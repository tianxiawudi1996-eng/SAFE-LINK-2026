# TTS & Translation Guidelines

## 1. Clean TTS Output (CRITICAL)
- **Rule**: When playing Text-to-Speech (TTS), **ONLY** read the actual translated text (the target language).
- **PROHIBITED**: NEVER read the "Pronunciation Guide" (Hangul Phonics).
- The pronunciation guide (e.g., "워아이니") is for **visual aid only** for the Manager to read aloud if they want. The AI voice must NOT read it.

## 2. Translation Output Format
- All translations MUST return a strictly formatted JSON object:
  ```json
  {
      "translation": "The actual translated text in target language",
      "pronunciation": "Phonetic reading strictly in KOREAN HANGUL characters (e.g. '워아이니')"
  }
  ```
- **Pronunciation Rule**: 
  - MUST be in Hangul (한글).
  - DO NOT use English Romanization (e.g., "Wo Ai Ni" is forbidden).
  - Example: "Nǐ hǎo" -> "니하오" (O), "Ni hao" (X).

## 3. Model Usage
- Use **`gemini-2.5-flash`** (or latest confirmed working version) for both Translation and TTS to ensure speed and quality.
- Ensure strict JSON mode is enabled for reliability.

## 4. UI Display
- **Foreign Text**: Display Large and Bold.
- **Pronunciation**: Display below Foreign Text, in **Yellow** color, clearly distinguishable.
- **Original Text**: Display Small and faded at the bottom.
