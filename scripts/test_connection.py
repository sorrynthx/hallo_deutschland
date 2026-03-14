"""
Gemini API 연결 테스트
실행: python3 test_connection.py
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

def test_connection():
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        print("❌ .env 파일에 GEMINI_API_KEY 가 없어요!")
        return False

    print(f"✅ API 키 확인: {api_key[:8]}...")

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.0-flash")

        print("📡 Gemini API 호출 중...")
        response = model.generate_content(
            "독일어로 '안녕하세요, 저는 강아지 외계인이에요!'를 번역해줘. 한 문장만."
        )

        print(f"✅ 응답 성공!")
        print(f"💬 {response.text.strip()}")
        return True

    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        return False

if __name__ == "__main__":
    test_connection()