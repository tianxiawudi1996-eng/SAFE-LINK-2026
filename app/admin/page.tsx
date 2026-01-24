'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 폼
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // 데이터
    const [data, setData] = useState<any>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            setIsLoggedIn(true);
            fetchData();
        }
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/data');
            const json = await res.json();
            if (json.success) setData(json);
        } catch (err) {
            console.error('Failed to fetch admin data');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const json = await res.json();

            if (json.success) {
                localStorage.setItem('adminToken', json.token);
                setIsLoggedIn(true);
                fetchData();
            } else {
                setError(json.error);
            }
        } catch (err) {
            setError('로그인 오류');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
        setData(null);
    };

    // 사용자 삭제
    const deleteUser = async (userId: string) => {
        if (!confirm('정말로 이 사용자를 강제 탈퇴시키겠습니까?')) return;
        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
            if (res.ok) {
                alert('삭제되었습니다.');
                setRefreshKey(prev => prev + 1);
            } else {
                alert('삭제 실패');
            }
        } catch (e) {
            alert('오류 발생');
        }
    };

    // 세션 삭제
    const deleteSession = async (sessionId: string) => {
        if (!confirm('정말로 이 세션 데이터를 삭제하시겠습니까? (서명 데이터 포함)')) return;
        try {
            const res = await fetch(`/api/admin/sessions?id=${sessionId}`, { method: 'DELETE' });
            if (res.ok) {
                alert('삭제되었습니다.');
                setRefreshKey(prev => prev + 1);
            } else {
                alert('삭제 실패');
            }
        } catch (e) {
            alert('오류 발생');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-6 text-center">🔐 슈퍼 관리자</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-slate-400 text-sm">아이디</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="admin" />
                        </div>
                        <div>
                            <label className="text-slate-400 text-sm">비밀번호</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="admin" />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg">접속</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-red-500">🛠️ 통합 관리자 대시보드</h1>
                    <div className="flex gap-4">
                        <button onClick={() => setRefreshKey(k => k + 1)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">🔄 새로고침</button>
                        <button onClick={handleLogout} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">로그아웃</button>
                    </div>
                </div>

                {data ? (
                    <div className="space-y-8">
                        {/* 통계 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-slate-400 text-sm mb-2">총 사용자</h3>
                                <p className="text-3xl font-bold">{data.stats.totalUsers}</p>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-slate-400 text-sm mb-2">총 세션</h3>
                                <p className="text-3xl font-bold text-orange-400">{data.stats.totalSessions}</p>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-slate-400 text-sm mb-2">총 서명</h3>
                                <p className="text-3xl font-bold text-green-400">{data.stats.totalSignatures}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* 사용자 관리 */}
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h2 className="text-xl font-bold mb-4">👥 사용자 관리</h2>
                                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                    {data.recentUsers.map((user: any) => (
                                        <div key={user.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg group">
                                            <div>
                                                <div className="font-bold flex items-center gap-2">
                                                    {user.name}
                                                    <span className={`text-xs px-2 py-0.5 rounded ${user.role === 'manager' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1">
                                                    ID: <span className="text-yellow-400">{user.email}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-600 font-mono mt-1 w-48 truncate" title={user.password}>
                                                    PW(암호화됨): {user.password.substring(0, 15)}...
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm(`${user.name}님의 비밀번호를 '1234'로 초기화하시겠습니까?`)) return;
                                                        await fetch('/api/admin/users/reset-pw', {
                                                            method: 'POST',
                                                            body: JSON.stringify({ userId: user.id }),
                                                            headers: { 'Content-Type': 'application/json' }
                                                        });
                                                        alert('비밀번호가 1234로 변경되었습니다.');
                                                    }}
                                                    className="px-3 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded text-xs transition-all"
                                                >
                                                    비번 1234로 초기화
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded text-xs transition-all"
                                                >
                                                    강제 탈퇴
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 세션 관리 */}
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h2 className="text-xl font-bold mb-4">📢 TBM 세션 관리</h2>
                                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                    {data.recentSessions.map((session: any) => (
                                        <div key={session.id} className="bg-slate-900/50 p-3 rounded-lg group">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-orange-400 text-xs font-mono">{session.id}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 text-xs">{new Date(session.createdAt).toLocaleDateString()}</span>
                                                    <button
                                                        onClick={() => deleteSession(session.id)}
                                                        className="opacity-0 group-hover:opacity-100 px-2 py-0.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded text-xs transition-all"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-300 line-clamp-1 mb-1">{session.instruction}</p>
                                            <div className="text-right text-xs text-green-400">서명: {session._count.signatures}명</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">Loading...</div>
                )}
            </div>
        </div>
    );
}
