import { db } from "@/db/client";
import { metadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest){
  try {
    const user = await isAuthorized();
    if(!user){
      return NextResponse.json({message: "Unauthorized"}, {status:401});
    };

    const [metadataRecord] = await db.select().from(metadata).where(eq(metadata.user_email, user.email));

    const organization = {
      ...(metadataRecord || []), id: user.organization_id,
    };

    return NextResponse.json({organization}, {status: 200});
  } catch (error) {
    console.error("Error fetching Workspace metadata: ", error);
    return NextResponse.json({
      error: "Failed to fetch Workspace metadata"
    }, {status: 500});
  }
}