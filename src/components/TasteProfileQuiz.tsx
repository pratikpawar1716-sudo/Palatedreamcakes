import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Sparkles, Utensils, Users, Calendar, User, Loader2 } from 'lucide-react';
import { sendSweetstoryOrder } from '../utils/whatsapp';
import { GoogleGenAI } from "@google/genai";

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommend: (palette: string) => void;
}

export const TasteProfileQuiz = ({ isOpen, onClose, onRecommend }: QuizProps) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selections, setSelections] = useState({
    userName: '',
    occasion: '',
    palette: '',
    count: ''
  });

  const steps = [
    {
      id: 1,
      title: "The Patron",
      subtitle: "May we have the honor of your name?",
      icon: User,
      type: 'input',
      placeholder: "ENTER YOUR NAME",
      key: 'userName'
    },
    {
      id: 2,
      title: "The Occasion",
      subtitle: "What are we celebrating today?",
      icon: Calendar,
      type: 'options',
      options: ['Birthday', 'Anniversary', 'Just Because'],
      key: 'occasion'
    },
    {
      id: 3,
      title: "The Palette",
      subtitle: "Which flavors speak to your soul?",
      icon: Utensils,
      type: 'options',
      options: ['Rich & Chocolatey', 'Fruity & Fresh', 'Classic & Nutty'],
      key: 'palette'
    },
    {
      id: 4,
      title: "The Guest Count",
      subtitle: "How many hearts are joining the feast?",
      icon: Users,
      type: 'options',
      options: ['Intimate (2-4)', 'Family (5-10)', 'Party (10+)'],
      key: 'count'
    }
  ];

  const generateCakeImage = async (userName: string, palette: string, occasion: string) => {
    setIsGenerating(true);
    try {
      let apiKey = '';
      try {
        // @ts-ignore
        apiKey = (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) || '';
      } catch (e) {
        apiKey = '';
      }
      
      if (!apiKey || apiKey === 'undefined') {
        throw new Error('GEMINI_API_KEY is missing');
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `A high-end, artisanal, luxury bespoke cake for ${userName}'s ${occasion}. 
      The cake has a ${palette} flavor profile. 
      It is beautifully decorated with edible art, gold leaf, and elegant textures. 
      Cinematic lighting, professional food photography, minimalist background, 4k resolution.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelect = (option: string) => {
    const currentKey = steps[step - 1].key;
    setSelections(prev => ({ ...prev, [currentKey]: option }));
    if (step < 4) {
      setStep(step + 1);
    } else {
      setStep(5);
      generateCakeImage(selections.userName, option, selections.occasion);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setStep(5);
      generateCakeImage(selections.userName, selections.palette, selections.occasion);
    }
  };

  const handleOrder = () => {
    sendSweetstoryOrder('quiz', selections);
  };

  const handleViewRecommendations = () => {
    let category = 'All';
    if (selections.palette === 'Rich & Chocolatey') category = 'Signature';
    if (selections.palette === 'Fruity & Fresh') category = 'Bento';
    if (selections.palette === 'Classic & Nutty') category = 'Couture';
    
    onRecommend(category);
    onClose();
    
    const grid = document.querySelector('.artisanal-grid-trigger');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setSelections({ userName: '', occasion: '', palette: '', count: '' });
    setGeneratedImage(null);
  };

  const currentStep = steps[step - 1];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/60 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-2xl bg-cream rounded-[3rem] overflow-hidden shadow-2xl border border-white/20"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 text-charcoal/40 hover:text-charcoal transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="p-12 md:p-20">
              {step <= 4 ? (
                <div className="space-y-12">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map(i => (
                        <div 
                          key={i} 
                          className={`h-1 rounded-full transition-all duration-500 ${
                            i === step ? 'w-8 bg-[#B87A62]' : i < step ? 'w-4 bg-[#B87A62]/40' : 'w-4 bg-charcoal/10'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-charcoal/30">Step 0{step} / 04</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-[#B87A62]">
                      <currentStep.icon size={20} />
                      <span className="text-[10px] uppercase tracking-[0.4em] font-bold">{currentStep.title}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight">{currentStep.subtitle}</h2>
                  </div>

                  {currentStep.type === 'input' ? (
                    <div className="space-y-6">
                      <input 
                        type="text"
                        value={selections.userName}
                        onChange={(e) => setSelections(prev => ({ ...prev, userName: e.target.value }))}
                        placeholder={currentStep.placeholder}
                        className="w-full bg-white border border-charcoal/10 rounded-2xl py-6 px-8 text-center text-xs tracking-[0.3em] focus:outline-none focus:border-[#B87A62] transition-all"
                        autoFocus
                      />
                      <button 
                        onClick={handleNext}
                        disabled={!selections.userName}
                        className="w-full py-6 bg-[#B87A62] text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:bg-charcoal transition-all duration-500 disabled:opacity-50"
                      >
                        Continue
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {currentStep.options?.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleSelect(option)}
                          className="group relative w-full text-left p-6 rounded-2xl border border-charcoal/5 bg-white hover:border-[#B87A62] hover:shadow-xl hover:shadow-[#B87A62]/5 transition-all duration-500"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-serif text-xl text-charcoal group-hover:text-[#B87A62] transition-colors">{option}</span>
                            <ChevronRight size={18} className="text-charcoal/20 group-hover:text-[#B87A62] group-hover:translate-x-1 transition-all" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {step > 1 && (
                    <button 
                      onClick={() => setStep(step - 1)}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-charcoal/40 hover:text-charcoal transition-colors"
                    >
                      <ChevronLeft size={14} /> Back
                    </button>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-8"
                >
                  <div className="relative w-48 h-48 mx-auto">
                    {isGenerating ? (
                      <div className="w-full h-full bg-[#B87A62]/10 rounded-full flex flex-col items-center justify-center text-[#B87A62] space-y-4">
                        <Loader2 className="animate-spin" size={32} />
                        <span className="text-[8px] uppercase tracking-widest font-bold">Visualizing your story...</span>
                      </div>
                    ) : generatedImage ? (
                      <motion.img 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={generatedImage} 
                        alt="Generated Cake" 
                        className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#B87A62]/10 rounded-full flex items-center justify-center text-[#B87A62]">
                        <Sparkles size={32} />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-serif text-charcoal">A Masterpiece for {selections.userName}</h2>
                    <p className="text-charcoal/60 font-light italic">"A {selections.palette.toLowerCase()} creation for your {selections.occasion.toLowerCase()} celebration."</p>
                  </div>

                  <div className="space-y-4">
                    <motion.button 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleViewRecommendations}
                      className="w-full py-6 bg-charcoal text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:bg-[#B87A62] transition-all duration-500 shadow-xl shadow-charcoal/10"
                    >
                      View My Recommendations
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleOrder}
                      className="w-full py-6 border border-[#B87A62] text-[#B87A62] text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:bg-[#B87A62] hover:text-white transition-all duration-500"
                    >
                      Order Recommendation via WhatsApp
                    </motion.button>
                  </div>

                  <button 
                    onClick={resetQuiz}
                    className="text-[9px] uppercase tracking-widest text-charcoal/40 hover:text-charcoal transition-colors font-bold"
                  >
                    Retake Quiz
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
