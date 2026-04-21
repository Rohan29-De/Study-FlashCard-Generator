'use server';

import { generateFlashcards } from './groq';
import { groq } from './groq';
import { Flashcard, Deck } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function processPdf(formData: FormData): Promise<Deck | null> {
  const file = formData.get('file') as File;
  if (!file) return null;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
      // Pattern from user:
const pdfParse = require('pdf-parse/dist/pdf-parse');
const data = await pdfParse(buffer);

    
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('PDF Processing Error:', errorMessage);
    console.error('Stack trace:', errorStack);
    throw new Error(`PDF Processing failed: ${errorMessage}`);
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
    if (!content) return [];
    if (!content) return [];
    const parsed = JSON.parse(content);
    return parsed.definitions || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error generating definitions:', errorMessage);
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
    if (!content) return [];
    const parsed = JSON.parse(content);
    return parsed.concepts || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error generating concepts:', errorMessage);
    return [];
  }
}
