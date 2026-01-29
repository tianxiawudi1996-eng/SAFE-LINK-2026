const fs = require('fs');
const path = require('path');
const https = require('https');

// Load env simply
function loadEnv(filename) {
    try {
        const envPath = path.resolve(process.cwd(), filename);
        if (!fs.existsSync(envPath)) return {};
        const content = fs.readFileSync(envPath, 'utf8');
        const env = {};
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                let value = match[2].trim();
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                env[match[1].trim()] = value;
            }
        });
        return env;
    } catch (e) {
        return {};
    }
}

const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };
const API_KEY = env.GEMINI_API_KEY || env.GOOGLE_CLOUD_API_KEY;

if (!API_KEY) {
    console.log("❌ No API Key found in .env (Looked for GEMINI_API_KEY or GOOGLE_CLOUD_API_KEY)");
    process.exit(1);
}

console.log("🔑 Found API Key. Testing Google Cloud TTS (Neural2)...");

const postData = JSON.stringify({
    input: { text: "테스트" },
    voice: { languageCode: "ko-KR", name: "ko-KR-Neural2-A" },
    audioConfig: { audioEncoding: "MP3" }
});

const options = {
    hostname: 'texttospeech.googleapis.com',
    path: `/v1/text:synthesize?key=${API_KEY}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log("✅ Google Cloud TTS Connection SUCCESS! (The Key works for Neural2)");
        } else {
            console.log(`❌ Google Cloud TTS Failed. Status: ${res.statusCode}`);
            console.log(`Response: ${data}`);
            if (data.includes("API key not valid")) console.log("-> The API Key is invalid.");
            else if (data.includes("Cloud Text-to-Speech API has not been used in project")) console.log("-> THe API Key is valid but the TTS API is not enabled in Google Cloud Console.");
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Request Error: ${e.message}`);
});

req.write(postData);
req.end();
