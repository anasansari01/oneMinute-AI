import { db } from "@/db/client";
import { chatBotMetadata } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { SignJWT } from 'jose'

export async function POST(req:Request) {
  try {
    const {widget_id} = await req.json();
    if(!widget_id){
      return NextResponse.json({error: "Missing widget_id"}, {status: 404});
    }

    //verify widget exists
    const [bot] = await db.select().from(chatBotMetadata).where(eq(chatBotMetadata.id, widget_id)).limit(1);

    if(!bot){
      return NextResponse.json({error: "Widget not found"}, {status: 404});
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const sessionId = crypto.randomUUID();

    const token = await new SignJWT({widgetId: bot.id, ownerEmail: bot.user_email, sessionId})
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

    return NextResponse.json({token});
  } catch (error) {
    console.error("Session Error: ", error);
    return NextResponse.json(
      {error: "Internal Server Error"},
      {status: 500},
    );
  }
}