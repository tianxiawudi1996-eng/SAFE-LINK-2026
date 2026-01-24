'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManagerSignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: 'manager',
                }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('가입에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
            <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-2xl border border-white/10 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">👔 관리자 회원가입</h1>
                    <p className="text-slate-400">안전 관리자 계정을 생성합니다</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 이름 */}
                    <div>
                        <label className="block text-sm text-white mb-2">이름</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                            placeholder="홍길동"
                            required
                        />
                    </div>

                    {/* 이메일 */}
                    <div>
                        <label className="block text-sm text-white mb-2">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                            placeholder="manager@company.com"
                            required
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block text-sm text-white mb-2">비밀번호 (4자 이상)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                            placeholder="••••••••"
                            required
                            minLength={4}
                        />
                    </div>

                    {/* 부서 (선택) */}
                    <div>
                        <label className="block text-sm text-white mb-2">부서 (선택)</label>
                        <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                            placeholder="안전관리팀"
                        />
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* 가입 버튼 */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 transition-all"
                    >
                        {isLoading ? '처리 중...' : '관리자 가입하기'}
                    </button>
                </form>

                {/* 로그인 링크 */}
                <p className="mt-6 text-center text-sm text-slate-400">
                    이미 계정이 있으신가요?{' '}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300">
                        로그인
                    </Link>
                </p>
            </div>
        </div>
    );
}
