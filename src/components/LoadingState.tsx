"use client";

import { useState, useEffect } from "react";

const STEPS = [
  { label: "Fetching metadata", icon: "M21 12a9 9 0 1 1-6.219-8.56" },
  {
    label: "Reading files",
    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
  },
  { label: "AI analysis", icon: "M13 2 3 14h9l-1 8 10-12h-9l1-8z" },
];

export default function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-12 text-center animate-in">
      {/* Bouncing dots */}
      <div className="flex justify-center gap-1.5 mb-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 animate-bounce-dot"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>

      <p className="text-gray-400 text-sm mb-6">
        Fetching repo data & analyzing with AI...
      </p>

      {/* Steps */}
      <div className="flex justify-center gap-8">
        {STEPS.map((step, i) => (
          <div
            key={step.label}
            className={`flex items-center gap-2 text-sm transition-all duration-300 ${
              i <= activeStep
                ? "text-emerald-400 opacity-100"
                : "text-gray-600 opacity-40"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {i <= activeStep ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <circle cx="12" cy="12" r="10" />
              )}
            </svg>
            <span>{step.label}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-6 max-w-md mx-auto h-1 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 animate-loading-bar" />
      </div>
    </div>
  );
}
