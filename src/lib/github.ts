const GITHUB_HEADERS: Record<string, string> = {
  "User-Agent": "repo-summarizer-ai",
  Accept: "application/vnd.github+json",
};

function getHeaders(accept?: string): Record<string, string> {
  const headers: Record<string, string> = {
    ...GITHUB_HEADERS,
    ...(accept ? { Accept: accept } : {}),
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function fetchGitHub(url: string) {
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    const msg =
      res.status === 404
        ? "Repository not found. Make sure it is public."
        : `GitHub API error: ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchReadme(owner: string, repo: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers: getHeaders("application/vnd.github.raw+json") }
    );
    if (!res.ok) return "";
    const text = await res.text();
    return text.slice(0, 8000);
  } catch {
    return "";
  }
}

export async function fetchTree(
  owner: string,
  repo: string,
  branch: string
): Promise<string[]> {
  try {
    const data = await fetchGitHub(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );
    return (data.tree || [])
      .filter((f: { type: string }) => f.type === "blob")
      .map((f: { path: string }) => f.path)
      .slice(0, 100);
  } catch {
    return [];
  }
}

export async function fetchConfigFiles(
  owner: string,
  repo: string,
  branch: string,
  filePaths: string[]
): Promise<Record<string, string>> {
  const configs = [
    "package.json",
    "requirements.txt",
    "Cargo.toml",
    "go.mod",
    "pom.xml",
    "build.gradle",
    "Dockerfile",
    "docker-compose.yml",
    "pyproject.toml",
    "Gemfile",
  ];
  const found = filePaths.filter((p) => configs.includes(p)).slice(0, 3);
  const results: Record<string, string> = {};
  for (const path of found) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
      );
      if (res.ok) results[path] = (await res.text()).slice(0, 3000);
    } catch {
      /* skip */
    }
  }
  return results;
}

export function parseGitHubUrl(repoUrl: string): { owner: string; repo: string } {
  const url = new URL(repoUrl);
  const parts = url.pathname.replace(/^\/|\/$/g, "").split("/");
  const owner = parts[0];
  const repo = parts[1];
  if (!owner || !repo) throw new Error("Invalid GitHub URL.");
  return { owner, repo };
}
