export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  // SM-2 Algorithm fields
  repetition: number; // consecutive successful recalls (n)
  interval: number;   // days until next review (I)
  efactor: number;    // ease factor (EF)
  dueDate: number;    // timestamp of next review
  mastery: 'new' | 'shaky' | 'mastered';
}

export interface Deck {
  id: string;
  title: string;
  description?: string;
  summary?: string;
  topics?: string[];
  createdAt: number;
  totalCards: number;
  cards: Flashcard[];
  concepts?: { title: string; content: string }[];
  definitions?: { term: string; definition: string }[];
  examples?: { scenario: string; concept: string }[];
  mcqs?: { question: string; options: string[]; answer: string; explanation: string }[];
  fillInBlanks?: { sentence: string; answer: string }[];
}

export interface MasteryStats {
  total: number;
  mastered: number;
  shaky: number;
  new: number;
  dueSoon: number;
}
