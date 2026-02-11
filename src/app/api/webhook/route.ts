import { NextRequest, NextResponse } from "next/server";
import { addMessage } from "@/lib/chatStore";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const events = body.events || [];

  for (const event of events) {
    if (
      event.type === "message" &&
      event.message.type === "text"
    ) {
      const userId = event.source.userId;

      addMessage(userId, {
        type: "oa",
        text: event.message.text,
        timestamp: Date.now(),
      });
    }
  }

  return NextResponse.json({ status: "ok" });
}
