import OpenAI from "openai";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const customFetch = (url: RequestInfo | URL, init?: RequestInit) => {
  return fetch(url, {
    ...init,
    agent: url.toString().startsWith("https") ? agent : undefined,
  } as any);
};

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: customFetch,
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function summarizeMarkdown(markdown: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      max_completion_tokens: 900,
      messages: [
        {
          role: "system",
          content: `

You are a data summarization engine for an AI chatbot.

Your task:

- Convert the input website markdown or text or csv files data into a CLEAN, DENSE SUMMARY for LLM context usage.

STRICT RULES:

- Output ONLY plain text (no markdown, no bullet points, no headings).
- Write as ONE continuous paragraph.
- Remove navigation, menus, buttons, CTAs, pricing tables, sponsors, ads, testimonials, community chats, UI labels, emojis, and decorative content.
- Remove repetition and marketing language.
- Keep ONLY factual, informational content that helps answer customer support questions.
- Do NOT copy sentences verbatim unless absolutely necessary.
- Compress aggressively while preserving meaning.
- The final output MUST be under 2000 words.

The result will be stored as long-term context for a chatbot.

`,
        },
        {
          role: "user",
          content: markdown,
        },
      ],
    });

    return completion.choices[0].message.content?.trim() ?? "";
  } catch (error) {
    console.error("Error in summarizeMarkdown:", error);
    throw error;
  }
}

export async function summarizeConversation(messages: any[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "Summarize the following conversation history into a concise paragraph, preserving key details and user intent.The final output MUST be under 2000 words.",
        },
        ...messages,
      ],
    });

    return completion.choices[0].message.content?.trim() ?? "";
  } catch (error) {
    console.error("Error in summarizeConversation:", error);
    throw error;
  }
}