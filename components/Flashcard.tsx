'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flashcard as FlashcardType } from '@/types';
import { ChevronRight, ChevronLeft, RefreshCcw } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardType;
  onRate: (quality: number) => void;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  onBackToIndex: () => void;
}

export function Flashcard({ card, onRate, index, total, onNext, onPrev, onBackToIndex }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        className="relative w-full aspect-[1.7/1] preserve-3d"
      >
        {/* FRONT SIDE (Question) */}
        <div 
          className="absolute inset-0 backface-hidden border-[3px] border-[#1a1a5e] rounded-[14px] shadow-[6px_6px_0px_#1a1a5e] overflow-hidden flex flex-col bg-white"
          style={{ 
            backgroundImage: 'repeating-linear-gradient(white, white 27px, #f7c5d0 28px)', // Pink lines
            backgroundPosition: '0 44px'
          }}
        >
          {/* Header */}
          <div className="bg-[#f7a8b8] px-6 py-4 flex items-center justify-between border-b-[3px] border-[#1a1a5e]">
            <div className="flex items-center gap-4">
              <div className="text-xl font-black text-white">{index + 1}</div>
              <div className="px-4 py-1 bg-white/30 rounded-full text-white text-sm font-black border border-white/50">Question</div>
            </div>
            <button onClick={() => setIsFlipped(true)} className="px-5 py-1 bg-white/30 rounded-full text-white text-sm font-black border border-white/50 hover:bg-white/50">Flip</button>
          </div>

          {/* Body */}
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <h3 className="question-text text-3xl font-black text-[#1a1a5e] italic">{card.question}</h3>
          </div>

          {/* Footer */}
          <div className="bg-white px-6 py-3 border-t-[3px] border-[#1a1a5e] flex items-center justify-between">
            <button onClick={onBackToIndex} className="text-[#f7a8b8] text-xs font-black uppercase underline">Index</button>
            <div className="flex gap-4">
              <button onClick={onPrev} disabled={index === 0} className="w-8 h-8 rounded-full border-2 border-[#1a1a5e] flex items-center justify-center text-[#1a1a5e] disabled:opacity-30"><ChevronLeft/></button>
              <button onClick={onNext} disabled={index === total - 1} className="w-8 h-8 rounded-full border-2 border-[#1a1a5e] flex items-center justify-center text-[#1a1a5e] disabled:opacity-30"><ChevronRight/></button>
            </div>
          </div>
        </div>

        {/* BACK SIDE (Answer) */}
        <div 
          className="absolute inset-0 backface-hidden rotate-y-180 border-[3px] border-[#1a1a5e] rounded-[14px] shadow-[-6px_6px_0px_#1a1a5e] overflow-hidden flex flex-col bg-white"
          style={{ 
            backgroundImage: 'repeating-linear-gradient(white, white 27px, #b8d4f8 28px)', // Blue lines
            backgroundPosition: '0 44px'
          }}
        >
          {/* Header */}
          <div className="bg-[#a8c8f7] px-6 py-4 flex items-center justify-between border-b-[3px] border-[#1a1a5e]">
            <div className="flex items-center gap-4">
              <div className="text-xl font-black text-white">{index + 1}</div>
              <div className="px-4 py-1 bg-white/30 rounded-full text-white text-sm font-black border border-white/50">Answer</div>
            </div>
            <button onClick={() => setIsFlipped(false)} className="px-5 py-1 bg-white/30 rounded-full text-white text-sm font-black border border-white/50 hover:bg-white/50">Flip</button>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <p className="question-text text-2xl font-black text-[#1a1a5e] italic">{card.answer}</p>
            {/* Rating buttons */}
            <div className="mt-8 flex gap-3">
              {[1, 3, 5].map((q) => (
                <button 
                  key={q} 
                  onClick={() => { onRate(q); setIsFlipped(false); }}
                  className="px-4 py-2 bg-white border-2 border-[#1a1a5e] shadow-[2px_2px_0px_#1a1a5e] rounded-xl text-xs font-black uppercase active:translate-y-1"
                >
                  {q === 1 ? 'Hard' : q === 3 ? 'Good' : 'Easy'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
