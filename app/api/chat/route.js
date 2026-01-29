export async function POST(request) {
  try {
    const body = await request.json();
    const apiBase =
      process.env.CHAT_API_URL || "https://carmah-rag-chat.vercel.app";
    const response = await fetch(`${apiBase}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json(
      { response: "Chat backend error. Please try again." },
      { status: 500 }
    );
  }
}
