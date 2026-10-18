import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/serverStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }
    const auth = createUser(name || "Creator", email, password);
    return NextResponse.json(auth);
  } catch (error) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
