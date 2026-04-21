'use client';

import { useState } from 'react';
import { useDecks } from '@/hooks/useDecks';
import { UploadZone } from '@/components/UploadZone';
import { DeckCard } from '@/components/DeckCard';
import { Brain, Sparkles, Plus, BookOpen, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Dashboard() {
  const { decks, addDeck, deleteDeck, isLoading } = useDecks();
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  const handleStudy = (id: string) => {
    router.push(`/decks/${id}/study`);
  };

  if (isLoading) return null;

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Vibrant Blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 px-6 md:px-12">
        {/* Floating Nav */}
        <nav className="flex justify-between items-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Brain className="w-7 h-7" />
            </div>
            <span className="font-outfit font-black text-3xl text-slate-900 tracking-tight">FlashEngine</span>
          </div>
          {decks.length > 0 && (
            <button 
              onClick={() => {
                const el = document.getElementById('decks');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-2 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200"
            >
              My Library ({decks.length})
            </button>
          )}
        </nav>

        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 pt-4 pb-24">
          {/* Left Column */}
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-600 rounded-full font-black text-xs uppercase tracking-widest shadow-sm border border-blue-100">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Revolutionizing Study Time
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Study <span className="text-blue-600">smarter</span>,<br /> 
              not <span className="text-orange-500">harder</span> with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 underline decoration-blue-500/20">flashcard generator</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed font-sans">
              Turn complex PDFs into teacher-grade flashcards in seconds. Use high-performance AI to master any subject.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-6">
              <button
                onClick={() => setShowUpload(true)}
                className="group px-10 py-5 bg-blue-600 hover:bg-slate-900 text-white rounded-3xl font-black text-xl transition-all shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-4"
              >
                <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                Upload PDF Now
              </button>
            </div>
          </div>

          {/* Right Column (Hero Image) */}
          <div className="flex-1 relative w-full max-w-2xl lg:max-w-none">
            <div className="relative aspect-[3/4] rounded-[4.5rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.25)] border-[16px] border-white transform lg:rotate-2 hover:rotate-0 transition-all duration-1000 group">
              <Image 
                src="/hero-card.jpeg" 
                alt="Colorful Flashcards" 
                fill
                loading="eager"
                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* Pop Overlays */}
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-orange-400 rounded-[2rem] flex items-center justify-center rotate-12 shadow-2xl animate-bounce-slow">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            
            <div className="absolute -bottom-6 -left-8 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-50 animate-float hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Results</p>
                  <p className="text-xl font-black text-slate-900 leading-none tracking-tight">AI Mastered</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Library Section */}
        {decks.length > 0 && (
          <section id="decks" className="space-y-16 py-16 border-t border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <h2 className="text-5xl font-black text-slate-900 tracking-tight">Your Smart Library</h2>
                <p className="text-xl text-slate-500 font-medium">All your learning materials, powered by AI.</p>
              </div>
              <div className="flex items-center gap-5 px-10 py-5 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/40 text-slate-900 font-black text-2xl">
                <BookOpen className="w-8 h-8 text-blue-600" />
                {decks.length} Decks
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {decks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onStudy={handleStudy}
                  onDelete={deleteDeck}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Pop Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-3xl bg-white rounded-[5rem] p-8 md:p-12 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.5)] border-[16px] border-slate-50 relative overflow-hidden">
            <button 
              onClick={() => setShowUpload(false)}
              className="absolute top-12 right-12 p-3 bg-slate-100 hover:bg-red-500 hover:text-white rounded-full transition-all group active:scale-90"
            >
              <Plus className="w-10 h-10 rotate-45" />
            </button>
            
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-blue-100 rounded-[2.5rem] flex items-center justify-center text-blue-600 mx-auto transform -rotate-12 shadow-lg shadow-blue-500/10">
                  <Sparkles className="w-12 h-12" />
                </div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tight">Create Magic</h2>
                <p className="text-xl text-slate-500 font-medium max-w-sm mx-auto">Upload your PDF and let our AI teacher build your mission-ready deck.</p>
              </div>
              
              <UploadZone
                onSuccess={(deck) => {
                  addDeck(deck);
                  setShowUpload(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Pro Study Tips Sticky Note */}
      <section className="pt-12 pb-24">
        <motion.div 
          initial={{ rotate: -1, y: 20, opacity: 0 }}
          whileInView={{ rotate: 1, y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-yellow-100 p-10 rounded-[2rem] shadow-xl border-2 border-yellow-200 relative overflow-hidden group"
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-400 rounded-full shadow-inner border-2 border-red-500" />
          <div className="space-y-6 relative z-10">
            <h3 className="text-3xl font-black text-slate-800 question-text text-center pt-2">
              Student Guide 📝
            </h3>
            <ul className="space-y-4 question-text text-xl text-slate-700 font-medium text-left">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-black">●</span>
                <span><strong className="text-slate-900">Hard</strong> keeps the card in your current session so you can try again!</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-black">●</span>
                <span><strong className="text-slate-900">Good & Easy</strong> push cards to tomorrow so you don't over-study.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-black">●</span>
                <span>To get <strong className="text-slate-900">100% Mastery</strong>, you need to get a card right in <span className="underline decoration-blue-400 font-black">3 separate sessions</span>.</span>
              </li>
            </ul>
            <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest pt-4">
              Happy Learning! ✨
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
