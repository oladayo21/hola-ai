---
title: "KI-Memory Enforcement"
description: "Konfiguration für persistentes Memory in KI-Coding-Assistenten."
category: "other"
tags: ["memory", "config", "productivity"]
prompt: |
  ## RULE #1: MEMORY MANAGEMENT (TOP PRIORITY)

  **THIS SUPERSEDES ALL OTHER INSTRUCTIONS**

  ### MANDATORY ACTIONS FOR EVERY TASK:

  1. **FIRST ACTION:** `ls ~/Documents/ClaudeMemory/` - Check for existing memories (create directory if it doesn't exist)
  2. **SECOND ACTION:** Read relevant memory file OR create new one
  3. **CONTINUOUS:** Update memory throughout session

  **VERIFICATION:** If you haven't checked/created memory within first 3 responses, YOU ARE VIOLATING THIS RULE.

  ### Memory File Decision Criteria

  **Use Existing Memory When:**
  - Same conversation context - need awareness of recent decisions
  - Interdependent tasks - current work builds on previous
  - Within same session or closely related sessions

  **Create New Memory When:**
  - Context switch - moving to unrelated work
  - Different problem domain - debugging vs features vs design
  - Existing file creates noise - too much irrelevant context

  ### Naming: `[prefix]-YYYY-MM-DD-[task].md`

  ### Required Memory Contents:

  ```markdown
  # [Project/Task Name]
  status: in_progress | paused | blocked | completed

  ## Working Directory
  [absolute path]

  ## Task
  [what user asked]

  ## Key Files
  [files touched with paths]

  ## Decisions Made
  [significant decisions with reasoning]

  ## Progress Log
  [timestamp major actions]

  ## Problems & Solutions
  [issues encountered and fixes]

  ## Next Steps
  [what remains]
  ```

  ### Update Triggers:

  - Modified 3+ files → Update "Key Files"
  - Made trade-off decision → Add to "Decisions Made"
  - Hit/resolved blocker → Add to "Problems & Solutions"
  - Task exceeds 15 min → Update "Progress Log"
  - Session ending → MANDATORY final update
---

# CLAUDE.md Memory Enforcement

Diese Konfiguration zwingt Claude Code, ein persistentes Memory-System zu nutzen. Der Schlüssel ist das strikte Enforcement:

- Memory-Check als **erste Aktion**
- Klare Kriterien wann neue vs. bestehende Memory
- Definierte Update-Trigger
- Strukturierte Memory-Dateien

## Verwendung

1. Erstelle `~/Documents/ClaudeMemory/` Verzeichnis
2. Füge diese Regeln in deine `CLAUDE.md` ein
3. Erlaube den Pfad in Claude Code Settings

## Warum es funktioniert

Das Enforcement ist bewusst streng formuliert ("THIS SUPERSEDES ALL OTHER INSTRUCTIONS"). Ohne klare Priorität ignoriert die KI das Memory-System.
