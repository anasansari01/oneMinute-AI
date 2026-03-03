import { db } from "@/db/client";
import { chatBotMetadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req:NextRequest) {
  try {
    const user = await isAuthorized();
    if(!user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    
    const body = await req.json();
    const {color, welcome_message} = body;

    if(!color || !welcome_message){
      return NextResponse.json({
        error: "Missing required fields"
      },{status: 400});
    }

    const [updatedMetadata] = await db.update(chatBotMetadata).set({
      color,
      welcome_message,
    }).where(eq(chatBotMetadata.user_email, user.email!)).returning();

    
    return NextResponse.json(updatedMetadata, {status:200});
  } catch (error) {
    console.error("Failed to update chatbot metadata: ", error);
      return NextResponse.json({error: "Internal Server Error"},
        {status: 500}
    );
  }
}