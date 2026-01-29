
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testTranslation() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { responseMimeType: "application/json" }
    });

    const text = "我可以休息吗？";
    const source = "Chinese";
    const target = "Korean";

    const prompt = `Translate this construction message.
Source: ${source}
Target: ${target}
Output JSON: {"translation": "...", "pronunciation": "Write the pronunciation of the Source text entirely in Korean Hangul characters. Example: '워아이니'. DO NOT USE ENGLISH ALPHABET."}

Input: "${text}"`;

    console.log("Testing Prompt:\n" + prompt);

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("\n--- Raw Response ---");
        console.log(responseText);
        console.log("--------------------\n");

        try {
            const parsed = JSON.parse(responseText);
            console.log("Parsed:", parsed);
        } catch (e) {
            console.error("JSON Parse Error:", e);
        }

    } catch (e) {
        console.error("GenAI Error:", e);
    }
}

testTranslation();
