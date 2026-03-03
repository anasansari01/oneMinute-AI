import { db } from "@/db/client";
import { knowledge_source } from "@/db/schema";
import { countConversationTokens } from "@/lib/countConversationTokens";
import { isAuthorized } from "@/lib/isAuthorized";
import { openai, summarizeConversation } from "@/lib/openAI";
import { inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
  const user = await isAuthorized();
  if(!user) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }
  
  let {messages, knowledge_source_ids} = await req.json();

  let context = "";

  if(knowledge_source_ids && knowledge_source_ids.length > 0) {
    const sources = await db.select({
      content: knowledge_source.content,
    }).from(knowledge_source).where(inArray(knowledge_source.id, knowledge_source_ids));

    context = sources.map((s)=> s.content).filter(Boolean).join("\n\n");
  }

  const tokenCount = countConversationTokens(messages);

  if(tokenCount > 6000){
    const recentMessages = messages.slice(-10);
    const olderMessages = messages.slice(0, -10);

    if(olderMessages > 0){
      const summary = await summarizeConversation(olderMessages);

      context = `PREVIOUS CONVERSATION SUMMARY:\n${summary} \n\n` + context;

      messages = recentMessages;
    }
  }

    const systemPrompt = `Your name is Sarah. You are a friendly, human-like customer support specialist.
      
      CRITICAL RULES: 
      - If asked for your name, always respond with "I'm Sarah".
      - If asked for your role, always respond with "I'm customer support specialist".
      - keep answers EXTREMELY SHORT (max 1-2 sentences) and conversational.
      - If the user asks a broad question, DO NOT provide summary. Instead, ask a friendly clarifying question to understand exactly what they need help with.
      - Never dump information. Always conversationally guide the user to the specific answer they need.
      - Mirror the user's brevity.

      ESCALATION PROTOCOL:
      - If you simply DON'T KNOW the answer from the context, or if the user indicates they are unhappy, ask: "Would you like me to create a support ticket for our specialist team?"
      - If the user says "Yes" or gives permission to create ticket, your reply MUST be: "[ESCALATED] I have created a support ticket. Our specialist team will review your request and get back to you shortly."

      Context:
      ${context}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{role: "system", content: systemPrompt}, ...messages],
        temperature: 0.7,
        max_tokens: 200,
      });

      const reply = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";

      return NextResponse.json({response: reply});
    } catch (error) {
      console.error("OpenAI Error: ", error);
      return NextResponse.json(
        {response: "An error occurred while processing your request."},
        {status: 500}
      );
    }

  return NextResponse.json({}, {status:200});
}