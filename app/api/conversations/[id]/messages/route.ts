import { db } from "@/db/client";
import { chatBotMetadata, conversation, messages } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, {params}: {params: Promise<{id: string}>}){
  try {
    const user = await isAuthorized();
    if(!user){
      return NextResponse.json({message: "Unauthorized"}, {status:401});
    };

    const {id: conversationId} = await params;

    const [conv] = await db.select().from(conversation).where(eq(conversation.id, conversationId));
    if(!conv) return NextResponse.json({error: "Not found"}, {status: 404});

    const bots = await db.select().from(chatBotMetadata).where(and(eq(chatBotMetadata.user_email, user.email), eq(chatBotMetadata.id, conv.chatbot_id)));

    if(!bots) {
      return NextResponse.json({error: "Forbidden"}, {status: 403});
    }

    const msgs = await db.select().from(messages).where(eq(messages.conversation_id, conversationId)).orderBy(asc(messages.created_at));

    return NextResponse.json({messages: msgs});
  } catch (error) {
    console.error("Fetch Messages Error: ", error);
    return NextResponse.json({
      error: "Internal Server Error"
    }, {status: 500});
  }
}