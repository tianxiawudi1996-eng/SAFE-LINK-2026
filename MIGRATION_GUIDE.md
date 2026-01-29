# 🏗️ Global SaaS Infrastructure Migration Guide

## 1. Cloudflare Pages Migration

We have prepared the project for Cloudflare Pages.

### Steps to Deploy:
1.  **Install Wrangler (if not already):**
    ```bash
    npm install -g wrangler
    ```
2.  **Login to Cloudflare:**
    ```bash
    npx wrangler login
    ```
3.  **Deploy:**
    ```bash
    npm run build
    npx wrangler pages deploy .vercel/output/static --project-name safe-link-s
    ```
    *Note: We are using the standard Vercel build output structure which Cloudflare Pages can often adapt, or strictly using `@cloudflare/next-on-pages` is recommended for full API support.*

    **Recommended (Production):**
    ```bash
    npm install -D @cloudflare/next-on-pages
    ```
    Then update `package.json` build script to: `"build": "next-on-pages"`

## 2. GitHub Private Repository Setup

1.  **Initialize Git:**
    ```bash
    git init
    git add .
    git commit -m "Initial Global SaaS Commit"
    ```
2.  **Push to GitHub:**
    *   Create a NEW Repository on GitHub (Private).
    *   Run:
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/SAFE-LINK-GLOBAL.git
        git push -u origin main
        ```
3.  **Connect to Cloudflare:**
    *   Go to Cloudflare Dashboard -> Pages -> Connect to Git.
    *   Select `SAFE-LINK-GLOBAL`.
    *   **Build Settings:**
        *   Framework: `Next.js`
        *   Build Command: `npx @cloudflare/next-on-pages` (if using the adapter) or `npm run build`
        *   Output Directory: `.vercel/output/static` (or `.next` depending on adapter)

## 3. Quad-Mapping Admin Dashboard

*   **URL:** `/admin/slang`
*   **Features:**
    *   Add new construction terms.
    *   Define Standard Korean mappings.
    *   Define multilingual Slang mappings via JSON.

## 4. Database Schema (Prisma)

We have updated `prisma/schema.prisma` with the `DictionaryEntry` model.
To apply this to your production Supabase DB:
```bash
npx prisma db push
```
