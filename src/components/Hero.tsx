"use client";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Gradient backdrop blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          Powered by AI
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            AI-Powered
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Repository Analysis
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste a GitHub repo URL and get an instant AI-powered breakdown of its
          purpose, architecture, tech stack, and key features.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#analyzer"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold hover:from-emerald-500 hover:to-cyan-500 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
          >
            Analyze a Repository
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/20 transition-all"
          >
            How it Works
          </a>
        </div>

        {/* Stats */}
        <div
          id="features"
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">Instant</div>
            <div className="text-sm text-gray-500 mt-1">Analysis Speed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">50+</div>
            <div className="text-sm text-gray-500 mt-1">Languages Detected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">AI</div>
            <div className="text-sm text-gray-500 mt-1">Smart Summaries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">Free</div>
            <div className="text-sm text-gray-500 mt-1">Open Source</div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div
        id="how-it-works"
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-12">
          How it Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(16 185 129)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">1. Paste URL</h3>
            <p className="text-sm text-gray-500">
              Enter any public GitHub repository URL to get started.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(6 182 212)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">2. We Fetch Data</h3>
            <p className="text-sm text-gray-500">
              README, file tree, and config files are analyzed automatically.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(20 184 166)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">
              3. AI Summarizes
            </h3>
            <p className="text-sm text-gray-500">
              Get purpose, architecture, tech stack, and key features instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
