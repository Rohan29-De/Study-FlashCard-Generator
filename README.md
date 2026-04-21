# PDF Study Assistant

An AI-powered PDF processing and study application built with Next.js, TypeScript, and Groq AI. Transform PDF documents into interactive flashcards, multiple-choice questions, fill-in-the-blanks, concepts, and definitions for efficient learning.

## Features

### 📚 Study Modes
- **Flashcards**: Spaced repetition learning with SM-2 algorithm
- **Multiple Choice Questions (MCQs)**: Test knowledge with AI-generated questions
- **Fill-in-the-Blanks**: Interactive sentence completion exercises
- **Concepts**: Key ideas and topics from the document
- **Progress Tracking**: Visual progress bars and mastery levels

### 🤖 AI-Powered Processing
- **Intelligent PDF Parsing**: Extracts text content from PDF files
- **Content Generation**: Uses Groq AI to create comprehensive study materials
- **Smart Summarization**: Generates concise summaries of documents
- **Adaptive Learning**: AI-generated content tailored to document content

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Framer Motion for delightful interactions
- **Tailwind CSS**: Modern, utility-first styling
- **Accessible**: Built with accessibility in mind

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, PostCSS
- **Animations**: Framer Motion
- **AI**: Groq SDK (Llama 3.3 model)
- **PDF Processing**: pdf-parse library
- **Icons**: Lucide React
- **State Management**: React hooks with localStorage persistence

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Groq API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pdf-study-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Add your Groq API key to `.env.local`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── decks/             # Dynamic deck routes
│       └── [id]/
│           └── study/
│               └── page.tsx
├── components/            # Reusable React components
│   ├── DeckCard.tsx       # Deck display card
│   ├── Flashcard.tsx      # Flashcard component
│   ├── ProgressBar.tsx    # Progress visualization
│   ├── UploadZone.tsx     # File upload interface
│   └── ...
├── hooks/                 # Custom React hooks
│   └── useDecks.ts        # Deck management hook
├── lib/                   # Utility libraries
│   ├── groq.ts            # AI integration
│   ├── pdf-actions.ts     # PDF processing
│   └── sm2.ts             # Spaced repetition algorithm
├── types/                 # TypeScript type definitions
│   └── index.ts           # Main type exports
└── public/                # Static assets
```

## API Usage

### PDF Processing
The app uses Groq AI to process uploaded PDFs and generate:
- Document summary
- Key topics
- Flashcards (questions/answers/explanations)
- Multiple choice questions
- Fill-in-the-blank exercises
- Key concepts
- Definitions

### Spaced Repetition
Implements the SM-2 algorithm for optimal flashcard scheduling based on user performance.

## Configuration

### Environment Variables
- `GROQ_API_KEY`: Your Groq API key for AI processing

### Customization
- Modify AI prompts in `lib/groq.ts` and `lib/pdf-actions.ts`
- Adjust styling in Tailwind CSS classes
- Configure SM-2 parameters in `lib/sm2.ts`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Groq](https://groq.com/) for AI processing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
