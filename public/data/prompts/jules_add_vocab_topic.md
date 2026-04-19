# Jules Prompt — 어휘 토픽 추가 템플릿

> `{중괄호}` 부분만 바꿔서 Jules에 그대로 붙여넣기 하면 됩니다.

---

## Jules에게 보낼 프롬프트

```
Please generate German vocabulary for the topic "{topic_id}" and add it 
to the Hallo Deutschland app.

### Task 1 — Create vocabulary file

Create the file: `public/data/vocabulary/{level}/{topic_id}.json`

Use this exact JSON format — do NOT change the structure:
{
  "topic": "{topic_id}",
  "topic_label": "{topic_label}",
  "topic_korean": "{topic_korean}",
  "topic_icon": "{topic_icon}",
  "level": "{LEVEL}",
  "words": [
    {
      "id": "voc_{level}_{topic_id}_001",
      "word": "...",
      "article": "der | die | das | null",
      "plural": "... | null",
      "pronunciation": "한국어 발음 표기 (예: 데어 티슈)",
      "meaning": "한국어 뜻",
      "example": "A simple {LEVEL}-level German sentence using this word.",
      "example_translation": "예문의 한국어 번역",
      "example_pronunciation": "예문의 한국어 발음 표기",
      "tags": ["noun | verb | adjective", "topic_tag"]
    }
  ],
  "lastUpdated": "today's date (YYYY-MM-DD)"
}

Generate exactly 10 words relevant to "{topic_korean}" in a real-life context.

Rules:
- {LEVEL} level only (appropriate difficulty)
- article must be "der", "die", "das", or null (null for verbs/adjectives)
- pronunciation MUST be in Korean phonetics (한국어 발음)
- example sentence must be a real, natural sentence at {LEVEL} level
- no duplicate words
- id format: voc_{level}_{topic_id}_001, 002, 003... (sequential)

### Task 2 — Register the topic in index.json

In `public/data/index.json`, add this entry to the "{level}" array
if it does not already exist:

{ "id": "{topic_id}", "label": "{topic_label}", "korean": "{topic_korean}", "icon": "{topic_icon}" }

IMPORTANT: Do NOT remove or modify any existing entries in index.json.
```

---

## 변수 설명

| 변수 | 설명 | 예시 |
|---|---|---|
| `{level}` | 소문자 레벨 | `a1`, `a2`, `b1`, `b2` |
| `{LEVEL}` | 대문자 레벨 | `A1`, `A2`, `B1`, `B2` |
| `{topic_id}` | 파일명 (소문자, 영문) | `restaurant`, `bahnhof`, `arzt` |
| `{topic_label}` | 독일어 표기 | `Restaurant`, `Bahnhof`, `Arztpraxis` |
| `{topic_korean}` | 한국어 이름 | `레스토랑`, `기차역`, `병원` |
| `{topic_icon}` | 이모지 | `🍽️`, `🚉`, `🏥` |

---

## 채우기 예시 (레스토랑 A1)

```
{level}        → a1
{LEVEL}        → A1
{topic_id}     → restaurant
{topic_label}  → Restaurant
{topic_korean} → 레스토랑
{topic_icon}   → 🍽️
```

→ 생성 파일: `public/data/vocabulary/a1/restaurant.json`

---

## 토픽 아이디어

| topic_id | label | korean | icon | 추천 레벨 |
|---|---|---|---|---|
| `restaurant` | Restaurant | 레스토랑 | 🍽️ | A1 |
| `bahnhof` | Bahnhof | 기차역 | 🚉 | A1 |
| `supermarkt` | Supermarkt | 마트 | 🛒 | A1 |
| `arzt` | Arztpraxis | 병원 | 🏥 | A1, A2 |
| `arbeit` | Arbeit | 직장 | 💼 | A2 |
| `wohnung` | Wohnung | 집/주거 | 🏠 | A2 |
| `bank` | Bank | 은행 | 🏦 | A2 |
| `schule` | Schule | 학교 | 🏫 | A2, B1 |
| `reise` | Reise | 여행 | ✈️ | B1 |
| `beruf` | Beruf | 직업/커리어 | 👔 | B1, B2 |
