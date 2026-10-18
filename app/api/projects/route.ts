import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, createNewProject } from "@/lib/serverStore";

export async function GET() {
  const list = getAllProjects();
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idea = body.idea?.trim();
    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }
    const project = createNewProject(idea);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
