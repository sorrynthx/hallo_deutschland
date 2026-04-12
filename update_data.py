import json
import os

# 주차 정보 (요구사항: W11)
week = "W11"
base_dir = "public/data"

# locations.json에서 위치 및 레벨 정보 읽기
with open(f"{base_dir}/locations.json", "r", encoding="utf-8") as f:
    locations_data = json.load(f)["locations"]

# 장소별 100% 진짜 독일어 단어 기초 데이터 (단어, 관사, 복수형, 한글발음, 한국어뜻)
loc_words = {
    "bakery": [("Brot", "das", "Brote", "브로트", "빵"), ("Kuchen", "der", "Kuchen", "쿠헨", "케이크"), ("Torte", "die", "Torten", "토르테", "크림 케이크"), ("Brezel", "die", "Brezeln", "브레첼", "프레즐"), ("Brötchen", "das", "Brötchen", "브뢰첸", "작은 빵")],
    "station": [("Zug", "der", "Züge", "추크", "기차"), ("Gleis", "das", "Gleise", "글라이스", "플랫폼"), ("Fahrkarte", "die", "Fahrkarten", "파르카르테", "승차권"), ("Verspätung", "die", "Verspätungen", "페어슈패퉁", "지연"), ("Bahnhof", "der", "Bahnhöfe", "반호프", "기차역")],
    "market": [("Apfel", "der", "Äpfel", "압펠", "사과"), ("Milch", "die", "Milchen", "밀히", "우유"), ("Käse", "der", "Käse", "캐제", "치즈"), ("Fleisch", "das", "-", "플라이쉬", "고기"), ("Gemüse", "das", "Gemüse", "게뮈제", "채소")],
    "inn": [("Bier", "das", "Biere", "비어", "맥주"), ("Tisch", "der", "Tische", "티쉬", "테이블"), ("Speisekarte", "die", "Speisekarten", "슈파이제카르테", "메뉴판"), ("Rechnung", "die", "Rechnungen", "레히눙", "계산서"), ("Kellner", "der", "Kellner", "켈너", "웨이터")],
    "hospital": [("Arzt", "der", "Ärzte", "아르츠트", "의사"), ("Schmerz", "der", "Schmerzen", "슈메르츠", "통증"), ("Rezept", "das", "Rezepte", "레쳅트", "처방전"), ("Apotheke", "die", "Apotheken", "아포테케", "약국"), ("Fieber", "das", "-", "피버", "열")],
    "library": [("Buch", "das", "Bücher", "부흐", "책"), ("Ausweis", "der", "Ausweise", "아우스바이스", "신분증"), ("Frist", "die", "Fristen", "프리스크", "기한"), ("Mahnung", "die", "Mahnungen", "마눙", "연체 통지"), ("Regal", "das", "Regale", "레갈", "선반")],
    "school": [("Lehrer", "der", "Lehrer", "레러", "선생님"), ("Schüler", "der", "Schüler", "쉴러", "학생"), ("Klasse", "die", "Klassen", "클라쎄", "학급"), ("Hausaufgabe", "die", "Hausaufgaben", "하우스아우프가베", "숙제"), ("Tafel", "die", "Tafeln", "타펠", "칠판")],
    "park": [("Baum", "der", "Bäume", "바움", "나무"), ("Bank", "die", "Bänke", "방크", "벤치"), ("Blume", "die", "Blumen", "블루메", "꽃"), ("Weg", "der", "Wege", "베크", "길"), ("Wiese", "die", "Wiesen", "비제", "잔디밭")],
    "rathaus": [("Formular", "das", "Formulare", "포르물라", "서식"), ("Unterschrift", "die", "Unterschriften", "운터슈리프트", "서명"), ("Termin", "der", "Termine", "테어민", "예약"), ("Beamte", "der", "Beamten", "베암테", "공무원"), ("Pass", "der", "Pässe", "파스", "여권")]
}

def get_akk_article(article):
    return "den" if article == "der" else article

def get_dat_article(article):
    if article == "der" or article == "das": return "dem"
    if article == "die": return "der"
    return "den" # Plural

# 단어 데이터 생성 함수
def generate_vocabs(loc_id, level, week):
    words = loc_words.get(loc_id, loc_words["bakery"])
    items = []
    for i, (word, article, plural, pron, meaning) in enumerate(words):
        akk_art = get_akk_article(article)
        ex_de = f"Wo ist {article} {word}?"
        ex_ko = f"그 {meaning}은/는 어디에 있나요?"
        ex_pron = f"보 이스트 {article} {word}?"
        if level in ["a2", "b1", "b2"]:
            ex_de = f"Ich suche {akk_art} {word}, können Sie mir helfen?"
            ex_ko = f"저는 {meaning}을/를 찾고 있습니다. 도와주실 수 있나요?"
            ex_pron = f"이히 주헤 {akk_art} {word}, 쾨넨 지 미어 헬펜?"

        item = {
            "id": f"voc_{loc_id}_{level}_{week}_00{i+1}",
            "word": word,
            "article": article,
            "plural": plural,
            "pronunciation": pron,
            "meaning": meaning,
            "example": ex_de,
            "example_translation": ex_ko,
            "example_pronunciation": ex_pron,
            "tags": [loc_id.capitalize(), "Nomen"],
            "week": week
        }
        items.append(item)
    return items

