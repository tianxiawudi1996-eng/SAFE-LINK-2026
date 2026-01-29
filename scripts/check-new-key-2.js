const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function run() {
    // Explicitly use the NEW Google Cloud Key
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    console.log("Testing GOOGLE_CLOUD_API_KEY:", apiKey ? apiKey.substring(0, 5) + "..." : "MISSING");

    if (!apiKey) return;

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try Flash first as it's the standard now
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent("Hello, are you working?");
        console.log("Response:", result.response.text());
    } catch (e) {
        console.log("FULL ERROR OBJECT:");
        console.log(JSON.stringify(e, null, 2));
        console.log("-------------------");
        console.log("ERROR MESSAGE:", e.message);
    }
}

run();
