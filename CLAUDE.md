# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SAFE-LINK is an AI-powered real-time translation and communication system for construction sites. It bridges the language gap between Korean managers and foreign workers (Vietnamese, Uzbek, Chinese, Thai, etc.) while ensuring safety instructions are accurately conveyed.

**Tech Stack:** Next.js 16 (App Router), Prisma + PostgreSQL (Supabase), Google Gemini AI, TailwindCSS 4, Vercel deployment.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npx prisma generate   # Regenerate Prisma client after schema changes
npx prisma db push    # Push schema changes to database
```

## Architecture

This project follows a **3-layer architecture** to separate concerns:

### Layer 1: Directives (`directives/`)
Markdown SOPs (Standard Operating Procedures) that define goals, inputs, tools, outputs, and edge cases. These are living documents - update them when you learn new constraints.

### Layer 2: Orchestration (AI Agent)
The AI reads directives, calls execution scripts in order, handles errors, and updates directives with learnings.

### Layer 3: Execution (`execution/`)
Deterministic Python scripts for API calls, data processing, and automation. Check here before writing new scripts.

**Key Principle:** Push complexity into deterministic code. AI focuses on decision-making, not repetitive execution.

## Key Directories

- `app/` - Next.js App Router pages and API routes
- `app/api/` - Backend endpoints (translate, tts, stt, auth, admin, worker)
- `components/` - React components (ChatPage, ControlCenterPage, GlossaryPage, etc.)
- `lib/` - Shared utilities (constants, i18n, auth, translation config)
- `directives/` - SOPs in Markdown (read before starting complex tasks)
- `execution/` - Python automation scripts
- `prisma/` - Database schema and migrations
- `.tmp/` - Intermediate files (gitignored, regeneratable)

## Translation Rules

All translations must follow rules in `directives/TRANSLATION_MASTER_RULES.md`:

1. **Construction Jargon:** Korean construction slang (노가다 용어) must be converted to standard safety terminology. See `lib/constants.ts` for the mapping (e.g., "공구리" → "콘크리트/Concrete").

2. **Profanity Removal:** Remove crude language from input; output must be polite and formal.

3. **Pronunciation:** Provide Hangul transliteration for non-Korean translations (e.g., "你好" → "니 하오").

4. **JSON Output:** Translation APIs must return `{ "translation": "...", "pronunciation": "..." }`.

## Database Schema

Key models in `prisma/schema.prisma`:
- `User` (manager/worker roles), `ManagerProfile`, `WorkerProfile`
- `UserSession` (auth tokens)
- `TbmSession`, `TbmSignature` (Toolbox Meeting management)
- `WorkerMessage` (chat messages with translations)
- `DictionaryEntry` (slang dictionary)

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection (pooled)
- `DIRECT_URL` - PostgreSQL direct connection
- `GEMINI_API_KEY` or `GOOGLE_CLOUD_API_KEY` - For translation/TTS

## Self-Annealing Loop

When something breaks:
1. Fix the script
2. Test it
3. Update the directive with what you learned
4. System becomes stronger

Check `directives/` for existing workflows before creating new ones.
