# Trend Brief

Trend Brief is a demo app that generates presentation-style trend reports powered by Exa's search API. An analyst types in a trend topic (e.g., "Gourmand Fragrances") and a vertical (e.g., "Beauty"), and the app returns a visual brief showing emerging brands, expert articles, and community discussions discovered from the open web, the kind of internal tooling a consumer insights team at Estée Lauder or L'Oréal could build.

## Setup

1. Copy `.env.local.example` to `.env.local` and add your API keys:
   - `EXA_API_KEY` — [Exa](https://exa.ai)
   - `ANTHROPIC_API_KEY` — [Anthropic](https://console.anthropic.com)

2. Install dependencies and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
