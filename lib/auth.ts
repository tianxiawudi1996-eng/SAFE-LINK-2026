// 인증 관련 유틸리티 함수들
import { createHash, randomBytes } from 'crypto';

// 비밀번호 해시
export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = createHash('sha256').update(password + salt).digest('hex');
    return `${salt}:${hash}`;
}

// 비밀번호 검증
export function verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    const inputHash = createHash('sha256').update(password + salt).digest('hex');
    return hash === inputHash;
}

// 세션 토큰 생성
export function generateToken(): string {
    return randomBytes(32).toString('hex');
}

// 지원 국가 및 언어 목록
export const SUPPORTED_COUNTRIES = [
    { code: 'KR', name: '한국', nameLocal: '한국', language: 'Korean', languageLocal: '한국어', flag: '🇰🇷' },
    { code: 'VN', name: '베트남', nameLocal: 'Việt Nam', language: 'Vietnamese', languageLocal: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'CN', name: '중국', nameLocal: '中国', language: 'Chinese', languageLocal: '中文', flag: '🇨🇳' },
    { code: 'UZ', name: '우즈베키스탄', nameLocal: 'O\'zbekiston', language: 'Uzbek', languageLocal: 'O\'zbek tili', flag: '🇺🇿' },
    { code: 'TH', name: '태국', nameLocal: 'ประเทศไทย', language: 'Thai', languageLocal: 'ภาษาไทย', flag: '🇹🇭' },
    { code: 'NP', name: '네팔', nameLocal: 'नेपाल', language: 'Nepali', languageLocal: 'नेपाली', flag: '🇳🇵' },
    { code: 'PH', name: '필리핀', nameLocal: 'Pilipinas', language: 'Filipino', languageLocal: 'Filipino', flag: '🇵🇭' },
    { code: 'ID', name: '인도네시아', nameLocal: 'Indonesia', language: 'Indonesian', languageLocal: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'MM', name: '미얀마', nameLocal: 'မြန်မာ', language: 'Burmese', languageLocal: 'ဗမာစာ', flag: '🇲🇲' },
    { code: 'KH', name: '캄보디아', nameLocal: 'កម្ពុជា', language: 'Khmer', languageLocal: 'ភាសាខ្មែរ', flag: '🇰🇭' },
];

// UI 다국어 텍스트 (한국어 + 각 언어)
export const UI_TEXTS = {
    signup: {
        title: { ko: '회원가입', en: 'Sign Up' },
        workerSignup: { ko: '근로자 가입', en: 'Worker Registration' },
        managerSignup: { ko: '관리자 가입', en: 'Manager Registration' },
        name: { ko: '이름', en: 'Name' },
        email: { ko: '이메일', en: 'Email' },
        password: { ko: '비밀번호', en: 'Password' },
        confirmPassword: { ko: '비밀번호 확인', en: 'Confirm Password' },
        country: { ko: '국가', en: 'Country' },
        language: { ko: '선호 언어', en: 'Preferred Language' },
        submit: { ko: '가입하기', en: 'Register' },
        alreadyHaveAccount: { ko: '이미 계정이 있으신가요?', en: 'Already have an account?' },
        login: { ko: '로그인', en: 'Login' },
    },
    login: {
        title: { ko: '로그인', en: 'Login' },
        email: { ko: '이메일', en: 'Email' },
        password: { ko: '비밀번호', en: 'Password' },
        submit: { ko: '로그인', en: 'Login' },
        noAccount: { ko: '계정이 없으신가요?', en: "Don't have an account?" },
        signup: { ko: '회원가입', en: 'Sign Up' },
        managerLogin: { ko: '관리자 로그인', en: 'Manager Login' },
        workerLogin: { ko: '근로자 로그인', en: 'Worker Login' },
    },
};

// 국가별 언어로 텍스트 가져오기
export function getLocalizedText(
    textKey: keyof typeof UI_TEXTS.signup | keyof typeof UI_TEXTS.login,
    section: 'signup' | 'login',
    language: string
): { ko: string; local: string } {
    const texts = section === 'signup' ? UI_TEXTS.signup : UI_TEXTS.login;
    const text = texts[textKey as keyof typeof texts];

    return {
        ko: text?.ko || textKey,
        local: text?.en || textKey, // 추후 각 언어별 번역 추가
    };
}
