'use client';
import Link from 'next/link';

export default function SignupSelectPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🛡️ SAFE-LINK</h1>
                    <p className="text-slate-400">가입 유형을 선택하세요</p>
                </div>

                {/* 관리자 가입 */}
                <Link href="/signup/manager">
                    <div className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 p-6 rounded-2xl cursor-pointer transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">👔</span>
                            <div>
                                <h2 className="text-xl font-bold text-white group-hover:text-blue-300">관리자 가입</h2>
                                <p className="text-slate-400 text-sm">안전 관리자, 소장, 현장 책임자</p>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* 근로자 가입 */}
                <Link href="/signup/worker">
                    <div className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 p-6 rounded-2xl cursor-pointer transition-all group mt-4">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">👷</span>
                            <div>
                                <h2 className="text-xl font-bold text-white group-hover:text-green-300">
                                    근로자 가입 <span className="text-green-400">/ Đăng ký lao động</span>
                                </h2>
                                <p className="text-slate-400 text-sm">외국인 근로자 / Foreign workers</p>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* 로그인 링크 */}
                <p className="text-center text-slate-400 text-sm mt-8">
                    이미 계정이 있으신가요?{' '}
                    <Link href="/login" className="text-orange-400 hover:text-orange-300">
                        로그인
                    </Link>
                </p>
            </div>
        </div>
    );
}
