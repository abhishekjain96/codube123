import { NextRequest, NextResponse } from "next/server";
import { createProjectFromUrl, updateProjectData } from "@/lib/serverStore";
import { GoogleGenAI } from "@google/genai";
import { parseSiteV2 } from "@/lib/siteTypes";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body.url?.trim();
    const instructions = body.instructions?.trim();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 1. Generate base project using morluto/rea archetype & token engine
    const project = createProjectFromUrl(url, instructions);

    // 2. If GEMINI_API_KEY is available, enrich with deep LLM reverse-engineering insights
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `You are the REA (Reverse Engineering Agent) based on morluto/rea.
A user wants to reverse-engineer and redesign this website:
URL: ${url}
User Instructions: ${instructions || "Decompile design system, extract high-converting copy, and redesign into a modern Next.js App Router layout."}

Current base site JSON:
${project.siteJson}

Analyze the target URL and brand essence. Enhance the siteJson with:
1. Realistic, punchy, domain-specific headlines, subheadings, and CTAs tailored to this company or product.
2. Refined theme colors (primary hex, secondary hex, dark or light mode).
3. 3-4 distinct bento feature cards with concrete benefits.
4. Realistic stats proof points.

Return ONLY a valid JSON object matching the SiteV2 structure with:
{
  "brand": { "name": string, "tagline": string },
  "theme": { "primary": string, "secondary": string, "dark": boolean, "font": "modern" },
  "pages": [...]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const text = response.text?.trim();
        if (text) {
          const parsed = parseSiteV2(text);
          if (parsed) {
            updateProjectData(project.id, {
              siteJson: JSON.stringify(parsed),
              brand: parsed.brand.name || project.brand,
              heading: parsed.brand.name || project.heading,
              accent: parsed.theme.primary || project.accent,
              dark: parsed.theme.dark ?? project.dark,
            });
            project.siteJson = JSON.stringify(parsed);
            project.brand = parsed.brand.name;
            project.accent = parsed.theme.primary || project.accent;
            project.dark = parsed.theme.dark ?? project.dark;
          }
        }
      } catch (geminiError) {
        console.warn("Gemini REA enrichment skipped, using built-in engine:", geminiError);
      }
    }

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to reverse engineer URL" }, { status: 500 });
  }
}
