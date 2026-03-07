import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import scaleKit from "@/lib/scalekit";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
  try {
    const body = await req.text();

    const headers = Object.fromEntries(req.headers.entries());

    const secret = process.env.SCALEKIT_WEBHOOK_SECRET!;

    try {
      scaleKit.verifyWebhookPayload(secret, headers, body);
    } catch (error) {
      console.error("Webhook verification failed: ", error);
      return NextResponse.json({error: "Invalid signature"}, {status: 400});
    }

    const event = JSON.parse(body);

    switch(event.type){
      case "user_organization_membership_created":{
        const param = event.data;
        await db.update(teamMembers).set({status: 'active'}).where(eq(teamMembers.user_email, param.user.email));
        break;
      }

      default:
        console.log("Unhandled event type: ", event.type);
    }

    return NextResponse.json({success: true}, {status: 200});
  } catch (error) {
    console.error("Webhook processing error: ", error);
    return NextResponse.json({error: "Failed to process webhook"}, {status: 500});
  }
}