# 🔐 Fix Authentication System

## 1. Objective
Restore and secure the authentication flow for SAFE-LINK. The `middleware.ts` is currently potentially unstable or needs verification to ensure proper role-based access control (Manager vs Worker).

## 2. Current State
*   File: `middleware.ts` exists.
*   Issue: Needs review to ensure it correctly intercepts routes and handles Supabase auth sessions.

## 3. Requirements
1.  **Protected Routes**:
    *   `/manager/*`: Only accessible by authenticated users with role 'manager'.
    *   `/worker/*`: Only accessible by authenticated users with role 'worker'.
2.  **Public Routes**: `/login`, `/signup`, `/`, `/auth/*`, `/api/translate`.
3.  **Redirects**:
    *   Unauthenticated users trying to access protected routes -> `/login`.
    *   Workers accessing Manager pages -> `/worker/dashboard` (or 403).
    *   Managers accessing Worker pages -> `/manager/dashboard` (or allow?).

## 4. Execution Plan
1.  Read `middleware.ts`.
2.  Check for common pitfalls (matcher config, session handling).
3.  Refactor if necessary to use the latest Supabase SSR pattern (if applicable) or standard Next.js middleware patterns.
4.  Verify logic.
