# Jules Prompt — 문법 레슨 추가 템플릿 (Autopilot)

> `{level}` 만 레벨에 맞춰 수정해서 Jules에 던져주면, Jules가 알아서 주제 선정부터 순번까지 처리해줍니다.

---

## Jules에게 보낼 프롬프트

```
Please add a new, appropriate German grammar lesson for the level "{level}" to the Hallo Deutschland app.

### Instructions for Jules:

1. **Read/Analyze**: Look at the existing file `public/data/grammar/{level}.json`.
2. **Topic Selection**: Identify which grammar topics are already covered. Then, choose a NEW essential grammar topic for the {LEVEL} level (CEFR standard) that is not yet in the file.
3. **ID Generation**: Look at the last lesson ID (e.g., `gram_{level}_003`) and generate the next sequential ID (e.g., `gram_{level}_004`).
4. **Content Creation**: Generate the grammar content in the following JSON format:

{
  "id": "gram_{level}_{next_number}",
  "topic": "Name of topic (German and Korean)",
  "explanation": "Friendly, educational explanation in Korean.",
  "examples": [
    {
      "german": "Natural example sentence",
      "korean": "Korean translation",
      "pronunciation": "Korean phonetics"
    }
  ],
  "conjugation_table": [ ... if applicable ... ]
}

5. **Update File**: Append the new lesson to the "lessons" array in `public/data/grammar/{level}.json`. Also update the "lastUpdated" field to today's date.

Rules:
- level: {level}
- Grammar topics must be accurate to the {LEVEL} level requirements.
- ALL explanations and translations MUST be in Korean.
- Pronunciation MUST be in Korean phonetics.
- DO NOT delete or overwrite existing lessons. Append the new one.
```

---

## 변수 설명

| 변수 | 설명 | 예시 |
|---|---|---|
| `{level}` | 소문자 레벨 | `a1`, `a2`, `b1`, `b2` |
| `{LEVEL}` | 대문자 레벨 | `A1`, `A2`, `B1`, `B2` |

---

## 사용 예시 (A1 새로운 문법 추가 요청)

```
{level} → a1
{LEVEL} → A1
```

Jules는 `a1.json`을 읽고, 현재 없는 주제(예: 'Imperativ', 'Possessivartikel' 등) 중 하나를 골라 `gram_a1_004` 번호로 자동 추가합니다.
