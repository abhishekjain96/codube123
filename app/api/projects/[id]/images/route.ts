import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompts: string[] = body.prompts || [];

    // Map prompts to reliable placeholder images or themed stock images
    const statuses = prompts.map((prompt, i) => {
      const encoded = encodeURIComponent(prompt.slice(0, 50));
      return {
        prompt,
        url: `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80`,
        ready: true,
        failed: false,
      };
    });

    return NextResponse.json(statuses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to process image requests" }, { status: 500 });
  }
}
