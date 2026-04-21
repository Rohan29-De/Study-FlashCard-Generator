'use client';

import { useState, useEffect } from 'react';
import { Deck, Flashcard, MasteryStats } from '@/types';
import { calculateSM2, getMasteryLevel } from '@/lib/sm2';

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fc_engine_decks');
    if (saved) {
      try {
        setDecks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse decks', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('fc_engine_decks', JSON.stringify(decks));
    }
  }, [decks, isLoading]);

  const addDeck = (newDeck: Deck) => {
    setDecks((prev) => [newDeck, ...prev]);
  };

  const deleteDeck = (id: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== id));
  };

  const updateCardStats = (deckId: string, cardId: string, quality: number) => {
    setDecks((prevDecks) => {
      return prevDecks.map((deck) => {
        if (deck.id !== deckId) return deck;

        const updatedCards = deck.cards.map((card) => {
          if (card.id !== cardId) return card;

          const { repetition, interval, efactor, dueDate } = calculateSM2(
            quality,
            card.repetition,
            card.interval,
            card.efactor
          );

          return {
            ...card,
            repetition,
            interval,
            efactor,
            dueDate,
            mastery: getMasteryLevel(repetition),
          };
        });

        return { ...deck, cards: updatedCards };
      });
    });
  };

  const getStats = (): MasteryStats => {
    const allCards = decks.flatMap((d) => d.cards);
    return {
      total: allCards.length,
      mastered: allCards.filter((c) => c.mastery === 'mastered').length,
      shaky: allCards.filter((c) => c.mastery === 'shaky').length,
      new: allCards.filter((c) => c.mastery === 'new').length,
      dueSoon: allCards.filter((c) => c.dueDate <= Date.now()).length,
    };
  };

  const updateDeck = (deckId: string, updates: Partial<Deck>) => {
    setDecks((prev) => prev.map(d => d.id === deckId ? { ...d, ...updates } : d));
  };

  return {
    decks,
    addDeck,
    deleteDeck,
    updateCardStats,
    updateDeck,
    getStats,
    isLoading,
  };
}
