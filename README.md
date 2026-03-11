# Repo Summarizer AI

Paste a GitHub repo URL and get an AI-powered summary — tech stack, architecture, purpose, and more.

![Repo Summarizer AI Demo](docs/how_to.png)

## Features

- Enter any public GitHub repo URL
- Fetches README, file tree, and config files via GitHub API
- AI-generated structured summary (Gemini / OpenAI compatible)
- Tech stack detection
- Clean dark-themed UI

## Setup

```bash
npm install
cp .env.example .env
# Edit .env and add your API key
npm start
```

Open http://localhost:3000

## Configuration

| Variable | Description | Default |
|---|---|---|
| `LLM_API_KEY` | Your API key | required |
| `LLM_BASE_URL` | API base URL (OpenAI-compatible) | HuggingFace router |
| `LLM_MODEL` | Model to use | `zai-org/GLM-5:zai-org` |
| `GITHUB_TOKEN` | Optional GitHub token for higher rate limits | — |
| `PORT` | Server port | `3000` |

## Tech Stack

- Node.js + Express
- HuggingFace / Any OpenAI-compatible LLM API
- Vanilla HTML/CSS/JS frontend
- GitHub REST API
