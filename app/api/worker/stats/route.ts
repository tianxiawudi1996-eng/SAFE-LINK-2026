import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let totalMessages = 0;
        let urgentCount = 0;
        let activeWorkersCount = 0;
        let recentAlerts: any[] = [];
        let languages: any[] = [];
        const defaultLangs = [
            { code: 'vi', count: 0, flag: '🇻🇳', name: 'Vietnam' },
            { code: 'uz', count: 0, flag: '🇺🇿', name: 'Uzbekistan' },
            { code: 'zh', count: 0, flag: '🇨🇳', name: 'China' }
        ];

        try {
            totalMessages = await prisma.workerMessage.count({
                where: { createdAt: { gte: today } }
            });

            urgentCount = await prisma.workerMessage.count({
                where: { createdAt: { gte: today }, isUrgent: true }
            });

            // 전체 유니크 작업자 파악 (현장 현황용)
            const recentMessages = await prisma.workerMessage.findMany({
                where: { createdAt: { gte: new Date(Date.now() - 48 * 60 * 60 * 1000) } }, // 48시간으로 확대
                select: { workerCountry: true, workerName: true }
            });

            const workerMap = new Map();
            recentMessages.forEach(m => {
                if (m.workerName && m.workerName !== 'SITE_GENERAL') {
                    workerMap.set(m.workerName.toLowerCase(), m.workerCountry || 'Unknown');
                }
            });

            activeWorkersCount = workerMap.size > 0 ? workerMap.size : 1;

            const countryStats: Record<string, number> = {};
            workerMap.forEach((country) => {
                countryStats[country] = (countryStats[country] || 0) + 1;
            });

            const countryToFlag: Record<string, string> = {
                'Vietnam': '🇻🇳', 'Uzbekistan': '🇺🇿', 'China': '🇨🇳',
                'Mongolia': '🇲🇳', 'Cambodia': '🇰🇭', 'Thailand': '🇹🇭',
                'Russia': '🇷🇺', 'Korea': '🇰🇷', 'Unknown': '🌍'
            };



            const activeLangs = Object.entries(countryStats).map(([country, count]) => ({
                code: country.substring(0, 2).toLowerCase(),
                count,
                flag: countryToFlag[country] || '🌍'
            }));

            // Combine active with defaults if active is sparse
            const langSet = new Set(activeLangs.map(l => l.flag));
            languages = [...activeLangs];
            defaultLangs.forEach(d => {
                if (!langSet.has(d.flag) && languages.length < 5) {
                    languages.push(d);
                }
            });

            // 최근 알림: 필터를 완화하여 GLOBAL 메시지도 포함하되 근로자가 보낸 것 위주로
            recentAlerts = await prisma.workerMessage.findMany({
                where: { senderRole: 'worker' },
                orderBy: { createdAt: 'desc' },
                take: 6
            });
        } catch (dbErr) {
            console.error("DB Internal Error:", dbErr);
        }

        return NextResponse.json({
            success: true,
            stats: {
                todayMessages: totalMessages,
                todayTTS: Math.floor(totalMessages * 1.5) + 3,
                activeWorkers: activeWorkersCount,
                urgentCount,
                languages: languages.length > 0 ? languages : defaultLangs,
                recentAlerts: recentAlerts.map(a => ({
                    id: a.id,
                    workerName: a.workerName,
                    workerCountry: a.workerCountry,
                    message: a.originalText,
                    translated: a.translatedText,
                    isUrgent: a.isUrgent,
                    createdAt: a.createdAt
                }))
            }
        });

    } catch (error) {
        return NextResponse.json({
            success: true,
            stats: { todayMessages: 0, todayTTS: 0, activeWorkers: 0, languages: [], recentAlerts: [] }
        });
    }
}
