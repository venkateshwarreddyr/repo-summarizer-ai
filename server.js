require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL || undefined,
});

const GITHUB_HEADERS = {
  'User-Agent': 'repo-summarizer-ai',
  Accept: 'application/vnd.github+json',
};

async function fetchGitHub(url) {
  const token = process.env.GITHUB_TOKEN;
  const headers = { ...GITHUB_HEADERS };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const msg = res.status === 404
      ? 'Repository not found. Make sure it is public.'
      : `GitHub API error: ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

async function fetchReadme(owner, repo) {
  try {
    const headers = { ...GITHUB_HEADERS, Accept: 'application/vnd.github.raw+json' };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers }
    );
    if (!res.ok) return '';
    const text = await res.text();
    return text.slice(0, 8000);
  } catch {
    return '';
  }
}

async function fetchTree(owner, repo, branch) {
  try {
    const data = await fetchGitHub(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );
    return (data.tree || [])
      .filter((f) => f.type === 'blob')
      .map((f) => f.path)
      .slice(0, 100);
  } catch {
    return [];
  }
}

async function fetchConfigFiles(owner, repo, branch, filePaths) {
  const configs = [
    'package.json', 'requirements.txt', 'Cargo.toml', 'go.mod',
    'pom.xml', 'build.gradle', 'Dockerfile', 'docker-compose.yml',
    'pyproject.toml', 'Gemfile',
  ];
  const found = filePaths.filter((p) => configs.includes(p)).slice(0, 3);
  const results = {};
  for (const path of found) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
      );
      if (res.ok) results[path] = (await res.text()).slice(0, 3000);
    } catch { /* skip */ }
  }
  return results;
}

app.post('/api/summarize', async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: 'Repository URL is required.' });

    let owner, repo;
    try {
      const url = new URL(repoUrl);
      const parts = url.pathname.replace(/^\/|\/$/g, '').split('/');
      owner = parts[0];
      repo = parts[1];
      if (!owner || !repo) throw new Error();
    } catch {
      return res.status(400).json({ error: 'Invalid GitHub URL.' });
    }

    // Fetch repo metadata
    const meta = await fetchGitHub(`https://api.github.com/repos/${owner}/${repo}`);
    const branch = meta.default_branch || 'main';

    // Fetch README, tree in parallel
    const [readme, tree] = await Promise.all([
      fetchReadme(owner, repo),
      fetchTree(owner, repo, branch),
    ]);

    // Fetch config files
    const configFiles = await fetchConfigFiles(owner, repo, branch, tree);

    // Build AI prompt
    const systemPrompt = `You are a software analyst. Analyze the given GitHub repository information and return a JSON object with exactly these fields:
{
  "name": "repository name",
  "language": "primary programming language",
  "techStack": ["technology1", "technology2"],
  "purpose": "one paragraph explaining what the project does",
  "architecture": "one paragraph describing the architecture",
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "complexity": "simple | moderate | complex"
}
Return ONLY valid JSON, no markdown fences.`;

    let userContent = `Repository: ${meta.full_name}\n`;
    userContent += `Description: ${meta.description || 'N/A'}\n`;
    userContent += `Language: ${meta.language || 'N/A'}\n`;
    userContent += `Stars: ${meta.stargazers_count}\n`;
    userContent += `Topics: ${(meta.topics || []).join(', ') || 'N/A'}\n\n`;
    if (readme) userContent += `--- README ---\n${readme}\n\n`;
    if (tree.length) userContent += `--- FILE TREE ---\n${tree.join('\n')}\n\n`;
    if (Object.keys(configFiles).length) {
      userContent += `--- CONFIG FILES ---\n`;
      for (const [path, content] of Object.entries(configFiles)) {
        userContent += `\n[${path}]\n${content}\n`;
      }
    }

    const completion = await openai.chat.completions.create({
      model: process.env.LLM_MODEL || 'zai-org/GLM-5:zai-org',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0].message.content;
    const summary = JSON.parse(text);

    // Enrich with GitHub metadata
    summary.stars = meta.stargazers_count;
    summary.url = meta.html_url;

    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Something went wrong.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
