import { NextRequest, NextResponse } from "next/server";
import { updateProjectData } from "@/lib/serverStore";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = updateProjectData(id, { siteJson: body.siteJson });
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project site" }, { status: 500 });
  }
}
