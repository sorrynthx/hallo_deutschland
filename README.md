# 🐶🛸 Alien K-9 Deutsch Quest

> **우주에서 온 강아지가 독일 마을에 불시착! 독일어를 배워 우주선을 수리하고 집으로 돌아가는 모바일 독일어 학습 앱**  
> *A space-traveling dog crash-lands in a German village! A mobile app to learn German, repair the spaceship, and return home*  
> *Ein Hund aus dem All landet not in einem deutschen Dorf! Eine mobile App zum Deutschlernen, um das Raumschiff zu reparieren und nach Hause zurückzukehren*

---

## 📖 Project Overview / Projektübersicht

**시중의 독일어 학습 앱들은 광고와 구독 모델이 많아, 직접 필요한 기능만 담은 미니멀한 학습 도구를 제작했습니다.**  
*I built a minimalist learning tool with only essential functions, avoiding the ads and subscriptions of existing apps.*  
*Ich habe ein minimalistisches Lerntool mit nur den wichtigsten Funktionen entwickelt, um Werbung und Abos bestehender Apps zu vermeiden.*  

**독일 취업을 준비하며 직접 사용하기 위해 만든 개인 프로젝트로, 인프라 유지 비용 0원($0)과 고품질의 데이터 자동 생성을 목표로 합니다.**  
*This is a personal project built for my own use while preparing for a job in Germany, aiming for zero infrastructure costs ($0) and high-quality automated data generation.*  
*Dies ist ein persönliches Projekt, das ich für den Eigenbedarf während meiner Jobsuche in Deutschland entwickelt habe. Ziel sind null Infrastrukturkosten (0 $) und eine hochwertige, automatisierte Datengenerierung.*

---

## 🏗️ System Architecture / Systemarchitektur

**프로젝트 초기에는 Google Gemini API와 Raspberry Pi를 활용하여 데이터를 자동 생성했으나, 현재는 비용 최적화와 코드 안정성을 위해 아래와 같이 구조를 개선했습니다.**  
*Originally, I used Google Gemini API and a Raspberry Pi for automated data generation, but I have evolved the architecture for better cost-efficiency and reliability as follows:*  
*Ursprünglich wurden die Daten automatisch über die Google Gemini API und einen Raspberry Pi generiert, aber die Architektur wurde wie folgt optimiert, um die Kosteneffizienz und Zuverlässigkeit zu erhöhen:*  

[ Workflow: AI-Driven Content Enrichment ]

1. AI Agent (Jules)  <-- Analyze locations.json & Supplement data
       |
       v
2. Pull Request (PR) <-- Manual Code Review & Validation
       |
       v
3. GitHub Actions    <-- Automated Deployment Trigger
       |
       v
4. Vercel (Hobby)    <-- Serving Static JSON Content (Public API)
       |
       v
5. Mobile App (PWA)  <-- Fetching data & LocalStorage Sync

---

## 💡 Tech Decision: Cost Optimization / 비용 최적화 전략

**1. From API to AI Agent (Jules)**
**데이터 축적에 따라 급증하는 API 비용을 해결하기 위해, Gemini API 호출 방식 대신 이미 구독 중인 Jules(AI Agent)를 활용한 데이터 생성 방식으로 전환했습니다.**  
*To avoid increasing API costs as the dataset grows, I transitioned from Gemini API to Jules (AI Agent). This leverages existing subscription benefits to generate high-quality content without additional pay-as-you-go fees.*  
*Um steigende API-Gebühren bei wachsendem Datenvolumen zu vermeiden, wurde von der Gemini API auf Jules (AI Agent) umgestellt. Dies nutzt bestehende Abonnements, um hochwertige Inhalte ohne zusätzliche Kosten zu erstellen.*  

**2. Improved Workflow with PR**
**라즈베리 파이 기반의 크론탭 자동화 대신, 개발자가 Jules와 협업하여 데이터를 보충하고 Pull Request(PR)를 통해 코드 안정성을 검토 후 병합하는 안정적인 워크플로우를 구축했습니다.**  
*Instead of automated scripts on a Raspberry Pi, I now collaborate with Jules to supplement data. This process ensures quality through a Pull Request (PR) workflow, allowing for manual review before merging.*  
*Anstelle automatisierter Skripte auf einem Raspberry Pi erfolgt die Datenergänzung nun in Zusammenarbeit mit Jules. Die Qualitätssicherung wird durch einen Pull Request (PR) Workflow gewährleistet, bei dem Änderungen vor dem Mergen geprüft werden.*  

**3. Simplified Infrastructure**
**외부 API 호출이 불필요해짐에 따라 라즈베리 파이 운영을 중단하고, GitHub과 Vercel 중심의 정적 데이터 구조로 간소화하여 유지비 0원을 달성했습니다.**  
*By removing the dependency on external APIs, the Raspberry Pi was decommissioned, resulting in a lean, GitHub-and-Vercel-centered static data architecture with zero maintenance cost.*  
*Da keine externen API-Aufrufe mehr nötig sind, wurde der Raspberry Pi außer Betrieb genommen. Das Projekt basiert nun auf einer schlanken Datenstruktur via GitHub und Vercel bei laufenden Kosten von 0 €.*  

---

## 📊 Cost Structure / Kostenstruktur

| Item | Cost | Note |
| :--- | :--- | :--- |
| **Hosting** | $0 | Vercel (Hobby Tier) |
| **Database** | $0 | LocalStorage / Static JSON |
| **AI Content** | **$0** | **Using Jules (Copilot Pro Subscription)** |
| **Total** | **$0** | **Sustainable Personal Project** |

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 15 (App Router), TypeScript
* **Styling:** CSS Variables (Zero-build CSS management)
* **Deployment:** Vercel (Auto-deploy via GitHub)
* **AI Tooling:** Jules (GitHub Copilot Workspace) for Data Engineering

---

## 👨‍💻 Developer / Entwickler

**5년 차 이상의 백엔드 개발자로서, 실용적인 기술 스택과 비용 효율적인 아키텍처 설계에 집중합니다.**  
*As a backend developer with 5+ years of experience, I focus on practical tech stacks and cost-effective architectural designs.*  
*Als Backend-Entwickler mit über 5 Jahren Erfahrung konzentriere ich mich auf praxisnahe Tech-Stacks und kosteneffiziente Architekturdesigns.*  
