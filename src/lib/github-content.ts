const REPO_OWNER = 'AzsaNrD';
const REPO_NAME = 'my-personal-web';
const BRANCH = 'main';
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_CONTENT_TOKEN;
  if (!token) {
    throw new Error('GITHUB_CONTENT_TOKEN is not configured on the server.');
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export async function repoFileExists(path: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/contents/${path}?ref=${BRANCH}`, {
    headers: githubHeaders(),
    cache: 'no-store',
  });
  if (res.status === 404) return false;
  if (!res.ok) {
    throw new Error(`GitHub lookup failed (${res.status}).`);
  }
  return true;
}

/** Commits a new file to the target branch; refuses to overwrite an existing one. */
export async function createRepoFile(path: string, content: string, message: string): Promise<void> {
  const res = await fetch(`${API_BASE}/contents/${path}`, {
    method: 'PUT',
    headers: { ...githubHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      branch: BRANCH,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GitHub commit failed (${res.status}): ${body.slice(0, 300)}`);
  }
}
