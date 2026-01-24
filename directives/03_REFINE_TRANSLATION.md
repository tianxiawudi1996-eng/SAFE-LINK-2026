# 🗣️ Refine Translation & TTS

## 1. Objective
Ensure high-quality translation and natural-sounding Text-to-Speech (TTS) for the safety interpreter system.

## 2. Current Issues
*   **Translation**: API Route `app/api/translate/route.ts` was missing helper functions (`getFewShotHistory`). Fixed on 2026-01-24.
*   **TTS**: Currently using browser default or basic Gemini TTS. Needs "Native Speaker" quality (Google Cloud TTS Neural2 or ElevenLabs).

## 3. Action Plan (TTS Upgrade)
1.  **Evaluate Google Cloud TTS**:
    *   Pros: High quality, supports many languages (Vietnamese, Thai, Uzbekistan, etc.), relatively cheap.
    *   Cons: Requires Google Cloud Credentials (JSON key).
    *   Action: Check if `GOOGLE_APPLICATION_CREDENTIALS` or API Key is available.
2.  **Fallback Mechanism**:
    *   If Google TTS fails -> Use Web Speech API (Browser Native).
    *   If Web Speech fails -> Show text only.
3.  **Implementation**:
    *   Create `app/api/tts/route.ts`.
    *   Accept `{ text, languageCode, gender }`.
    *   Return Audio Blob (MP3).

## 4. Translation Optimization
*   **Context Injection**: Ensure "Safety" context is strictly enforced.
*   **JSON Enforcement**: Gemini sometimes returns markdown. The cleaning logic in `route.ts` handles this, but prompting can be improved with `response_mime_type: "application/json"`.
