import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/serverStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const auth = authenticate(email, password || "");
    return NextResponse.json(auth);
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
