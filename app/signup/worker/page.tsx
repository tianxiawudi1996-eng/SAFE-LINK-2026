'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Twemoji CDN을 사용한 국기 이미지 URL 생성
const getFlagUrl = (countryCode: string) => {
    // 국가 코드를 이모지 유니코드로 변환
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => (127397 + char.charCodeAt(0)).toString(16))
        .join('-');
    return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codePoints}.svg`;
};

// 주요 국가들
const MAIN_COUNTRIES = [
    { code: 'VN', name: '베트남', nameLocal: 'Việt Nam', language: 'Vietnamese', languageLocal: 'Tiếng Việt' },
    { code: 'CN', name: '중국', nameLocal: '中国', language: 'Chinese', languageLocal: '中文' },
    { code: 'TH', name: '태국', nameLocal: 'ประเทศไทย', language: 'Thai', languageLocal: 'ไทย' },
    { code: 'NP', name: '네팔', nameLocal: 'नेपाल', language: 'Nepali', languageLocal: 'नेपाली' },
    { code: 'KH', name: '캄보디아', nameLocal: 'កម្ពុជា', language: 'Khmer', languageLocal: 'ខ្មែរ' },
    { code: 'UZ', name: '우즈베키스탄', nameLocal: "O'zbekiston", language: 'Uzbek', languageLocal: "O'zbek" },
    { code: 'PH', name: '필리핀', nameLocal: 'Pilipinas', language: 'Filipino', languageLocal: 'Filipino' },
    { code: 'ID', name: '인도네시아', nameLocal: 'Indonesia', language: 'Indonesian', languageLocal: 'Indonesia' },
    { code: 'MM', name: '미얀마', nameLocal: 'မြန်မာ', language: 'Burmese', languageLocal: 'ဗမာ' },
    { code: 'MN', name: '몽골', nameLocal: 'Монгол', language: 'Mongolian', languageLocal: 'Монгол' },
    { code: 'LK', name: '스리랑카', nameLocal: 'ශ්‍රී ලංකා', language: 'Sinhala', languageLocal: 'සිංහල' },
    { code: 'BD', name: '방글라데시', nameLocal: 'বাংলাদেশ', language: 'Bengali', languageLocal: 'বাংলা' },
];

// 추가 국가들
const OTHER_COUNTRIES = [
    { code: 'RU', name: '러시아', nameLocal: 'Россия', language: 'Russian', languageLocal: 'Русский' },
    { code: 'US', name: '영어권', nameLocal: 'English', language: 'English', languageLocal: 'English' },
    { code: 'PK', name: '파키스탄', nameLocal: 'پاکستان', language: 'Urdu', languageLocal: 'اردو' },
    { code: 'IN', name: '인도', nameLocal: 'भारत', language: 'Hindi', languageLocal: 'हिंदी' },
    { code: 'KZ', name: '카자흐스탄', nameLocal: 'Қазақстан', language: 'Kazakh', languageLocal: 'Қазақ' },
    { code: 'KG', name: '키르기스스탄', nameLocal: 'Кыргызстан', language: 'Kyrgyz', languageLocal: 'Кыргыз' },
    { code: 'TJ', name: '타지키스탄', nameLocal: 'Тоҷикистон', language: 'Tajik', languageLocal: 'Тоҷикӣ' },
    { code: 'LA', name: '라오스', nameLocal: 'ລາວ', language: 'Lao', languageLocal: 'ລາວ' },
];

const ALL_COUNTRIES = [...MAIN_COUNTRIES, ...OTHER_COUNTRIES];

// 다국어 텍스트
const UI_TEXTS: Record<string, {
    step2Title: string;
    name: string;
    namePlaceholder: string;
    email: string;
    password: string;
    submit: string;
    back: string;
    login: string;
    processing: string;
}> = {
    Vietnamese: {
        step2Title: 'Đăng ký lao động',
        name: 'Họ và tên',
        namePlaceholder: 'Nguyen Van A',
        email: 'Email',
        password: 'Mật khẩu (4+ ký tự)',
        submit: 'Đăng ký',
        back: '← Chọn lại ngôn ngữ',
        login: 'Đã có tài khoản? Đăng nhập',
        processing: 'Đang xử lý...',
    },
    Chinese: {
        step2Title: '工人注册',
        name: '姓名',
        namePlaceholder: '王洪',
        email: '电子邮箱',
        password: '密码（4位以上）',
        submit: '注册',
        back: '← 重新选择语言',
        login: '已有账号？登录',
        processing: '处理中...',
    },
    Thai: {
        step2Title: 'สมัครสมาชิก',
        name: 'ชื่อ',
        namePlaceholder: 'ชื่อของคุณ',
        email: 'อีเมล',
        password: 'รหัสผ่าน (4+ ตัว)',
        submit: 'สมัคร',
        back: '← เลือกภาษาใหม่',
        login: 'มีบัญชี? เข้าสู่ระบบ',
        processing: 'กำลังดำเนินการ...',
    },
    Nepali: {
        step2Title: 'कामदार दर्ता',
        name: 'नाम',
        namePlaceholder: 'तपाईंको नाम',
        email: 'इमेल',
        password: 'पासवर्ड (4+ अक्षर)',
        submit: 'दर्ता गर्नुहोस्',
        back: '← भाषा पुन: छान्नुहोस्',
        login: 'खाता छ? लगइन',
        processing: 'प्रशोधन गर्दै...',
    },
    Uzbek: {
        step2Title: "Ishchi ro'yxatdan o'tish",
        name: 'Ism',
        namePlaceholder: 'Ismingiz',
        email: 'Email',
        password: 'Parol (4+ belgi)',
        submit: "Ro'yxatdan o'tish",
        back: '← Tilni qayta tanlash',
        login: "Hisobingiz bormi? Kirish",
        processing: "Jarayonda...",
    },
    Khmer: {
        step2Title: 'ចុះឈ្មោះកម្មករ',
        name: 'ឈ្មោះ',
        namePlaceholder: 'ឈ្មោះរបស់អ្នក',
        email: 'អ៊ីមែល',
        password: 'ពាក្យសម្ងាត់ (4+)',
        submit: 'ចុះឈ្មោះ',
        back: '← ជ្រើសភាសាឡើងវិញ',
        login: 'មានគណនី? ចូល',
        processing: 'កំពុងដំណើរការ...',
    },
    Filipino: {
        step2Title: 'Worker Sign Up',
        name: 'Pangalan',
        namePlaceholder: 'Iyong pangalan',
        email: 'Email',
        password: 'Password (4+ chars)',
        submit: 'Mag-sign up',
        back: '← Pumili ulit ng wika',
        login: 'May account? Login',
        processing: 'Isinasagawa...',
    },
    Indonesian: {
        step2Title: 'Pendaftaran Pekerja',
        name: 'Nama',
        namePlaceholder: 'Nama Anda',
        email: 'Email',
        password: 'Kata Sandi (4+ karakter)',
        submit: 'Daftar',
        back: '← Pilih bahasa lagi',
        login: 'Punya akun? Masuk',
        processing: 'Memproses...',
    },
    Burmese: {
        step2Title: 'အလုပ်သမားမှတ်ပုံတင်',
        name: 'နာမည်',
        namePlaceholder: 'သင့်နာမည်',
        email: 'အီးမေးလ်',
        password: 'စကားဝှက် (4+)',
        submit: 'မှတ်ပုံတင်',
        back: '← ဘာသာစကားပြန်ရွေး',
        login: 'အကောင့်ရှိပြီးသား? ဝင်မည်',
        processing: 'လုပ်ဆောင်နေသည်...',
    },
    Mongolian: {
        step2Title: 'Ажилтан бүртгүүлэх',
        name: 'Нэр',
        namePlaceholder: 'Таны нэр',
        email: 'Имэйл',
        password: 'Нууц үг (4+)',
        submit: 'Бүртгүүлэх',
        back: '← Хэлээ дахин сонгох',
        login: 'Бүртгэлтэй юу? Нэвтрэх',
        processing: 'Боловсруулж байна...',
    },
    Sinhala: {
        step2Title: 'කම්කරු ලියාපදිංචිය',
        name: 'නම',
        namePlaceholder: 'ඔබේ නම',
        email: 'ඊමේල්',
        password: 'මුරපදය (4+)',
        submit: 'ලියාපදිංචි වන්න',
        back: '← භාෂාව නැවත තෝරන්න',
        login: 'ගිණුමක් ඇත? ලොග් වෙන්න',
        processing: 'සකසමින්...',
    },
    Bengali: {
        step2Title: 'শ্রমিক নিবন্ধন',
        name: 'নাম',
        namePlaceholder: 'আপনার নাম',
        email: 'ইমেইল',
        password: 'পাসওয়ার্ড (4+)',
        submit: 'নিবন্ধন করুন',
        back: '← ভাষা পুনরায় নির্বাচন করুন',
        login: 'অ্যাকাউন্ট আছে? লগইন',
        processing: 'প্রক্রিয়াকরণ...',
    },
    Russian: {
        step2Title: 'Регистрация',
        name: 'Имя',
        namePlaceholder: 'Ваше имя',
        email: 'Email',
        password: 'Пароль (4+ символов)',
        submit: 'Регистрация',
        back: '← Выбрать другой язык',
        login: 'Есть аккаунт? Войти',
        processing: 'Обработка...',
    },
    English: {
        step2Title: 'Worker Sign Up',
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        password: 'Password (4+ chars)',
        submit: 'Sign Up',
        back: '← Select language again',
        login: 'Have an account? Login',
        processing: 'Processing...',
    },
};

const getTexts = (lang: string) => UI_TEXTS[lang] || UI_TEXTS['English'];

// 국기 이미지 컴포넌트
function FlagImage({ countryCode, size = 64 }: { countryCode: string; size?: number }) {
    return (
        <img
            src={getFlagUrl(countryCode)}
            alt={countryCode}
            width={size}
            height={size}
            className="object-contain"
            style={{ width: size, height: size }}
        />
    );
}

export default function WorkerSignupPage() {
    const router = useRouter();

    const [step, setStep] = useState<1 | 2 | 'other'>(1);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('female'); // 기본값 여성
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const t = getTexts(selectedLanguage || 'English');

    const handleLanguageSelect = (country: typeof MAIN_COUNTRIES[0]) => {
        setSelectedCountry(country.code);
        setSelectedLanguage(country.language);
        localStorage.setItem('userLanguage', country.language);
        localStorage.setItem('userCountry', country.code);
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
        setSelectedCountry('');
        setSelectedLanguage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const country = ALL_COUNTRIES.find(c => c.code === selectedCountry);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: 'worker',
                    country: selectedCountry,
                    language: country?.language || 'English',
                    gender, // 성별 추가
                }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/tbm');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================
    // STEP 1: 메인 국기 선택 (국기 이미지 크게!)
    // ============================================
    if (step === 1) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
                <div className="w-full max-w-4xl">
                    {/* 헤더 */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-3">👷 SAFE-LINK</h1>
                        <p className="text-slate-400">
                            Select your country / 국가를 선택하세요
                        </p>
                    </div>

                    {/* 국기 그리드 - 크게! */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                        {MAIN_COUNTRIES.map((country) => (
                            <button
                                key={country.code}
                                onClick={() => handleLanguageSelect(country)}
                                className="group bg-white/5 hover:bg-orange-500/30 border-2 border-transparent hover:border-orange-500 rounded-2xl transition-all duration-200 p-4 flex flex-col items-center justify-center gap-3"
                            >
                                {/* 국기 이미지 - 크게 */}
                                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FlagImage countryCode={country.code} size={80} />
                                </div>
                                {/* 현지어 이름 */}
                                <span className="text-white text-sm font-medium text-center">
                                    {country.nameLocal}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* 기타 국가 버튼 */}
                    <div className="text-center">
                        <button
                            onClick={() => setStep('other')}
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white transition-all inline-flex items-center gap-3 text-lg"
                        >
                            <span className="text-3xl">🌍</span>
                            <span>Other Countries / 기타 국가</span>
                        </button>
                    </div>

                    {/* 로그인 링크 */}
                    <p className="mt-8 text-center text-sm text-slate-500">
                        <Link href="/login" className="hover:text-white">
                            Already have account? Login / 이미 계정이 있으신가요?
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    // ============================================
    // 기타 국가 선택
    // ============================================
    if (step === 'other') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
                <div className="w-full max-w-3xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">🌍 Other Countries</h1>
                        <p className="text-slate-400">기타 국가 / Negara lain</p>
                    </div>

                    {/* 기타 국가 그리드 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        {OTHER_COUNTRIES.map((country) => (
                            <button
                                key={country.code}
                                onClick={() => handleLanguageSelect(country)}
                                className="group bg-white/5 hover:bg-orange-500/30 border-2 border-transparent hover:border-orange-500 rounded-2xl transition-all p-4 flex flex-col items-center gap-3"
                            >
                                <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FlagImage countryCode={country.code} size={56} />
                                </div>
                                <span className="text-white text-sm text-center">
                                    {country.nameLocal}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* 뒤로가기 */}
                    <div className="text-center">
                        <button
                            onClick={() => setStep(1)}
                            className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all text-lg"
                        >
                            ← Back / 뒤로가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================
    // STEP 2: 회원가입 폼
    // ============================================
    const selectedCountryInfo = ALL_COUNTRIES.find(c => c.code === selectedCountry);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
            <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-3xl border border-white/10 p-8">
                {/* 헤더 */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-4 px-6 py-4 bg-orange-500/20 border border-orange-500/30 rounded-2xl mb-4">
                        <div className="w-16 h-16">
                            <FlagImage countryCode={selectedCountry} size={64} />
                        </div>
                        <div className="text-left">
                            <div className="text-orange-400 font-bold text-xl">{selectedCountryInfo?.languageLocal}</div>
                            <div className="text-orange-300/70 text-sm">{selectedCountryInfo?.nameLocal}</div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white">{t.step2Title}</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 이름 */}
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">{t.name}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-lg"
                            placeholder={t.namePlaceholder}
                            required
                        />
                    </div>

                    {/* 이메일 */}
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">{t.email}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-lg"
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    {/* 성별 선택 */}
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Gender / 성별
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setGender('male')}
                                className={`py-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${gender === 'male'
                                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                                    : 'bg-white/5 border-white/10 text-slate-500'
                                    }`}
                            >
                                <span className="text-2xl">👨</span>
                                <span className="font-bold">Male / 남성</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender('female')}
                                className={`py-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${gender === 'female'
                                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                    : 'bg-white/5 border-white/10 text-slate-500'
                                    }`}
                            >
                                <span className="text-2xl">👩</span>
                                <span className="font-bold">Female / 여성</span>
                            </button>
                        </div>
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">{t.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-lg"
                            placeholder="••••"
                            required
                            minLength={4}
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-xl disabled:opacity-50 hover:from-green-600 hover:to-green-700 transition-all"
                    >
                        {isLoading ? t.processing : t.submit}
                    </button>
                </form>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={handleBack}
                        className="w-full py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
                    >
                        {t.back}
                    </button>
                    <p className="text-center text-sm">
                        <Link href="/login" className="text-slate-400 hover:text-white">
                            {t.login}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
