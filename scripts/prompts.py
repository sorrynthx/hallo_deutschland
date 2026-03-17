"""
Alien K-9 Deutsch Quest — 프롬프트 템플릿 (타입별 단일 호출)
"""


def build_prompt_single(
    location: dict,
    level: str,
    content_type: str,
    count: int,
    week: str
) -> str:
    """타입 하나만 생성하는 프롬프트 — JSON 잘림 방지"""

    loc_id     = location["id"]
    loc_korean = location["korean"]
    loc_label  = location["label"]

    instruction = ""

    if content_type == "vocabulary":
        instruction = f"""독일어 단어 {count}개를 생성하세요.
각 항목 필드:
- id: "voc_{loc_id}_{level}_{week}_001" (순번)
- word, article (der/die/das/null), plural (없으면 null)
- pronunciation (한글 발음), meaning (한국어)
- example (독일어 예문), example_translation (한국어)
- example_pronunciation (한글 발음)
- tags (배열), week: "{week}"
- {loc_korean} 상황에서 자주 쓰는 단어 위주"""

    elif content_type == "grammar":
        instruction = f"""독일어 문법 문제 {count}개를 생성하세요.
각 항목 필드:
- id: "gram_{loc_id}_{level}_{week}_001" (순번)
- type: "fill_blank" 또는 "conjugation_table" 또는 "declension_table"
- topic, topic_explanation
- question (빈칸은 반드시 ____ 언더바 4개), question_translation
- options (4개 배열), answer, explanation
- related_table: 반드시 "pronoun" 키 사용 (person 금지), form 키 사용
  예시: [{{"pronoun": "ich", "form": "bin"}}, ...]
  없으면 빈 배열 []
- week: "{week}"
- {level.upper()} 레벨 적합 문법"""

    elif content_type == "conversation":
        instruction = f"""독일어 대화 퀴즈 {count}개를 생성하세요.
각 항목 필드:
- id: "conv_{loc_id}_{level}_{week}_001" (순번)
- situation ({loc_korean}의 구체적 상황), situation_icon (이모지 1개)
- dialogue 배열: role, text, pronunciation, translation, isQuestion(true/false)
  isQuestion이 true인 항목 1개 반드시 포함
- choices (3개): text, pronunciation, translation
- answer (choices 중 하나의 text), explanation, grammar_point
- week: "{week}"
"""

    elif content_type == "expressions":
        instruction = f"""독일어 표현 {count}개를 생성하세요.
각 항목 필드:
- id: "expr_{loc_id}_{level}_{week}_001" (순번)
- phrase, pronunciation (한글), meaning (한국어), usage
- alternatives 배열: phrase, pronunciation, nuance
- responses 배열: text, pronunciation, translation
- week: "{week}"
"""

    return f"""당신은 독일어 학습 콘텐츠 전문가입니다.
{loc_label} ({loc_korean}) 상황, {level.upper()} 레벨 데이터를 생성하세요.

{instruction}

## 출력 규칙
- 순수 JSON만 출력 (마크다운 코드블록 없이)
- 아래 구조만 출력:

{{
  "items": [
    {{ ... }},
    {{ ... }}
  ]
}}"""