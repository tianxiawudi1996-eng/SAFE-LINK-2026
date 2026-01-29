'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { normalizeLanguageCode } from '@/lib/i18n';

// 다국어 텍스트
const LOGIN_TEXTS: Record<string, {
    title: string;
    email: string;
    password: string;
    login: string;
    noAccount: string;
    manager: string;
    worker: string;
    errorLogin: string;
}> = {
    Korean: {
        title: '로그인',
        email: '이메일',
        password: '비밀번호',
        login: '로그인',
        noAccount: '계정이 없으신가요?',
        manager: '관리자 가입',
        worker: '근로자 가입',
        errorLogin: '로그인에 실패했습니다.',
    },
    Chinese: {
        title: '登录',
        email: '电子邮箱',
        password: '密码',
        login: '登录',
        noAccount: '还没有账号?',
        manager: '管理员注册',
        worker: '工人注册',
        errorLogin: '登录失败。',
    },
    Vietnamese: {
        title: 'Đăng nhập',
        email: 'Email',
        password: 'Mật khẩu',
        login: 'Đăng nhập',
        noAccount: 'Chưa có tài khoản?',
        manager: 'Quản lý đăng ký',
        worker: 'Công nhân đăng ký',
        errorLogin: 'Đăng nhập thất bại.',
    },
    Thai: {
        title: 'เข้าสู่ระบบ',
        email: 'อีเมล',
        password: 'รหัสผ่าน',
        login: 'เข้าสู่ระบบ',
        noAccount: 'ยังไม่มีบัญชี?',
        manager: 'สมัครผู้จัดการ',
        worker: 'สมัครคนงาน',
        errorLogin: 'เข้าสู่ระบบล้มเหลว',
    },
    Uzbek: {
        title: 'Kirish',
        email: 'Email',
        password: 'Parol',
        login: 'Kirish',
        noAccount: "Hisobingiz yo'qmi?",
        manager: "Menejer ro'yxatdan o'tish",
        worker: "Ishchi ro'yxatdan o'tish",
        errorLogin: "Kirishda xatolik yuz berdi.",
    },
    Mongolian: {
        title: 'Нэвтрэх',
        email: 'Имэйл',
        password: 'Нууц үг',
        login: 'Нэвтрэх',
        noAccount: 'Бүртгэлгүй юу?',
        manager: 'Менежер бүртгүүлэх',
        worker: 'Ажилтан бүртгүүлэх',
        errorLogin: 'Нэвтрэх амжилтгүй боллоо.',
    },
    Khmer: {
        title: 'ចូល',
        email: 'អ៊ីមែល',
        password: 'ពាក្យសម្ងាត់',
        login: 'ចូល',
        noAccount: 'មិនមានគណនីមែនទេ?',
        manager: 'ចុះឈ្មោះអ្នកគ្រប់គ្រង',
        worker: 'ចុះឈ្មោះកម្មករ',
        errorLogin: 'ការចូលបរាជ័យ។',
    },
    Russian: {
        title: 'Вход',
        email: 'Электронная почта',
        password: 'Пароль',
        login: 'Войти',
        noAccount: 'Нет аккаунта?',
        manager: 'Регистрация менеджера',
        worker: 'Регистрация рабочего',
        errorLogin: 'Не удалось войти.',
    },
    English: {
        title: 'Login',
        email: 'Email',
        password: 'Password',
        login: 'Login',
        noAccount: "Don't have an account?",
        manager: 'Manager Sign Up',
        worker: 'Worker Sign Up',
        errorLogin: 'Login failed.',
    },
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userLanguage, setUserLanguage] = useState('Korean');

    // 저장된 언어 설정 불러오기
    useEffect(() => {
        const savedLang = localStorage.getItem('userLanguage');
        if (savedLang && LOGIN_TEXTS[savedLang]) {
            setUserLanguage(savedLang);
        }
    }, []);

    const t = LOGIN_TEXTS[userLanguage] || LOGIN_TEXTS['Korean'];
    const tKo = LOGIN_TEXTS['Korean'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // 역할에 따라 리다이렉트
                if (data.user.role === 'manager') {
                    router.push('/dashboard');
                } else {
                    router.push('/tbm');
                }
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(t.errorLogin);
        } finally {
            setIsLoading(false);
        }
    };

    const showBilingual = userLanguage !== 'Korean';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
            <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-2xl border border-white/10 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🛡️ SAFE-LINK</h1>
                    <p className="text-slate-400">
                        {tKo.title}
                        {showBilingual && <span className="text-orange-400 ml-2">/ {t.title}</span>}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 이메일 */}
                    <div>
                        <label className="block text-sm mb-2">
                            <span className="text-white">{tKo.email}</span>
                            {showBilingual && <span className="text-orange-400 ml-2">/ {t.email}</span>}
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                            placeholder="example@email.com or login ID"
                            required
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block text-sm mb-2">
                            <span className="text-white">{tKo.password}</span>
                            {showBilingual && <span className="text-orange-400 ml-2">/ {t.password}</span>}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                            placeholder="••••"
                            required
                        />
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* 로그인 버튼 */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-orange-700 transition-all"
                    >
                        {isLoading ? '...' : (
                            <>
                                {tKo.login}
                                {showBilingual && ` / ${t.login}`}
                            </>
                        )}
                    </button>
                </form>

                {/* 언어 빠른 선택 */}
                <div className="mt-4 flex justify-center gap-2 flex-wrap">
                    {['Korean', 'Chinese', 'Vietnamese', 'Thai', 'Uzbek', 'English'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => {
                                setUserLanguage(lang);
                                localStorage.setItem('userLanguage', lang);
                            }}
                            className={`px-2 py-1 text-xs rounded-lg transition-all ${userLanguage === lang
                                ? 'bg-orange-500 text-white'
                                : 'bg-white/10 text-slate-400 hover:bg-white/20'
                                }`}
                        >
                            {lang === 'Korean' && '🇰🇷'}
                            {lang === 'Chinese' && '🇨🇳'}
                            {lang === 'Vietnamese' && '🇻🇳'}
                            {lang === 'Thai' && '🇹🇭'}
                            {lang === 'Uzbek' && '🇺🇿'}
                            {lang === 'English' && '🇺🇸'}
                        </button>
                    ))}
                </div>

                {/* 회원가입 링크 */}
                <div className="mt-6 space-y-3">
                    <p className="text-center text-slate-400 text-sm">
                        {tKo.noAccount}
                        {showBilingual && <span className="text-orange-400 ml-1">{t.noAccount}</span>}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/signup/manager">
                            <button className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-xl text-sm transition-all">
                                👔 {tKo.manager}
                            </button>
                        </Link>
                        <Link href="/signup/worker">
                            <button className="w-full py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-xl text-sm transition-all">
                                👷 {showBilingual ? t.worker : tKo.worker}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
