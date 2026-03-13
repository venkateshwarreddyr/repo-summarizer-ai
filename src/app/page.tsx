"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RepoAnalyzer from "@/components/RepoAnalyzer";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Header />
      <Hero />
      <RepoAnalyzer />
      <Footer />
    </main>
  );
}
