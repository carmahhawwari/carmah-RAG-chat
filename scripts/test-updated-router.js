// Test script for the updated intent router implementation
const API_URL = 'https://carmah-chatbot-7vskh19ec-chawwari-stanfordedus-projects.vercel.app/api/chat';

async function testChatbot() {
  const testCases = [
    { query: "what are some of ur hobbies", expectedIntent: "HOBBIES" },
    { query: "tell me about your experience", expectedIntent: "EXPERIENCE" },
    { query: "yes of everything", expectedIntent: "COMPREHENSIVE" },
    { query: "tell me about everything", expectedIntent: "COMPREHENSIVE" }
  ];

  console.log('Testing updated intent router implementation...\n');

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
