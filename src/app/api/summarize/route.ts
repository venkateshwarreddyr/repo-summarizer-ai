import { NextRequest, NextResponse } from "next/server";
import {
  fetchGitHub,
  fetchReadme,
  fetchTree,
  fetchConfigFiles,
  parseGitHubUrl,
} from "@/lib/github";
import { analyzeWithLLM } from "@/lib/llm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { repoUrl } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL is required." },
        { status: 400 }
      );
    }

    let owner: string, repo: string;
    try {
      ({ owner, repo } = parseGitHubUrl(repoUrl));
    } catch {
      return NextResponse.json(
        { error: "Invalid GitHub URL." },
        { status: 400 }
      );
    }

    // Fetch repo metadata
    let meta;
    try {
      meta = await fetchGitHub(
        `https://api.github.com/repos/${owner}/${repo}`
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Repository not found.";
      const status = message.includes("not found") ? 404 : 500;
      return NextResponse.json({ error: message }, { status });
    }

    const branch = meta.default_branch || "main";

    // Fetch README and tree in parallel
    const [readme, tree] = await Promise.all([
      fetchReadme(owner, repo),
      fetchTree(owner, repo, branch),
    ]);

    // Fetch config files
    const configFiles = await fetchConfigFiles(owner, repo, branch, tree);

    // Analyze with LLM
    const summary = await analyzeWithLLM(meta, readme, tree, configFiles);

    return NextResponse.json(summary);
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
