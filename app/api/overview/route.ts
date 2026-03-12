import { db } from "@/db/client";
import { chatBotMetadata, conversation, knowledge_source, messages, sections } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { count, desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(){
  try {
    const user = await isAuthorized();
    if(!user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const bots = await db.select().from(chatBotMetadata).where(eq(chatBotMetadata.user_email, user.email));

    const botIds = bots?.map((b)=>b.id);

    const ks = await db.select({
      type: knowledge_source.type,
      count: count(),
    }).from(knowledge_source).where(eq(knowledge_source.user_email, user.email)).groupBy(knowledge_source.type);

    const knowledgeStats = {
      website: 0,
      upload: 0,
      text: 0,
      total: 0,
    }

    ks.forEach((k)=>{
      if(k.type === "website") knowledgeStats.website += k.count;
      if(k.type === "text") knowledgeStats.text += k.count;
      if(k.type === "upload") knowledgeStats.upload += k.count;
      knowledgeStats.total += k.count;
    });

    const recentSections = await db.select().from(sections).where(eq(sections.user_email, user.email));

    const sectionStats = {
      total: recentSections.length,
      list: recentSections.map((s)=>({
        name: s.name,
        sourceCount: s.source_ids.length,
        tone: s.tone,
      })),
    };

    const [totalSections] = await db.select({value: count()}).from(sections).where(eq(sections.user_email, user.email));
    sectionStats.total = totalSections.value;

    let recentChats: {title: string, snippet: string; time: string}[] = [];
    let totalConversations = 0;

    if(botIds.length > 0){
      const rawConvs = await db.select().from(conversation).where(inArray(conversation.chatbot_id, botIds)).orderBy(desc(conversation.created_at)).limit(5);

      totalConversations = rawConvs.length;

      recentChats = await Promise.all(rawConvs.map(async (c)=> {
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
        title: c.name || "Visitor Chat",
        snippet: lastMsg?.content || "No interactions yet",
        time: timeDisplay,
      }
      }));

      if(totalConversations>0 && totalConversations<5){

      }else if(totalConversations === 5){
        const [t] = await db.select({value: count()}).from(conversation).where(inArray(conversation.chatbot_id, botIds));
        totalConversations = t.value;
      }
    }


    return NextResponse.json({
      botId: botIds[0] || null,
      knowledge: knowledgeStats,
      sections: sectionStats,
      chats: recentChats,
      counts: {
        knowledge: knowledgeStats.total,
        sections: sectionStats.total,
        conversations: totalConversations
      }
    }, {status:200});
  } catch (error) {
    console.error("Dashboard Overview Error: ", error);
    return NextResponse.json(
      {error: "Internal Server Error"},
      {status: 500},
    )
  }
}