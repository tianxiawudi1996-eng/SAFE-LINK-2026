'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 다국어 텍스트
const UI_TEXTS: Record<string, {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    sending: string;
    sent: string;
    urgent: string;
    voiceStart: string;
    voiceStop: string;
    voiceNotSupported: string;
    back: string;
    examples: string[];
}> = {
    Vietnamese: {
        title: 'Gửi tin nhắn',
        subtitle: 'Gửi tin nhắn cho giám đốc',
        placeholder: 'Nhập tin nhắn của bạn...',
        send: 'Gửi',
        sending: 'Đang gửi...',
        sent: 'Đã gửi thành công!',
        urgent: '🚨 Khẩn cấp',
        voiceStart: '🎤 Nói',
        voiceStop: '⏹ Dừng',
        voiceNotSupported: 'Không hỗ trợ giọng nói',
        back: '← Quay lại TBM',
        examples: ['Tôi không hiểu', 'Cần giúp đỡ', 'Đã hoàn thành', 'Có vấn đề'],
    },
    Chinese: {
        title: '发送消息',
        subtitle: '向管理员发送消息',
        placeholder: '输入您的消息...',
        send: '发送',
        sending: '发送中...',
        sent: '发送成功！',
        urgent: '🚨 紧急',
        voiceStart: '🎤 说话',
        voiceStop: '⏹ 停止',
        voiceNotSupported: '不支持语音',
        back: '← 返回TBM',
        examples: ['我不明白', '需要帮助', '已完成', '有问题'],
    },
    Thai: {
        title: 'ส่งข้อความ',
        subtitle: 'ส่งข้อความถึงผู้จัดการ',
        placeholder: 'พิมพ์ข้อความของคุณ...',
        send: 'ส่ง',
        sending: 'กำลังส่ง...',
        sent: 'ส่งสำเร็จ!',
        urgent: '🚨 เร่งด่วน',
        voiceStart: '🎤 พูด',
        voiceStop: '⏹ หยุด',
        voiceNotSupported: 'ไม่รองรับเสียง',
        back: '← กลับ TBM',
        examples: ['ไม่เข้าใจ', 'ต้องการความช่วยเหลือ', 'เสร็จแล้ว', 'มีปัญหา'],
    },
    Uzbek: {
        title: 'Xabar yuborish',
        subtitle: "Menejerga xabar yuboring",
        placeholder: 'Xabaringizni yozing...',
        send: 'Yuborish',
        sending: 'Yuborilmoqda...',
        sent: "Muvaffaqiyatli yuborildi!",
        urgent: "🚨 Shoshilinch",
        voiceStart: "🎤 Gapiring",
        voiceStop: "⏹ To'xtating",
        voiceNotSupported: "Ovoz qo'llab-quvvatlanmaydi",
        back: "← TBMga qaytish",
        examples: ["Tushunmadim", "Yordam kerak", "Bajarildi", "Muammo bor"],
    },
    Khmer: {
        title: 'ផ្ញើសារ',
        subtitle: 'ផ្ញើសារទៅអ្នកគ្រប់គ្រង',
        placeholder: 'វាយសាររបស់អ្នក...',
        send: 'ផ្ញើ',
        sending: 'កំពុងផ្ញើ...',
        sent: 'បានផ្ញើដោយជោគជ័យ!',
        urgent: '🚨 បន្ទាន់',
        voiceStart: '🎤 និយាយ',
        voiceStop: '⏹ ឈប់',
        voiceNotSupported: 'មិនគាំទ្រសំឡេង',
        back: '← ត្រឡប់ TBM',
        examples: ['មិនយល់', 'ត្រូវការជំនួយ', 'រួចរាល់', 'មានបញ្ហា'],
    },
    English: {
        title: 'Send Message',
        subtitle: 'Send a message to manager',
        placeholder: 'Type your message...',
        send: 'Send',
        sending: 'Sending...',
        sent: 'Sent successfully!',
        urgent: '🚨 Urgent',
        voiceStart: '🎤 Speak',
        voiceStop: '⏹ Stop',
        voiceNotSupported: 'Voice not supported',
        back: '← Back to TBM',
        examples: ["I don't understand", 'Need help', 'Completed', 'There is a problem'],
    },
};

const getTexts = (lang: string) => UI_TEXTS[lang] || UI_TEXTS['English'];

