import { NextRequest, NextResponse } from "next/server";
import { generateSiteFromIdea } from "@/lib/serverStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idea = body.idea || "Modern SaaS platform";
    const site = generateSiteFromIdea(idea);
    return NextResponse.json(site);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate site" }, { status: 500 });
  }
}
