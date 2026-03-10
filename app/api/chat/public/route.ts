import { db } from "@/db/client";
import { conversation, knowledge_source } from "@/db/schema";
import { messages as messagesTable } from "@/db/schema";
import { countConversationTokens } from "@/lib/countConversationTokens";
import { groq, openai, summarizeConversation, summarizeConversationGroq } from "@/lib/openAI";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function POST(req: Request){
  const authHeader = req.headers.get("Authorization");

  const token = authHeader?.split(" ")[1];
  if(!token){
    return NextResponse.json({error: "Missing token"}, {status: 400} );
  }

  let sessionId: string | undefined;
  let widgetId: string | undefined;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const {payload} = await jwtVerify(token, secret);
    sessionId = payload.sessionId as string;
    widgetId = payload.widgetId as string;

    if(!sessionId || !widgetId){
      throw new Error("Invalid Token Payload");
    }
  } catch (error) {
    console.error("Token Verification Failed: ", error);
    return NextResponse.json(
      {error: "Invalid or expired session token"},
      {status: 401},
    );
  }

  let {messages, knowledge_source_ids} = await req.json();

  const lastMessage = messages[messages.length -1];
  if (!lastMessage || lastMessage.role !== "user") {
    return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
  }

  try {
    const [existingConv] = await db.select().from(conversation).where(eq(conversation.id, sessionId)).limit(1);

    if(!existingConv){
      const forwardedFor = req.headers.get("x-forwarded-for");
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ||
        req.headers.get("x-real-ip") ||
        "Unknown IP";
      const visitorName = `#Visitor(${ip})`;

      await db.insert(conversation).values({
        id:sessionId,
        chatbot_id: widgetId,
        visitor_ip: ip,
        name: visitorName,
      });

      const previousMessages = messages.slice(0, -1);
      if(previousMessages.length > 0){
        await db.insert(messagesTable).values(
        previousMessages.map((msg:any)=>({
          conversation_id: sessionId,
          role: msg.role as "user" | "assistant",
          content: msg.content
        }))
      );
      }
    }

    if(lastMessage && lastMessage.role === "user"){
      await db.insert(messagesTable).values({
        conversation_id: sessionId,
        role: "user",
        content: lastMessage.content,
      });
    }

  } catch (error) {
    console.error("Database Persistence Error (User): ", error)
  }

  let context = "";
  if(knowledge_source_ids && knowledge_source_ids.length > 0){
    try {
      const sources = await db.select({content: knowledge_source.content}).from(knowledge_source).where(eq(knowledge_source.id, knowledge_source_ids));

      context = sources.map((s)=>s.content).filter(Boolean).join("\n\n");
    } catch (error) {
      console.error("RAG Retrieval Error: ", error);
    }
  }
  
  const tokenCount = countConversationTokens(messages);

  if(tokenCount > 6000){
    const recentMessages = messages.slice(-10);
    const olderMessages = messages.slice(0,-10);

    if(olderMessages.length > 0){
      const summary = await summarizeConversationGroq(olderMessages);

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
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [{role: "system", content: systemPrompt}, ...messages],
    //   temperature: 0.7,
    //   max_tokens: 200,
    // });
    const cleanMessages = messages.map((m:any) => ({
      role: m.role,
      content: m.content
    }));

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...cleanMessages
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const reply = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";

    try {
      await db.insert(messagesTable).values({
        conversation_id: sessionId,
        role: "assistant",
        content: reply,
      });
    } catch (error) {
      console.error("Database Persistence Error (AI): ", error);
    }

    return NextResponse.json({response: reply});
  } catch (error) {
    console.error("OpenAI Error: ", error);
    return NextResponse.json(
      {response: "An error occurred while processing your request."},
      {status: 500}
    );
  }

}