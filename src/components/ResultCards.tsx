"use client";

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

function getComplexityStyles(complexity: string) {
  const level = complexity.toLowerCase();
  switch (level) {
    case "simple":
      return "bg-emerald-500/12 text-emerald-400 border-emerald-500/25";
    case "complex":
      return "bg-red-500/12 text-red-400 border-red-500/25";
    default:
      return "bg-yellow-500/12 text-yellow-400 border-yellow-500/25";
  }
}

function formatComplexity(complexity: string) {
  const level = complexity.toLowerCase();
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export default function ResultCards({ data }: { data: RepoSummary }) {
  return (
    <div className="mt-10 space-y-3">
      {/* Hero card */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/15 transition-colors animate-in">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                {data.name || "Unknown"}
              </a>
            </h2>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/12 text-violet-400 border border-violet-500/25">
                {data.language || "N/A"}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getComplexityStyles(data.complexity)}`}
              >
                {formatComplexity(data.complexity || "moderate")}
              </span>
              {data.stars != null && (
                <span className="text-sm text-yellow-400 font-medium">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="inline -mt-0.5 mr-1"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {data.stars.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Purpose card */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/15 transition-colors animate-in animate-delay-1">
        <div className="flex items-center gap-2 mb-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(6 182 212)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Purpose
          </h3>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{data.purpose}</p>
      </div>

      {/* Architecture card */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/15 transition-colors animate-in animate-delay-2">
        <div className="flex items-center gap-2 mb-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(139 92 246)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Architecture
          </h3>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          {data.architecture}
        </p>
      </div>

      {/* Tech Stack card */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/15 transition-colors animate-in animate-delay-3">
        <div className="flex items-center gap-2 mb-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(6 182 212)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Tech Stack
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data.techStack || []).map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/8 border border-cyan-500/20 text-cyan-400"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Key Features card */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/15 transition-colors animate-in animate-delay-4">
        <div className="flex items-center gap-2 mb-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(16 185 129)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Key Features
          </h3>
        </div>
        <ul className="space-y-2">
          {(data.keyFeatures || []).map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-300"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
