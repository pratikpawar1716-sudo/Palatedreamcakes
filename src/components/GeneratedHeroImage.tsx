import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { GoogleGenAI } from "@google/genai";
import { Loader2 } from 'lucide-react';

export const GeneratedHeroImage = () => {
  const { heroImage, setHeroImage } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // High-quality editorial masterpiece fallback for instant first-load
  const fallbackUrl = "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1920&auto=format&fit=crop";

  useEffect(() => {
    if (!heroImage) {
      const generateInitialHero = async () => {
        setIsGenerating(true);
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const prompt = "A hyper-realistic, ultra-luxury 3-tier wedding cake with intricate gold leaf detailing, white orchids, and a minimalist marble background, cinematic lighting, 8k resolution, professional food photography";
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [{ text: prompt }],
            },
            config: {
              imageConfig: {
                aspectRatio: "9:16"
              }
            }
          });

          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64EncodeString = part.inlineData.data;
              const imageUrl = `data:image/png;base64,${base64EncodeString}`;
              setHeroImage(imageUrl);
              break;
            }
          }
        } catch (err) {
          console.error("Initial hero generation failed:", err);
        } finally {
          setIsGenerating(false);
        }
      };

      generateInitialHero();
    }
  }, [heroImage, setHeroImage]);

  return (
    <div className="w-full h-full relative bg-[#F9F7F4] flex items-center justify-center">
      {isGenerating && !heroImage && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FFFACA] gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#004F39]" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#004F39] font-black animate-pulse">Manifesting AI Masterpiece...</p>
        </div>
      )}
      
      <motion.img 
        key={heroImage || fallbackUrl}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        src={heroImage || fallbackUrl} 
        alt="THE LUXURY CAKE STUDIO Hero Masterpiece" 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        loading="eager"
        // @ts-ignore
        fetchPriority="high"
        decoding="sync"
      />
      
      {/* Subtle overlay to ensure text readability if needed */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
    </div>
  );
};
