# 🐶🛸 Alien K-9 Deutsch Quest

> 우주에서 온 강아지가 독일 마을에 불시착! 독일어를 배워 우주선을 수리하고 집으로 돌아가는 모바일 독일어 학습 앱  
> A space-traveling dog crash-lands in a German village! A mobile app to learn German, repair the spaceship, and return home  
> Ein Hund aus dem All landet not in einem deutschen Dorf! Eine mobile App zum Deutschlernen, um das Raumschiff zu reparieren und nach Hause zurückzukehren  

---

## 📖 프로젝트 개요
## 📖 Project Overview
## 📖 Projektübersicht

혼자 독일어를 공부하기 위해 만든 개인용 모바일 학습 앱입니다.  
A personal mobile learning app built for self-studying German.  
Eine persönliche mobile Lern-App zum eigenständigen Deutschlernen.  

시중의 독일어 학습 앱들은 광고, 구독 모델, 불필요한 기능이 많아 직접 필요한 기능만 갖춘 앱을 제작했습니다.  
Most existing German learning apps include ads, subscriptions, and unnecessary features, so I built one with only essential functions.  
Viele bestehende Deutschlern-Apps enthalten Werbung, Abos und unnötige Funktionen, daher habe ich eine App mit nur den wichtigsten Funktionen entwickelt.  

학습 콘텐츠는 Google Gemini API를 통해 매주 자동 생성 및 업데이트됩니다.  
Learning content is automatically generated and updated weekly using the Google Gemini API.  
Die Lerninhalte werden wöchentlich automatisch mit der Google Gemini API erstellt und aktualisiert.  

---

## 🏗️ 시스템 아키텍처
## 🏗️ System Architecture
## 🏗️ Systemarchitektur

    ┌─────────────────────────────────────────────────────────┐
    │                  RASPBERRY PI 3                          │
    │                                                          │
    │  crontab (weekly 03:00 Mon-Fri)                          │
    │       ↓                                                  │
    │  Python Script                                           │
    │  ├── Read locations.json                                 │
    │  ├── Call Google Gemini API                              │
    │  ├── JSON parse & validate                              │
    │  ├── Save public/data/{location}/{level}.json           │
    │  └── git push                                           │
    │                                                          │
    └──────────────────────┬──────────────────────────────────┘
                           ↓
                  ┌────────────────┐
                  │    GitHub      │
                  └───────┬────────┘
                          ↓
                  ┌────────────────┐
                  │    Vercel      │
                  │  Static JSON   │
                  └───────┬────────┘
                          ↓
                  ┌────────────────┐
                  │   Mobile App   │
                  │     (PWA)      │
                  └────────────────┘

---

## 🛠️ 기술 스택
## 🛠️ Tech Stack
## 🛠️ Tech-Stack

Frontend / Frontend / Frontend  
Next.js 15 + TypeScript  
App Router 기반 라우팅 / App Router routing / App Router Routing  

Styling / Styling / Styling  
CSS Variables + Inline Style  
빌드 없이 관리 / No build tools / Ohne Build-Tools  

Deployment / Deployment / Deployment  
Vercel  
자동 배포 / Auto deploy / Automatische Bereitstellung  

---

## 💡 설계 결정 이유
## 💡 Design Decisions
## 💡 Designentscheidungen

### 왜 DB를 사용하지 않았나요?
### Why no database?
### Warum keine Datenbank?

개인 앱에 DB는 불필요한 비용과 복잡성을 만듭니다.  
A database adds unnecessary cost and complexity.  
Eine Datenbank verursacht unnötige Kosten und Komplexität.  

localStorage로 충분히 저장 가능합니다.  
localStorage is sufficient.  
localStorage reicht aus.  

---

### 왜 Raspberry Pi인가?
### Why Raspberry Pi?
### Warum Raspberry Pi?

기존 장비 활용으로 비용 0원  
Zero cost using existing device  
Null Kosten durch vorhandenes Gerät  

---

## 📱 주요 기능
## 📱 Features
## 📱 Funktionen

마을 지도 기반 학습  
Village-based learning UI  
Dorfbasierte Lernoberfläche  

단어/문법/대화 학습  
Vocabulary / Grammar / Conversation  
Vokabel / Grammatik / Dialog  

게임화 (점수, 부품)  
Gamification (score, parts)  
Gamification (Punkte, Teile)  

---

## 🚀 실행 방법
## 🚀 Getting Started
## 🚀 Ausführung

git clone https://github.com/sorrynthx/hallo_deutschland.git  
cd hallo_deutschland  
npm install  
npm run dev  

---

## 📂 프로젝트 구조
## 📂 Project Structure
## 📂 Projektstruktur

    hallo-deutschland/
    ├── app/
    │   ├── components/
    │   ├── hooks/
    │   ├── learn/
    │   ├── layout.tsx
    │   └── page.tsx
    │
    ├── public/
    │   └── data/
    │       ├── locations.json
    │       ├── bakery/
    │       └── hospital/
    │
    └── scripts/
        ├── generate_content.py
        └── prompts.py

---

## 🎨 디자인 컨셉
## 🎨 Design Concept
## 🎨 Designkonzept

황혼 마을 + 외계 기술 대비  
Twilight village + alien tech  
Dämmerungsdorf + Alien-Technologie  

---

## 📊 비용 구조
## 📊 Cost Structure
## 📊 Kostenstruktur

총 비용 $0  
Total cost $0  
Gesamtkosten $0  

---

## 👨‍💻 개발자
## 👨‍💻 Developer
## 👨‍💻 Entwickler

개인 프로젝트  
Personal project  
Persönliches Projekt  

"필요해서 만들었고, 직접 씁니다."  
"Built because I needed it."  
"Ich habe es gebaut, weil ich es brauche."  