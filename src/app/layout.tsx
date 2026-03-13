import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Repo Summarizer AI - AI-Powered Repository Analysis",
  description:
    "Paste a GitHub repo URL and get an instant AI-powered breakdown of its purpose, architecture, tech stack, and key features.",
  keywords: [
    "GitHub",
    "repository analysis",
    "AI",
    "code analysis",
    "tech stack",
    "open source",
  ],
  openGraph: {
    title: "Repo Summarizer AI - AI-Powered Repository Analysis",
    description:
      "Paste a GitHub repo URL and get an instant AI-powered breakdown.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950`}
      >
        {children}
      </body>
    </html>
  );
}
