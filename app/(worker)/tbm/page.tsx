'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SignaturePad from '@/components/SignaturePad';

interface TbmSession {
    id: string;
    instruction: string;
    createdAt: string;
}

// 다국어 텍스트
const TBM_TEXTS: Record<string, {
    title: string;
    subtitle: string;
    waiting: string;
    noSession: string;
    waitingForManager: string;
    signatureComplete: string;
    enterName: string;
    namePlaceholder: string;
    signButton: string;
    signing: string;
    original: string;
}> = {
    Korean: {
        title: '오늘의 안전 지시',
        subtitle: '내용을 확인하고 서명해주세요.',
        waiting: '대기 중',
        noSession: '현재 활성화된 TBM 세션이 없습니다.',
        waitingForManager: '관리자가 지시사항을 전송하면 여기에 표시됩니다.',
        signatureComplete: '서명 완료',
        enterName: '이름 (Name)',
        namePlaceholder: '홍길동',
        signButton: '전자서명 하기',
        signing: '서명 처리 중...',
        original: '원본',
    },
    Chinese: {
        title: '今日安全指示',
        subtitle: '请确认内容后签名。',
        waiting: '等待中',
        noSession: '目前没有活动的TBM会议。',
        waitingForManager: '管理员发送指示后将在此显示。',
        signatureComplete: '签名完成',
        enterName: '姓名',
        namePlaceholder: '王洪',
        signButton: '电子签名',
        signing: '签名处理中...',
        original: '原文',
    },
    Vietnamese: {
        title: 'Hướng dẫn an toàn hôm nay',
        subtitle: 'Vui lòng xác nhận nội dung và ký tên.',
        waiting: 'Đang chờ',
        noSession: 'Hiện không có phiên TBM nào đang hoạt động.',
        waitingForManager: 'Hướng dẫn sẽ hiển thị khi quản lý gửi.',
        signatureComplete: 'Đã ký xong',
        enterName: 'Họ và tên',
        namePlaceholder: 'Nguyen Van A',
        signButton: 'Ký điện tử',
        signing: 'Đang xử lý...',
        original: 'Bản gốc',
    },
    Thai: {
        title: 'คำแนะนำความปลอดภัยวันนี้',
        subtitle: 'กรุณาตรวจสอบและลงนาม',
        waiting: 'กำลังรอ',
        noSession: 'ไม่มีเซสชัน TBM ที่ใช้งานอยู่',
        waitingForManager: 'คำแนะนำจะแสดงเมื่อผู้จัดการส่ง',
        signatureComplete: 'ลงนามเสร็จสิ้น',
        enterName: 'ชื่อ',
        namePlaceholder: 'ชื่อของคุณ',
        signButton: 'ลงนามอิเล็กทรอนิกส์',
        signing: 'กำลังดำเนินการ...',
        original: 'ต้นฉบับ',
    },
    Uzbek: {
        title: "Bugungi xavfsizlik ko'rsatmasi",
        subtitle: "Iltimos, ko'rib chiqing va imzolang.",
        waiting: 'Kutilmoqda',
        noSession: "Faol TBM sessiyasi yo'q.",
        waitingForManager: "Menejer ko'rsatma yuborganida bu yerda ko'rinadi.",
        signatureComplete: 'Imzo tugallandi',
        enterName: 'Ism',
        namePlaceholder: 'Ismingiz',
        signButton: 'Elektron imzo',
        signing: "Imzo qo'yilmoqda...",
        original: 'Asl',
    },
    Mongolian: {
        title: 'Өнөөдрийн аюулгүйн заавар',
        subtitle: 'Агуулгыг шалгаж, гарын үсэг зурна уу.',
        waiting: 'Хүлээж байна',
        noSession: 'Идэвхтэй TBM хуралдаан байхгүй байна.',
        waitingForManager: 'Менежер заавар илгээхэд энд харагдана.',
        signatureComplete: 'Гарын үсэг зурсан',
        enterName: 'Нэр',
        namePlaceholder: 'Таны нэр',
        signButton: 'Цахим гарын үсэг',
        signing: 'Боловсруулж байна...',
        original: 'Эх хувь',
    },
    Khmer: {
        title: 'ការណែនាំសុវត្ថិភាពថ្ងៃនេះ',
        subtitle: 'សូមពិនិត្យមើល និងចុះហត្ថលេខា។',
        waiting: 'កំពុងរង់ចាំ',
        noSession: 'គ្មានវគ្គ TBM សកម្មទេ។',
        waitingForManager: 'ការណែនាំនឹងបង្ហាញនៅពេលអ្នកគ្រប់គ្រងផ្ញើ។',
        signatureComplete: 'ចុះហត្ថលេខារួចរាល់',
        enterName: 'ឈ្មោះ',
        namePlaceholder: 'ឈ្មោះរបស់អ្នក',
        signButton: 'ហត្ថលេខាអេឡិចត្រូនិក',
        signing: 'កំពុងដំណើរការ...',
        original: 'ច្បាប់ដើម',
    },
    Russian: {
        title: 'Инструкция по безопасности',
        subtitle: 'Пожалуйста, проверьте и подпишите.',
        waiting: 'Ожидание',
        noSession: 'Нет активной сессии TBM.',
        waitingForManager: 'Инструкции появятся когда менеджер их отправит.',
        signatureComplete: 'Подпись завершена',
        enterName: 'Имя',
        namePlaceholder: 'Ваше имя',
        signButton: 'Электронная подпись',
        signing: 'Подписание...',
        original: 'Оригинал',
    },
    English: {
        title: "Today's Safety Instruction",
        subtitle: 'Please review and sign.',
        waiting: 'Waiting',
        noSession: 'No active TBM session.',
        waitingForManager: 'Instructions will appear when manager sends them.',
        signatureComplete: 'Signature Complete',
        enterName: 'Name',
        namePlaceholder: 'Your name',
        signButton: 'Electronic Signature',
        signing: 'Processing...',
        original: 'Original',
    },
};