# 문법 데이터 생성 함수
def generate_grammar(loc_id, level, week):
    words = loc_words.get(loc_id, loc_words["bakery"])
    items = []

    # 1. Akkusativ (목적격)
    w1 = words[0]
    akk_ans = get_akk_article(w1[1])
    opts_akk = list({"der", "die", "das", "den", "dem"} - {akk_ans})[:3] + [akk_ans]

    item1 = {
        "id": f"gram_{loc_id}_{level}_{week}_001",
        "type": "fill_blank",
        "topic": "Akkusativ",
        "topic_explanation": "목적격(4격) 관사 채우기",
        "question": f"Ich brauche ____ {w1[0]}.",
        "question_translation": f"나는 그 {w1[4]}이/가 필요해.",
        "options": opts_akk,
        "answer": akk_ans,
        "explanation": f"{w1[0]}은/는 {w1[1]} 명사이므로, Akkusativ 형태는 {akk_ans}입니다.",
        "related_table": [{"pronoun": "ich", "form": "brauche"}],
        "week": week
    }
    items.append(item1)

    # 2. Dativ (여격) - mit 전치사 뒤
    w2 = words[1]
    dat_ans = get_dat_article(w2[1])
    opts_dat = list({"der", "die", "das", "den", "dem"} - {dat_ans})[:3] + [dat_ans]

    item2 = {
        "id": f"gram_{loc_id}_{level}_{week}_002",
        "type": "fill_blank",
        "topic": "Dativ",
        "topic_explanation": "전치사 mit 다음 여격(3격)",
        "question": f"Ich komme mit ____ {w2[0]}.",
        "question_translation": f"나는 그 {w2[4]}와/과 함께 온다.",
        "options": opts_dat,
        "answer": dat_ans,
        "explanation": f"mit 다음에는 Dativ가 옵니다. {w2[0]}은/는 {w2[1]} 명사이므로 {dat_ans}가 됩니다.",
        "related_table": [{"pronoun": "ich", "form": "komme"}],
        "week": week
    }
    items.append(item2)

    # 3. Nominativ (주격)
    w3 = words[2]
    nom_ans = w3[1]
    opts_nom = list({"der", "die", "das", "den", "dem"} - {nom_ans})[:3] + [nom_ans]

    item3 = {
        "id": f"gram_{loc_id}_{level}_{week}_003",
        "type": "fill_blank",
        "topic": "Nominativ",
        "topic_explanation": "주격(1격) 관사 채우기",
        "question": f"Hier ist ____ {w3[0]}.",
        "question_translation": f"여기에 그 {w3[4]}이/가 있다.",
        "options": opts_nom,
        "answer": nom_ans,
        "explanation": f"{w3[0]}은/는 {w3[1]} 명사이므로, Nominativ 형태는 {nom_ans}입니다.",
        "related_table": [{"pronoun": "es", "form": "ist"}],
        "week": week
    }
    items.append(item3)

    # 4. 동사 변화 (Conjugation)
    item4 = {
        "id": f"gram_{loc_id}_{level}_{week}_004",
        "type": "fill_blank",
        "topic": "Präsens",
        "topic_explanation": "현재 시제 동사 변화",
        "question": f"Wir ____ heute zum {loc_id}.",
        "question_translation": f"우리는 오늘 {loc_id}에 간다.",
        "options": ["gehen", "gehe", "geht", "gehst"],
        "answer": "gehen",
        "explanation": "주어가 Wir(우리)일 때 동사원형(gehen) 형태를 사용합니다.",
        "related_table": [{"pronoun": "wir", "form": "gehen"}],
        "week": week
    }
    items.append(item4)

    # 5. 형용사 어미 변화 등
    item5 = {
        "id": f"gram_{loc_id}_{level}_{week}_005",
        "type": "fill_blank",
        "topic": "Adjektivdeklination",
        "topic_explanation": "형용사 어미 변화",
        "question": f"Das ist ein schön____ Tag.",
        "question_translation": "아름다운 날이다.",
        "options": ["er", "es", "e", "en"],
        "answer": "er",
        "explanation": "Tag은 남성 명사이므로, 부정관사 ein 뒤 주격 형태인 schöner가 됩니다.",
        "related_table": [{"pronoun": "er", "form": "ist"}],
        "week": week
    }
    items.append(item5)

    return items

