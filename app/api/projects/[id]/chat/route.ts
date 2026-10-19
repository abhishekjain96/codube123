import { NextRequest, NextResponse } from "next/server";
import { getProjectById, updateProjectData } from "@/lib/serverStore";
import { parseSiteV2, type SiteV2 } from "@/lib/siteTypes";
import { GoogleGenAI } from "@google/genai";

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
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let currentSite = parseSiteV2(project.siteJson);
    if (!currentSite) {
      return NextResponse.json({ reply: "Project loaded.", project });
    }

    let reply = `Applied changes based on: "${message}".`;

    // 1. Try Gemini if API key is present
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `You are an expert design & full-stack engineer in the Codube REA studio.
The user wants to update their website based on this prompt: "${message}".

Current site JSON:
${JSON.stringify(currentSite, null, 2)}

Instructions:
- Modify the site JSON appropriately (e.g., update copywriting, change colors/theme, add/adjust sections, update CTA buttons or branding).
- Maintain the SiteV2 JSON schema structure.
- In your response, provide ONLY valid JSON in this exact structure:
{
  "reply": "Brief 1-sentence friendly confirmation of what was changed",
  "site": <modified SiteV2 JSON>
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const text = response.text?.trim();
        if (text) {
          const start = text.indexOf("{");
          const end = text.lastIndexOf("}");
          if (start !== -1 && end > start) {
            const parsed = JSON.parse(text.slice(start, end + 1));
            if (parsed.site && Array.isArray(parsed.site.pages)) {
              currentSite = parsed.site as SiteV2;
              reply = parsed.reply || reply;
            }
          }
        }
      } catch (geminiError) {
        console.warn("Gemini chat processing fallback:", geminiError);
      }
    }

    // 2. Rule-based updates (fallbacks / fast paths)
    const lower = message.toLowerCase();
    if (lower.includes("dark mode") || lower.includes("dark theme") || lower.includes("make it dark")) {
      currentSite.theme.dark = true;
    } else if (lower.includes("light mode") || lower.includes("light theme") || lower.includes("make it light")) {
      currentSite.theme.dark = false;
    }

    const hexMatch = message.match(/#([0-9a-fA-F]{6})/);
    if (hexMatch) {
      currentSite.theme.primary = `#${hexMatch[1]}`;
    } else if (lower.includes("emerald") || lower.includes("green")) {
      currentSite.theme.primary = "#10b981";
    } else if (lower.includes("blue") || lower.includes("cyan")) {
      currentSite.theme.primary = "#06b6d4";
    } else if (lower.includes("purple") || lower.includes("violet")) {
      currentSite.theme.primary = "#8b5cf6";
    } else if (lower.includes("orange") || lower.includes("flame")) {
      currentSite.theme.primary = "#f97316";
    } else if (lower.includes("rose") || lower.includes("red") || lower.includes("pink")) {
      currentSite.theme.primary = "#f43f5e";
    }

    // Headline or brand update if specified
    const brandMatch = message.match(/call(?:ed)?\s+it\s+([A-Za-z0-9\s]+)/i) || message.match(/brand\s+(?:to|is)\s+([A-Za-z0-9\s]+)/i);
    if (brandMatch) {
      const newBrand = brandMatch[1].trim();
      currentSite.brand.name = newBrand;
    }

    // Save updated project state
    const updated = updateProjectData(id, {
      siteJson: JSON.stringify(currentSite),
      brand: currentSite.brand.name || project.brand,
      heading: currentSite.brand.name || project.heading,
      accent: currentSite.theme.primary || project.accent,
      dark: currentSite.theme.dark ?? project.dark,
    });

    return NextResponse.json({
      reply,
      project: updated,
    });
  } catch {
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
