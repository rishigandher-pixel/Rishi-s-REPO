import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateProposalContent(
  prompt: string,
  tone: "professional" | "friendly" | "persuasive" = "professional"
) {
  const response = await openai.chat.completions.create({
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