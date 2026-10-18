import { NextRequest, NextResponse } from "next/server";
import { createProjectFromUrl, generateSiteFromUrl } from "@/lib/serverStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body.url?.trim();
    const instructions = body.instructions?.trim();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Generate and store the reverse engineered project
    const project = createProjectFromUrl(url, instructions);

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reverse engineer URL" }, { status: 500 });
  }
}
