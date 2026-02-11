import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/chatStore";

export async function GET() {
  return NextResponse.json(getAllUsers());
}
