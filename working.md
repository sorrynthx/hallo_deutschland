# 🐶🛸 Alien K-9 Deutsch Quest — 프로젝트 진행 현황

## 프로젝트 개요
강아지 외계인(ALIEN K-9)이 독일 마을에 불시착해서 독일어를 배워 우주선 부품을 모아 탈출하는 **모바일 전용 독일어 학습 앱**.

---

## 기술 스택
| 구분 | 기술 |
|------|------|
| 프론트엔드 | Next.js (App Router) + TypeScript |
| 배포 | Vercel (GitHub 연동 자동 배포) |
| 데이터 | 정적 JSON 파일 (`public/data/`) |
| 데이터 생성 | 라즈베리파이3 + Python + Gemini API |
| 스케줄 | crontab (매주 월-금 새벽 3시) |
| 저장소 | GitHub (`sorrynthx/hallo_deutschland`) |
| DB/로그인 | 없음 (혼자 사용) |

---

## 디자인 컨셉
- **황혼 마을** 분위기 — 깊은 황혼 보라 하늘 + 석양 오렌지 + 마을 따뜻한 빛
- **UFO/인터페이스**만 민트 `#4ECDC4` 글로우
- 강아지 🐶 우주복 캐릭터 (ALIEN K-9)
- 마을 지도 세로 스크롤 — 아래가 초급(Baby/A1), 위로 갈수록 고급(B1/B2)
- 장소 탭 → 바텀시트 팝업 → 학습 유형 선택

### 핵심 색상
```
--bg-deep:     #2D1B4E  황혼 보라 (메인 배경)
--bg-panel:    #1e1235  카드/패널
--mint:        #4ECDC4  외계 기술 포인트
--horizon:     #e8832a  석양 오렌지
--loc-bakery:  #FF8C42  빵집
--loc-station: #78b4e0  기차역
--loc-market:  #6BCB77  슈퍼마켓
--text-gold:   #FFD750  점수/별
```

---

## 프로젝트 구조
```
hallo-deutschland/
  app/
    components/
      Header.tsx        ✅ 완성
      Ticker.tsx        ✅ 완성
    globals.css         ✅ 완성 (색상변수, 애니메이션, 공통 스타일)
    layout.tsx          ✅ 완성
    page.tsx            ✅ 완성 (홈 지도 화면)
  public/
    data/
      locations.json    ✅ 완성 (상황 마스터 목록)
      meta.json         ✅ 샘플
      bakery/
        baby.json       ✅ Gemini 생성 완료
  scripts/              ← 라즈베리파이에서 실행
    generate_content.py ✅ 완성
    prompts.py          ✅ 완성
    test_connection.py  ✅ 완성
    requirements.txt    ✅ 완성
    .env                ✅ (gitignore, 라즈베리파이에만 존재)
    .env.example        ✅
    logs/               자동 생성
```

---

## 데이터 구조

### locations.json (상황 마스터)
```json
{
  "locations": [
    {
      "id": "bakery",
      "icon": "🥐",
      "label": "BÄCKEREI",
      "korean": "빵집",
      "color": "#FF8C42",
      "colorDim": "rgba(255,140,66,.18)",
      "colorBorder": "rgba(255,140,66,.7)",
      "colorGlow": "rgba(255,140,66,.3)",
      "levels": ["baby", "a1", "a2"],
      "mapPosition": { "bottom": "52%", "left": "8%" }
    }
  ]
}
```
> ⭐ `locations.json`에 항목 추가하면 웹 지도 핀 + Python 스크립트 대상 **자동 반영**

### 콘텐츠 파일 구조 (예: bakery/baby.json)
```json
{
  "location": "bakery",
  "level": "baby",
  "lastUpdated": "W10",
  "items": {
    "vocabulary": [...],
    "grammar": [...],
    "conversation": [...],
    "expressions": [...]
  }
}
```

### 레벨별 생성 개수
| 레벨 | vocabulary | grammar | conversation | expressions |
|------|-----------|---------|--------------|-------------|
| baby | 8 | 0 | 0 | 4 |
| a1   | 10 | 3 | 2 | 4 |
| a2   | 10 | 3 | 2 | 4 |
| b1   | 10 | 3 | 2 | 4 |
| b2   | 10 | 3 | 2 | 4 |

### 요일별 생성 스케줄
| 요일 | 레벨 |
|------|------|
| 월 | baby |
| 화 | a1 |
| 수 | a2 |
| 목 | b1 |
| 금 | b2 |

---

## 완성된 화면

### ✅ 홈 화면 (page.tsx)
- 세로 스크롤 마을 지도
- 별빛, 노을 그라데이션, 마을 실루엣 SVG
- 장소 핀 9개 (Bäckerei ~ Rathaus)
- UFO 민트 글로우 + 강아지 float 애니메이션
- 장소 탭 → 바텀시트 (6가지 학습 유형 선택)
- Header, Ticker 컴포넌트 사용

### 🔲 미구현 화면 (다음 작업)
- 단어 퀴즈 (O/X)
- 플래시카드
- 문법 퀴즈 (fill_blank / conjugation_table / declension_table)
- 상황 대화 퀴즈
- 표현 & 발음 정리
- 부품 현황
- 레벨 선택
- 오늘의 미션

---

## 라즈베리파이 환경
```
OS: Raspberry Pi OS
Python: 3.13.5
pip: 25.1.1
위치: /home/pi/hallo_deutschland (git clone)
패키지: google-genai, python-dotenv
Gemini 모델: gemini-2.5-flash
```

### scripts/.env
```
GEMINI_API_KEY=실제키
REPO_PATH=/home/pi/hallo_deutschland
```

### 데이터 생성 플로우
```
crontab (매주 월-금 새벽 3시)
  → generate_content.py 실행
  → locations.json 읽기 → 해당 레벨 location 필터
  → prompts.py → 프롬프트 생성
  → Gemini API 호출
  → JSON 파싱 → public/data/{location}/{level}.json 누적 저장
  → git add/commit/push
  → Vercel 자동 재배포
```

---

## 다음 작업 목록
1. **page.tsx 수정** — `locations.json` 읽어서 지도 핀 동적 렌더링 (현재는 하드코딩)
2. **학습 화면 구현** — 단어 퀴즈부터 순서대로
3. **라우팅 연결** — 바텀시트 버튼 → 각 학습 화면
4. **localStorage** — 학습 진도 저장
5. **crontab 설정** — 데이터 생성 자동화
6. **부품 현황** — 진도에 따라 우주선 부품 수집

---

## 참고 — 학습 화면 디자인 가이드
- 모든 화면: `Header` (showBack=true) + `Ticker` 포함
- 카드: `background: #1e1235`, `border: 1.5px solid rgba(78,205,196,.3)`, `border-radius: 14px`
- 정답 버튼: 민트 글로우 (`--mint: #4ECDC4`)
- 오답 버튼: 레드 (`--wrong: #e88a8a`)
- 격(article) 색상: `der=#78b4e0` / `die=#e88a8a` / `das=#6BCB77`
- 한글 발음: 민트 색상으로 표시
- 애니메이션: `globals.css`에 정의된 클래스 사용 (`float-anim`, `glow-pulse`, `shake`)