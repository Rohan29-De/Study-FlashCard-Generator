'use server';

import { PDFParse } from 'pdf-parse';
import { generateFlashcards } from './groq';
import { Flashcard, Deck } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Fix for worker path in Next.js environment
const workerPath = path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
PDFParse.setWorker(`file://${workerPath}`);

export async function processPdf(formData: FormData): Promise<Deck | null> {
  const file = formData.get('file') as File;
  if (!file) return null;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    
    // Talk to the Teacher AI
    const kit = await generateFlashcards(data.text);
    if (!kit) return null;

    // Helper to find data regardless of AI naming casing
    const findData = (obj: any, target: string) => {
      const key = Object.keys(obj).find(k => k.toLowerCase() === target.toLowerCase());
      return key ? obj[key] : [];
    };

    // Map the new Flashcards
    const rawFlashcards = findData(kit, 'flashcards');
    const cards: Flashcard[] = (rawFlashcards || []).map((card: any) => ({
      id: uuidv4(),
      question: card.question,
      answer: card.answer,
      explanation: card.explanation,
      repetition: 0,
      interval: 0,
      efactor: 2.5,
      dueDate: Date.now(),
      mastery: 'new' as const,
    }));

    // Assemble the complete Deck with ALL materials
    // Mapping everything including the new Concepts and Definitions
    return {
      id: uuidv4(),
      title: file.name.replace('.pdf', ''),
      description: `Generated from ${file.name}`,
      summary: kit.summary || kit.Summary || "No summary found.",
      topics: findData(kit, 'topics'),
      concepts: findData(kit, 'concepts'),
      definitions: findData(kit, 'definitions'),
      mcqs: findData(kit, 'mcqs'),
      fillInBlanks: findData(kit, 'fillInBlanks'),
      createdAt: Date.now(),
      totalCards: cards.length,
      cards: cards,
    };
  } catch (error) {
    console.error('PDF Processing Error:', error);
    return null;
  }
}

export async function generateDefinitions(summary: string) {
  const prompt = `Generate 5-10 key definitions from this lesson summary: ${summary}. Return as JSON object with a "definitions" key containing an array of objects with "term" and "definition" fields.`;
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });
    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content);
    return parsed.definitions || [];
  } catch (error) {
    console.error('Error generating definitions:', error);
    return [];
  }
}

export async function generateConcepts(summary: string) {
  const prompt = `Generate 5-10 key concepts from this lesson summary: ${summary}. Return as JSON object with a "concepts" key containing an array of objects with "title" and "content" fields.`;
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });
    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content);
    return parsed.concepts || [];
  } catch (error) {
    console.error('Error generating concepts:', error);
    return [];
  }
}
