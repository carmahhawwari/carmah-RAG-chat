// Test script for the creative responses
const API_URL = 'https://carmah-chatbot-5f442g7jn-chawwari-stanfordedus-projects.vercel.app/api/chat';

async function testChatbot() {
  const testCases = [
    { query: "tell me about yourself", expectedIntent: "ABOUT" },
    { query: "who is carmah", expectedIntent: "ABOUT" },
    { query: "introduce yourself", expectedIntent: "ABOUT" },
    { query: "what's a fun fact", expectedIntent: "FUN_FACT" },
    { query: "random question", expectedIntent: "FALLBACK" }
  ];

  console.log('Testing creative responses...\n');

  for (const testCase of testCases) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: testCase.query,
          sessionId: 'test-session'
        }),
      });

      const data = await response.json();
      
      console.log(`Query: "${testCase.query}"`);
      console.log(`Expected Intent: ${testCase.expectedIntent}`);
      console.log(`Response: ${data.response}`);
      console.log(`Success: ${data.success}`);
      console.log('---');
      
    } catch (error) {
      console.error(`Error testing "${testCase.query}":`, error);
    }
  }
}

testChatbot();
