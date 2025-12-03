---
title: Security-Analyse
description: Schwachstellen identifizieren und Best Practices enforc'en
---

## Uberblick

KI kann bei Security-Reviews helfen:
- OWASP Top 10 prufen
- Dependency-Vulnerabilities finden
- Sichere Coding-Patterns vorschlagen

## OWASP-Analyse

```bash
> Prufe diesen Code auf OWASP Top 10 Risiken:
  - Injection
  - Broken Authentication
  - Sensitive Data Exposure
  - XXE
  - Broken Access Control
```

## Dependency-Check

```bash
> Analysiere package.json auf bekannte Vulnerabilities
```

## Beispiel-Findings

### SQL Injection

```javascript
// UNSICHER
const query = `SELECT * FROM users WHERE id = ${userId}`;

// SICHER
const query = 'SELECT * FROM users WHERE id = $1';
db.query(query, [userId]);
```

### XSS

```javascript
// UNSICHER
element.innerHTML = userInput;

// SICHER
element.textContent = userInput;
```

## Best Practices

1. **Input validieren** - Immer
2. **Output escapen** - Kontextabhangig
3. **Dependencies updaten** - Regelmasig
4. **Secrets managen** - Nie im Code
