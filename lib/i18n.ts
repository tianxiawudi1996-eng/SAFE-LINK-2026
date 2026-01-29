/**
 * 🌍 SAFE-LINK i18n & Language Mapping Central
 * 
 * Rules:
 * 1. Convert Country Codes (CN, VN) to ISO Codes (zh-CN, vi)
 * 2. Map to Google Cloud TTS Voice Names
 * 3. Map to Full Language Names for AI Prompting
 */

export const SUPPORTED_LANGUAGES: Record<string, {
    iso: string;
    sttCode: string;
    name: string;
    flag: string;
    ttsVoice: { f: string; m: string };
}> = {
    'VN': {
        iso: 'vi',
        sttCode: 'vi-VN',
        name: 'Vietnamese',
        flag: '🇻🇳',
        ttsVoice: { f: 'vi-VN-Neural2-A', m: 'vi-VN-Neural2-D' }
    },
    'CN': {
        iso: 'zh-CN',
        sttCode: 'zh-CN',
        name: 'Chinese (Simplified)',
        flag: '🇨🇳',
        ttsVoice: { f: 'cmn-CN-Neural2-F', m: 'cmn-CN-Neural2-C' }
    },
    'UZ': {
        iso: 'uz',
        sttCode: 'uz-UZ',
        name: 'Uzbek',
        flag: '🇺🇿',
        ttsVoice: { f: 'uz-UZ-Wavenet-A', m: 'uz-UZ-Wavenet-B' }
    },
    'ID': {
        iso: 'id',
        sttCode: 'id-ID',
        name: 'Indonesian',
        flag: '🇮🇩',
        ttsVoice: { f: 'id-ID-Wavenet-A', m: 'id-ID-Wavenet-C' }
    },
    'PH': {
        iso: 'tl',
        sttCode: 'fil-PH',
        name: 'Tagalog',
        flag: '🇵🇭',
        ttsVoice: { f: 'fil-PH-Wavenet-A', m: 'fil-PH-Wavenet-C' }
    },
    'KH': {
        iso: 'km',
        sttCode: 'km-KH',
        name: 'Khmer',
        flag: '🇰🇭',
        ttsVoice: { f: 'km-KH-Standard-A', m: 'km-KH-Standard-B' }
    },
    'MN': {
        iso: 'mn',
        sttCode: 'mn-MN',
        name: 'Mongolian',
        flag: '🇲🇳',
        ttsVoice: { f: 'mn-MN-Standard-A', m: 'mn-MN-Standard-A' }
    },
    'TH': {
        iso: 'th',
        sttCode: 'th-TH',
        name: 'Thai',
        flag: '🇹🇭',
        ttsVoice: { f: 'th-TH-Neural2-C', m: 'th-TH-Standard-A' }
    },
    'RU': {
        iso: 'ru',
        sttCode: 'ru-RU',
        name: 'Russian',
        flag: '🇷🇺',
        ttsVoice: { f: 'ru-RU-Wavenet-A', m: 'ru-RU-Wavenet-D' }
    },
    'US': {
        iso: 'en',
        sttCode: 'en-US',
        name: 'English',
        flag: '🇺🇸',
        ttsVoice: { f: 'en-US-Neural2-F', m: 'en-US-Neural2-J' }
    },
    'KR': {
        iso: 'ko',
        sttCode: 'ko-KR',
        name: 'Korean',
        flag: '🇰🇷',
        ttsVoice: { f: 'ko-KR-Neural2-A', m: 'ko-KR-Neural2-C' }
    }
};

/**
 * Normalizes any input language string (code, name, iso) to our internal Country Code
 */
export function normalizeLanguageCode(input: string): string {
    if (!input) return 'US';
    const up = input.trim().toUpperCase();
    if (SUPPORTED_LANGUAGES[up]) return up;

    // Check by ISO or name
    for (const [code, data] of Object.entries(SUPPORTED_LANGUAGES)) {
        if (data.iso.toUpperCase() === up || data.name.toUpperCase() === up || data.sttCode.toUpperCase() === up) return code;
    }

    // Check if input is a partial like 'vi-VN' -> 'VN'
    if (up.includes('-')) {
        const parts = up.split('-');
        if (SUPPORTED_LANGUAGES[parts[1]]) return parts[1];
        if (parts[0] === 'ZH') return 'CN';
        if (parts[0] === 'VI') return 'VN';
    }

    return 'US';
}

export function getLanguageData(input: string) {
    const code = normalizeLanguageCode(input);
    return SUPPORTED_LANGUAGES[code];
}
