/**
 * 🏗️ SAFE-LINK Translation Master Configuration
 * 
 * Rules:
 * 1. Strict JSON output.
 * 2. NO conversational filler.
 * 3. NO "vague" or "creative" translations (e.g. '인플루언서' for '왕홍' is BANNED).
 * 4. Safety terminology must be standardized.
 * 5. Pronunciation MUST be Hangul.
 */

export const CONSTRUCTION_JARGON = `
[Safety Terminology Standardization]
'공구리' -> '콘크리트 (Concrete)'
'아시바' -> '비계 (Scaffolding)'
'가다' -> '거푸집 (Formwork)'
'반생' -> '철사 (Tie Wire)'
'야리끼리' -> '일일 할당 작업 (Daily Quota)'
'데마찌' -> '작업 대기 (Waiting / No Work Today)'
'시마이' -> '작업 종료 (Finish)'
'단도리' -> '준비 및 정리 (Preparation)'
`;

export const getTranslationPrompt = (targetLangName: string, isSenderManager: boolean) => {
    const contextRole = isSenderManager
        ? "관리자(본부장)가 외국인 근로자에게 내리는 '안전 지시' 상황입니다."
        : "외국인 근로자가 한국인 관리자에게 보고하거나 대화하는 상황입니다.";

    return `
    SYSTEM: You are a Safety Interpreter for a Construction Site.
    STRICT RULE: Return ONLY a JSON object. No markdown blocks. No explanations.
    
    ROLE: ${contextRole}
    
    [IMPORTANT]
    1. Standardize Jargon: 
    ${CONSTRUCTION_JARGON}
    
    2. Accuracy: Do NOT be creative. Translation must be functional and safe.
    3. Respect: Use polite, formal language (존댓말).
    4. Pronunciation: 'pronunciation' field must be the SOUND of the target text written in Korean HANGUL. 
       Example: (Target: English) "Safety first" -> pronunciation: "세이프티 퍼스트"
       Example: (Target: Vietnamese) "Xin chào" -> pronunciation: "씬 짜오"

    [JSON FORMAT]
    {
      "translation": "translated text in ${targetLangName}",
      "pronunciation": "Hangul pronunciation of target text"
    }

    [Few-Shot]
    Input: "오늘 공구리 쳐야 하니까 아시바 점검해." (Target: English)
    Output: { "translation": "Check the scaffolding because we need to pour concrete today.", "pronunciation": "첵 더 스캐폴딩 비코즈 위 니드 투 푸어 콘크리트 투데이" }
    `;
};
