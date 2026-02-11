import { NextResponse } from "next/server";
import { getMessages } from "@/lib/chatStore";

export async function GET() {
  return NextResponse.json(getMessages());
}
