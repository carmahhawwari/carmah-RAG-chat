# Carmah Hawwari Portfolio Chatbot

A personalized chatbot for your Framer portfolio that answers questions about your background, experience, and projects using AI.

## Features

- 🤖 AI-powered responses using OpenAI GPT-4o-mini
- 📚 Knowledge base built from your personal information
- 🔍 Semantic search using OpenAI embeddings
- ⚡ Fast responses with Vercel Edge Functions
- 💾 Vector storage with Supabase
- 🌐 CORS-enabled for web integration

## Quick Start

### 1. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL commands in `supabase-setup.sql` in your Supabase SQL editor
3. Get your project URL and service role key from Settings > API

### 2. Set up OpenAI

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env.local` file with your credentials:

```bash
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 3. Index your knowledge base

```bash
npm run index-kb
```

This will read all markdown files from `/kb` and create embeddings in Supabase.

### 4. Test locally

```bash
npm run dev
```

Then test with:
```bash
node scripts/test-chatbot.js
```

### 5. Deploy to Vercel

```bash
npm run deploy
```

## Usage

### API Endpoint

`POST /api/chat`

**Request:**
```json
{
  "query": "Tell me about your design philosophy"
}
```

**Response:** Server-Sent Events stream
```
data: {"content": "My design philosophy is anchored on four pillars..."}
data: [DONE]
```

### Integration with Framer

Add this to your Framer site:

```javascript
async function askCarmah(question) {
  const response = await fetch("https://your-vercel-url.vercel.app/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: question })
  });
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let answer = "";
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split("
");
    
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") return answer;
        try {
          const parsed = JSON.parse(data);
          if (parsed.content) answer += parsed.content;
        } catch (e) {}
      }
    }
  }
}
```

## File Structure

```
├── api/
│   └── chat/
│       └── route.js          # Vercel Edge API endpoint
├── kb/                       # Your knowledge base
│   ├── intro.md
│   ├── experience.md
│   ├── projects.md
│   └── faq.md
├── scripts/
│   ├── index-kb.js           # Index knowledge base to Supabase
│   └── test-chatbot.js       # Test the chatbot
├── package.json
├── vercel.json              # Vercel configuration
├── supabase-setup.sql       # Database setup
└── .env.example             # Environment variables template
```

## Customization

### Update Knowledge Base
Edit the markdown files in `/kb` and re-run `npm run index-kb`.

### Modify System Prompt
Edit the `systemPrompt` in `api/chat/route.js` to change how the AI responds.

### Adjust Search Parameters
Modify `match_count` and `similarity_threshold` in the API route for different search behavior.

## Troubleshooting

- **"No relevant information found"**: Check if your knowledge base is indexed properly
- **CORS errors**: Ensure your Framer site domain is allowed in the API response headers
- **Rate limiting**: Check your OpenAI API usage and billing
- **Vector search issues**: Verify the Supabase setup SQL was run correctly

## Support

For issues or questions, check the logs in Vercel dashboard or Supabase logs.
