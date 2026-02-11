import { NextRequest, NextResponse } from "next/server";
import { addMessage } from "@/lib/chatStore";

export async function POST(req: NextRequest) {
  const { message, userId } = await req.json();

  addMessage(userId, {
    type: "oa",
    text: message,
    timestamp: Date.now(),
  });

  await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text: message }],
    }),
  });

  return NextResponse.json({ success: true });
}
