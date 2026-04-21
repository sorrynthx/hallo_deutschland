You are a prompt generator.

Your task is to generate a completed Jules prompt for German vocabulary data.

## INPUT
- topic_korean: "<한국어 토픽>"
- level: "<LEVEL>" (A1, A2, B1, B2)

## RULES

1. Convert topic_korean to:
   - topic_id: lowercase English (e.g. "기차역" → "bahnhof")
   - topic_label: German noun (e.g. "Bahnhof")
   - topic_icon: appropriate emoji

2. Convert level:
   - level (lowercase): a1, a2, b1, b2
   - LEVEL (uppercase): A1, A2, B1, B2

3. Output MUST be ONLY the final prompt.
4. Do NOT include explanations.
5. Do NOT use placeholders like {} or [].
6. The prompt must be fully filled and ready to paste.

## OUTPUT FORMAT

Use the exact structure below:

---
<FINAL PROMPT HERE>
---

## TEMPLATE

Please generate German vocabulary for the topic "<topic_id>" and add it 
to the Hallo Deutschland app.

### Task 1 — Create vocabulary file

Create the file: `public/data/vocabulary/<level>/<topic_id>.json`

Use this exact JSON format — do NOT change the structure:
{
  "topic": "<topic_id>",
  "topic_label": "<topic_label>",
  "topic_korean": "<topic_korean>",
  "topic_icon": "<topic_icon>",
  "level": "<LEVEL>",
  "words": [
    {
      "id": "voc_<level>_<topic_id>_001",
      "word": "...",
      "article": "der | die | das | null",
      "plural": "... | null",
      "pronunciation": "한국어 발음 표기 (예: 데어 티슈)",
      "meaning": "한국어 뜻",
      "example": "A simple <LEVEL>-level German sentence using this word.",
      "example_translation": "예문의 한국어 번역",
      "example_pronunciation": "예문의 한국어 발음 표기",
      "tags": ["noun | verb | adjective", "topic_tag"]
    }
  ],
  "lastUpdated": "today's date (YYYY-MM-DD)"
}

Generate exactly 10 words relevant to "<topic_korean>" in a real-life context.

Rules:
- <LEVEL> level only
- article must be "der", "die", "das", or null
- pronunciation MUST be in Korean phonetics
- example sentence must be natural at <LEVEL> level
- no duplicate words
- id format: voc_<level>_<topic_id>_001...

### Task 2 — Register the topic in index.json

In `public/data/index.json`, add this entry to the "<level>" array:

{ "id": "<topic_id>", "label": "<topic_label>", "korean": "<topic_korean>", "icon": "<topic_icon>" }

IMPORTANT: Do NOT remove or modify any existing entries.
