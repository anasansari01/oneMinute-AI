import { db } from "@/db/client";
import { chatBotMetadata, sections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const token = searchParams.get("token");

  if(!token){
    return NextResponse.json({error: "Missing token"}, {status: 401} );
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const {payload} = await jwtVerify(token, secret);
    const widgetId = payload.widgetId as string;
    const ownerEmail = payload.ownerEmail as string;

    const [meta] = (await db.select().from(chatBotMetadata).where(eq(chatBotMetadata.id, widgetId)).limit(1));

    if(!meta){
      return NextResponse.json({error: "Bot not found"}, {status: 404});
    }

    const userSections = await db.select().from(sections).where(eq(sections.user_email, ownerEmail));

    return NextResponse.json({metadata: meta, sections: userSections});
  } catch (error) {
    console.error("Config Fetch Error: ", error);
    return NextResponse.json(
      {error: "Invalid or expired token"},
      {status: 401},
    );
  }
}