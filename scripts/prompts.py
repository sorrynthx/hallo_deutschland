"""
Alien K-9 Deutsch Quest — 프롬프트 템플릿
"""


def build_prompt(location: dict, level: str, config: dict, week: str) -> str:
    loc_id     = location["id"]
    loc_korean = location["korean"]
    loc_label  = location["label"]

    voc_count  = config.get("vocabulary", 0)
    expr_count = config.get("expressions", 0)
    gram_count = config.get("grammar", 0)
    conv_count = config.get("conversation", 0)

    type_instructions = []

    if voc_count > 0:
        type_instructions.append(f"""[vocabulary] {voc_count}개
- id 형식: voc_{loc_id}_{level}_{week}_001 (순번)
- 필드: word, article (der/die/das/null), plural (없으면 null),
  pronunciation (한글 발음), meaning (한국어),
  example (독일어 예문), example_translation (한국어),
  example_pronunciation (한글 발음), tags (배열), week
- {loc_korean} 상황에서 자주 쓰는 단어 위주""")

    if gram_count > 0:
        type_instructions.append(f"""[grammar] {gram_count}개
- id 형식: gram_{loc_id}_{level}_{week}_001
- 필드: type (fill_blank / conjugation_table / declension_table),
  topic, topic_explanation,
  question (빈칸은 반드시 ____ 4개 언더바로 표시),
  question_translation,
  options (4개 배열), answer, explanation,
  related_table (배열, 없으면 반드시 빈 배열 [] 로),
  week
- related_table 필드명 규칙 (반드시 준수):
  * conjugation_table: pronoun (절대 person 사용 금지), form
  * declension_table: pronoun (절대 person 사용 금지), form
  * fill_blank 의 related_table: pronoun (절대 person 사용 금지), form
  * 예시: {{"pronoun": "ich", "form": "bin"}}
- {level.upper()} 레벨에 적합한 문법""")

    if conv_count > 0:
        type_instructions.append(f"""[conversation] {conv_count}개
- id 형식: conv_{loc_id}_{level}_{week}_001
- 필드: situation ({loc_korean}의 구체적 상황), situation_icon (이모지 1개),
  dialogue (배열: role/text/pronunciation/translation, isQuestion:true 항목 1개 포함),
  choices (3개 배열: text/pronunciation/translation),
  answer, explanation, grammar_point, week""")

    if expr_count > 0:
        type_instructions.append(f"""[expressions] {expr_count}개
- id 형식: expr_{loc_id}_{level}_{week}_001
- 필드: phrase, pronunciation (한글), meaning (한국어), usage (언제 쓰는지),
  alternatives (배열: phrase/pronunciation/nuance),
  responses (배열: text/pronunciation/translation), week""")

    types_str = "\n\n".join(type_instructions)

    return f"""당신은 독일어 학습 콘텐츠 생성 전문가입니다.
아래 조건에 맞는 독일어 학습 데이터를 JSON으로 생성해주세요.

## 조건
- 상황: {loc_label} ({loc_korean})
- 레벨: {level.upper()}
- 주차: {week}

## 생성 항목
{types_str}

## 중요 규칙
1. related_table 의 인칭 필드는 반드시 "pronoun" 키를 사용하세요. "person" 키는 절대 사용 금지.
2. 빈칸 표시는 반드시 ____ (언더바 4개)를 사용하세요.
3. related_table 이 없는 경우 빈 배열 [] 로 채워주세요.

## 출력 규칙
- 순수 JSON만 출력 (마크다운 코드블록, 설명 없이)
- 아래 구조 그대로 출력

{{
  "location": "{loc_id}",
  "level": "{level}",
  "week": "{week}",
  "items": {{
    "vocabulary": [],
    "grammar": [],
    "conversation": [],
    "expressions": []
  }}
}}"""