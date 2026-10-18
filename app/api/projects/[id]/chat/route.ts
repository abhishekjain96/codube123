import { NextRequest, NextResponse } from "next/server";
import { getProjectById, updateProjectData } from "@/lib/serverStore";
import { parseSiteV2 } from "@/lib/siteTypes";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const message = body.message?.trim() || "";

    // Parse current site or fallback
    let currentSite = parseSiteV2(project.siteJson);
    if (currentSite) {
      // Modify theme or heading based on message if mentioned
      const lower = message.toLowerCase();
      if (lower.includes("dark")) {
        currentSite.theme.dark = true;
      } else if (lower.includes("light")) {
        currentSite.theme.dark = false;
      }

      if (lower.includes("blue")) {
        currentSite.theme.primary = "#2563eb";
      } else if (lower.includes("green")) {
        currentSite.theme.primary = "#059669";
      } else if (lower.includes("purple")) {
        currentSite.theme.primary = "#8b5cf6";
      } else if (lower.includes("orange")) {
        currentSite.theme.primary = "#f97316";
      }

      // Update project siteJson
      const updated = updateProjectData(id, {
        siteJson: JSON.stringify(currentSite),
        accent: currentSite.theme.primary,
        dark: currentSite.theme.dark,
      });

      return NextResponse.json({
        reply: `Done! I've updated the website design based on: "${message}".`,
        project: updated,
      });
    }

    return NextResponse.json({
      reply: "Updated your website.",
      project,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
