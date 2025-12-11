import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { listPosts, getPostBySlug, fetchFrontMatter, renderMarkdown, setPublished } from "./notion.js";
import { withWebsiteRepo, writePostFile, commitAndPush } from "./git.js";
import path from "node:path";

// --- small helpers -----------------------------------------------------------
function asObject(v: unknown): Record<string, unknown> {
    if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
    return {};
}
function asString(v: unknown, name: string): string {
    if (typeof v !== "string" || !v.trim()) throw new Error(`Missing or invalid '${name}'`);
    return v.trim();
}
function asBooleanOptional(v: unknown): boolean | undefined {
    if (typeof v === "boolean") return v;
    return undefined;
}
function jsonText(obj: unknown) {
    return [{ type: "text", text: JSON.stringify(obj, null, 2) }] as const;
}
function frontMatterYaml(fm: any) {
    const q = (x: string) => `"${String(x).replace(/"/g, '\\"')}"`;
    const lines: string[] = ["---"];
    lines.push(`title: ${q(fm.title)}`);
    if (fm.date) lines.push(`date: ${fm.date}`);
    if (fm.tags?.length) lines.push(`tags: [${fm.tags.map(q).join(", ")}]`);
    lines.push(`slug: ${q(fm.slug)}`);
    lines.push(`published: ${fm.published ? "true" : "false"}`);
    if (fm.heroImage) lines.push(`heroImage: ${q(fm.heroImage)}`);
    lines.push("---");
    return lines.join("\n");
}
// ----------------------------------------------------------------------------

const server = new Server(
    { name: "notion-publisher", version: "0.1.0" },
    { capabilities: { tools: {} } }
);

// Advertise tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: "list_posts",
            description: "List posts; optional filter by published.",
            inputSchema: {
                type: "object",
                properties: { published: { type: "boolean" } },
                additionalProperties: false
            }
        },
        {
            name: "render_post",
            description: "Render a Notion page (by slug) to Markdown with YAML front-matter.",
            inputSchema: {
                type: "object",
                properties: { slug: { type: "string" } },
                required: ["slug"],
                additionalProperties: false
            }
        },
        {
            name: "publish",
            description: "Set the Published checkbox for a given slug.",
            inputSchema: {
                type: "object",
                properties: { slug: { type: "string" }, value: { type: "boolean" } },
                required: ["slug", "value"],
                additionalProperties: false
            }
        },
        {
            name: "push_post",
            description: "Render a post by slug, write it into the website repo, and push a commit.",
            inputSchema: {
                type: "object",
                properties: { slug: { type: "string" } },
                required: ["slug"],
                additionalProperties: false
            }
        }
    ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: rawArgs } = request.params;
    const args = asObject(rawArgs);

    switch (name) {
        case "list_posts": {
            const published = asBooleanOptional(args.published);
            const posts = await listPosts(published);
            return { content: jsonText({ posts }) };
        }

        case "render_post": {
            const slug = asString(args.slug, "slug");
            const page = await getPostBySlug(slug);
            if (!page) throw new Error(`No Notion page found for slug='${slug}'`);
            const fm = await fetchFrontMatter(page);
            const mdBody = await renderMarkdown((page as any).id);
            const md = `${frontMatterYaml(fm)}\n\n${mdBody}`;
            return { content: jsonText({ frontMatter: fm, md }) };
        }

        case "publish": {
            const slug = asString(args.slug, "slug");
            const value = typeof args.value === "boolean" ? args.value : (() => { throw new Error("Missing 'value' (boolean)"); })();
            const result = await setPublished(slug, value);
            return { content: jsonText(result) };
        }

        case "push_post": {
            const slug = asString(args.slug, "slug");
            const page = await getPostBySlug(slug);
            if (!page) throw new Error(`No Notion page found for slug='${slug}'`);
            const fm = await fetchFrontMatter(page);
            if (!fm.slug) throw new Error("Slug property on the Notion page is empty.");
            const mdBody = await renderMarkdown((page as any).id);
            const rel = path.join(process.env.CONTENT_DIR || "content/posts", `${fm.slug}.md`);
            const content = `${frontMatterYaml(fm)}\n\n${mdBody}`;

            const result = await withWebsiteRepo(async (repoDir) => {
                await writePostFile(repoDir, rel, content);
                return commitAndPush(repoDir, `chore(blog): publish ${fm.slug}`);
            });

            return { content: jsonText({ file: rel, result }) };
        }

        default:
            throw new Error(`Unknown tool: ${name}`);
    }
});

// stdio transport (MCP)
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP server started over stdio");
}
main().catch((e) => {
    console.error("Startup error:", e);
});
