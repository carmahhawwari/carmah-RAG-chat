// Test script for the new intent router implementation
const API_URL = 'https://carmah-chatbot-7fant41bb-chawwari-stanfordedus-projects.vercel.app/api/chat';

async function testChatbot() {
  const testCases = [
    { query: "hi", expectedIntent: "GREET" },
    { query: "what's your name?", expectedIntent: "NAME" },
    { query: "what do you do?", expectedIntent: "WHAT_DO_YOU_DO" },
    { query: "what's your favorite food?", expectedIntent: "FOOD" },
    { query: "tell me a fun fact", expectedIntent: "FUN_FACT" },
    { query: "show me your projects", expectedIntent: "PROJECTS" },
    { query: "what's your experience?", expectedIntent: "EXPERIENCE" },
    { query: "what skills do you have?", expectedIntent: "SKILLS" },
    { query: "how can I contact you?", expectedIntent: "CONTACT" },
    { query: "random question about nothing", expectedIntent: "UNKNOWN" }
  ];

  console.log('Testing new intent router implementation...\n');

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

  // Test memory system by sending the same query twice
  console.log('\nTesting memory system (avoiding repetition)...');
  try {
    const response1 = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: "hi", sessionId: 'memory-test' }),
    });
    const data1 = await response1.json();
    console.log(`First "hi": ${data1.response}`);

    const response2 = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: "hi", sessionId: 'memory-test' }),
    });
    const data2 = await response2.json();
    console.log(`Second "hi": ${data2.response}`);
    console.log(`Different responses: ${data1.response !== data2.response}`);
    
  } catch (error) {
    console.error('Error testing memory:', error);
  }
}

testChatbot();
