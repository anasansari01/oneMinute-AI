import { db } from "@/db/client";
import { knowledge_source } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { summarizeMarkdownGroq } from "@/lib/openAI";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let type: string;
    let body: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      type = formData.get("type") as string;

      if (type === "upload") {
        const file = formData.get("file") as File;

        if (!file) {
          return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
        }

        if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
          return NextResponse.json({ error: "Only CSV files are allowed" }, { status: 400 });
        }

        const fileContent = await file.text();

        const lines = fileContent
          .split("\n")
          .filter((line) => line.trim().length > 0);

        const headers =
          lines.length > 0
            ? lines[0].split(",").map((h) => h.trim())
            : [];

        const existingSource = await db.query.knowledge_source.findFirst({
          where: and(
            eq(knowledge_source.user_email, user.email),
            eq(knowledge_source.name, file.name),
            eq(knowledge_source.type, "upload")
          ),
        });

        if (existingSource) {
          return NextResponse.json(
            { error: "A file with this name already exists in your knowledge base" },
            { status: 400 }
          );
        }

        const markdown = await summarizeMarkdownGroq(fileContent);

        await db.insert(knowledge_source).values({
          user_email: user.email,
          type: "upload",
          name: file.name,
          status: "active",
          content: markdown,
          meta_data: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            rowCount: lines.length - 1,
            headers: headers,
          }),
        });

        return NextResponse.json(
          { message: "CSV file uploaded successfully" },
          { status: 200 }
        );
      }

      if (type === "website") {
        const url = formData.get("url") as string;
        body = { type: "website", url };
      }

      if (type === "text") {
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;

        body = {
          type: "text",
          title,
          content,
        };
      }
    } else {
      body = await req.json();
      type = body.type;
    }

    if (type === "website") {
      if (!body.url) {
        return NextResponse.json({ error: "No URL provided" }, { status: 400 });
      }

      const existingSource = await db.query.knowledge_source.findFirst({
        where: and(
          eq(knowledge_source.user_email, user.email),
          eq(knowledge_source.source_url, body.url),
          eq(knowledge_source.type, "website")
        ),
      });

      if (existingSource) {
        return NextResponse.json(
          { error: "This website is already in your knowledge base" },
          { status: 400 }
        );
      }

      const zenUrl = new URL("https://api.zenrows.com/v1/");

      zenUrl.searchParams.set("apikey", process.env.ZENROWS_API_KEY!);
      zenUrl.searchParams.set("url", body.url);
      zenUrl.searchParams.set("response_type", "markdown");
      zenUrl.searchParams.set("js_render", "true");
      zenUrl.searchParams.set("premium_proxy", "true");

      const res = await fetch(zenUrl.toString(), {
        headers: {
          "User-Agent": "OneMinuteSupportBot/1.0",
        },
      });

      const html = await res.text();

      if (!res.ok) {
        return NextResponse.json(
          {
            error: "ZenRows request failed",
            status: res.status,
            body: html.slice(0, 500),
          },
          { status: 502 }
        );
      }

      if (!html) {
        return NextResponse.json(
          { error: "Failed to fetch website content" },
          { status: 502 }
        );
      }

      const markdown = await summarizeMarkdownGroq(html);

      await db.insert(knowledge_source).values({
        user_email: user.email,
        type: "website",
        name: body.url,
        status: "active",
        source_url: body.url,
        content: markdown,
      });
    } else if (type === "text") {
      if (!body.title || !body.content) {
        return NextResponse.json(
          { error: "Title and content are required" },
          { status: 400 }
        );
      }

      const existingSource = await db.query.knowledge_source.findFirst({
        where: and(
          eq(knowledge_source.user_email, user.email),
          eq(knowledge_source.name, body.title),
          eq(knowledge_source.type, "text")
        ),
      });

      if (existingSource) {
        return NextResponse.json(
          { error: "A source with this title already exists" },
          { status: 400 }
        );
      }

      let content = body.content;

      if (body.content.length > 500) {
        content = await summarizeMarkdownGroq(body.content);
      }

      await db.insert(knowledge_source).values({
        user_email: user.email,
        type: "text",
        name: body.title,
        status: "active",
        content: content,
      });
    }

    return NextResponse.json(
      { message: "Source added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in knowledge store:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}