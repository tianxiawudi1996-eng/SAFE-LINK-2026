import { NOGADA_SLANG } from './constants';
import { normalizeLanguageCode } from './i18n';

/**
 * 🛠️ 4-Step Slang Processor (Field-First Logic)
 * 1. Match Korean Slang
 * 2. Convert to Standard Korean (Safety-First)
 * 3. Map to Target Language Standard
 * 4. (Optional) Enhance with Target Slang Context
 */

export function processSlang(text: string, targetLangCode: string): {
    processedText: string;
    slangDetected: boolean;
    directTranslation?: string;
} {
    let slangDetected = false;
    let processedText = text;
    const langCode = normalizeLanguageCode(targetLangCode).toLowerCase(); // 'vi', 'zh', etc.

    // Simple Map for specific lang keys in NOGADA_SLANG
    const langKeyMap: Record<string, string> = {
        'vi': 'vi', 'zh-cn': 'zh', 'uz': 'uz', 'tl': 'ph', 'id': 'id',
        'mn': 'mn', 'en': 'en', 'th': 'th', 'ru': 'ru', 'km': 'km'
    };
    const targetKey = langKeyMap[langCode] || 'en';

    // Iterate through slang DB
    for (const item of NOGADA_SLANG) {
        const regex = new RegExp(item.slang, 'gi');
        if (regex.test(processedText)) {
            slangDetected = true;
            // For the 텍스트 자체는 표준어로 일단 치환 (AI 가 이해하기 쉽게)
            processedText = processedText.replace(regex, item.standard);

            // 만약 문장 전체가 딱 그 단어라면? (초고속 모드)
            if (text.trim() === item.slang) {
                return {
                    processedText: item.standard,
                    slangDetected: true,
                    directTranslation: (item as any)[targetKey] || item.en
                };
            }
        }
    }

    return { processedText, slangDetected };
}
