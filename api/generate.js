// api/generate.js
// You need to install: npm install node-fetch (if using older Node) or use native fetch in Node 18+

export default async function handler(request, response) {
  // 1. CORS Setup (Allow your frontend to talk to this backend)
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // 2. Validate Method
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = request.body;
    const apiKey = process.env.GEMINI_API_KEY; // Secure environment variable

    if (!apiKey) {
      throw new Error('Server API Key missing');
    }

    // 3. Call Google Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await geminiResponse.json();

    // 4. Return Data to Frontend
    return response.status(200).json(data);

  } catch (error) {
    console.error("Server Error:", error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}