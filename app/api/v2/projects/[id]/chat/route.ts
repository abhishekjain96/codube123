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
    const { slug, message } = body;

    const currentSite = parseSiteV2(project.siteJson);
    if (currentSite) {
      const page = currentSite.pages.find((p) => p.slug === slug);
      if (page) {
        // Tweak page title or subtitle if mentioned
        const heroSection = page.sections.find(
          (s) => s.type === "hero-split" || s.type === "hero-center"
        );
        if (heroSection?.props) {
          heroSection.props.subtitle = `Updated for: ${message}`;
        }
      }

      const updated = updateProjectData(id, {
        siteJson: JSON.stringify(currentSite),
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Failed to edit page" }, { status: 500 });
  }
}
