import { NextRequest, NextResponse } from "next/server";
import { getMessages } from "@/lib/chatStore";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json([]);
  }

  return NextResponse.json(getMessages(userId));
}
