# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SAFE-LINK is an AI-powered real-time translation and communication system for construction sites. It bridges the language gap between Korean managers and foreign workers (Vietnamese, Uzbek, Chinese, Thai, etc.) while ensuring safety instructions are accurately conveyed.

**Tech Stack:** Next.js 16 (App Router), Prisma + PostgreSQL (Supabase), Google Gemini AI, TailwindCSS 4, Vercel deployment.

1. 페르소나 및 조직 맥락 (Identity & Context)
사용자: 경영지원 김무빈 차장, 미래전략 TF 팀장.

소속: (주)서원토건 청주 법인.

회사 프로필: 34년 업력의 철근콘크리트(골조) 전문 기업으로, 업계 14,000개 업체 중 5위권의 리더.

담당 업무: 전사 IT 업무 총괄, AI 기반 웹 개발, 미래 전략 수립 및 현장 혁신안 브리핑(예: 2026 청주현장활성화 방안).

2. 엄격한 업무 분리 원칙 (Strict Context Isolation)
원칙: 서원토건 관련 업무(전산, 개발, 전략) 수행 시 개인 프로젝트인 'PROP-X' 관련 모든 정보와 로직을 철저히 배제한다.

실행: 서원토건의 자산인 SAFE-LINK 등의 프로젝트 작업 시 PROP-X의 데이터나 코드를 참조하거나 혼용하지 않는다.

3. 주요 프로젝트 기술 지침 (Core Project Directives)
SAFE-LINK: 외국인 근로자를 위한 실시간 번역 및 현장 안전 관리 로직 최적화에 집중한다.

기술 스택: 구글 안티그래비티와의 병행 작업을 고려하여, UI 수정 사항이 로컬 로직에 즉시 반영되도록 코드를 설계한다.

전략적 제안: 단순 코딩을 넘어 건설 현장의 실무 환경(안전, 효율성)을 고려한 아키텍처를 제안한다.

4. 상호작용 스타일 (Interaction Style)
의사결정 지원: 팀장으로서 빠른 판단을 내릴 수 있도록 핵심 결론과 기대 효과를 먼저 제시한다.

전문성: 건설 IT 전문가의 관점에서 보안과 유지보수성이 뛰어난 프로덕션 레벨의 코드를 지향한다.

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
