# Hallo Deutschland 🐶

**A self-built German learning app — created while preparing to relocate to Germany.**

> *„Man lernt eine Sprache am besten, wenn man sie täglich braucht."*  
> *"You learn a language best when you need it every day."*

---

## What is this? / Was ist das?

A flashcard-style German vocabulary and grammar learning app (A1–B2), built entirely without a backend or database.

Eine Lernapp für deutschen Wortschatz und Grammatik (A1–B2), vollständig ohne Backend oder Datenbank entwickelt.

---

## Why I built it / Warum ich es gebaut habe

I'm actively preparing to work in Germany and have been studying German independently. Instead of just using an existing app, I wanted to demonstrate both my technical skills and my commitment to learning the language — so I built my own.

Ich bereite mich aktiv darauf vor, in Deutschland zu arbeiten, und lerne Deutsch selbstständig. Anstatt nur eine bestehende App zu nutzen, wollte ich sowohl meine technischen Fähigkeiten als auch mein Engagement für das Sprachenlernen zeigen — also habe ich meine eigene gebaut.

---

## Zero-Cost Architecture / Kostenfreie Architektur

The entire system runs at **€0/month**.

Das gesamte System läuft für **0 €/Monat**.

```
  You (Prompt)
       │
       ▼
 Google Jules (AI Coding Agent)
       │  Generates structured JSON data
       │  Opens a Pull Request on GitHub
       ▼
  GitHub PR Review & Merge
       │
       ▼
  Vercel (Auto-deploy on merge)
       │
       ▼
  Static JSON → Next.js App
  (No server. No database. No cost.)
```

| Step | Tool | Cost |
|------|------|------|
| Data generation | Google Jules (Free) | €0 |
| Hosting & CI/CD | Vercel Free Plan | €0 |
| Frontend | Next.js + Tailwind CSS | €0 |
| **Total** | | **€0 / month** |

---

## How the data pipeline works / Wie die Datenpipeline funktioniert

1. **Prompt** — I write a prompt describing what vocabulary or grammar content to generate for a given level (A1–B2).
2. **Jules** — Google's AI coding agent reads the repository context, generates properly formatted JSON, and opens a Pull Request.
3. **Review & Merge** — I review the PR, check the content quality, and merge it into `main`.
4. **Auto-deploy** — Vercel detects the new commit and automatically rebuilds and deploys the app.

---

**Auf Deutsch:**

1. **Prompt** — Ich schreibe eine Anfrage, welche Vokabeln oder Grammatikthemen für ein bestimmtes Niveau (A1–B2) generiert werden sollen.
2. **Jules** — Googles KI-Coding-Agent liest den Repository-Kontext, erstellt korrekt formatierte JSON-Dateien und öffnet einen Pull Request.
3. **Review & Merge** — Ich überprüfe den PR und merge ihn nach Prüfung in `main`.
4. **Auto-Deploy** — Vercel erkennt den neuen Commit und baut die App automatisch neu und stellt sie bereit.

---

## Data Format / Datenformat

Content is stored as flat, human-readable JSON files — easy for both humans and AI to read and extend.

```
public/data/
├── vocabulary/
│   ├── a1.json    ← { "words": [...] }
│   ├── a2.json
│   ├── b1.json
│   └── b2.json
└── grammar/
    ├── a1.json    ← { "lessons": [...] }
    ├── a2.json
    ├── b1.json
    └── b2.json
```

---

## Tech Stack / Technologie-Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Font | Nunito (Google Fonts) |
| Data | Static JSON (AI-generated via Google Jules) |
| Deployment | Vercel |

---

## Run locally / Lokal starten

```bash
git clone https://github.com/your-username/hallo-deutschland
npm install
npm run dev
# → http://localhost:3000
```

---

## Current progress / Aktueller Stand

- [x] A1 vocabulary & grammar data
- [ ] A2, B1, B2 — expanding weekly via Jules

---

*Built with curiosity, caffeine, and Kaffeekuchen.* ☕
