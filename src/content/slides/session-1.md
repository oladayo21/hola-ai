---
title: "Session 1: Foundations & First Steps"
description: "AI-Coding Grundlagen und erste Schritte"
session: 1
theme: black
---

# Hola AI

## Session 1: Foundations & First Steps

*05.12.2025 | 09:00-10:30*

---

## Wer ist heute dabei?

**16 Anmeldungen** - Lasst uns schauen, wo ihr steht

---

## Erfahrungslevel

| Level | Anzahl | % |
|-------|--------|---|
| Mittelstufe | 6 | 37% |
| Unsicher / Keine Erfahrung | 5 | 31% |
| Fortgeschrittener Anfänger | 3 | 19% |
| Anfänger | 2 | 13% |

**~63% sind Einsteiger** - Wir starten bei den Grundlagen!

---

## Was erwartet ihr?

Die haufigsten Wunsche:

- **Praktische Workflow-Integration** (6x)
- **Tool-Uberblick** (5x)
- **Best Practices & Pitfalls** (3x)
- **Hands-on lernen** (3x)
- **MCP Server** (1x - kommt in Session 3)

---

## Zitate aus euren Antworten

> *"tools kennenlernen, verstehen, in den arbeitsalltag ubernehmen"*

> *"getting my own junior developer ;)"*

> *"Best practices. Knowing pitfalls."*

---

## Agenda heute

1. Was ist AI-Coding? (10 min)
2. Tool-Landschaft (15 min)
3. Kontext ist King (25 min)
4. Live Demo + Hands-on (30 min)
5. Q&A + Ausblick (10 min)

---

# Teil 1

## Was ist AI-Coding?

---

## AI-Assisted vs. Agentic Coding

| AI-Assisted | Agentic |
|-------------|---------|
| Du fragst, AI antwortet | AI fuhrt Aufgaben aus |
| Copy-paste workflow | Direkter Dateizugriff |
| Chat-Interface | CLI / IDE Integration |
| *"Wie mache ich X?"* | *"Mach X fur mich"* |

---

## Die Evolution

```
Chat (ChatGPT, Claude.ai)
        ↓
IDE Extensions (Copilot, Cursor)
        ↓
CLI Agents (Claude Code, Aider)
        ↓
Autonomous Agents (Devin, etc.)
```

Wir fokussieren auf **CLI Agents** - der Sweet Spot.

---

# Teil 2

## Tool-Landschaft

---

## Die wichtigsten Tools

| Tool | Typ | Starke |
|------|-----|--------|
| **Claude Code** | CLI | Plan Mode, Agentic |
| **Cursor** | IDE | Nahtlose Integration |
| **GitHub Copilot** | IDE | Autocomplete |
| **Aider** | CLI | Git-Integration |
| **Continue** | IDE | Open Source |

---

## Warum Claude Code?

- **Plan Mode**: AI denkt erst nach, dann handelt
- **Kontext-Steuerung**: CLAUDE.md fur Projekt-Wissen
- **Sicherheit**: Du behalst Kontrolle
- **Terminal-native**: Keine IDE-Abhangigkeit

---

## Plan Mode vs. Auto Mode

**Plan Mode**
```
> /plan Refaktoriere die Auth-Module

Claude analysiert erst, schlagt dann vor.
Du reviewst und gibst frei.
```

**Auto Mode**
```
> Erstelle einen REST-Endpunkt

Claude schreibt direkt Code.
Schneller, aber weniger Kontrolle.
```

---

# Teil 3

## Kontext ist King

---

## Warum Kontext?

Gleiche Frage, unterschiedliche Ergebnisse:

**Ohne Kontext:**
> "Schreibe einen API-Endpunkt"
→ Generischer Code, falsche Patterns

**Mit Kontext:**
> "Schreibe einen API-Endpunkt (Express, TypeScript, unser Error-Handling)"
→ Passend zu eurem Projekt

---

## CLAUDE.md

Eine Datei im Projekt-Root die Claude kennt:

```markdown
# Projekt: Meine App

## Stack
- Frontend: React + TypeScript
- Backend: Express
- DB: PostgreSQL

## Konventionen
- Error-Handling: Immer AppError verwenden
- Logging: winston, nicht console.log
```

---

## Vorher / Nachher

**Ohne CLAUDE.md:**
```javascript
app.get('/users', (req, res) => {
  // Generischer Code
})
```

**Mit CLAUDE.md:**
```typescript
router.get('/users', asyncHandler(async (req, res) => {
  // Folgt euren Projekt-Patterns
}))
```

---

# Teil 4

## Live Demo + Hands-on

---

## Demo: Codebase verstehen

```bash
cd mein-projekt
claude

> Was macht dieses Projekt? Gib mir eine
  Ubersicht der Architektur.
```

*Live-Demo folgt...*

---

## Eure Aufgabe

1. Offnet euer Terminal
2. Navigiert zu einem Projekt
3. Startet `claude`
4. Fragt: *"Was macht dieses Projekt?"*

**Ich komme rum und helfe!**

---

## Tipps fur gute Prompts

1. **Kontext geben** - Je mehr, desto besser
2. **Spezifisch sein** - "Funktion X in Datei Y"
3. **Iterativ arbeiten** - Kleine Schritte
4. **Verifizieren** - AI macht Fehler

---

# Ausblick

---

## Nachste Sessions

**Session 2 (12.12.)**: Workflow-Integration
- CLAUDE.md deep-dive
- Sprint-Aufgaben mit AI
- Codebase-Analyse

**Session 3 (19.12.)**: Advanced
- Code-Reviews
- Security-Analyse
- MCP Server

---

## Ressourcen

- Setup: [hola-ai.dev/setup/claude-code](/guides/setup/)
- Cheatsheet: [hola-ai.dev/ressourcen/cheatsheet](/ressourcen/cheatsheet/)
- Claude Code Docs: [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code)

---

## Fragen?

*Q&A Zeit*

---

# Danke!

Bis zum 12.12.
