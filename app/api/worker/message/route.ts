// 근로자 메시지 전송 API (자국어 → 한국어 번역)
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

// Gemini 설정
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 한국어로 번역
async function translateToKorean(text: string, sourceLanguage: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a professional translator for a construction site safety communication system.

Translate the following ${sourceLanguage} message to Korean (한국어).
This is a message from a foreign worker to a Korean manager.

Rules:
1. Translate naturally and accurately
2. Keep safety-related terms precise
3. If the message seems urgent or about an emergency, preserve that urgency
4. Return ONLY the Korean translation, no explanations

Original message (${sourceLanguage}):
"${text}"

Korean translation:`;

        const result = await model.generateContent(prompt);
        const translation = result.response.text().trim();

        return translation || text;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // 번역 실패 시 원문 반환
    }
}

// POST: 메시지 전송
export async function POST(request: NextRequest) {
    try {
        const { workerName, workerCountry, workerLanguage, message, isUrgent } = await request.json();

        if (!workerName || !message) {
            return NextResponse.json({
                success: false,
                error: 'Name and message are required'
            }, { status: 400 });
        }

        // 한국어로 번역
        const translatedText = await translateToKorean(message, workerLanguage || 'Unknown');

        // 메시지 저장
        const workerMessage = await prisma.workerMessage.create({
            data: {
                workerName,
                workerCountry: workerCountry || 'Unknown',
                workerLanguage: workerLanguage || 'Unknown',
                originalText: message,
                translatedText,
                isUrgent: isUrgent || false,
            },
        });

        return NextResponse.json({
            success: true,
            message: workerMessage,
        });
    } catch (error) {
        console.error('Message send error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to send message'
        }, { status: 500 });
    }
}

// GET: 메시지 조회 (관리자용)
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const unreadOnly = url.searchParams.get('unread') === 'true';

        const messages = await prisma.workerMessage.findMany({
            where: unreadOnly ? { isRead: false } : {},
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        // 읽지 않은 메시지 수
        const unreadCount = await prisma.workerMessage.count({
            where: { isRead: false },
        });

        return NextResponse.json({
            success: true,
            messages,
            unreadCount,
        });
    } catch (error) {
        console.error('Message fetch error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch messages'
        }, { status: 500 });
    }
}
