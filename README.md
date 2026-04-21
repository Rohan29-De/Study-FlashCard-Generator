# 📚 PDF Study Assistant

> Transform any PDF into a complete, interactive study toolkit — powered by Groq AI and spaced repetition science.
---

## What It Does

Upload any PDF — a textbook chapter, lecture notes, research paper — and the app instantly generates a full set of study materials: flashcards with spaced repetition, multiple-choice quizzes, fill-in-the-blank exercises, key concepts, and definitions. Everything you need to actually learn the material, not just skim it.

---

## Features

### 🃏 Study Modes
- **Flashcards** — Flip-card interface with SM-2 spaced repetition scheduling
- **Multiple Choice (MCQs)** — AI-generated questions with instant feedback
- **Fill in the Blanks** — Sentence completion exercises for active recall
- **Concepts & Definitions** — Key terms extracted and explained from your document

### 🤖 AI Processing
- Intelligent PDF text extraction via `pdf-parse`
- Groq AI (Llama 3.3) generates comprehensive, high-quality study content
- Auto-generated document summary and key topics
- Content adapts to the subject matter of your document

### 📈 Progress & Learning
- SM-2 spaced repetition algorithm — hard cards come back sooner, easy cards fade
- Visual progress bars and mastery level tracking
- Study session history stored locally — pick up where you left off

### 🎨 UI/UX
- Responsive design — works on desktop and mobile
- Smooth animations via Framer Motion
- Clean, distraction-free study interface

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + PostCSS |
| Animations | Framer Motion |
| AI Provider | Groq SDK — Llama 3.3 70B |
| PDF Parsing | pdf-parse |
| Icons | Lucide React |
| State / Storage | React hooks + localStorage |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### Installation

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd pdf-study-assistant

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
```

Open `.env.local` and add your key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Running Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Dashboard / home
│   ├── globals.css             # Global styles
│   └── decks/[id]/study/
│       └── page.tsx            # Study session page
│
├── components/
│   ├── DeckCard.tsx            # Deck tile on dashboard
│   ├── Flashcard.tsx           # Flip card component
│   ├── ProgressBar.tsx         # Mastery progress indicator
│   ├── UploadZone.tsx          # PDF drag-and-drop upload
│   └── ...
│
├── hooks/
│   └── useDecks.ts             # Deck CRUD + localStorage sync
│
├── lib/
│   ├── groq.ts                 # Groq AI client + prompt logic
│   ├── pdf-actions.ts          # PDF parsing server actions
│   └── sm2.ts                  # SM-2 spaced repetition algorithm
│
└── types/
    └── index.ts                # Shared TypeScript interfaces
```

---

## How the AI Works

When you upload a PDF, the app:

1. **Parses** the file server-side using `pdf-parse` and extracts raw text
2. **Sends** the text to Groq (Llama 3.3 70B) with a structured prompt
3. **Receives** a JSON payload containing:
   - Document summary
   - Key topics
   - Flashcard question/answer pairs with explanations
   - Multiple choice questions with distractors
   - Fill-in-the-blank sentences
   - Core concepts and definitions

All generation happens in a single API call to keep latency low.

---

## Spaced Repetition (SM-2)

Flashcard scheduling uses the SM-2 algorithm. After each card review you rate your recall:

| Rating | Meaning |
|---|---|
| 0–1 | Forgot completely |
| 2 | Hard — remembered with difficulty |
| 3 | Good — correct with some effort |
| 4–5 | Easy / perfect recall |

Cards with low ratings reappear within 1–2 days. Well-known cards are pushed further out (weeks, then months). The algorithm adjusts each card's ease factor independently over time.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Your Groq API key from [console.groq.com](https://console.groq.com) |

---

## Security

- The Groq API key is used server-side only (Next.js API routes / Server Actions)
- No keys are ever exposed to the browser or bundled into client JS
- All user data stays local — nothing is sent to any server except your PDF text to Groq for processing

---

## Roadmap

- [ ] Deck export (Anki `.apkg` format)
- [ ] Image and diagram support in PDFs
- [ ] Collaborative decks (share a link)
- [ ] Study streaks and gamification
- [ ] Dark mode

---

## Contributing

1. Fork the repo and create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run build` to verify
4. Open a pull request with a clear description

---

## License

MIT — see [LICENSE](./LICENSE) for details.
