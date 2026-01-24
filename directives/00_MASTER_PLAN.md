# 🧭 SAFE-LINK Master Plan

> 이 문서는 프로젝트의 현재 상태와 앞으로의 로드맵을 정의하는 최상위 지도입니다.

## 1. Project Overview
*   **Goal**: 외국인 근로자와 관리자 간의 언어 장벽을 없애고 안전을 보장하는 AI 번역 및 소통 시스템.
*   **Tech Stack**: Next.js (App Router), Supabase (Auth/DB), Gemini (Translation/AI), Vercel (Deployment).

## 2. Current Status (2026-01-24)
*   ✅ **Basic UI**: Manager & Worker Dashboards implemented.
*   ✅ **Translation**: Basic Gemini integration working.
*   ✅ **Excel Automation**: `execution/translate_excel.py` (Completed).
*   ✅ **Infrastructure**: GitHub Repos & Agent Architecture Setup (Completed).
*   ⚠️ **Authentication**: Middleware currently disabled (`middleware.ts.disabled`). Needs repair.
*   ⚠️ **TTS**: Quality improvements needed (Google Cloud TTS vs Gemini).

## 3. Immediate Action Items (Priority Order)

### Phase 1: Stabilization (Now)
- [ ] **Cleanup**: Move root scripts to `execution/` folder.
- [ ] **Documentation**: Establish standard deployment workflow.

### Phase 2: Core Features
- [ ] **Fix Auth**: Enable `middleware.ts` and ensure Role-Based Access (Manager vs Worker).
- [ ] **Refine Translation**: Move translation logic to a robust `execution` module where possible.

### Phase 3: Enhancement
- [ ] **Voice Interface**: Improve STT/TTS latency and quality.
- [ ] **Dashboard Stats**: Real-time safety status visualization.

## 4. Architecture Compliance
*   **Directives**: All complex tasks must start with a markdown file in `directives/`.
*   **Execution**: Scripts must be idempotent and located in `execution/`.
