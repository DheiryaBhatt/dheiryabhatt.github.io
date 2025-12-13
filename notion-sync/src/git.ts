import path from "node:path";
import fs from "node:fs/promises";
import simpleGit from "simple-git";


export async function withWebsiteRepo<T>(fn: (repoDir: string) => Promise<T>) {
    const repoUrl = process.env.GIT_REPO!;
    const branch = process.env.BRANCH || "main";
    const tmp = path.join(process.cwd(), ".site-repo");
    const git = simpleGit();


    // Fresh clone or pull
    try {
        await fs.rm(tmp, { recursive: true, force: true });
    } catch { }
    await git.clone(repoUrl, tmp, ["--branch", branch]);


    // Configure identity (if pushing via HTTPS with token)
    const git2 = simpleGit({ baseDir: tmp });
    await git2.addConfig("user.name", process.env.GIT_USERNAME || "mcp-bot");
    await git2.addConfig("user.email", process.env.GIT_EMAIL || "bot@example.com");


    const res = await fn(tmp);


    return res;
}


export async function writePostFile(repoDir: string, relPath: string, content: string) {
    const full = path.join(repoDir, relPath);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, content, "utf8");
}


export async function commitAndPush(repoDir: string, message: string) {
    const git = simpleGit({ baseDir: repoDir });
    await git.add(".");
    const status = await git.status();
    if (status.staged.length === 0) return { pushed: false, reason: "no changes" };
    await git.commit(message);
    // If using HTTPS with token, embed token in origin
    const origin = process.env.GIT_REPO!;
    const token = process.env.GITHUB_TOKEN;
    if (token && origin.startsWith("https://")) {
        const withCreds = origin.replace("https://", `https://${token}@`);
        await git.remote(["set-url", "origin", withCreds]);
    }
    await git.push();
    return { pushed: true };
}