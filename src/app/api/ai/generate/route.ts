import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sectionType, context, tone = "professional" } = await req.json();

    if (!sectionType || !context) {
      return NextResponse.json(
        { error: "sectionType and context are required" },
        { status: 400 }
      );
    }

    const prompts: Record<string, string> = {
      cover: `Write a compelling proposal cover page with the following context:
Client: ${context.clientName || "[Client Name]"}
Project: ${context.projectTitle || "[Project Title]"}
Description: ${context.description || ""}

Write a brief, professional project description (2-3 sentences) that will appear on the cover page. Focus on value and outcomes.`,
      
      intro: `Write an introduction section for a proposal with this context:
Client: ${context.clientName || "[Client Name]"}
Your Expertise: ${context.expertise || "our team's expertise"}
Pain Points: ${context.painPoints || "the challenges they face"}

Write 2-3 paragraphs introducing your company, acknowledging the client's needs, and setting the stage for your solution. Be warm but professional.`,

      problem: `Write a "Problem Statement" section for a proposal. Context:
Client Industry: ${context.industry || "their industry"}
Challenges: ${context.challenges || "common challenges"}
Current Situation: ${context.situation || "the current situation"}

Write 2-3 paragraphs that demonstrate deep understanding of the client's challenges. Show empathy and insight.`,

      solution: `Write a "Our Solution" section for a proposal. Context:
Problem: ${context.problem || "the problem"}
Your Approach: ${context.approach || "our approach"}
Key Deliverables: ${context.deliverables || "key deliverables"}

Write 2-3 paragraphs describing your proposed solution. Be specific about methodology and approach.`,

      scope: `Write a "Scope of Work" section. Context:
Deliverables: ${context.deliverables || "deliverables"}
Timeline: ${context.timeline || "timeline"}
Milestones: ${context.milestones || "key milestones"}

Write a structured scope of work with clear deliverables and timeline. Use bullet points for clarity.`,

      timeline: `Write a "Project Timeline" section. Context:
Duration: ${context.duration || "project duration"}
Phases: ${context.phases || "project phases"}

Create a timeline overview with phases, key milestones, and estimated dates.`,

      pricing: `Write a "Investment/Pricing" section. Context:
Services: ${context.services || "services offered"}
Budget: ${context.budget || "the investment amount"}

Write a professional pricing section that presents the investment as a value-driven decision. Explain what's included.`,

      testimonial: `Write a "Testimonials" section with 2-3 fictional but realistic client testimonials relevant to ${context.industry || "the industry"}. Keep them concise (2-3 sentences each) and impactful.`,

      about: `Write an "About Us" section for a company that specializes in ${context.expertise || "professional services"}. Write 2 paragraphs about the team's mission, values, and expertise. Be authentic.`,

      cta: `Write a compelling "Call to Action" / "Next Steps" section that encourages the client to move forward. Include:
1. A clear next step
2. Contact information
3. An expression of enthusiasm about working together

Keep it warm, confident, and action-oriented.`,
    };

    const systemPrompt = `You are a professional proposal writer for freelancers and agencies. Write compelling, ${tone} content that wins clients. Be specific, confident, and value-focused. Format in clean markdown with clear headings.`;

    const userPrompt = prompts[sectionType] || `Write a ${sectionType} section for a business proposal. Context: ${JSON.stringify(context)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || "";

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate content" },
      { status: 500 }
    );
  }
}