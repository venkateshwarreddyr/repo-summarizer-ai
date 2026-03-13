"use client";

import { useState, useCallback } from "react";
import LoadingState from "./LoadingState";
import ResultCards from "./ResultCards";

interface RepoSummary {
  name: string;
  language: string;
  techStack: string[];
  purpose: string;
  architecture: string;
  keyFeatures: string[];
  complexity: string;
  stars: number;
  url: string;
}

const EXAMPLE_REPOS = [
  { label: "facebook/react", url: "https://github.com/facebook/react" },
  {
    label: "langchain-ai/langgraph",
    url: "https://github.com/langchain-ai/langgraph",
  },
  {
    label: "expressjs/express",
    url: "https://github.com/expressjs/express",
  },
];

export default function RepoAnalyzer() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RepoSummary | null>(null);

  const handleAnalyze = useCallback(
    async (url?: string) => {
      const targetUrl = url || repoUrl;
      if (!targetUrl.trim()) return;

      if (!targetUrl.startsWith("https://github.com/")) {
        setError(
          "Please enter a valid GitHub URL (https://github.com/owner/repo)"
        );
        return;
      }

      setError("");
      setResult(null);
      setLoading(true);

      try {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl: targetUrl }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Request failed");

        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [repoUrl]
  );

  const handleExampleClick = useCallback(
    (url: string) => {
      setRepoUrl(url);
      handleAnalyze(url);
    },
    [handleAnalyze]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleAnalyze();
    },
    [handleAnalyze]
  );

  return (
    <section id="analyzer" className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Input form */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </div>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                required
                autoComplete="off"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono text-sm"
                aria-label="GitHub repository URL"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold hover:from-emerald-500 hover:to-cyan-500 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-emerald-600 disabled:hover:to-cyan-600 whitespace-nowrap"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Analyze</span>
            </button>
          </div>
        </form>

        {/* Example repos */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-sm text-gray-500">Try:</span>
          {EXAMPLE_REPOS.map((example) => (
            <button
              key={example.label}
              onClick={() => handleExampleClick(example.url)}
              disabled={loading}
              className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-sm text-gray-400 hover:border-emerald-500/30 hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {example.label}
            </button>
          ))}
        </div>

        {/* Error display */}
        {error && (
          <div className="mt-6 px-5 py-3.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm animate-in">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && <LoadingState />}

        {/* Results */}
        {result && !loading && <ResultCards data={result} />}
      </div>
    </section>
  );
}
