import { db } from "@/db/client";
import { sections } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function DELETE(req:NextRequest){
  try {
    const user = await isAuthorized();
    if(!user){
      return NextResponse.json({message: "Unauthorized"}, {status:400});
    };

    const {id} = await req.json();

    if(!id) {
      return NextResponse.json({error: "Section ID is required"}, {status: 401});
    }

    const section = await db.select().from(sections).where(eq(sections.user_email, user.email));

    if(!section){
      return NextResponse.json({error: "You can't delete this section!"}, {status:404});
    }

    const res = await db.select().from(sections).where(eq(sections.id, id));

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error deleting section: ", error);
    return NextResponse.json({
      error: "Failed to delete section"
    }, {status: 500});
  }
}