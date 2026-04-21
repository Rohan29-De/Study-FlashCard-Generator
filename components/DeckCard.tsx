import { Deck } from '@/types';
import { motion } from 'framer-motion';
import { BookOpen, Trash2, Calendar } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface DeckCardProps {
  deck: Deck;
  onStudy: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DeckCard({ deck, onStudy, onDelete }: DeckCardProps) {
  const masteredCount = deck.cards.filter(c => c.mastery === 'mastered').length;
  const shakyCount = deck.cards.filter(c => c.mastery === 'shaky').length;
  
  // Progress = (Mastered * 100% + Shaky * 40%) / Total
  const masteryPercentage = deck.totalCards > 0 
    ? ((masteredCount * 1 + shakyCount * 0.4) / deck.totalCards) * 100 
    : 0;
    
  const dueCount = deck.cards.filter(c => c.dueDate <= Date.now()).length;

  return (
    <motion.div
      layout
      whileHover={{ y: -6, x: -2 }}
      className="bg-white rounded-[24px] p-8 border-[3px] border-[#1a1a5e] shadow-[8px_8px_0px_#1a1a5e] transition-all group relative overflow-hidden"
    >
      {/* Decorative Lined Background (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(#1a1a5e, #1a1a5e 1px, transparent 1px, transparent 24px)', backgroundSize: '100% 24px' }} />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="w-12 h-12 bg-[#f7a8b8] rounded-xl flex items-center justify-center border-2 border-[#1a1a5e] text-white shadow-[3px_3px_0px_#1a1a5e]">
          <BookOpen className="w-6 h-6" />
        </div>
        <button
          onClick={() => onDelete(deck.id)}
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="relative z-10 space-y-2">
        <h3 className="text-2xl font-black text-[#1a1a5e] line-clamp-1 question-text">
          {deck.title}
        </h3>
        <p className="text-slate-500 text-sm font-medium line-clamp-2 min-h-[2.5rem]">
          {deck.description || 'Generated study materials'}
        </p>
      </div>

      <div className="mt-8 space-y-6 relative z-10">
        <div className="space-y-2">
           <div className="flex justify-between text-xs font-black text-[#1a1a5e] uppercase tracking-widest">
              <span>Mastery</span>
              <span>{Math.round(masteryPercentage)}%</span>
           </div>
           <ProgressBar value={masteryPercentage} color="bg-[#a8c8f7]" />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-[#1a1a5e] font-bold">
            <div className="w-2 h-2 bg-[#f7a8b8] rounded-full animate-pulse" />
            <span>{deck.totalCards} cards</span>
          </div>
          {dueCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 rounded-full text-orange-600 font-black text-[10px] uppercase border border-orange-200">
              <Calendar className="w-3 h-3" />
              <span>{dueCount} due</span>
            </div>
          )}
        </div>


        <button
          onClick={() => onStudy(deck.id)}
          className="w-full py-4 bg-[#f7a8b8] text-white rounded-2xl font-black text-xl border-[2.5px] border-[#1a1a5e] shadow-[4px_4px_0px_#1a1a5e] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
        >
          Study Now
        </button>
      </div>
    </motion.div>
  );
}
