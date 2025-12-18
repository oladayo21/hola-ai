---
title: "Basis-Konfiguration KI-Assistent"
description: "Template als Grundlage für deine eigene CLAUDE.md oder AGENTS.md Datei."
category: "other"
tags: ["config", "template", "claude-md", "agents-md"]
prompt: |
  # KI CONFIGURATION - MANDATORY FOR ALL SESSIONS

  **THESE RULES ARE ABSOLUTE. NO EXCEPTIONS. NO INTERPRETATION.**

  ## RULE #1: CONCISENESS

  Extreme brevity. Sacrifice grammar. No filler.

  ---

  ## RULE #2: NO EMOJIS

  Never in code or coding projects.

  ---

  ## RULE #3: JS/TS SPACING

  Empty line before: `if`, `return`, `throw` (.js/.ts only)

  ```javascript
  // CORRECT
  function example(data) {
    const result = process(data);

    if (result.error) {
      console.error("Failed");

      throw new Error(result.error);
    }

    return result;
  }
  ```

  ---

  ## DIRECTORIES

  - ~/code/work/ - Work projects
  - ~/code/personal/ - Personal projects
  - ~/code/projects/ - Client projects
  - ~/code/learning/ - Testing/learning

  ---

  ## USER CONTEXT

  - [Your Name] | [Company] (Role) | [Side Projects]
  - Tools: [your preferred tools]

  Example:
  - Max Mustermann | Acme Corp (Fullstack) | Open Source Contributor
  - Tools: VS Code, Docker, pnpm

  ---

  ## MEMORY MANAGEMENT

  [See "KI-Memory Enforcement" below for an example]

  ---

  ## ENFORCEMENT CHECKLIST (MENTAL CHECK EVERY RESPONSE)

  - [ ] Being concise?
  - [ ] Following NO EMOJI rule?
  - [ ] Following coding conventions?

  **ANY VIOLATION = CRITICAL FAILURE**
---
