import { NextRequest, NextResponse } from "next/server";
import { addMessage, addUserIfNotExists } from "@/lib/chatStore";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const events = body.events || [];

  for (const event of events) {
    if (
      event.type === "message" &&
      event.message.type === "text"
    ) {
      const userId = event.source.userId;

      // 🔥 ดึง profile จาก LINE
      const profileRes = await fetch(
        `https://api.line.me/v2/bot/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          },
        }
      );

      const profile = await profileRes.json();

      // สร้าง user ถ้ายังไม่มี
      addUserIfNotExists(
        userId,
        profile.displayName || "Unknown",
        profile.pictureUrl
      );

      // เก็บข้อความจาก user
      addMessage(userId, {
        type: "user",
        text: event.message.text,
        timestamp: Date.now(),
      });
    }
  }

  return NextResponse.json({ status: "ok" });
}
