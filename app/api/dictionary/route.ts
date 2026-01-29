import { NextRequest, NextResponse } from 'next/server';
import { getAllTerms, upsertTerm, deleteTerm } from '@/lib/slang-dictionary';

export async function GET() {
    try {
        const terms = await getAllTerms();
        return NextResponse.json({ success: true, terms });
    } catch (error) {
        console.error('Dictionary GET Error:', error);
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const success = await upsertTerm(body);
        return NextResponse.json({ success });
    } catch (error) {
        console.error('Dictionary POST Error:', error);
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

        const success = await deleteTerm(id);
        return NextResponse.json({ success });
    } catch (error) {
        console.error('Dictionary DELETE Error:', error);
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}
