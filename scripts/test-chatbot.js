import fetch from "node-fetch";

async function testChatbot() {
  const testQueries = [
    "Tell me about yourself",
    "What internships have you done?",
    "What projects have you worked on?",
    "What is your design philosophy?",
    "How can I contact you?",
    "What is your favorite Apple product?"
  ];

  console.log("Testing chatbot with sample queries...
");

  for (const query of testQueries) {
    console.log(`Query: ${query}`);
    console.log("Response:");
    
    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("
");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              console.log("
---
");
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                process.stdout.write(parsed.content);
              }
            } catch (e) {
              // Ignore parsing errors for non-JSON data
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error testing query "${query}":`, error.message);
      console.log("---
");
    }
  }
}

testChatbot();
