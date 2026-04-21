'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2 } from 'lucide-react';
import { processPdf } from '@/lib/pdf-actions';
import { Deck } from '@/types';

interface UploadZoneProps {
  onSuccess: (deck: Deck) => void;
}

export function UploadZone({ onSuccess }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const deck = await processPdf(formData);
      if (deck) {
        onSuccess(deck);
      } else {
        setError('Failed to generate flashcards. Please try another PDF.');
      }
    } catch (err) {
      setError('An error occurred during processing.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <label className="relative block group">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="sr-only"
        />
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            cursor-pointer rounded-[3rem] border-[4px] border-dashed p-10 lg:p-14 text-center
            transition-all duration-300 flex flex-col items-center gap-6
            ${isUploading 
              ? 'bg-blue-50 border-blue-400' 
              : 'bg-yellow-50 border-yellow-400 hover:bg-yellow-100 shadow-[8px_8px_0px_#1a1a5e]'
            }
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-6 animate-pulse">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <div>
                <p className="text-2xl font-black text-[#1a1a5e] tracking-tight">
                  AI is analyzing...
                </p>
                <p className="text-slate-500 font-medium">
                  Extracting concepts from your PDF
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-yellow-400 rounded-[2rem] flex items-center justify-center text-white border-[3px] border-[#1a1a5e] shadow-[4px_4px_0px_#1a1a5e]">
                <Upload className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-[#1a1a5e] tracking-tight">
                  Drop PDF here
                </h3>
                <p className="text-lg text-slate-500 font-medium">
                  Chapters, notes, & handouts
                </p>
              </div>
              <div className="px-8 py-3 bg-[#1a1a5e] text-white rounded-2xl text-lg font-black transition-transform group-hover:scale-110 shadow-lg">
                Select File
              </div>
            </>
          )}
        </motion.div>
      </label>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6 text-red-500 font-black"
        >
          ⚠️ {error}
        </motion.p>
      )}
    </div>
  );
}
