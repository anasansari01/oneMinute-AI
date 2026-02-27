import { db } from "@/db/client";
import { sections } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function DELETE(req: NextRequest) {
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Section ID is required" },
        { status: 400 }
      );
    }

    const section = await db
      .select()
      .from(sections)
      .where(eq(sections.id, id));

    if (!section.length) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    if (section[0].user_email !== user.email) {
      return NextResponse.json(
        { error: "You can't delete this section!" },
        { status: 403 }
      );
    }

    await db.delete(sections).where(eq(sections.id, id));

    return NextResponse.json({ message: "Section deleted successfully" });

  } catch (error) {
    console.error("Error deleting section: ", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}