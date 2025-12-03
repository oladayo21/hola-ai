---
title: Code Review mit KI
description: PRs analysieren und strukturierte Review-Kommentare generieren
---

## Uberblick

KI kann bei Code-Reviews unterstutzen durch:
- Automatische PR-Analyse
- Erkennung von Problemen
- Vorschlage fur Verbesserungen

## Workflow

### 1. PR-Kontext laden

```bash
# In Claude Code
> Analysiere PR #123

# Oder mit Git-Diff
> Review diesen Diff: [paste]
```

### 2. Fokus setzen

```bash
> Prufe auf:
  - Security-Probleme
  - Performance-Issues
  - Code-Style-Verletzungen
```

### 3. Review-Kommentare generieren

```bash
> Erstelle Review-Kommentare im GitHub-Format
```

## Beispiel-Prompts

```
Analysiere diese Anderungen und identifiziere:
1. Potenzielle Bugs
2. Fehlende Error-Handling
3. Performance-Probleme
4. Test-Coverage-Lucken
```

## Tipps

- **Kontext geben** - Welche Standards gelten?
- **Iterativ arbeiten** - Erst Ubersicht, dann Details
- **Verifizieren** - KI-Vorschlage immer prufen
