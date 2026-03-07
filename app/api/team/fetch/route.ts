import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(){
  try {
    const user = await isAuthorized();
    if(!user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    
    const teamMembersData = await db.select({
      id: teamMembers.id,
      name: teamMembers.name,
      user_email: teamMembers.user_email,
      role: teamMembers.role,
      status: teamMembers.status,
      created_at: teamMembers.created_at,
    }).from(teamMembers).where(eq(teamMembers.organization_id, user.organization_id));

    return NextResponse.json({team: teamMembersData}, {status:200});
  } catch (error) {
    return NextResponse.json(
      {error: "Failed to fetch team members"},
      {status: 200},
    )
  }
}