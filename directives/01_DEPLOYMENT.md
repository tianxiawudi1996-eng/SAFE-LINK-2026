# 🚀 Deployment Protocol

## Overview
Standard procedure for deploying SAFE-LINK to Vercel.

> 🚨 **CRITICAL WARNING**:
> **DO NOT DEPLOY WITHOUT EXPLICIT USER APPROVAL.**
> The current production version is being tested by staff.
> Any unauthorized deployment could disrupt ongoing operations.
> **ALWAYS ASK BEFORE RUNNING DEPLOY SCRIPTS.**

## Execution Tools
*   **Script**: `execution/deploy.bat`
*   **Environment**: Windows PowerShell / CMD

## Procedure
1.  **Pre-flight Check**:
    *   Ensure all changes are committed (or the script will auto-commit).
    *   Check `npm run build` locally if substantial changes were made.
2.  **Execution**:
    *   Run `execution/deploy.bat`
3.  **Verification**:
    *   Check Vercel Dashboard for build status.
    *   Visit production URL to verify critical features (Login, Translation).

## Maintenance
*   If build fails, check `execution/deploy.bat` for strict mode settings or linting errors.
*   Update this directive if deployment target changes (e.g. Docker/AWS).
