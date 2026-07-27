# Villa 25 Ekas

Website and booking system for a five-room surf villa in Ekas Bay, Lombok.

## Where things are

| Folder | What's in it |
|---|---|
| `forms/` | Static intake forms for the owners — hosted, no login, answers emailed. |
| `docs/` | Decisions register, questionnaire source, admin scope. Reference only. |
| `Weather Widget/` | Standalone surf-forecast widget builder (Open-Meteo, no API key). |
| `Coming soon/` | Coming-soon page assets. |
| `tools/` | Local dev helpers. |

## The forms

Two pages the owners fill in. Both save to `localStorage` as you type, so a half-finished
form survives closing the tab. Submissions post to FormSubmit, which forwards to
`milkysbeta@gmail.com` — no account needed at either end.

- `forms/index.html` — landing page linking to both
- `forms/decisions.html` — 29 decisions, options plus reasoning, 7 flagged as launch-blocking
- `forms/questionnaire.html` — 175 property questions across 14 sections
- `forms/thanks.html` — post-submit confirmation

**FormSubmit needs activating once.** The first submission to a new address triggers a
confirmation email. Click the link in it, and every submission after that arrives silently.
Send one test yourself before sharing the links.

### Preview locally

```bash
node tools/serve.js
```

Then open http://localhost:5175.

## Publishing the forms

GitHub Pages, source = `main` branch, root. The forms land at:

```
https://milkysbeta.github.io/villa25ekas/forms/
```

Note that GitHub Pages on a **private** repo requires a paid GitHub plan. This repo holds no
secrets — Supabase keys and API tokens live in host environment variables, never in git — so
public is safe.

## Still to build

The main site: Vite + React + Tailwind, i18n for English, Indonesian, German and French,
Supabase for auth, availability and the media library, an admin portal with owner/manager
roles, and the surf widget ported to a component.
