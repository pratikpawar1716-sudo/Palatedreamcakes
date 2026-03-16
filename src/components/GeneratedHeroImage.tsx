import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion } from 'motion/react';

const getAiClient = () => {
  let apiKey = '';
  try {
    // @ts-ignore
    apiKey = (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) || '';
  } catch (e) {
    apiKey = '';
  }
  return new GoogleGenAI({ apiKey });
};

export const GeneratedHeroImage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(localStorage.getItem('hero-cake-editorial-v2'));
  const [isAiGenerated, setIsAiGenerated] = useState(!!localStorage.getItem('hero-cake-editorial-v2'));

  // High-quality editorial masterpiece fallback for instant first-load
  const fallbackUrl = "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1920&auto=format&fit=crop";

  useEffect(() => {
    if (isAiGenerated) return;

    const generate = async () => {
      try {
        let apiKey = '';
        try {
          // @ts-ignore
          apiKey = (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) || '';
        } catch (e) {
          apiKey = '';
        }

        if (!apiKey || apiKey === 'undefined') {
          console.warn('GEMINI_API_KEY is missing or invalid. Using fallback image.');
          return;
        }

        const ai = getAiClient();
        const prompt = `A full-bleed, high-resolution editorial photograph of a multi-tiered luxury cake. 
        The cake is a 3-tier masterpiece with a smooth cream-colored fondant base. 
        It features extremely intricate, hand-painted artisanal patterns inspired by regal tapestries and fine porcelain. 
        The patterns include symmetrical floral and geometric motifs in deep burgundy, midnight blue, and shimmering gold. 
        The cake is adorned with a few delicate, hand-crafted sugar flowers in soft pink and cream. 
        The setting is a soft-focus, moody studio background with cinematic lighting that highlights the textures and gold detailing. 
        The overall aesthetic is "Quiet Luxury" and highly sophisticated. 
        8k resolution, professional food photography.`;

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
            const base64 = part.inlineData.data;
            const url = `data:image/jpeg;base64,${base64}`;
            setImageUrl(url);
            setIsAiGenerated(true);
            try {
              localStorage.setItem('hero-cake-editorial-v2', url);
            } catch (e) {
              console.warn('LocalStorage might be full');
            }
          }
        }
      } catch (error) {
        console.error('Error generating image:', error);
      }
    };

    generate();
  }, [isAiGenerated]);

  return (
    <div className="w-full h-full relative bg-[#F9F7F4]">
      <motion.img 
        key={imageUrl || fallbackUrl}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        src={imageUrl || fallbackUrl} 
        alt="The Palette Stories Hero Masterpiece" 
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
