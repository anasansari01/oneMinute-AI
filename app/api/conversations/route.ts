import { db } from "@/db/client";
import { chatBotMetadata, conversation, messages } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { desc, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
  try {
    const user = await isAuthorized();
    if(!user){
      return NextResponse.json({message: "Unauthorized"}, {status:401});
    };

    const bots = await db.select().from(chatBotMetadata).where(eq(chatBotMetadata.user_email, user.email));

    if(bots.length === 0) {
      return NextResponse.json({conversation: []});
    }

    const botIds = bots.map((b)=>b.id);

    const convs = await db.select().from(conversation).where(inArray(conversation.chatbot_id, botIds)).orderBy(desc(conversation.created_at));

    const data = await Promise.all(convs.map(async (c)=> {
      const [lastMsg] = await db.select().from(messages).where(eq(messages.conversation_id, c.id)).orderBy(desc(messages.created_at)).limit(1);

      let timeDisplay = "";
      const ts = lastMsg?.created_at || c.created_at;
      if(ts) {
        const date = new Date(ts);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs/60000);
        const diffHours = Math.floor(diffMins/60);
        if(diffMins<60) timeDisplay = `${diffMins}m ago`;
        else if(diffHours<24) timeDisplay = `${diffHours}h ago`;
        else timeDisplay = date.toLocaleDateString();
      }

      return {
        id: c.id,
        user: c.name || "Visitor",
        lastMessage: lastMsg?.content || "Started conversation",
        status: "active",
        time: timeDisplay,
        visitor_ip: c.visitor_ip,
      }
    }));

    return NextResponse.json({conversations: data});
  } catch (error) {
    console.error("Dashboard Conversation Error: ", error);
    return NextResponse.json({
      error: "Internal Server Error"
    }, {status: 500});
  }
}