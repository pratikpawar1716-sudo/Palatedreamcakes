import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, ChevronLeft, Heart, Zap, Moon, Sun, Coffee } from 'lucide-react';
import { sendSweetstoryOrder } from '../utils/whatsapp';

const FLAVORS = [
  {
    id: 'chocolate',
    name: 'Signature Dark Chocolate',
    description: 'Intense, rich, and deeply passionate.',
    mood: 'Intense & Passionate',
    image: 'https://picsum.photos/seed/chocolate/800/1000'
  },
  {
    id: 'lemon',
    name: 'Zesty Lemon Blueberry',
    description: 'Fresh, vibrant, and full of energy.',
    mood: 'Fresh & Energetic',
    image: 'https://picsum.photos/seed/lemon/800/1000'
  },
  {
    id: 'vanilla',
    name: 'Classic Vanilla Bean',
    description: 'Calm, elegant, and timelessly sophisticated.',
    mood: 'Calm & Elegant',
    image: 'https://picsum.photos/seed/vanilla/800/1000'
  },
  {
    id: 'caramel',
    name: 'Salted Caramel Praline',
    description: 'Bold, adventurous, and delightfully complex.',
    mood: 'Bold & Adventurous',
    image: 'https://picsum.photos/seed/caramel/800/1000'
  },
  {
    id: 'velvet',
    name: 'Red Velvet Rose',
    description: 'Romantic, dreamy, and soft as a whisper.',
    mood: 'Romantic & Dreamy',
    image: 'https://picsum.photos/seed/velvet/800/1000'
  }
];

const QUESTIONS = [
  {
    id: 1,
    question: "How are you feeling right now?",
    options: [
      { text: "Passionate & Driven", value: "chocolate", icon: Heart },
      { text: "Energetic & Bright", value: "lemon", icon: Zap },
      { text: "Calm & Serene", value: "vanilla", icon: Moon },
      { text: "Adventurous & Bold", value: "caramel", icon: Sun },
      { text: "Romantic & Dreamy", value: "velvet", icon: Sparkles }
    ]
  },
  {
    id: 2,
    question: "What's your ideal setting?",
    options: [
      { text: "Dimly lit library", value: "chocolate", icon: Coffee },
      { text: "Sunny garden party", value: "lemon", icon: Sun },
      { text: "Minimalist art gallery", value: "vanilla", icon: Moon },
      { text: "Bustling city street", value: "caramel", icon: Zap },
      { text: "Starlit rooftop", value: "velvet", icon: Sparkles }
    ]
  },
  {
    id: 3,
    question: "Pick a texture...",
    options: [
      { text: "Velvety & Smooth", value: "chocolate", icon: Heart },
      { text: "Light & Airy", value: "lemon", icon: Zap },
      { text: "Silky & Classic", value: "vanilla", icon: Moon },
      { text: "Crunchy & Rich", value: "caramel", icon: Sun },
      { text: "Soft & Delicate", value: "velvet", icon: Sparkles }
    ]
  },
  {
    id: 4,
    question: "What's your morning ritual?",
    options: [
      { text: "Strong black coffee", value: "chocolate", icon: Coffee },
      { text: "Fresh fruit smoothie", value: "lemon", icon: Sun },
      { text: "Earl Grey tea", value: "vanilla", icon: Moon },
      { text: "Spiced chai latte", value: "caramel", icon: Zap },
      { text: "Rose petal water", value: "velvet", icon: Sparkles }
    ]
  },
  {
    id: 5,
    question: "Choose a color palette...",
    options: [
      { text: "Deep Umbers & Golds", value: "chocolate", icon: Heart },
      { text: "Citrus Yellows & Blues", value: "lemon", icon: Zap },
      { text: "Ivories & Soft Grays", value: "vanilla", icon: Moon },
      { text: "Burnt Oranges & Coppers", value: "caramel", icon: Sun },
      { text: "Dusty Pinks & Creams", value: "velvet", icon: Sparkles }
    ]
  }
];

export const MoodFlavourQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<typeof FLAVORS[0] | null>(null);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate result based on most frequent answer
      const counts: Record<string, number> = {};
      newAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
      const winnerId = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      setResult(FLAVORS.find(f => f.id === winnerId) || FLAVORS[0]);
      setStep(QUESTIONS.length);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  const handleOrder = () => {
    if (result) {
      sendSweetstoryOrder('quiz', {
        palette: result.name,
        occasion: 'Mood Discovery',
        count: 'Custom'
      });
    }
  };

  return (
    <section className="py-32 px-4 bg-[#FFFACA] relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#004F39] font-black mb-4 block">Flavor Discovery</span>
          <h2 className="text-5xl md:text-7xl font-serif font-black text-[#151613]">The <span className="italic">Mood</span> Quiz</h2>
          <p className="mt-6 text-[#151613]/40 font-black italic text-lg">Let your emotions guide your taste buds.</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-black/5 overflow-hidden min-h-[600px] flex flex-col">
          <AnimatePresence mode="wait">
            {step < QUESTIONS.length ? (
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-16 flex-1 flex flex-col"
              >
                <div className="flex justify-between items-center mb-12">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#004F39]">Question {step + 1} / 5</span>
                  <div className="flex gap-1">
                    {QUESTIONS.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-6 bg-[#004F39]' : 'w-2 bg-[#004F39]/10'}`} />
                    ))}
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-serif font-black text-[#151613] mb-12 leading-tight">
                  {QUESTIONS[step].question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  {QUESTIONS[step].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option.value)}
                      className="group flex items-center gap-6 p-6 rounded-2xl border border-black/5 bg-[#FFFACA]/10 hover:bg-[#004F39] hover:border-[#004F39] transition-all duration-500 text-left"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#004F39] group-hover:bg-white/20 group-hover:text-white transition-all">
                        <option.icon size={24} />
                      </div>
                      <span className="font-serif font-black text-xl text-[#151613] group-hover:text-white transition-colors">{option.text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col md:flex-row h-full"
              >
                <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                  <img src={result?.image} alt={result?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center bg-white">
                  <div className="w-16 h-16 bg-[#004F39]/10 rounded-full flex items-center justify-center text-[#004F39] mb-8">
                    <Sparkles size={32} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#004F39] font-black mb-4 block">Your Match Found</span>
                  <h3 className="text-4xl font-serif font-black text-[#151613] mb-4">{result?.name}</h3>
                  <p className="text-[#151613]/60 font-black italic mb-8 leading-relaxed">
                    "{result?.description}"
                  </p>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={handleOrder}
                      className="w-full py-5 bg-[#004F39] text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-[#151613] transition-all duration-500 shadow-xl shadow-[#004F39]/20"
                    >
                      Order this Flavour
                    </button>
                    <button 
                      onClick={reset}
                      className="w-full py-5 border border-[#004F39] text-[#004F39] text-[10px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-[#004F39] hover:text-white transition-all duration-500"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
