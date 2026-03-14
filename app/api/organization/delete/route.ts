import { db } from "@/db/client";
import { 
  user, 
  metadata, 
  knowledge_source, 
  sections, 
  chatBotMetadata, 
  teamMembers, 
  conversation, 
  messages, 
  widgets 
} from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const userData = await isAuthorized();
    if (!userData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = userData.email;
    const organizationId = userData.organization_id;

    const conversations = await db
      .select()
      .from(conversation)
      .where(eq(conversation.user_email, userEmail));
    
    for (const conv of conversations) {
      await db.delete(messages).where(eq(messages.conversation_id, conv.id));
    }

    await db.delete(conversation).where(eq(conversation.user_email, userEmail));
    await db.delete(teamMembers).where(eq(teamMembers.user_email, userEmail));

    if (organizationId) {
      await db.delete(widgets).where(eq(widgets.organization_id, organizationId));
    }

    await db.delete(sections).where(eq(sections.user_email, userEmail));
    await db.delete(knowledge_source).where(eq(knowledge_source.user_email, userEmail));
    await db.delete(chatBotMetadata).where(eq(chatBotMetadata.user_email, userEmail));
    await db.delete(metadata).where(eq(metadata.user_email, userEmail));
    await db.delete(user).where(eq(user.email, userEmail));

    const response = NextResponse.json(
      { 
        success: true, 
        message: "Workspace deleted successfully" 
      }, 
      { status: 200 }
    );

    response.cookies.delete('user_session');
    response.cookies.delete('metadata');
    response.cookies.delete('sk_state');
    response.cookies.delete('__next_hmr_refresh_hash__');

    return response;

  } catch (error) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete workspace",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }, 
      { status: 500 }
    );
  }
}