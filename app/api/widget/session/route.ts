import { db } from "@/db/client";
import { chatBotMetadata } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { widget_id } = await req.json();

    if (!widget_id) {
      return NextResponse.json(
        { error: "Missing widget_id" },
        { status: 400 }
      );
    }

    const [bot] = await db
      .select()
      .from(chatBotMetadata)
      .where(eq(chatBotMetadata.id, widget_id))
      .limit(1);

    if (!bot) {
      return NextResponse.json(
        { error: "Widget not found" },
        { status: 404 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const sessionId = crypto.randomUUID();

    const token = await new SignJWT({
      widgetId: widget_id,
      ownerEmail: bot.user_email,
      sessionId,
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    const response = NextResponse.json({ token });
    
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;

  } catch (error) {
    console.error("Session Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}