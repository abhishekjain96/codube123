import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "acoopa-backend",
    status: "ok",
    time: new Date().toISOString(),
  });
}
