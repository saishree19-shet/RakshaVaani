// Native fetch is available in Node.js 18+

const API_URL = 'http://localhost:3000/api/voice-detection';
const API_KEY = 'sk_test_123456789'; // Matching the one in server.js valid keys

// A minimal valid MP3 ID3 header + one frame (Silence) to pass formatting checks
// This is a 1-second silent MP3 base64
const MOCK_MP3_BASE64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//oeAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIWFhYWVhYWVhYWVhYWVhYWVhYWVhYWVhYWVhYWVhYWVhYWVhYWVhYWVhAP/6HgAAAAAAAAAAAAAA//oeAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU2LjQxAAAAAAAAAAAAAAAAJAAAAAAAAAAAASGJE9+dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

async function testVoiceAPI() {
    console.log("Testing Voice Detection API...");
    console.log(`Target: ${API_URL}`);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                language: "English",
                audioFormat: "mp3",
                audioBase64: MOCK_MP3_BASE64
            })
        });

        const data = await response.json();

        console.log("\n--- API Response ---");
        console.log(JSON.stringify(data, null, 2));

        if (data.status === 'success' && (data.classification === 'HUMAN' || data.classification === 'AI_GENERATED')) {
            console.log("\n✅ TEST PASSED: Valid response format received.");
        } else {
            console.log("\n❌ TEST FAILED: Invalid response format.");
        }

    } catch (error) {
        console.error("\n❌ TEST FAILED: Connection error.", error.message);
        console.log("Make sure the server is running on port 3000!");
    }
}

testVoiceAPI();
