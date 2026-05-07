# 프로젝트 트리 구조 (Hallo Deutschland)

> Next.js 16 기반 독일어 학습 앱(A1–B2)의 디렉터리 구조 문서입니다.
> 빌드 산출물(`.next`), 의존성(`node_modules`), Git 메타데이터(`.git`) 및 OS 캐시(`.DS_Store`)는 제외했습니다.

## 트리

```
hallo-deutschland/
├── app/                          # Next.js App Router (페이지/레이아웃/UI)
│   ├── components/
│   │   └── TopNav.tsx            # 상단 내비게이션 컴포넌트
│   ├── contexts/
│   │   └── LevelContext.tsx      # 학습 레벨(A1~B2) 전역 상태 관리
│   ├── grammar/
│   │   └── page.tsx              # 문법 학습 페이지
│   ├── quiz/
│   │   ├── [topic]/
│   │   │   └── page.tsx          # 주제별 동적 퀴즈 페이지
│   │   └── page.tsx              # 퀴즈 인덱스 페이지
│   ├── favicon.ico
│   ├── globals.css               # Tailwind 글로벌 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   ├── manifest.json             # PWA 매니페스트
│   └── page.tsx                  # 홈 페이지
│
├── public/                       # 정적 자산 및 학습 데이터
│   ├── data/
│   │   ├── grammar/
│   │   │   └── a1.json           # A1 레벨 문법 데이터
│   │   ├── market/
│   │   │   └── b1.json           # B1 레벨 마켓(상황별) 데이터
│   │   ├── prompts/              # 콘텐츠 생성용 LLM 프롬프트
│   │   │   ├── jules_add_grammar_topic.md
│   │   │   ├── jules_add_vocab_topic.md
│   │   │   └── run_in_llm_website.md
│   │   ├── vocabulary/
│   │   │   ├── a1/               # A1 단어장
│   │   │   │   ├── baeckerei.json     # 빵집
│   │   │   │   ├── bahnhof.json       # 기차역
│   │   │   │   ├── beruf.json         # 직업
│   │   │   │   └── supermarkt.json    # 슈퍼마켓
│   │   │   ├── a2/               # A2 단어장 (예정)
│   │   │   ├── b1/               # B1 단어장 (예정)
│   │   │   └── b2/               # B2 단어장 (예정)
│   │   └── index.json            # 데이터 인덱스(메타)
│   └── icons/
│       ├── icon-192.png          # PWA 아이콘 (192px)
│       └── icon-512.png          # PWA 아이콘 (512px)
│
├── scripts/                      # 콘텐츠 생성 스크립트(Python)
│   ├── .env                      # (커밋 금지) 환경 변수
│   ├── .env.example              # 환경 변수 예시
│   ├── generate_content.py       # 학습 콘텐츠 자동 생성기
│   └── requirements.txt          # Python 의존성
│
├── .gitignore
├── README.md                     # 프로젝트 소개 (한/영/독)
├── eslint.config.mjs             # ESLint 설정
├── next-env.d.ts                 # Next.js 타입 정의
├── next.config.ts                # Next.js 설정
├── package.json                  # npm 의존성 / 스크립트
├── package-lock.json
├── postcss.config.mjs            # PostCSS / Tailwind 설정
├── tree.md                       # (이 문서) 디렉터리 구조 안내
└── tsconfig.json                 # TypeScript 설정
```

## 디렉터리 요약

| 경로 | 역할 |
| --- | --- |
| `app/` | Next.js App Router. 라우팅, 레이아웃, 클라이언트 컴포넌트가 위치합니다. |
| `app/components/` | 페이지 간 재사용되는 UI 컴포넌트 |
| `app/contexts/` | React Context (학습 레벨 등 전역 상태) |
| `app/grammar/` | 문법 학습 라우트 (`/grammar`) |
| `app/quiz/` | 퀴즈 라우트 (`/quiz`, `/quiz/[topic]`) |
| `public/data/` | 백엔드 없이 사용하는 정적 학습 데이터(JSON) |
| `public/data/vocabulary/<level>/` | CEFR 레벨별 주제 단어장 |
| `public/data/grammar/` | 레벨별 문법 데이터 |
| `public/data/prompts/` | 콘텐츠 생성을 위한 LLM 프롬프트 모음 |
| `public/icons/` | PWA용 아이콘 |
| `scripts/` | 학습 콘텐츠를 자동 생성하는 Python 스크립트 |

## 기술 스택

- **프레임워크**: Next.js `16.1.6` (App Router)
- **런타임**: React `19.2.3`
- **언어**: TypeScript `^5`
- **스타일**: Tailwind CSS `^4` (PostCSS 플러그인 방식)
- **린팅**: ESLint `^9` + `eslint-config-next`
- **데이터**: 백엔드/DB 없이 `public/data/**/*.json` 정적 파일 기반
- **콘텐츠 자동화**: `scripts/generate_content.py` (Python)

## 라우팅 맵

| URL | 파일 |
| --- | --- |
| `/` | `app/page.tsx` |
| `/grammar` | `app/grammar/page.tsx` |
| `/quiz` | `app/quiz/page.tsx` |
| `/quiz/[topic]` | `app/quiz/[topic]/page.tsx` |

## 제외된 항목

다음 항목은 가독성과 의미 있는 구조 파악을 위해 트리에서 제외했습니다.

- `node_modules/` — npm 의존성 (재생성 가능)
- `.next/` — Next.js 빌드 산출물
- `.git/` — Git 내부 메타데이터
- `.DS_Store` — macOS 시스템 파일
