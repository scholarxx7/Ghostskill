/**
 * Test script to check API connections
 * Run with: node test-api-connections.js
 */

const fetch = require('node-fetch');

// Configuration
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

console.log('🔍 Testing API Connections...\n');
console.log('Configuration:');
console.log(`  Python API URL: ${PYTHON_API_URL}`);
console.log(`  Google API Key: ${GOOGLE_API_KEY ? '✅ Set (' + GOOGLE_API_KEY.substring(0, 10) + '...)' : '❌ Not set'}\n`);

// Test 1: Python API Health Check
async function testPythonAPI() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Test 1: Python API Health Check');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        const response = await fetch(`${PYTHON_API_URL}/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            console.log(`❌ Python API health check failed: ${response.status} ${response.statusText}`);
            return false;
        }

        const data = await response.json();
        console.log('✅ Python API is healthy!');
        console.log('   Datasets loaded:', JSON.stringify(data.datasets_loaded, null, 2));
        return true;
    } catch (error) {
        console.log(`❌ Error connecting to Python API: ${error.message}`);
        console.log('   Make sure the Python API is running at:', PYTHON_API_URL);
        console.log('   Start it with: cd python-api && python main.py');
        return false;
    }
}

// Test 2: Python API Wisdom Fetch
async function testPythonWisdom() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Test 2: Python API Wisdom Fetch');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        const response = await fetch(`${PYTHON_API_URL}/wisdom/chanakya/random`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            console.log(`❌ Failed to fetch wisdom: ${response.status} ${response.statusText}`);
            return false;
        }

        const data = await response.json();
        console.log('✅ Successfully fetched wisdom!');
        console.log('   Sample:');
        console.log(`   Source: ${data.wisdom.source}`);
        console.log(`   Text: ${data.wisdom.text.substring(0, 100)}...`);
        return true;
    } catch (error) {
        console.log(`❌ Error fetching wisdom: ${error.message}`);
        return false;
    }
}

// Test 3: Google Gemini API
async function testGeminiAPI() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Test 3: Google Gemini API');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!GOOGLE_API_KEY) {
        console.log('⚠️  Google API Key not set');
        console.log('   Set it in backend/.env: GOOGLE_API_KEY=your_key_here');
        console.log('   Get a key from: https://makersuite.google.com/app/apikey');
        return false;
    }

    try {
        const requestBody = {
            contents: [{
                parts: [{
                    text: 'Say "API connection successful" in one sentence.'
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 50
            }
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(`❌ Gemini API error: ${response.status}`);
            console.log('   Error details:', JSON.stringify(errorData, null, 2));
            return false;
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            console.log('✅ Gemini API is working!');
            console.log('   Response:', data.candidates[0].content.parts[0].text);
            return true;
        } else {
            console.log('❌ Unexpected response format from Gemini API');
            return false;
        }
    } catch (error) {
        console.log(`❌ Error connecting to Gemini API: ${error.message}`);
        return false;
    }
}

// Test 4: End-to-End Integration
async function testEndToEnd() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Test 4: End-to-End Integration');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!GOOGLE_API_KEY) {
        console.log('⚠️  Skipping (requires Google API Key)');
        return false;
    }

    try {
        // Simulate the full flow
        console.log('1. Fetching wisdom from Python API...');
        const wisdomResponse = await fetch(`${PYTHON_API_URL}/wisdom/chanakya/random`);
        const wisdomData = await wisdomResponse.json();
        const wisdom = wisdomData.wisdom;

        console.log('   ✅ Got wisdom:', wisdom.text.substring(0, 50) + '...');

        console.log('2. Sending to Gemini with wisdom context...');
        const systemPrompt = `You are Chanakya. Here is relevant wisdom: "${wisdom.text}"`;
        const requestBody = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser's question: How do I make better decisions?\n\nYour response:`
                }]
            }],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 150
            }
        };

        const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const geminiData = await geminiResponse.json();
        const response = geminiData.candidates[0].content.parts[0].text;

        console.log('   ✅ Got AI response:', response.substring(0, 100) + '...');
        console.log('\n✅ Full integration working!');
        return true;
    } catch (error) {
        console.log(`❌ Integration test failed: ${error.message}`);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    const results = {
        pythonHealth: false,
        pythonWisdom: false,
        geminiAPI: false,
        integration: false
    };

    results.pythonHealth = await testPythonAPI();

    if (results.pythonHealth) {
        results.pythonWisdom = await testPythonWisdom();
    }

    results.geminiAPI = await testGeminiAPI();

    if (results.pythonWisdom && results.geminiAPI) {
        results.integration = await testEndToEnd();
    }

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Python API Health:    ${results.pythonHealth ? '✅' : '❌'}`);
    console.log(`Python API Wisdom:    ${results.pythonWisdom ? '✅' : '❌'}`);
    console.log(`Google Gemini API:    ${results.geminiAPI ? '✅' : '❌'}`);
    console.log(`End-to-End:           ${results.integration ? '✅' : '❌'}`);

    const allPassed = results.pythonHealth && results.pythonWisdom && results.geminiAPI && results.integration;
    console.log(`\nOverall Status:       ${allPassed ? '✅ ALL TESTS PASSED' : '⚠️  SOME TESTS FAILED'}`);

    // Recommendations
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('NEXT STEPS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!results.pythonHealth) {
        console.log('1. Start the Python API:');
        console.log('   cd python-api');
        console.log('   python main.py');
    }

    if (!results.geminiAPI) {
        console.log('2. Set up Google API Key:');
        console.log('   - Get key from: https://makersuite.google.com/app/apikey');
        console.log('   - Add to backend/.env: GOOGLE_API_KEY=your_key');
    }

    if (allPassed) {
        console.log('✨ All systems operational! Ready to use.');
    }
}

// Run tests
runAllTests().catch(console.error);
