// src/test-mcp.ts
import "dotenv/config";
import { listPosts, getPostBySlug, fetchFrontMatter, renderMarkdown, setPublished } from "./notion.js";
import { withWebsiteRepo, writePostFile, commitAndPush } from "./git.js";
import path from "node:path";

function fmYaml(fm: any) {
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

async function main() {
    const slug = process.argv[2] || "hello-world";

    console.log("1) listPosts():");
    console.log(await listPosts());

    console.log(`\n2) render '${slug}':`);
    const page = await getPostBySlug(slug);
    if (!page) throw new Error(`No Notion page for slug='${slug}'`);
    const fm = await fetchFrontMatter(page);
    const md = await renderMarkdown((page as any).id);
    console.log(fm);
    console.log(md.slice(0, 200) + "…");

    console.log("\n3) write to repo + push:");
    const rel = path.join(process.env.CONTENT_DIR || "content/posts", `${fm.slug}.md`);
    await withWebsiteRepo(async (repoDir) => {
        await writePostFile(repoDir, rel, `${fmYaml(fm)}\n\n${md}`);
        const res = await commitAndPush(repoDir, `chore(blog): publish ${fm.slug}`);
        console.log(res);
        return res;
    });

    console.log("\n4) setPublished true:");
    console.log(await setPublished(slug, true));
}

main().catch((e) => {
    console.error("test-mcp error:", e);
    process.exit(1);
});
