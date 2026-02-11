import { NextRequest, NextResponse } from "next/server";
import { addMessage } from "@/lib/chatStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Webhook body:", JSON.stringify(body));

    const events = body.events || [];

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        addMessage({
          type: "oa",
          text: event.message.text,
          timestamp: Date.now(),
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
