---
title: Kontext-Management
description: Projektkontext und Coding-Standards fur KI setzen
---

## Was ist CLAUDE.md?

Eine Markdown-Datei im Projekt-Root, die der KI Kontext uber dein Projekt gibt.

## Aufbau

```markdown
# Projekt: Meine App

## Technologie-Stack
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Datenbank: PostgreSQL

## Konventionen
- Komponentennamen: PascalCase
- Funktionen: camelCase
- Tests: *.test.ts

## Wichtige Pfade
- /src/components - UI-Komponenten
- /src/api - Backend-Endpunkte
- /src/utils - Hilfsfunktionen
```

## Best Practices

1. **Halte es aktuell** - Bei Anderungen updaten
2. **Sei spezifisch** - Je mehr Detail, desto besser
3. **Dokumentiere Entscheidungen** - Warum, nicht nur was
4. **Verlinke Ressourcen** - Externe Docs, ADRs

## MCP-Server

Model Context Protocol Server erweitern Claude's Fahigkeiten:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "mcp-postgres",
      "args": ["--connection-string", "..."]
    }
  }
}
```

Mehr dazu in [Session 3](/workshop/session-3).
