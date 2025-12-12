import "dotenv/config";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// This spawns your server for the test run.
// If you already run the server in another terminal, that's fine too — this will start a fresh one.
const transport = new StdioClientTransport({
    command: process.platform === "win32" ? "npx.cmd" : "npx",
    args: ["-y", "tsx", "src/index.ts"],
    env: process.env
});

const client = new Client({ name: "tester", version: "0.1.0" }, { capabilities: {} });

async function main() {
    await client.connect(transport);

    // 1) List tools
    const tools = await client.listTools();
    console.log("\n== Tools ==");
    console.log(JSON.stringify(tools, null, 2));

    // 2) Call list_posts (adjust published as needed)
    const list = await client.callTool({
        name: "list_posts",
        arguments: { published: false }
    });
    console.log("\n== list_posts ==");
    console.log(JSON.stringify(list, null, 2));

    // 3) Try render_post on a known slug (set one in Notion first)
    const slug = process.env.TEST_SLUG || "hello-world";
    const rendered = await client.callTool({
        name: "render_post",
        arguments: { slug }
    });
    console.log("\n== render_post ==");
    console.log(JSON.stringify(rendered, null, 2));

    // 4) Push to your website repo (writes markdown + commits)
    const pushed = await client.callTool({
        name: "push_post",
        arguments: { slug }
    });
    console.log("\n== push_post ==");
    console.log(JSON.stringify(pushed, null, 2));

    await client.close();
}

main().catch((e) => {
    console.error("Test error:", e);
    process.exit(1);
});
