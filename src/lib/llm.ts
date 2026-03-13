import OpenAI from "openai";

export interface RepoSummary {
  name: string;
  language: string;
  techStack: string[];
  purpose: string;
  architecture: string;
  keyFeatures: string[];
  complexity: "simple" | "moderate" | "complex";
  stars: number;
  url: string;
}

interface RepoMeta {
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  html_url: string;
}

export async function analyzeWithLLM(
  meta: RepoMeta,
  readme: string,
  tree: string[],
  configFiles: Record<string, string>
): Promise<RepoSummary> {
  const apiKey =
    process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || "";
  const baseURL = process.env.LLM_BASE_URL || "https://router.huggingface.co/v1";
  const model = process.env.LLM_MODEL || "zai-org/GLM-5:zai-org";

  const openai = new OpenAI({ apiKey, baseURL });

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
  userContent += `Description: ${meta.description || "N/A"}\n`;
  userContent += `Language: ${meta.language || "N/A"}\n`;
  userContent += `Stars: ${meta.stargazers_count}\n`;
  userContent += `Topics: ${(meta.topics || []).join(", ") || "N/A"}\n\n`;
  if (readme) userContent += `--- README ---\n${readme}\n\n`;
  if (tree.length) userContent += `--- FILE TREE ---\n${tree.join("\n")}\n\n`;
  if (Object.keys(configFiles).length) {
    userContent += `--- CONFIG FILES ---\n`;
    for (const [path, content] of Object.entries(configFiles)) {
      userContent += `\n[${path}]\n${content}\n`;
    }
  }

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
  });

  const text = completion.choices[0].message.content || "{}";
  const summary = JSON.parse(text) as Omit<RepoSummary, "stars" | "url">;

  return {
    ...summary,
    stars: meta.stargazers_count,
    url: meta.html_url,
  };
}
