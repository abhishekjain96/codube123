import { NextRequest, NextResponse } from "next/server";
import { McpClient } from "@/lib/mcp/mcpClient";
import { getAllComponents } from "@/lib/mcp/componentDatabase";

export async function GET() {
  const tools = McpClient.getRegisteredTools();
  return NextResponse.json({
    name: "vibecoder-mcp-server",
    version: "1.0.0",
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: {},
      resources: {},
    },
    tools,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Standard MCP JSON-RPC routing
    const method = body.method || (body.tool ? "tools/call" : "tools/list");

    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id ?? 1,
        result: {
          tools: McpClient.getRegisteredTools(),
        },
      });
    }

    if (method === "tools/call") {
      const toolName = body.params?.name || body.tool;
      const toolArgs = body.params?.arguments || body.arguments || {};

      const response = await McpClient.executeTool({
        tool: toolName,
        arguments: toolArgs,
      });

      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id ?? 1,
        result: response,
      });
    }

    if (method === "resources/list") {
      const components = getAllComponents();
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id ?? 1,
        result: {
          resources: components.map((c) => ({
            uri: `ui://components/${c.id}`,
            name: c.name,
            mimeType: "text/x-typescript",
            description: c.description,
          })),
        },
      });
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      id: body.id ?? 1,
      error: { code: -32601, message: `Method not found: ${method}` },
    }, { status: 404 });
  } catch (error) {
    return NextResponse.json({
      jsonrpc: "2.0",
      id: 1,
      error: { code: -32603, message: error instanceof Error ? error.message : "Internal error" },
    }, { status: 500 });
  }
}
