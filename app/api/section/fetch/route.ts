import { db } from "@/db/client";
import { sections } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest){
  try {
    const user = await isAuthorized();
    if(!user){
      return NextResponse.json({message: "Unauthorized"}, {status:400});
    };

    const res = await db.select().from(sections).where(eq(sections.user_email, user.email));
    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching sections: ", error);
    return NextResponse.json({
      error: "Failed to fetch sections"
    }, {status: 500});
  }
}