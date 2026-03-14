"""
Alien K-9 Deutsch Quest — 콘텐츠 자동 생성
실행: python3 generate_content.py
crontab: 0 9 * * 1-5 /usr/bin/python3 /home/pi/hallo_deutschland/scripts/generate_content.py
"""

import os
import json
import subprocess
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from prompts import build_prompt

# ── 환경변수 ───────────────────────────────────────────────
load_dotenv()
API_KEY   = os.getenv("GEMINI_API_KEY")
REPO_PATH = os.getenv("REPO_PATH", "/home/pi/hallo_deutschland")

DATA_PATH      = Path(REPO_PATH) / "public" / "data"
LOCATIONS_FILE = DATA_PATH / "locations.json"
LOG_PATH       = Path(REPO_PATH) / "scripts" / "logs"
LOG_PATH.mkdir(exist_ok=True)

MODEL = "gemini-2.0-flash-lite"

# ── 요일 → 레벨 ───────────────────────────────────────────
WEEKDAY_LEVEL = {
    0: "baby",   # 월
    1: "a1",     # 화
    2: "a2",     # 수
    3: "b1",     # 목
    4: "b2",     # 금
}

# ── 레벨별 생성 개수 ───────────────────────────────────────
LEVEL_CONFIG = {
    "baby": { "vocabulary": 8,  "expressions": 4, "grammar": 0, "conversation": 0 },
    "a1":   { "vocabulary": 10, "expressions": 4, "grammar": 3, "conversation": 2 },
    "a2":   { "vocabulary": 10, "expressions": 4, "grammar": 3, "conversation": 2 },
    "b1":   { "vocabulary": 10, "expressions": 4, "grammar": 3, "conversation": 2 },
    "b2":   { "vocabulary": 10, "expressions": 4, "grammar": 3, "conversation": 2 },
}


# ── 로그 ──────────────────────────────────────────────────
def log(msg: str):
    now  = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{now}] {msg}"
    print(line)
    log_file = LOG_PATH / f"{datetime.now().strftime('%Y-%m')}.log"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(line + "\n")


# ── locations.json 읽기 ───────────────────────────────────
def load_locations() -> list:
    if not LOCATIONS_FILE.exists():
        log("❌ locations.json 없음!")
        return []
    with open(LOCATIONS_FILE, "r", encoding="utf-8") as f:
        return json.load(f).get("locations", [])


# ── 기존 파일 읽기 ─────────────────────────────────────────
def load_existing(location_id: str, level: str) -> dict:
    path = DATA_PATH / location_id / f"{level}.json"
    if not path.exists():
        return {
            "location": location_id,
            "level": level,
            "items": { "vocabulary": [], "grammar": [], "conversation": [], "expressions": [] }
        }
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# ── JSON 파싱 ──────────────────────────────────────────────
def parse_json(text: str) -> dict | None:
    if "```" in text:
        lines = [l for l in text.split("\n") if not l.strip().startswith("```")]
        text  = "\n".join(lines)
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError as e:
        log(f"❌ JSON 파싱 실패: {e}")
        log(f"응답 앞 200자: {text[:200]}")
        return None


# ── 파일 저장 (기존 데이터에 누적) ────────────────────────
def save_data(location_id: str, level: str, new_data: dict):
    folder = DATA_PATH / location_id
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{level}.json"

    existing = load_existing(location_id, level)

    for t in ["vocabulary", "grammar", "conversation", "expressions"]:
        new_items = new_data.get("items", {}).get(t, [])
        existing["items"].setdefault(t, [])
        existing["items"][t].extend(new_items)

    existing["lastUpdated"] = new_data.get("week", "")

    with open(path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    total = sum(len(v) for v in new_data.get("items", {}).values())
    log(f"✅ 저장: {location_id}/{level}.json (+{total}개)")


# ── git push ───────────────────────────────────────────────
def git_push(week: str, level: str):
    try:
        os.chdir(REPO_PATH)
        subprocess.run(["git", "add", "public/data/"], check=True)
        subprocess.run(["git", "commit", "-m", f"chore: generate {level} {week}"], check=True)
        subprocess.run(["git", "push"], check=True)
        log(f"🚀 git push 완료")
    except subprocess.CalledProcessError as e:
        log(f"❌ git push 실패: {e}")


# ── 메인 ──────────────────────────────────────────────────
def main():
    log("=" * 50)
    log("🐶 콘텐츠 생성 시작")

    # 요일 → 레벨 (테스트 시 아래 주석 해제 후 원하는 레벨 입력)
    level = "baby"
    weekday = datetime.now().weekday()
    #level   = WEEKDAY_LEVEL.get(weekday)
    week    = datetime.now().strftime("W%W")

    if not level:
        log(f"⏭️  오늘은 생성 스케줄 없음 (weekday={weekday}). 종료.")
        return

    log(f"📅 레벨: {level.upper()} / 주차: {week}")

    if not API_KEY:
        log("❌ GEMINI_API_KEY 없음!")
        return

    locations = load_locations()
    if not locations:
        return

    config  = LEVEL_CONFIG.get(level, {})
    targets = [loc for loc in locations if level in loc.get("levels", [])]
    log(f"🗺️  대상: {[l['id'] for l in targets]}")

    client  = genai.Client(api_key=API_KEY)
    success = 0
    fail    = 0

    for loc in targets:
        log(f"\n── {loc['label']} ({loc['korean']}) ...")
        try:
            prompt   = build_prompt(loc, level, config, week)
            response = client.models.generate_content(model=MODEL, contents=prompt)
            new_data = parse_json(response.text.strip())

            if new_data:
                save_data(loc["id"], level, new_data)
                success += 1
            else:
                fail += 1

        except Exception as e:
            log(f"❌ {loc['id']} 실패: {e}")
            fail += 1

    log(f"\n📊 성공 {success} / 실패 {fail}")

    if success > 0:
        git_push(week, level)

    log("🐶 완료!")
    log("=" * 50)


if __name__ == "__main__":
    main()