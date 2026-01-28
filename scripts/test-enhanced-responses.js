// Test script for enhanced personalized responses
const API_URL = 'https://carmah-chatbot-da0atvxsp-chawwari-stanfordedus-projects.vercel.app/api/chat';

async function testChatbot() {
  const testCases = [
    { query: "tell me about carmah", expectedIntent: "PERSONAL" },
    { query: "what does she like", expectedIntent: "PERSONAL" },
    { query: "what inspires her", expectedIntent: "PERSONAL" },
    { query: "what is her personality", expectedIntent: "PERSONAL" },
    { query: "how does she design", expectedIntent: "DESIGN_PHILOSOPHY" },
    { query: "what drives her", expectedIntent: "DESIGN_PHILOSOPHY" },
    { query: "random creative question", expectedIntent: "PERSONALIZED_FALLBACK" },
    { query: "what makes her unique", expectedIntent: "PERSONALIZED_FALLBACK" }
  ];

  console.log('Testing enhanced personalized responses...\n');

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