// 언어 코드 → 텍스트 키 매핑
const langCodeToKey: Record<string, string> = {
    'vi-VN': 'Vietnamese',
    'zh-CN': 'Chinese',
    'uz-UZ': 'Uzbek',
    'th-TH': 'Thai',
    'ru-RU': 'Russian',
    'mn-MN': 'Mongolian',
    'km-KH': 'Khmer',
    'en-US': 'English',
    'ko-KR': 'Korean',
};

export default function WorkerTBMPage() {
    const [session, setSession] = useState<TbmSession | null>(null);
    const [translatedText, setTranslatedText] = useState<string>('');
    const [translatedPronunciation, setTranslatedPronunciation] = useState<string>('');
    const [workerName, setWorkerName] = useState('');
    const [isSigned, setIsSigned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigning, setIsSigning] = useState(false);
    const [showSignaturePad, setShowSignaturePad] = useState(false);

    const [language, setLanguage] = useState(''); // 초기값 비움 (로딩 후 설정)
    const [isTranslating, setIsTranslating] = useState(false);
    const [userLanguage, setUserLanguage] = useState('Korean');
    const router = useRouter(); // useRouter 추가 필요

    // 보안 검사
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    // 저장된 사용자 정보 및 언어 설정 불러오기
    useEffect(() => {
        const savedLang = localStorage.getItem('userLanguage');
        const savedUserStr = localStorage.getItem('user');

        // 1. 사용자 프로필에 저장된 언어 우선 확인
        if (savedUserStr) {
            try {
                const user = JSON.parse(savedUserStr);
                // WorkerProfile에 language가 있거나, userLanguage에 저장된 값 확인
                // 보통 가입 시 선택한 국가/언어가 workerProfile에 있을 수 있음
                // 지금 구조에서는 localStorage 'userLanguage'가 주로 쓰임

                // 만약 savedLang이 있다면 그것을 우선 사용
                if (savedLang) {
                    setLanguageState(savedLang);
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        }

        // 2. 저장된 설정이 없으면 기본값 (여기서는 로직상 savedLang 체크와 통합)
        if (savedLang) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguageState = (langName: string) => {
        setUserLanguage(langName);

        // 언어 코드 매핑
        const langCodeMap: Record<string, string> = {
            'Vietnamese': 'vi-VN',
            'Chinese': 'zh-CN',
            'Uzbek': 'uz-UZ',
            'Thai': 'th-TH',
            'Russian': 'ru-RU',
            'Mongolian': 'mn-MN',
            'Khmer': 'km-KH',
            'English': 'en-US',
            'Korean': 'ko-KR',
        };

        if (langCodeMap[langName]) {
            setLanguage(langCodeMap[langName]);
        }
    };

    const t = TBM_TEXTS[userLanguage] || TBM_TEXTS['Korean'];
    const tKo = TBM_TEXTS['Korean'];
    const showBilingual = userLanguage !== 'Korean';

    // 최신 TBM 세션 조회 (여기서는 번역하지 않고 세션만 업데이트)
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch('/api/tbm');
                const data = await res.json();

                if (data.success && data.session) {
                    // session ID가 바뀌었거나 instruction이 바뀌었을 때만 업데이트하여 불필요한 렌더링 방지
                    setSession(prev => {
                        if (prev?.id !== data.session.id || prev?.instruction !== data.session.instruction) {
                            return data.session;
                        }
                        return prev;
                    });
                }
            } catch (error) {
                console.error('세션 조회 오류:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();

        const interval = setInterval(fetchSession, 5000); // 30초 -> 5초로 단축하여 반응성 향상
        return () => clearInterval(interval);
    }, []);

    // 세션이 변경되거나 언어가 변경되면 번역 실행
    useEffect(() => {
        if (session) {
            translateInstruction(session.instruction, language);
        }
        // UI 언어도 업데이트
        const langKey = langCodeToKey[language];
        if (langKey) {
            setUserLanguage(langKey);
        }
    }, [session, language]);

    const translateInstruction = async (text: string, targetLang: string) => {
        if (!text) return;
        setIsTranslating(true);
        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    langName: targetLang,
                    isManager: true,
                    sourceLang: 'ko-KR'
                })
            });
            const data = await res.json();
            if (data.success) {
                setTranslatedText(data.translation);
                setTranslatedPronunciation(data.pronunciation || '');
            } else {
                setTranslatedText(text);
                setTranslatedPronunciation('');
            }
        } catch (e) {
            console.error('Translation failed', e);
            setTranslatedText(text);
            setTranslatedPronunciation('');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleOpenSignaturePad = () => {
        if (!workerName.trim()) {
            alert(showBilingual ? `${tKo.enterName} / ${t.enterName}` : tKo.enterName);
            return;
        }

        if (!session) {
            alert(tKo.noSession);
            return;
        }

        setShowSignaturePad(true);
    };

    const handleSignatureComplete = async (signatureData: string) => {
        if (!session) return;

        setShowSignaturePad(false);
        setIsSigning(true);

        try {
            const res = await fetch('/api/tbm/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tbmId: session.id,
                    workerName: workerName.trim(),
                    signatureData: signatureData,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setIsSigned(true);
            } else {
                alert(`❌ ${data.error}`);
            }
        } catch (error) {
            console.error('서명 오류:', error);
            alert('Error processing signature.');
        } finally {
            setIsSigning(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="text-white text-xl">
                    {tKo.waiting}
                    {showBilingual && <span className="text-orange-400 ml-2">/ {t.waiting}</span>}
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex flex-col items-center justify-center">
                <div className="bg-white/10 backdrop-blur w-full max-w-md p-8 rounded-2xl border border-white/10 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">📋 {t.waiting}</h2>
                    <p className="text-slate-400">
                        {t.noSession}<br />
                        {t.waitingForManager}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex flex-col items-center justify-center">
            {showSignaturePad && (
                <SignaturePad
                    workerName={workerName}
                    instruction={session.instruction}
                    onSave={handleSignatureComplete}
                    onCancel={() => setShowSignaturePad(false)}
                />
            )}

            <div className="bg-white/10 backdrop-blur w-full max-w-md p-6 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-1">🛡️ {t.title}</h2>
                <p className="text-sm text-slate-400 mb-4">{t.subtitle}</p>

                {/* Language Selector */}
                <div className="flex justify-end mb-4">
                    <select
                        title="Language Selection"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-white/10 text-white text-sm px-3 py-2 rounded-lg border border-white/20 outline-none focus:border-orange-500"
                    >
                        <option value="vi-VN">🇻🇳 Tiếng Việt</option>
                        <option value="zh-CN">🇨🇳 中文</option>
                        <option value="uz-UZ">🇺🇿 O&apos;zbek</option>
                        <option value="th-TH">🇹🇭 ไทย</option>
                        <option value="ru-RU">🇷🇺 Русский</option>
                        <option value="mn-MN">🇲🇳 Монгол</option>
                        <option value="km-KH">🇰🇭 ខ្មែរ</option>
                        <option value="en-US">🇺🇸 English</option>
                    </select>
                </div>

                {/* 지시사항 표시 */}
                <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-xl mb-6 relative group">
                    {/* 재번역 버튼 (우측 상단) */}
                    <button
                        onClick={() => session && translateInstruction(session.instruction, language)}
                        className="absolute top-2 right-2 p-2 bg-black/20 hover:bg-black/30 rounded-full text-orange-400 transition-all opacity-0 group-hover:opacity-100"
                        title="다시 번역 / Re-translate"
                    >
                        🔄
                    </button>

                    {isTranslating && (
                        <div className="absolute top-2 right-12 text-xs text-orange-400 animate-pulse bg-black/20 px-2 py-1 rounded">
                            Running AI...
                        </div>
                    )}

                    <p className="text-xl font-medium text-orange-100 leading-relaxed whitespace-pre-wrap">
                        {translatedText || session.instruction}
                    </p>

                    {translatedPronunciation && (
                        <div className="mt-4 p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
                            <p className="text-xs text-orange-400 uppercase font-black mb-1">Pronunciation (한글 발음)</p>
                            <p className="text-2xl font-black text-orange-300 tracking-tight">"{translatedPronunciation}"</p>
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-end">
                        <p className="text-xs text-slate-500">
                            {new Date(session.createdAt).toLocaleString('ko-KR')}
                        </p>
                        {translatedText && translatedText !== session.instruction && (
                            <p className="text-[10px] text-orange-500/50 uppercase tracking-wider">
                                Translated by Gemini AI
                            </p>
                        )}
                    </div>

                    {/* 원문 보기 토글 (필요시) */}
                    <details className="mt-2">
                        <summary className="text-[10px] text-orange-500/50 cursor-pointer hover:text-orange-400 transition-colors uppercase tracking-wider list-none">
                            ▶ {t.original} (KR)
                        </summary>
                        <p className="text-xs text-slate-400 mt-1 p-2 bg-black/20 rounded">
                            {session.instruction}
                        </p>
                    </details>
                </div>

                {!isSigned ? (
                    <>
                        {/* 이름 입력 */}
                        <div className="mb-4">
                            <label className="block text-sm text-slate-400 mb-2">{t.enterName}</label>
                            <input
                                type="text"
                                value={workerName}
                                onChange={(e) => setWorkerName(e.target.value)}
                                placeholder={t.namePlaceholder}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                            />
                        </div>

                        {/* 서명 버튼 */}
                        <button
                            onClick={handleOpenSignaturePad}
                            disabled={isSigning || !workerName.trim()}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSigning ? t.signing : `✍️ ${t.signButton}`}
                        </button>
                    </>
                ) : (
                    <div className="w-full py-6 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl text-center font-bold text-lg">
                        ✅ {t.signatureComplete}
                    </div>
                )}

                {/* 관리자에게 메시지 보내기 버튼 */}
                <Link href="/chat" className="block mt-4">
                    <button className="w-full py-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2">
                        💬 {userLanguage === 'Vietnamese' ? 'Gửi tin nhắn cho giám đốc' :
                            userLanguage === 'Chinese' ? '向管理员发送消息' :
                                userLanguage === 'Thai' ? 'ส่งข้อความถึงผู้จัดการ' :
                                    'Send message to manager'}
                    </button>
                </Link>
            </div>
        </div>
    );
}