# 대화 데이터 생성 함수
def generate_conversation(loc_id, level, week):
    words = loc_words.get(loc_id, loc_words["bakery"])
    items = []
    for i in range(5):
        word = words[i][0]
        meaning = words[i][4]
        article = words[i][1]

        item = {
            "id": f"conv_{loc_id}_{level}_{week}_00{i+1}",
            "situation": f"{meaning} 유무 묻기",
            "situation_icon": "💬",
            "dialogue": [
                {
                    "role": "A",
                    "text": f"Haben Sie noch {word}?",
                    "pronunciation": f"하벤 지 노흐 {word}?",
                    "translation": f"아직 {meaning} 있나요?",
                    "isQuestion": True
                },
                {
                    "role": "B",
                    "text": f"Ja, {article} {word} ist dort hinten.",
                    "pronunciation": f"야, {article} {word} 이스트 도르트 힌텐.",
                    "translation": f"네, {meaning}은/는 저기 뒤에 있습니다.",
                    "isQuestion": False
                }
            ],
            "choices": [
                {"text": "Ja, bitte.", "pronunciation": "야, 비테.", "translation": "네, 부탁합니다."},
                {"text": f"Wo finde ich {get_akk_article(article)} {word}?", "pronunciation": f"보 핀데 이히 {get_akk_article(article)} {word}?", "translation": f"{meaning}을/를 어디서 찾을 수 있나요?"},
                {"text": "Nein, danke.", "pronunciation": "나인, 당케.", "translation": "아니요, 괜찮습니다."}
            ],
            "answer": f"Wo finde ich {get_akk_article(article)} {word}?",
            "explanation": f"{meaning}의 위치를 묻는 적절한 질문을 고릅니다.",
            "grammar_point": "의문사 Wo와 Akkusativ",
            "week": week
        }
        if level in ["b1", "b2"]:
            item["dialogue"][0]["text"] = f"Könnten Sie mir bitte sagen, ob Sie noch {word} vorrätig haben?"
            item["dialogue"][0]["pronunciation"] = f"쾨넨 지 미어 비테 자겐, 옵 지 노흐 {word} 포르레티히 하벤?"
            item["dialogue"][0]["translation"] = f"{meaning} 재고가 아직 있는지 말씀해 주시겠어요?"
        items.append(item)
    return items

# 표현 데이터 생성 함수
def generate_expressions(loc_id, level, week):
    words = loc_words.get(loc_id, loc_words["bakery"])
    items = []
    for i in range(5):
        word = words[i][0]
        meaning = words[i][4]
        article = words[i][1]
        akk_art = get_akk_article(article)

        phrase = f"Ich hätte gern {akk_art} {word}."
        ko_meaning = f"저는 그 {meaning}을/를 원합니다."
        pron = f"이히 헤테 게른 {akk_art} {word}."
        if level in ["b1", "b2"]:
            phrase = f"Ich interessiere mich für {akk_art} {word}."
            ko_meaning = f"저는 그 {meaning}에 관심이 있습니다."
            pron = f"이히 인터레시어레 미히 퓌어 {akk_art} {word}."

        item = {
            "id": f"expr_{loc_id}_{level}_{week}_00{i+1}",
            "phrase": phrase,
            "pronunciation": pron,
            "meaning": ko_meaning,
            "usage": f"{meaning}을/를 요청하거나 말할 때 사용합니다.",
            "alternatives": [
                {
                    "phrase": f"Geben Sie mir bitte {akk_art} {word}.",
                    "pronunciation": f"게벤 지 미어 비테 {akk_art} {word}.",
                    "nuance": "정중한 요청"
                }
            ],
            "responses": [
                {
                    "text": "Gerne, sofort.",
                    "pronunciation": "게르네, 조포르트.",
                    "translation": "기꺼이, 바로 드리겠습니다."
                }
            ],
            "week": week
        }
        items.append(item)
    return items

# 모든 로케이션과 레벨에 대해 데이터 생성 및 추가 (Append 원칙 준수)
for loc in locations_data:
    loc_id = loc["id"]
    for level in loc["levels"]:
        file_path = f"{base_dir}/{loc_id}/{level}.json"

        # 파일이 존재하면 기존 데이터 로드, 없으면 기본 구조 생성
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        else:
            data = {
                "location": loc_id,
                "level": level,
                "items": {"vocabulary": [], "grammar": [], "conversation": [], "expressions": []}
            }

        # 기존 배열이 없을 수 있으므로 초기화 확인
        for key in ["vocabulary", "grammar", "conversation", "expressions"]:
            if key not in data.get("items", {}):
                if "items" not in data:
                    data["items"] = {}
                data["items"][key] = []

        # 각 카테고리별로 5개 항목 추가
        data["items"]["vocabulary"].extend(generate_vocabs(loc_id, level, week))
        data["items"]["grammar"].extend(generate_grammar(loc_id, level, week))
        data["items"]["conversation"].extend(generate_conversation(loc_id, level, week))
        data["items"]["expressions"].extend(generate_expressions(loc_id, level, week))

        # lastUpdated 필드 업데이트
        data["lastUpdated"] = week

        # 파일 저장
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

print("Data update complete.")
