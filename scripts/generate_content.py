"""
Hallo Deutschland — Gemini 기반 학습 데이터 자동 생성 스크립트
실행: python3 generate_content.py [--level a1] [--type vocabulary|grammar]
crontab(예시): 0 9 * * MON /usr/bin/python3 /path/to/scripts/generate_content.py
"""

import os, json, argparse, subprocess
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY   = os.getenv("GEMINI_API_KEY")
REPO_PATH = os.getenv("REPO_PATH", str(Path(__file__).resolve().parent.parent))
DATA_PATH = Path(REPO_PATH) / "public" / "data"
LOG_PATH  = Path(__file__).parent / "logs"
LOG_PATH.mkdir(exist_ok=True)

MODEL = "gemini-2.5-flash"

LEVELS = ["a1", "a2", "b1", "b2"]

# ── 데이터 저장 경로 ──────────────────────────────────────────
# public/data/vocabulary/{level}.json
# public/data/grammar/{level}.json

VOCAB_PROMPT = """
You are a German language teacher. Generate {count} German vocabulary entries for level {level_upper} learners.
Return ONLY a valid JSON object in this exact format (no markdown, no extra text):
{{
  "words": [
    {{
      "id": "voc_{level}_{timestamp}_001",
      "word": "...",
      "article": "der|die|das|null",
      "plural": "...|null",
      "pronunciation": "한국어 발음 표기",
      "meaning": "한국어 뜻",
      "example": "Example German sentence.",
      "example_translation": "한국어 번역",
      "example_pronunciation": "한국어 발음 표기",
      "tags": ["noun|verb|adjective|...", "topic_tag"]
    }}
  ]
}}
Rules:
- {level_upper} level vocabulary only
- article must be "der", "die", "das", or null for verbs/adjectives
- pronunciation must be in Korean (한국어)
- example sentence must demonstrate real usage
- tags: first tag = word type (noun/verb/adjective/adverb), second = topic
"""

GRAMMAR_PROMPT = """
You are a German grammar teacher. Generate {count} grammar lesson(s) for level {level_upper} learners.
Return ONLY a valid JSON object in this exact format (no markdown, no extra text):
{{
  "lessons": [
    {{
      "id": "gram_{level}_{timestamp}_001",
      "topic": "Grammar topic name (Korean OK)",
      "explanation": "2-3 sentences explaining the grammar point clearly in Korean.",
      "examples": [
        {{
          "german": "German example sentence.",
          "korean": "한국어 번역",
          "pronunciation": "한국어 발음 표기"
        }}
      ],
      "conjugation_table": [
        {{"pronoun": "...", "form": "..."}}
      ]
    }}
  ]
}}
Rules:
- {level_upper} level grammar only
- explanation must be in Korean, clear and concise
- conjugation_table is optional — only include if relevant to the topic
- focus on practical, real-world usage
"""

def log(msg: str):
    now  = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{now}] {msg}"
    print(line)
    log_file = LOG_PATH / f"{datetime.now().strftime('%Y-%m')}.log"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def parse_json(text: str) -> dict | None:
    if "```" in text:
        lines = [l for l in text.split("\n") if not l.strip().startswith("```")]
        text  = "\n".join(lines)
    text  = text.strip()
    start = text.find("{")
    end   = text.rfind("}") + 1
    if start == -1 or end == 0:
        log("❌ JSON 구조 없음")
        return None
    try:
        return json.loads(text[start:end])
    except json.JSONDecodeError as e:
        log(f"❌ JSON 파싱 실패: {e}")
        return None

def load_existing(data_type: str, level: str) -> dict:
    path = DATA_PATH / data_type / f"{level}.json"
    if not path.exists():
        return {"level": level.upper(), "words" if data_type == "vocabulary" else "lessons": [], "lastUpdated": ""}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data_type: str, level: str, new_data: dict):
    folder = DATA_PATH / data_type
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{level}.json"

    existing = load_existing(data_type, level)
    key = "words" if data_type == "vocabulary" else "lessons"

    existing.setdefault(key, [])
    new_items = new_data.get(key, [])
    existing[key].extend(new_items)
    existing["lastUpdated"] = datetime.now().strftime("%Y-%m-%d")

    with open(path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    log(f"✅ 저장: {data_type}/{level}.json (+{len(new_items)}개)")

def generate(client, data_type: str, level: str, count: int):
    timestamp = datetime.now().strftime("%Y%m%d")
    template  = VOCAB_PROMPT if data_type == "vocabulary" else GRAMMAR_PROMPT
    prompt    = template.format(
        count       = count,
        level       = level,
        level_upper = level.upper(),
        timestamp   = timestamp,
    )
    log(f"   → {data_type} ({count}개) 생성 중...")
    try:
        response  = client.models.generate_content(model=MODEL, contents=prompt)
        data      = parse_json(response.text.strip())
        if data:
            save_data(data_type, level, data)
        else:
            log(f"⚠️ {data_type} 파싱 실패")
    except Exception as e:
        log(f"❌ {data_type} API 호출 실패: {e}")

def git_push(level: str):
    try:
        os.chdir(REPO_PATH)
        subprocess.run(["git", "add", "public/data/"], check=True)
        result = subprocess.run(["git", "diff", "--cached", "--quiet"])
        if result.returncode == 0:
            log("⏭️ 변경사항 없음 — 커밋 스킵")
            return
        msg = f"chore(data): add {level.upper()} content {datetime.now().strftime('%Y-%m-%d')}"
        subprocess.run(["git", "commit", "-m", msg], check=True)
        subprocess.run(["git", "pull", "--rebase", "origin", "main"], check=True)
        subprocess.run(["git", "push"], check=True)
        log("🚀 git push 완료 → Vercel 자동 배포 시작")
    except subprocess.CalledProcessError as e:
        log(f"❌ git push 실패: {e}")

def main():
    parser = argparse.ArgumentParser(description="Hallo Deutschland 학습 데이터 생성기")
    parser.add_argument("--level", choices=LEVELS, default="a1", help="생성 레벨 (기본: a1)")
    parser.add_argument("--type",  choices=["vocabulary", "grammar", "all"], default="all", help="생성 타입 (기본: all)")
    parser.add_argument("--count", type=int, default=5, help="생성 개수 (기본: 5)")
    parser.add_argument("--push",  action="store_true", help="생성 후 git push")
    args = parser.parse_args()

    log("=" * 50)
    log(f"🐶 Hallo Deutschland 데이터 생성 시작")
    log(f"   레벨: {args.level.upper()} / 타입: {args.type} / 개수: {args.count}")

    if not API_KEY:
        log("❌ GEMINI_API_KEY 없음! .env 파일 확인")
        return

    client = genai.Client(api_key=API_KEY)

    if args.type in ("vocabulary", "all"):
        generate(client, "vocabulary", args.level, args.count)
    if args.type in ("grammar", "all"):
        generate(client, "grammar", args.level, args.count)

    if args.push:
        git_push(args.level)

    log("✅ 완료!")
    log("=" * 50)

if __name__ == "__main__":
    main()