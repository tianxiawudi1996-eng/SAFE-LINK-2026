
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ExcelJS from 'exceljs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const targetLang = formData.get('targetLang') as string;

        if (!file || !targetLang) {
            return NextResponse.json({ error: 'File and target language are required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
        }

        // 1. Load Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer as any);

        // 2. Extract Text
        const worksheet = workbook.worksheets[0]; // Process first sheet
        const cellsToTranslate: { address: string; text: string }[] = [];

        worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
            row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
                // Skip formulas, numbers, and dates
                if (cell.type === ExcelJS.ValueType.String || cell.type === ExcelJS.ValueType.RichText) {
                    const text = cell.text;
                    if (text && text.trim().length > 0 && !text.startsWith('=')) {
                        cellsToTranslate.push({
                            address: cell.address,
                            text: text
                        });
                    }
                }
            });
        });

        if (cellsToTranslate.length === 0) {
            return NextResponse.json({ message: 'No text found to translate' }, { status: 400 });
        }

        console.log(`Found ${cellsToTranslate.length} cells to translate to ${targetLang}`);

        // 3. Batch Translate with Gemini
        // We'll proceed in batches to avoid token limits, but for this demo, single batch or smaller chunks
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fast model

        // Prepare prompt
        const terms = cellsToTranslate.map((c, i) => `${i}: "${c.text}"`).join('\n');

        const prompt = `
        Role: Professional Legal Translator.
        Task: Translate the following numbered lines from Korean to ${targetLang}.
        Context: Labor Contract (Standard Form).
        Rules:
        1. Maintain legal accuracy.
        2. Keep formatting codes if any.
        3. Output ONLY a JSON object where keys are the numbers and values are translations.
        4. Do NOT translate numbers, dates inside text if they are clear values.
        
        Input:
        ${terms}
        
        Output JSON:
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        let translations: Record<string, string> = {};
        try {
            translations = JSON.parse(responseText);
        } catch (e) {
            console.error('JSON Parse Error:', e);
            console.log('Raw Response:', responseText);
            // Fallback: Try regex if JSON fails
            return NextResponse.json({ error: 'Translation parsing failed' }, { status: 500 });
        }

        // 4. Apply Translations
        cellsToTranslate.forEach((item, index) => {
            const translatedText = translations[index.toString()];
            if (translatedText) {
                const cell = worksheet.getCell(item.address);
                cell.value = translatedText;
            }
        });

        // 5. Write back to buffer
        const newBuffer = await workbook.xlsx.writeBuffer();

        // 6. Return File
        return new NextResponse(newBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="translated_${targetLang}.xlsx"`
            }
        });

    } catch (error) {
        console.error('Translation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
