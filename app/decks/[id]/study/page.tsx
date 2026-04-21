'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDecks } from '@/hooks/useDecks';
import { Flashcard } from '@/components/Flashcard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Brain, BookMarked, ListChecks, Type, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { generateConcepts } from '@/lib/pdf-actions';

type StudyMode = 'flashcards' | 'concepts' | 'mcq' | 'fill-in';

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const { decks, updateCardStats, updateDeck, isLoading } = useDecks();
  
  const [mode, setMode] = useState<StudyMode>('flashcards');
  const [qIndex, setQIndex] = useState(0);
  const [qScore, setQScore] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [fIndex, setFIndex] = useState(0);
  const [generating, setGenerating] = useState(false);

  const deckId = params.id as string;
  const deck = useMemo(() => decks.find((d) => d.id === deckId), [decks, deckId]);
  
  const dueCards = useMemo(() => deck?.cards?.filter((c) => c.dueDate <= Date.now()) || [], [deck]);

  const currentList = useMemo(() => {
    if (!deck) return [];
    if (mode === 'mcq') return Array.isArray(deck.mcqs) ? deck.mcqs : [];
    if (mode === 'fill-in') return Array.isArray(deck.fillInBlanks) ? deck.fillInBlanks : [];
    return [];
  }, [mode, deck]);

  const stableOptions = useMemo(() => {
    const q = currentList[qIndex];
    if (!q || !deck) return [];
    if (mode === 'mcq' && 'options' in q) return Array.isArray(q.options) ? q.options : [];
    const correct = q.answer || "";
    const others = (Array.isArray(deck.definitions) ? deck.definitions.map((d: any) => d.term) : []).concat(deck.topics || []);
    const decoys = others.filter(o => o !== correct).sort(() => 0.5 - Math.random()).slice(0, 3);
    return [correct, ...decoys].sort();
  }, [mode, qIndex, currentList, deck]);

  useEffect(() => { setQIndex(0); setQScore(0); setSelectedAns(null); setIsDone(false); }, [mode]);

  useEffect(() => {
    if (mode === 'concepts' && deck && (!deck.concepts || deck.concepts.length === 0) && !generating && deck.summary) {
      setGenerating(true);
      generateConcepts(deck.summary).then(concepts => {
        updateDeck(deckId, { concepts });
        setGenerating(false);
      }).catch(() => setGenerating(false));
    }
  }, [mode, deck, generating, deckId, updateDeck]);

  const handleQuizAnswer = (ans: string, correct: string) => {
    if (selectedAns) return;
    setSelectedAns(ans);
    if (ans === correct) setQScore(prev => prev + 1);
    setTimeout(() => {
      if (qIndex < currentList.length - 1) { setQIndex(qIndex + 1); setSelectedAns(null); } 
      else { setIsDone(true); }
    }, 1500);
  };

  if (isLoading || !deck) return <div className="p-20 text-center font-black text-[#1a1a5e]">Loading Lab...</div>;

  const resultMsg = qScore === 0 ? "Let's try again! 🎀" : qScore < 3 ? "So close! ✨" : "You're a Rockstar! 🏆";

  return (
    <main className="min-h-screen flex bg-[#ddeeff] grid-background">
      <aside className="w-[30%] bg-[#f8fbff] border-r-[3px] border-[#1a1a5e]/10 p-10 flex flex-col gap-8 h-screen sticky top-0 overflow-y-auto shrink-0">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a1a5e]/50 font-black uppercase text-[10px] tracking-widest hover:text-[#1a1a5e] transition-colors"><ChevronLeft size={16}/> Go Back</Link>
        <h1 className="text-3xl font-black text-[#1a1a5e] leading-none font-itim">{deck.title}</h1>
        <div className="bg-yellow-50 p-6 rounded-[2.5rem] border-2 border-yellow-200 shadow-[4px_4px_0px_#fef3c7] mt-4 relative rotate-1">
          {/* The Red Thumbtack */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-400 rounded-full border-2 border-red-500 shadow-inner" />
          
          <h3 className="text-xl font-black text-slate-800 question-text mb-2 italic underline decoration-yellow-300">
            Lesson Recap
          </h3>
          <p className="text-slate-600 font-itim text-sm leading-relaxed italic">
            "{deck.summary || 'Prepare for glory.'}"
          </p>
        </div>
        <div className="mt-auto space-y-4">
           <div className="flex justify-between items-center text-xs font-black text-[#1a1a5e] uppercase"><span>{mode.toUpperCase()}</span><span>{Math.round(((qIndex + 1) / (currentList.length || 1)) * 100)}%</span></div>
           <div className="w-full h-4 bg-white rounded-full border-2 border-[#1a1a5e] overflow-hidden p-[2px]"><div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${mode === 'flashcards' ? ((fIndex + 1) / (dueCards.length || 1)) * 100 : ((qIndex + 1) / (currentList.length || 1)) * 100}%` }} /></div>
        </div>
      </aside>

      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <nav className="flex flex-wrap gap-2 justify-center mb-10 pb-4">
           {['flashcards', 'mcq', 'fill-in', 'concepts'].map((m) => (
             <button key={m} onClick={() => setMode(m as StudyMode)} className={`px-6 py-3 rounded-2xl font-black text-xs border-[3px] transition-all ${mode === m ? 'bg-[#1a1a5e] text-white' : 'bg-white text-slate-400 border-slate-100 hover:border-[#1a1a5e]'}`}>{m.toUpperCase().replace('-', ' ')}</button>
           ))}
        </nav>

        <div className="flex-1 w-full flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isDone ? (
               <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-12 bg-white rounded-[3rem] border-[4px] border-[#1a1a5e] shadow-[10px_10px_0px_#1a1a5e] space-y-6"><h2 className="text-4xl font-black text-[#1a1a5e]">{resultMsg}</h2><p className="text-2xl font-black text-slate-400">Score: {qScore} / {currentList.length}</p><button onClick={() => setIsDone(false)} className="px-10 py-4 bg-[#f7a8b8] text-[#1a1a5e] font-black rounded-2xl">Restart</button></motion.div>
            ) : mode === 'flashcards' ? (
               <div className="w-full max-w-2xl">{dueCards[fIndex] ? <Flashcard card={dueCards[fIndex]} index={fIndex} total={dueCards.length} onRate={(q) => updateCardStats(deckId, dueCards[fIndex].id, q)} onNext={() => setFIndex(fIndex+1)} onPrev={() => setFIndex(fIndex-1)} onBackToIndex={() => router.push('/')}/> : <div className="p-12 bg-white rounded-3xl border-4 text-center">Done! 🏆</div>}</div>
            ) : (mode === 'mcq' || mode === 'fill-in') ? (
               currentList[qIndex] ? (
                 <motion.div key={qIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-xl bg-white p-10 rounded-[3rem] border-[4px] border-[#1a1a5e] shadow-[8px_8px_0px_#1a1a5e] space-y-8 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Question {qIndex + 1} of {currentList.length}</p>
                    <p className="text-2xl font-black text-[#1a1a5e] tracking-tight leading-relaxed font-itim">
                      {/* Robust Question Finder */}
                      {(() => {
                        const q = currentList[qIndex];
                        const text = q.question || q.sentence || q.text || "Question data missing";
                        const answer = q.answer || "";
                        return mode === 'mcq' ? text : `"${text.replace(answer, '_______')}"`;
                      })()}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {stableOptions.map((opt, i) => {
                         const correct = currentList[qIndex].answer || "";
                         return (<button key={i} onClick={() => handleQuizAnswer(opt, correct)} className={`px-4 py-4 rounded-xl border-[3px] font-black transition-all ${selectedAns ? (opt === correct ? 'bg-green-100 border-green-500 text-green-700' : selectedAns === opt ? 'bg-red-100 border-red-500 text-red-700' : 'opacity-30') : 'border-[#1a1a5e]/10 hover:border-[#1a1a5e]'}`}>{opt}</button>);
                      })}
                    </div>
                 </motion.div>
               ) : <div className="p-12 bg-white rounded-3xl border-4 text-center">Upload NEW PDF 🕵️‍♂️</div>
            ) : mode === 'concepts' ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                 {generating ? (
                   <div className="p-12 text-center font-black text-[#1a1a5e]">Generating concepts with AI...</div>
                 ) : (
                   (Array.isArray(deck.concepts) ? deck.concepts : []).map((c: any, i: number) => (<div key={i} className="bg-orange-50 p-8 rounded-[2.5rem] border-[4px] border-orange-400 shadow-[6px_6px_0px_#fdba74] space-y-2 text-center"><h3 className="text-2xl font-black text-orange-600 font-itim">{c.title}</h3><p className="text-slate-600 font-bold">{c.content}</p></div>))
                 )}
               </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