// 언어 → 음성인식 코드 매핑
const langToSpeechCode: Record<string, string> = {
    'Vietnamese': 'vi-VN',
    'Chinese': 'zh-CN',
    'Thai': 'th-TH',
    'Uzbek': 'uz-UZ',
    'Khmer': 'km-KH',
    'Indonesian': 'id-ID',
    'Mongolian': 'mn-MN',
    'Bengali': 'bn-BD',
    'Russian': 'ru-RU',
    'English': 'en-US',
};

export default function WorkerChatPage() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // 사용자 정보
    const [workerName, setWorkerName] = useState('');
    const [workerLanguage, setWorkerLanguage] = useState('English');
    const [workerCountry, setWorkerCountry] = useState('');

    // 보안 검사
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const recognitionRef = useRef<any>(null);

    // localStorage에서 사용자 정보 불러오기
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedLang = localStorage.getItem('userLanguage');
        const savedCountry = localStorage.getItem('userCountry');

        if (savedUser) {
            const user = JSON.parse(savedUser);
            setWorkerName(user.name || '');
        }
        if (savedLang) setWorkerLanguage(savedLang);
        if (savedCountry) setWorkerCountry(savedCountry);
    }, []);

    const t = getTexts(workerLanguage);

    // 음성 인식 시작/중지
    const toggleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert(t.voiceNotSupported);
            return;
        }

        if (isListening) {
            // 중지
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        // 시작
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = langToSpeechCode[workerLanguage] || 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setMessage((prev) => prev + ' ' + transcript);
            setIsListening(false);
        };

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    // 메시지 전송
    const handleSend = async () => {
        if (!message.trim()) return;

        setIsSending(true);

        try {
            const res = await fetch('/api/worker/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workerName,
                    workerCountry,
                    workerLanguage,
                    message: message.trim(),
                    isUrgent,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage('');
                setIsUrgent(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Send error:', error);
        } finally {
            setIsSending(false);
        }
    };

    // 빠른 메시지 버튼
    const handleQuickMessage = (text: string) => {
        setMessage(text);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex flex-col">
            {/* 헤더 */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">💬 {t.title}</h1>
                <p className="text-slate-400 text-sm">{t.subtitle}</p>
            </div>

            {/* 성공 메시지 */}
            {showSuccess && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center font-medium animate-pulse">
                    ✅ {t.sent}
                </div>
            )}

            {/* 빠른 메시지 버튼 */}
            <div className="mb-4">
                <div className="flex flex-wrap gap-2 justify-center">
                    {t.examples.map((example, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuickMessage(example)}
                            className="px-4 py-2 bg-white/10 hover:bg-orange-500/30 border border-white/10 hover:border-orange-500 rounded-full text-white text-sm transition-all"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>

            {/* 메시지 입력 영역 */}
            <div className="flex-1 flex flex-col justify-end max-w-lg mx-auto w-full">
                {/* 긴급 토글 */}
                <div className="mb-3">
                    <button
                        onClick={() => setIsUrgent(!isUrgent)}
                        className={`w-full py-3 rounded-xl font-medium transition-all ${isUrgent
                            ? 'bg-red-500/30 border-2 border-red-500 text-red-400'
                            : 'bg-white/5 border border-white/10 text-slate-400'
                            }`}
                    >
                        {t.urgent}
                    </button>
                </div>

                {/* 텍스트 입력 */}
                <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/10 p-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.placeholder}
                        className="w-full h-32 bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none text-lg"
                    />

                    {/* 버튼들 */}
                    <div className="flex gap-3 mt-3">
                        {/* 음성 입력 */}
                        <button
                            onClick={toggleVoiceInput}
                            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30'
                                }`}
                        >
                            {isListening ? t.voiceStop : t.voiceStart}
                        </button>

                        {/* 전송 */}
                        <button
                            onClick={handleSend}
                            disabled={isSending || !message.trim()}
                            className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 hover:from-orange-600 hover:to-orange-700 transition-all"
                        >
                            {isSending ? t.sending : t.send}
                        </button>
                    </div>
                </div>

                {/* TBM으로 돌아가기 */}
                <Link href="/tbm" className="mt-4 text-center">
                    <button className="w-full py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                        {t.back}
                    </button>
                </Link>
            </div>
        </div>
    );
}
