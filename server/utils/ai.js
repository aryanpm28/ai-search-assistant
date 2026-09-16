const OpenAI = require('openai');
const { searchWikipedia } = require('./wikipedia');

// Using Groq (OpenAI-compatible API)
// Your key starts with gsk_ → this is a Groq key
const groq = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // we keep the same env name for simplicity
  baseURL: 'https://api.groq.com/openai/v1'
});

/**
 * Generate an AI answer with Wikipedia sources
 */
async function generateAnswer(userMessage, history = []) {
  // Search Wikipedia for relevant sources
  const sources = await searchWikipedia(userMessage, 3);

  // Build system prompt
  let systemPrompt = `You are a helpful and friendly AI assistant. 
Answer the user's question clearly and in a natural, human way.
If you have Wikipedia sources, use them and mention the source titles.
Keep answers concise but informative. Use markdown when helpful (lists, bold, etc).`;

  if (sources.length > 0) {
    systemPrompt += `\n\nHere are some Wikipedia sources you can use:\n`;
    sources.forEach((s, i) => {
      systemPrompt += `${i + 1}. ${s.title}: ${s.snippet}\n`;
    });
  }

  // Build conversation messages
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage }
  ];

  // Call Groq - using a currently available model
  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages,
    temperature: 0.7,
    max_tokens: 800
  });

  const answer = completion.choices[0].message.content;

  return { answer, sources };
}

module.exports = { generateAnswer };
