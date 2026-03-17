[🇰🇷 한국어](#-한국어) | [🇺🇸 English](#-english) | [🇩🇪 Deutsch](#-deutsch)

---

# 🇰🇷 한국어

# 🐶🛸 Alien K-9 Deutsch Quest

> 우주에서 온 강아지가 독일 마을에 불시착! 독일어를 배워 우주선을 수리하고 집으로 돌아가는 모바일 독일어 학습 앱
---

## 📖 프로젝트 개요

혼자 독일어를 공부하기 위해 만든 **개인용 모바일 학습 앱**입니다. 시중의 독일어 학습 앱들은 광고, 구독 모델, 불필요한 기능이 많아 직접 필요한 기능만 갖춘 앱을 제작했습니다.

단어 퀴즈, 문법 퀴즈, 상황 대화, 표현 정리 등 핵심 학습 기능을 구현하고, 학습 콘텐츠는 Google Gemini API를 통해 매주 자동으로 생성·업데이트됩니다.

---

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                  RASPBERRY PI 3                          │
│                                                          │
│  crontab (매주 월-금 새벽 3시)                            │
│       ↓                                                  │
│  Python Script                                           │
│  ├── locations.json 읽기 (대상 장소 파악)                  │
│  ├── Google Gemini API 호출 (타입별 개별 호출)              │
│  ├── JSON 파싱 & 검증                                     │
│  ├── public/data/{location}/{level}.json 누적 저장         │
│  └── git push                                            │
│                                                          │
└──────────────────────┬──────────────────────────────────┘
                       ↓
              ┌────────────────┐
              │    GitHub      │
              │  (Repository)  │
              └───────┬────────┘
                      ↓ 자동 배포 트리거
              ┌────────────────┐
              │    Vercel      │
              │  (Next.js 앱)  │
              │  정적 JSON 서빙 │
              └───────┬────────┘
                      ↓
              ┌────────────────┐
              │   모바일 앱     │
              │  (PWA 설치)    │
              └────────────────┘
```

---

## 🛠️ 기술 스택

| 구분 | 기술 | 선택 이유 |
|------|------|-----------|
| Frontend | Next.js 15 + TypeScript | App Router 기반 파일 라우팅, 정적 파일 서빙 최적화 |
| Styling | CSS Variables + Inline Style | 빌드 도구 없이 디자인 토큰 관리, 다크모드 자동 대응 |
| 배포 | Vercel | GitHub 연동 자동 배포, 개인 프로젝트 무료 플랜으로 충분 |
| 데이터 생성 | Python 3.13 + Google Gemini API | 구조화된 JSON 생성에 최적화, 무료 티어 활용 |
| 스케줄러 | Raspberry Pi 3 + crontab | 별도 서버 비용 없이 집에 있는 기기 활용 |
| 상태 관리 | React Hooks + localStorage | 서버 없이 학습 진도 영구 저장 |
| PWA | Web App Manifest | 모바일 홈 화면 설치, 네이티브 앱 경험 |

---

## 💡 설계 결정 이유 (Why)

### 왜 DB를 사용하지 않았나요?

**개인 혼자 사용하는 앱에 DB는 불필요한 비용과 복잡성을 만듭니다.**

- 클라우드 DB (Firebase, Supabase 등): 월 비용 발생, 무료 티어도 제한 있음
- 학습 진도 데이터는 오직 나만 사용 → 서버 공유 필요 없음
- `localStorage`로 브라우저에 저장: 단어 10,000개 진도도 300KB 이하, 완전 무료
- 정적 JSON 파일로 콘텐츠 제공: CDN 캐싱 자동 적용, 응답 속도 빠름

```
DB 있을 때: 앱 → API 서버 → DB → 응답 (비용 + 지연)
DB 없을 때: 앱 → Vercel CDN → JSON 파일 (무료 + 빠름)
```

### 왜 Raspberry Pi 3를 사용했나요?

**이미 집에 있는 기기를 활용해 서버 비용을 제로로 만들었습니다.**

- AWS Lambda, Cloud Functions 등 서버리스: 실행 횟수/시간 비용
- Vercel Cron Jobs: 유료 플랜 필요 (분 단위 스케줄)
- Raspberry Pi: **추가 비용 0원**, 24시간 상시 가동, `crontab`으로 유연한 스케줄 설정
- 로컬 파일 시스템 직접 접근 가능 → JSON 파일 읽기/쓰기 자유로움

### 왜 정적 JSON 파일 방식을 선택했나요?

**콘텐츠 특성상 실시간 업데이트가 필요 없고, 정적 파일이 가장 효율적입니다.**

- 학습 콘텐츠는 주 1회 업데이트로 충분 → 실시간 API 불필요
- Vercel의 정적 파일 서빙: 전 세계 CDN 자동 배포, 빠른 응답
- 파일 구조가 곧 API 구조: `/data/bakery/a1.json` → 직관적
- 새 장소/레벨 추가 시 `locations.json` 한 줄만 수정 → 자동 반영

```
public/data/
  locations.json      ← 마스터 목록 (웹 + Python 스크립트 공유)
  bakery/
    baby.json
    a1.json           ← vocabulary + grammar + conversation + expressions 통합
  hospital/
    a1.json
```

### 왜 Google Gemini API를 사용했나요?

**독일어 학습 콘텐츠 생성에 필요한 구조화된 JSON 출력과 무료 티어가 결정적이었습니다.**

- 주 5회 × 장소 수 × 타입 4개 호출 → 월 수백 회 수준
- Gemini 1.5/2.5 Flash: **무료 티어 월 수백만 토큰** → 비용 0원
- 독일어 + 한국어 발음 + 예문 생성 품질 우수
- Python SDK 간단, JSON 형식 지시 준수율 높음

### 왜 localStorage를 사용했나요?

**로그인 없는 개인 앱에서 가장 단순하고 효과적인 상태 영속화 방법입니다.**

- 서버 없이 브라우저에 영구 저장
- 진도 데이터 구조: `{location}_{level}: {vocabulary: true, grammar: false, ...}`
- 단어 10,000개 진도도 300KB 이하 → 5MB 한도에 여유
- 학습 완료 시 부품 획득 조건 계산, 점수 누적 모두 클라이언트에서 처리

---

## 📱 주요 기능

### 🗺️ 마을 지도 네비게이션
- 독일 마을 지도를 세로 스크롤하며 탐험
- 장소 탭 → 학습 유형 선택 바텀시트
- 레벨 올라갈수록 새 장소 해금 (위로 올라가는 구조)
- `locations.json` 기반 동적 렌더링 → 코드 수정 없이 장소 추가 가능

### 📝 학습 화면 (5가지)
| 화면 | 설명 |
|------|------|
| 단어 퀴즈 | 카드 탭으로 예문 확인 → O/X 응답 |
| 플래시카드 | 앞면(독일어) → 뒷면(뜻+예문) 뒤집기 |
| 문법 퀴즈 | fill_blank / 동사활용표 / 격변화표 3가지 타입 |
| 대화 퀴즈 | 채팅 UI 스타일, 상황별 적절한 표현 선택 |
| 표현 정리 | 스크롤 리스트, Web Speech API TTS 버튼 |

### ⚙️ 게임화 요소
- **부품 수집 시스템**: 각 장소+레벨 학습 완료 시 우주선 부품 획득
- **점수 시스템**: 학습 유형별 점수 차등 (문법/대화 +15점, 단어/표현 +10점)
- **진행률 표시**: 헤더 실시간 업데이트

---

## 🚀 실행 방법

### 웹 앱 (Next.js)

```bash
git clone https://github.com/sorrynthx/hallo_deutschland.git
cd hallo_deutschland
npm install
npm run dev
```

### 데이터 생성 스크립트 (Raspberry Pi)

```bash
cd scripts
cp .env.example .env
# .env 에 GEMINI_API_KEY, REPO_PATH 설정

pip3 install -r requirements.txt --break-system-packages

# 테스트 실행
python3 generate_content.py

# crontab 등록 (매주 월-금 새벽 3시)
crontab -e
# 0 3 * * 1-5 /usr/bin/python3 /home/pi/hallo_deutschland/scripts/generate_content.py
```

---

## 📂 프로젝트 구조

```
hallo-deutschland/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # 공통 헤더 (점수/부품 실시간 표시)
│   │   ├── Ticker.tsx          # 하단 마퀴 텍스트
│   │   ├── InstallPrompt.tsx   # PWA 설치 안내
│   │   └── learn/
│   │       ├── VocabQuiz.tsx
│   │       ├── Flashcard.tsx
│   │       ├── GrammarQuiz.tsx
│   │       ├── ConversationQuiz.tsx
│   │       ├── Expressions.tsx
│   │       ├── CompleteScreen.tsx
│   │       ├── LevelTabs.tsx
│   │       └── EmptyState.tsx
│   ├── hooks/
│   │   └── useProgress.ts      # localStorage 진도 관리
│   ├── learn/[locationId]/[typeId]/
│   │   └── page.tsx            # 학습 화면 라우팅
│   ├── mission/page.tsx
│   ├── parts/page.tsx
│   ├── levels/page.tsx
│   ├── globals.css             # 디자인 토큰, 애니메이션
│   ├── layout.tsx
│   ├── manifest.json           # PWA 설정
│   └── page.tsx                # 홈 (마을 지도)
│
├── public/
│   └── data/
│       ├── locations.json      # 장소 마스터 목록
│       ├── bakery/
│       │   ├── baby.json
│       │   └── a1.json
│       └── hospital/
│           └── a1.json
│
└── scripts/                    # Raspberry Pi에서 실행
    ├── generate_content.py     # 메인 생성 스크립트
    ├── prompts.py              # Gemini 프롬프트 템플릿
    ├── requirements.txt
    └── .env                    # API 키 (gitignore)
```

---

## 🎨 디자인 컨셉

**황혼 마을 + 외계 기술의 대비**

- 배경: 황혼 보라 `#2D1B4E` — 석양이 지는 독일 마을의 하늘
- 마을: 따뜻한 앰버 `#FF8C42` — 가로등과 건물 창문의 온기
- 외계: 민트 `#4ECDC4` — UFO와 인터페이스에만 사용되는 외계 기술 색상
- 폰트: Space Mono — 우주선 계기판 느낌의 모노스페이스

---

## 📊 비용 구조

| 항목 | 비용 |
|------|------|
| Vercel 배포 | 무료 (Hobby Plan) |
| GitHub 저장소 | 무료 |
| Google Gemini API | 무료 (Flash 모델 무료 티어) |
| Raspberry Pi 3 운영 | 기존 보유 기기 활용 |
| **총 월 비용** | **$0** |

---

## 🔮 향후 계획

- [ ] Google Cloud TTS 연동 — 자연스러운 독일어 발음 오디오 파일 사전 생성
- [ ] B1/B2 레벨 콘텐츠 확장
- [ ] 오답 노트 기능
- [ ] 학습 통계 시각화

---

## 👨‍💻 개발자

개인 독일어 학습을 위해 설계·개발한 프로젝트입니다.
불필요한 비용 없이 실용적인 아키텍처를 고민하며 만들었습니다.

> "필요해서 만들었고, 직접 씁니다."

---

# 🇺🇸 English

# 🐶🛸 Alien K-9 Deutsch Quest

> A puppy from space crash-lands in a German village! A mobile German learning app to learn German, repair the spaceship, and return home.
---

## 📖 Project Overview

This is a **personal mobile learning app** created to study German alone. Since most German learning apps on the market are full of ads, subscription models, and unnecessary features, I built an app with only the necessary features.

It implements core learning features such as vocabulary quizzes, grammar quizzes, situational conversations, and expression summaries. Learning content is automatically generated and updated every week via the Google Gemini API.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  RASPBERRY PI 3                          │
│                                                          │
│  crontab (Every Mon-Fri 3 AM)                             │
│       ↓                                                  │
│  Python Script                                           │
│  ├── Read locations.json (Identify target location)        │
│  ├── Call Google Gemini API (Individual calls by type)      │
│  ├── Parse & Validate JSON                               │
│  ├── Accumulate & Save public/data/{location}/{level}.json │
│  └── git push                                            │
│                                                          │
└──────────────────────┬──────────────────────────────────┘
                       ↓
              ┌────────────────┐
              │    GitHub      │
              │  (Repository)  │
              └───────┬────────┘
                      ↓ Auto Deployment Trigger
              ┌────────────────┐
              │    Vercel      │
              │  (Next.js App) │
              │  Serving Static JSON│
              └───────┬────────┘
                      ↓
              ┌────────────────┐
              │   Mobile App    │
              │  (PWA Install)  │
              └────────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technology | Reason for Selection |
|------|------|-----------|
| Frontend | Next.js 15 + TypeScript | App Router-based file routing, optimized static file serving |
| Styling | CSS Variables + Inline Style | Manage design tokens without build tools, automatic dark mode support |
| Deployment | Vercel | GitHub integration for auto deployment, free plan is sufficient for personal projects |
| Data Generation | Python 3.13 + Google Gemini API | Optimized for structured JSON generation, utilizes free tier |
| Scheduler | Raspberry Pi 3 + crontab | Utilizing a device at home without separate server costs |
| State Management| React Hooks + localStorage | Permanent storage of learning progress without a server |
| PWA | Web App Manifest | Install on mobile home screen, native app experience |

---

## 💡 Design Decisions (Why)

### Why not use a DB?

**For a personal app used alone, a DB introduces unnecessary costs and complexity.**

- Cloud DBs (Firebase, Supabase, etc.): Incur monthly costs, free tiers have limits
- Learning progress data is used only by me → No need for server sharing
- Saved in browser via `localStorage`: Progress for 10,000 words is less than 300KB, completely free
- Serving content as static JSON files: CDN caching applied automatically, fast response times

```
With DB: App → API Server → DB → Response (Cost + Delay)
Without DB: App → Vercel CDN → JSON files (Free + Fast)
```

### Why use a Raspberry Pi 3?

**Reduced server costs to zero by utilizing a device already at home.**

- Serverless (AWS Lambda, Cloud Functions, etc.): Costs based on executions/time
- Vercel Cron Jobs: Requires a paid plan (minute-level scheduling)
- Raspberry Pi: **$0 additional cost**, runs 24/7, flexible scheduling with `crontab`
- Direct access to local file system → Free to read/write JSON files

### Why choose the static JSON file approach?

**Given the nature of the content, real-time updates are not needed, making static files the most efficient.**

- Updating learning content once a week is sufficient → No real-time API needed
- Vercel's static file serving: Automatic global CDN distribution, fast response
- File structure equals API structure: `/data/bakery/a1.json` → Intuitive
- Adding a new location/level only requires changing one line in `locations.json` → Automatically reflected

```
public/data/
  locations.json      ← Master list (shared between web + Python script)
  bakery/
    baby.json
    a1.json           ← vocabulary + grammar + conversation + expressions integrated
  hospital/
    a1.json
```

### Why use the Google Gemini API?

**The structured JSON output needed for generating German learning content and the free tier were decisive factors.**

- 5 times a week × number of locations × 4 types of calls → Hundreds of calls per month
- Gemini 1.5/2.5 Flash: **Millions of tokens per month on the free tier** → $0 cost
- Excellent quality in generating German + Korean pronunciation + example sentences
- Python SDK is simple, high compliance rate with JSON format instructions

### Why use localStorage?

**The simplest and most effective state persistence method for a personal app without login.**

- Permanent storage in the browser without a server
- Progress data structure: `{location}_{level}: {vocabulary: true, grammar: false, ...}`
- Progress for 10,000 words is less than 300KB → Plenty of room within the 5MB limit
- Condition calculation for acquiring parts upon completing learning, and score accumulation are all handled on the client side

---

## 📱 Key Features

### 🗺️ Village Map Navigation
- Explore the German village map by scrolling vertically
- Location tab → Bottom sheet to select learning type
- Unlock new locations as you level up (moving upwards)
- Dynamic rendering based on `locations.json` → Can add locations without modifying code

### 📝 Learning Screens (5 Types)
| Screen | Description |
|------|------|
| Word Quiz | Tap card to check example sentences → O/X response |
| Flashcard | Front (German) → Flip to Back (Meaning + Example sentence) |
| Grammar Quiz | 3 types: fill_blank / verb conjugation table / case declension table |
| Conversation Quiz | Chat UI style, choose appropriate expressions for situations |
| Expressions | Scrollable list, Web Speech API TTS button |

### ⚙️ Gamification Elements
- **Part Collection System**: Acquire spaceship parts upon completing learning for each location + level
- **Score System**: Different scores by learning type (+15 points for grammar/conversation, +10 points for words/expressions)
- **Progress Display**: Real-time update in the header

---

## 🚀 How to Run

### Web App (Next.js)

```bash
git clone https://github.com/sorrynthx/hallo_deutschland.git
cd hallo_deutschland
npm install
npm run dev
```

### Data Generation Script (Raspberry Pi)

```bash
cd scripts
cp .env.example .env
# Set GEMINI_API_KEY, REPO_PATH in .env

pip3 install -r requirements.txt --break-system-packages

# Run test
python3 generate_content.py

# Register crontab (Every Mon-Fri 3 AM)
crontab -e
# 0 3 * * 1-5 /usr/bin/python3 /home/pi/hallo_deutschland/scripts/generate_content.py
```

---

## 📂 Project Structure

```
hallo-deutschland/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # Common header (Real-time score/parts display)
│   │   ├── Ticker.tsx          # Bottom marquee text
│   │   ├── InstallPrompt.tsx   # PWA installation prompt
│   │   └── learn/
│   │       ├── VocabQuiz.tsx
│   │       ├── Flashcard.tsx
│   │       ├── GrammarQuiz.tsx
│   │       ├── ConversationQuiz.tsx
│   │       ├── Expressions.tsx
│   │       ├── CompleteScreen.tsx
│   │       ├── LevelTabs.tsx
│   │       └── EmptyState.tsx
│   ├── hooks/
│   │   └── useProgress.ts      # localStorage progress management
│   ├── learn/[locationId]/[typeId]/
│   │   └── page.tsx            # Learning screen routing
│   ├── mission/page.tsx
│   ├── parts/page.tsx
│   ├── levels/page.tsx
│   ├── globals.css             # Design tokens, animations
│   ├── layout.tsx
│   ├── manifest.json           # PWA configuration
│   └── page.tsx                # Home (Village map)
│
├── public/
│   └── data/
│       ├── locations.json      # Location master list
│       ├── bakery/
│       │   ├── baby.json
│       │   └── a1.json
│       └── hospital/
│           └── a1.json
│
└── scripts/                    # Runs on Raspberry Pi
    ├── generate_content.py     # Main generation script
    ├── prompts.py              # Gemini prompt templates
    ├── requirements.txt
    └── .env                    # API keys (gitignore)
```

---

## 🎨 Design Concept

**Contrast between twilight village + alien technology**

- Background: Twilight Purple `#2D1B4E` — Sky of a German village at sunset
- Village: Warm Amber `#FF8C42` — Warmth from streetlights and building windows
- Alien: Mint `#4ECDC4` — Alien technology color used only for UFOs and interfaces
- Font: Space Mono — Monospace giving a spaceship dashboard feel

---

## 📊 Cost Structure

| Item | Cost |
|------|------|
| Vercel Deployment | Free (Hobby Plan) |
| GitHub Repository | Free |
| Google Gemini API | Free (Flash model free tier) |
| Raspberry Pi 3 Operation | Utilizing existing device |
| **Total Monthly Cost** | **$0** |

---

## 🔮 Future Plans

- [ ] Google Cloud TTS Integration — Pre-generate natural German pronunciation audio files
- [ ] Expand B1/B2 level content
- [ ] Review note feature for incorrect answers
- [ ] Visualizing learning statistics

---

## 👨‍💻 Developer

A project designed and developed for personal German study.
Created while considering a practical architecture without unnecessary costs.

> "Built because I needed it, and I use it myself."

---

# 🇩🇪 Deutsch

# 🐶🛸 Alien K-9 Deutsch Quest

> Ein Welpe aus dem Weltraum bruchlandet in einem deutschen Dorf! Eine mobile Deutschlern-App, um Deutsch zu lernen, das Raumschiff zu reparieren und nach Hause zurückzukehren.
---

## 📖 Projektübersicht

Dies ist eine **persönliche mobile Lern-App**, die für das Selbststudium von Deutsch entwickelt wurde. Da die meisten Deutschlern-Apps auf dem Markt voller Werbung, Abonnementmodelle und unnötiger Funktionen sind, habe ich eine App entwickelt, die nur die wirklich benötigten Funktionen enthält.

Sie implementiert wichtige Lernfunktionen wie Vokabelquiz, Grammatikquiz, Situationsgespräche und Ausdruckszusammenfassungen. Die Lerninhalte werden automatisch wöchentlich über die Google Gemini API generiert und aktualisiert.

---

## 🏗️ Systemarchitektur

```
┌─────────────────────────────────────────────────────────┐
│                  RASPBERRY PI 3                          │
│                                                          │
│  crontab (Jeden Mo-Fr 3 Uhr)                              │
│       ↓                                                  │
│  Python Script                                           │
│  ├── locations.json lesen (Zielort identifizieren)         │
│  ├── Google Gemini API aufrufen (Individuelle Aufrufe)      │
│  ├── JSON parsen & validieren                            │
│  ├── public/data/{location}/{level}.json akkumulieren & speichern │
│  └── git push                                            │
│                                                          │
└──────────────────────┬──────────────────────────────────┘
                       ↓
              ┌────────────────┐
              │    GitHub      │
              │  (Repository)  │
              └───────┬────────┘
                      ↓ Auto-Deployment Trigger
              ┌────────────────┐
              │    Vercel      │
              │  (Next.js App) │
              │ Statisches JSON-Serving│
              └───────┬────────┘
                      ↓
              ┌────────────────┐
              │   Mobile App    │
              │  (PWA Install)  │
              └────────────────┘
```

---

## 🛠️ Tech-Stack

| Kategorie | Technologie | Grund für die Auswahl |
|------|------|-----------|
| Frontend | Next.js 15 + TypeScript | App Router-basiertes Datei-Routing, optimiertes Serving statischer Dateien |
| Styling | CSS Variables + Inline Style | Verwaltung von Design-Tokens ohne Build-Tools, automatische Unterstützung für Dark Mode |
| Deployment | Vercel | GitHub-Integration für automatisches Deployment, kostenloser Plan ist ausreichend für persönliche Projekte |
| Datengenerierung | Python 3.13 + Google Gemini API | Optimiert für die Generierung von strukturiertem JSON, nutzt das kostenlose Kontingent |
| Scheduler | Raspberry Pi 3 + crontab | Nutzung eines Geräts zu Hause ohne separate Serverkosten |
| State Management| React Hooks + localStorage | Dauerhafte Speicherung des Lernfortschritts ohne Server |
| PWA | Web App Manifest | Installation auf dem mobilen Startbildschirm, natives App-Erlebnis |

---

## 💡 Designentscheidungen (Warum)

### Warum keine DB verwenden?

**Für eine persönliche App, die alleine genutzt wird, verursacht eine DB unnötige Kosten und Komplexität.**

- Cloud-DBs (Firebase, Supabase usw.): Monatliche Kosten, kostenlose Kontingente haben Limits
- Lernfortschrittsdaten werden nur von mir genutzt → Keine Serverfreigabe erforderlich
- Speicherung im Browser über `localStorage`: Fortschritt für 10.000 Wörter ist kleiner als 300 KB, völlig kostenlos
- Bereitstellung von Inhalten als statische JSON-Dateien: CDN-Caching wird automatisch angewendet, schnelle Antwortzeiten

```
Mit DB: App → API Server → DB → Antwort (Kosten + Verzögerung)
Ohne DB: App → Vercel CDN → JSON-Dateien (Kostenlos + Schnell)
```

### Warum ein Raspberry Pi 3?

**Reduzierung der Serverkosten auf Null durch die Nutzung eines bereits zu Hause vorhandenen Geräts.**

- Serverless (AWS Lambda, Cloud Functions usw.): Kosten basierend auf Ausführungen/Zeit
- Vercel Cron Jobs: Erfordert einen kostenpflichtigen Plan (Minuten-Scheduling)
- Raspberry Pi: **0$ zusätzliche Kosten**, läuft rund um die Uhr, flexible Planung mit `crontab`
- Direkter Zugriff auf das lokale Dateisystem → Frei zum Lesen/Schreiben von JSON-Dateien

### Warum der Ansatz mit statischen JSON-Dateien?

**Aufgrund der Art des Inhalts sind keine Echtzeit-Updates erforderlich, was statische Dateien am effizientesten macht.**

- Einmal wöchentliches Aktualisieren der Lerninhalte ist ausreichend → Keine Echtzeit-API erforderlich
- Statisches Datei-Serving von Vercel: Automatische globale CDN-Verteilung, schnelle Antwort
- Dateistruktur entspricht API-Struktur: `/data/bakery/a1.json` → Intuitiv
- Hinzufügen eines neuen Ortes/Levels erfordert nur die Änderung einer Zeile in `locations.json` → Automatisch reflektiert

```
public/data/
  locations.json      ← Master-Liste (geteilt zwischen Web + Python-Skript)
  bakery/
    baby.json
    a1.json           ← vocabulary + grammar + conversation + expressions integriert
  hospital/
    a1.json
```

### Warum die Google Gemini API?

**Der strukturierte JSON-Output, der für die Generierung von Deutschlerninhalten benötigt wird, und das kostenlose Kontingent waren entscheidende Faktoren.**

- 5 Mal pro Woche × Anzahl der Orte × 4 Arten von Aufrufen → Hunderte von Aufrufen pro Monat
- Gemini 1.5/2.5 Flash: **Millionen von Token pro Monat im kostenlosen Kontingent** → 0$ Kosten
- Hervorragende Qualität bei der Generierung von Deutsch + koreanischer Aussprache + Beispielsätzen
- Python SDK ist einfach, hohe Einhaltungsrate von JSON-Format-Anweisungen

### Warum localStorage?

**Die einfachste und effektivste Methode zur Zustandspersistenz für eine persönliche App ohne Login.**

- Dauerhafte Speicherung im Browser ohne Server
- Struktur der Fortschrittsdaten: `{location}_{level}: {vocabulary: true, grammar: false, ...}`
- Fortschritt für 10.000 Wörter ist kleiner als 300 KB → Viel Platz innerhalb des 5-MB-Limits
- Die Bedingungsberechnung für den Erwerb von Teilen nach Abschluss des Lernens und die Punkteakkumulation werden alle auf der Client-Seite verarbeitet

---

## 📱 Hauptfunktionen

### 🗺️ Dorfkarte Navigation
- Erkunden Sie die deutsche Dorfkarte durch vertikales Scrollen
- Ort-Tab → Bottom Sheet zur Auswahl des Lerntyps
- Freischalten neuer Orte mit steigendem Level (Bewegung nach oben)
- Dynamisches Rendering basierend auf `locations.json` → Orte können ohne Codeänderung hinzugefügt werden

### 📝 Lernbildschirme (5 Typen)
| Bildschirm | Beschreibung |
|------|------|
| Wort-Quiz | Karte antippen, um Beispielsätze zu prüfen → O/X-Antwort |
| Karteikarte | Vorderseite (Deutsch) → Umdrehen zur Rückseite (Bedeutung + Beispielsatz) |
| Grammatik-Quiz | 3 Typen: fill_blank / Verben-Konjugationstabelle / Kasus-Deklinationstabelle |
| Konversations-Quiz | Chat-UI-Stil, wählen Sie passende Ausdrücke für Situationen |
| Ausdrücke | Scrollbare Liste, Web Speech API TTS-Button |

### ⚙️ Gamification-Elemente
- **Teilesammelsystem**: Erwerben Sie Raumschiffteile nach Abschluss des Lernens für jeden Ort + Level
- **Punktesystem**: Unterschiedliche Punktzahlen nach Lerntyp (+15 Punkte für Grammatik/Konversation, +10 Punkte für Wörter/Ausdrücke)
- **Fortschrittsanzeige**: Echtzeit-Update im Header

---

## 🚀 Wie man es ausführt

### Web-App (Next.js)

```bash
git clone https://github.com/sorrynthx/hallo_deutschland.git
cd hallo_deutschland
npm install
npm run dev
```

### Datengenerierungsskript (Raspberry Pi)

```bash
cd scripts
cp .env.example .env
# Setzen Sie GEMINI_API_KEY, REPO_PATH in .env

pip3 install -r requirements.txt --break-system-packages

# Test ausführen
python3 generate_content.py

# crontab registrieren (Jeden Mo-Fr 3 Uhr)
crontab -e
# 0 3 * * 1-5 /usr/bin/python3 /home/pi/hallo_deutschland/scripts/generate_content.py
```

---

## 📂 Projektstruktur

```
hallo-deutschland/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # Gemeinsamer Header (Echtzeit-Punkte/Teile-Anzeige)
│   │   ├── Ticker.tsx          # Unterer Marquee-Text
│   │   ├── InstallPrompt.tsx   # PWA-Installationsaufforderung
│   │   └── learn/
│   │       ├── VocabQuiz.tsx
│   │       ├── Flashcard.tsx
│   │       ├── GrammarQuiz.tsx
│   │       ├── ConversationQuiz.tsx
│   │       ├── Expressions.tsx
│   │       ├── CompleteScreen.tsx
│   │       ├── LevelTabs.tsx
│   │       └── EmptyState.tsx
│   ├── hooks/
│   │   └── useProgress.ts      # localStorage-Fortschrittsverwaltung
│   ├── learn/[locationId]/[typeId]/
│   │   └── page.tsx            # Lernbildschirm-Routing
│   ├── mission/page.tsx
│   ├── parts/page.tsx
│   ├── levels/page.tsx
│   ├── globals.css             # Design-Tokens, Animationen
│   ├── layout.tsx
│   ├── manifest.json           # PWA-Konfiguration
│   └── page.tsx                # Startseite (Dorfkarte)
│
├── public/
│   └── data/
│       ├── locations.json      # Master-Liste der Orte
│       ├── bakery/
│       │   ├── baby.json
│       │   └── a1.json
│       └── hospital/
│           └── a1.json
│
└── scripts/                    # Läuft auf dem Raspberry Pi
    ├── generate_content.py     # Hauptgenerierungsskript
    ├── prompts.py              # Gemini-Prompt-Vorlagen
    ├── requirements.txt
    └── .env                    # API-Schlüssel (gitignore)
```

---

## 🎨 Design-Konzept

**Kontrast zwischen Dämmerungsdorf + außerirdischer Technologie**

- Hintergrund: Dämmerungslila `#2D1B4E` — Himmel eines deutschen Dorfes bei Sonnenuntergang
- Dorf: Warmes Bernstein `#FF8C42` — Wärme von Straßenlaternen und Gebäudefenstern
- Alien: Minze `#4ECDC4` — Farbe der außerirdischen Technologie, die nur für UFOs und Interfaces verwendet wird
- Schriftart: Space Mono — Monospace, das das Gefühl eines Raumschiff-Armaturenbretts vermittelt

---

## 📊 Kostenstruktur

| Element | Kosten |
|------|------|
| Vercel Deployment | Kostenlos (Hobby Plan) |
| GitHub Repository | Kostenlos |
| Google Gemini API | Kostenlos (Flash-Modell kostenloses Kontingent) |
| Raspberry Pi 3 Betrieb | Nutzung vorhandener Geräte |
| **Monatliche Gesamtkosten** | **0$** |

---

## 🔮 Zukünftige Pläne

- [ ] Google Cloud TTS-Integration — Vorgenerieren natürlich klingender deutscher Aussprache-Audiodateien
- [ ] Erweiterung der B1/B2-Level-Inhalte
- [ ] Überprüfungsnotiz-Funktion für falsche Antworten
- [ ] Visualisierung von Lernstatistiken

---

## 👨‍💻 Entwickler

Ein Projekt, das für das persönliche Deutschstudium konzipiert und entwickelt wurde.
Erstellt unter Berücksichtigung einer praktischen Architektur ohne unnötige Kosten.

> "Gebaut, weil ich es brauchte, und ich benutze es selbst."
