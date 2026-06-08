import OpenAI from "openai";

let _openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!_openai) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error(
        "OPENAI_API_KEY is not configured. " +
        "Set it in your .env.local or Vercel environment variables."
      );
    }
    _openai = new OpenAI({ apiKey: key });
  }
  return _openai;
}

// Lazy proxy — only initializes when first method is called
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop: keyof OpenAI) {
    return getOpenAIClient()[prop];
  },
});

export async function generateProposalContent(
  prompt: string,
  tone: "professional" | "friendly" | "persuasive" = "professional"
) {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a professional proposal writer for freelancers and agencies. 
Write compelling, ${tone} proposal content that wins clients.
Format your response as structured sections with clear headings.
Be specific, confident, and value-focused.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content || "";
}