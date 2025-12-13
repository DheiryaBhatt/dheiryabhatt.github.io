import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";


const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });


export type PostFrontMatter = {
    title: string;
    slug: string;
    date?: string;
    tags?: string[];
    heroImage?: string | null;
    published: boolean;
};


export async function listPosts(published?: boolean) {
    const dbId = process.env.NOTION_DATABASE_ID!;
    const filter = published === undefined ? undefined : {
        property: "Published",
        checkbox: { equals: published }
    } as any;
    const res = await notion.databases.query({ database_id: dbId, filter });
    return res.results.map(r => ({ id: r.id }));
}


export async function getPostBySlug(slug: string) {
    const dbId = process.env.NOTION_DATABASE_ID!;
    const res = await notion.databases.query({
        database_id: dbId,
        filter: {
            property: "Slug",
            rich_text: { equals: slug }
        }
    });
    if (!res.results.length) throw new Error(`No Notion page with slug='${slug}'.`);
    return res.results[0];
}


export async function fetchFrontMatter(page: any): Promise<PostFrontMatter> {
    const props = page.properties;
    const title = props.Title?.title?.[0]?.plain_text ?? "Untitled";
    const slug = props.Slug?.rich_text?.[0]?.plain_text ?? "";
    const date = props.Date?.date?.start ?? undefined;
    const tags = props.Tags?.multi_select?.map((t: any) => t.name) ?? [];
    const published = !!props.Published?.checkbox;
    // Try to read first file URL (requires public files or signed URLs)
    const heroImage = props.HeroImage?.files?.[0]?.file?.url ?? null;
    return { title, slug, date, tags, heroImage, published };
}


export async function renderMarkdown(pageId: string) {
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);
    return mdString.parent ?? "";
}


export async function setPublished(slug: string, value: boolean) {
    const page = await getPostBySlug(slug);
    await notion.pages.update({
        page_id: page.id,
        properties: {
            Published: { checkbox: value }
        }
    });
    return { pageId: page.id, published: value };
}