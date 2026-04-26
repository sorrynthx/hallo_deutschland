# Jules Prompt — 어휘 토픽 추가 템플릿 (Smart)

> 상단의 `{level}`과 `{topic}`만 작성해서 Jules에 전달하면, 나머지(아이콘, 독일어명, ID 등)는 Jules가 알아서 판단하여 생성합니다.

---

## Jules에게 보낼 프롬프트

```
I want to add a new vocabulary topic to the Hallo Deutschland app.

Target Level: {level}
Target Topic: {topic}

### Instructions for Jules:

1. **Information Extraction**:
   - Infer the **topic_korean** name and a suitable **topic_icon** (emoji) for the given "{topic}".
   - Create a clean **topic_id** (snake_case, English).
   - Determine the correct **topic_label** (German capitalized name).

2. **Task 1 — Create vocabulary file**:
   - Create the file: `public/data/vocabulary/{level}/[topic_id].json`
   - Use the standard JSON structure:
   {
     "topic": "[topic_id]",
     "topic_label": "[topic_label]",
     "topic_korean": "[topic_korean]",
     "topic_icon": "[topic_icon]",
     "level": "{LEVEL}",
     "words": [
       {
         "id": "voc_{level}_[topic_id]_001",
         "word": "...",
         "article": "der | die | das | null",
         "plural": "...",
         "pronunciation": "Korean phonetics",
         "meaning": "Korean meaning",
         "example": "German example sentence",
         "example_translation": "Korean translation",
         "example_pronunciation": "Korean phonetics",
         "tags": ["noun | verb | adjective", "[topic_id]"]
       }
     ],
     "lastUpdated": "YYYY-MM-DD"
   }
   - Generate exactly 10 essential words for this topic at the {LEVEL} level.

3. **Task 2 — Register the topic in index.json**:
   - In `public/data/index.json`, add the entry to the "{level}" array:
   { "id": "[topic_id]", "label": "[topic_label]", "korean": "[topic_korean]", "icon": "[topic_icon]" }

Rules:
- level: {level} (a1, a2, etc.)
- Use Korean for all meanings, translations, and explanations.
- Pronunciation MUST be in Korean phonetics.
- Do not repeat words.
- Ensure natural German sentences.
```

---

## 사용 예시

```
Target Level: a1
Target Topic: 공항 (Airport)
```

Jules는 위 요청을 받으면 자동으로 `id: airport`, `label: Flughafen`, `icon: ✈️` 등을 설정하여 파일을 생성하고 `index.json`에 등록합니다.

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
