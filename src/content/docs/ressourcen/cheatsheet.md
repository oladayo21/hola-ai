---
title: Cheatsheet
description: Schnellreferenz fur AI-Coding
---

## Claude Code Befehle

```bash
# Starten
claude

# Mit spezifischem Modell
claude --model claude-sonnet-4-20250514

# Plan Mode aktivieren
/plan [Aufgabe]

# Kontext hinzufugen
@file.ts  # Einzelne Datei
@src/     # Ganzer Ordner
```

## Prompt-Patterns

### Analyse

```
Analysiere [was] und identifiziere:
1. [Aspekt 1]
2. [Aspekt 2]
3. [Aspekt 3]
```

### Implementierung

```
Implementiere [Feature]:
- Anforderungen: [...]
- Constraints: [...]
- Beispiel: [...]
```

### Review

```
Review diesen Code auf:
- Bugs
- Performance
- Security
- Lesbarkeit
```

## CLAUDE.md Template

```markdown
# [Projektname]

## Stack
- [Technologien]

## Konventionen
- [Naming]
- [Structure]
- [Testing]

## Commands
- `make dev` - Start dev server
- `make test` - Run tests
```

## Haufige Fehler

| Fehler | Losung |
|--------|--------|
| Zu vage | Mehr Kontext geben |
| Zu komplex | In Schritte aufteilen |
| Falsche Ergebnisse | Verifizieren, iterieren |
| Context-Overflow | Fokus eingrenzen |
