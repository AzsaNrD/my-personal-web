import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & { slug: string; readingMinutes: number };
export type Post = PostMeta & { content: string };

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts');

const WORDS_PER_MINUTE = 200;

/** Rough reading estimate. Strips code fences so snippets don't inflate the count. */
function estimateReadingMinutes(content: string): number {
  const prose = content.replace(/```[\s\S]*?```/g, ' ');
  const words = prose.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function isPublished(fm: PostFrontmatter): boolean {
  if (process.env.NODE_ENV === 'production' && fm.draft) return false;
  return true;
}

async function readPostFile(file: string): Promise<Post | null> {
  if (!file.endsWith('.mdx')) return null;
  const slug = file.replace(/\.mdx$/, '');
  const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;

  if (!fm.title || !fm.date) {
    throw new Error(`Post "${slug}" is missing required frontmatter (title, date).`);
  }
  if (!isPublished(fm)) return null;

  return {
    slug,
    title: fm.title,
    description: fm.description ?? '',
    date: fm.date,
    tags: fm.tags ?? [],
    draft: fm.draft ?? false,
    readingMinutes: estimateReadingMinutes(content),
    content,
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  let files: string[];
  try {
    files = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }

  const posts = await Promise.all(files.map(readPostFile));
  return posts
    .filter((p): p is Post => p !== null)
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return readPostFile(`${slug}.mdx`).catch(() => null);
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
