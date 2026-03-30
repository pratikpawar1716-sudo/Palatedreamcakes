import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const GoldLeafLine = ({ delay = 0 }: { delay?: number }) => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <motion.path
      d="M -10,50 Q 25,20 50,50 T 110,50"
      fill="none"
      stroke="#B89B5E"
      strokeWidth="0.1"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 3, delay, ease: "easeInOut" }}
    />
    <motion.path
      d="M 50,-10 Q 80,25 50,50 T 50,110"
      fill="none"
      stroke="#B89B5E"
      strokeWidth="0.1"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 4, delay: delay + 0.5, ease: "easeInOut" }}
    />
  </svg>
);

const Chapter = ({ 
  children, 
  image,
  className = "" 
}: { 
  children: React.ReactNode; 
  image: string;
  className?: string;
}) => (
  <section className={`relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#F5F0E6] snap-start ${className}`}>
    {/* Background Image with Parallax Effect */}
    <motion.div 
      initial={{ scale: 1.1, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 0.6 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="absolute inset-0 z-0"
    >
      <img 
        src={image} 
        alt="Process" 
        className="w-full h-full object-cover grayscale opacity-80"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0E6]/80 via-transparent to-[#F5F0E6]/80" />
    </motion.div>

    <GoldLeafLine />
    <div className="relative z-10">
      {children}
    </div>
  </section>
);

export const NarrativeScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const processImages = {
    alchemy: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=1920&auto=format&fit=crop", // Ingredients
    craft: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1920&auto=format&fit=crop", // Hands decorating
    masterpiece: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1920&auto=format&fit=crop" // Finished cake
  };

  return (
    <div ref={containerRef} className="relative w-full bg-[#F5F0E6]">
      {/* Section Header */}
      <div className="sticky top-0 z-20 pt-20 pb-10 text-center pointer-events-none">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[10px] uppercase tracking-[0.8em] font-black text-[#333333]/60"
        >
          Narrative Scroll
        </motion.h2>
      </div>

      {/* Chapter 1: THE ALCHEMY */}
      <Chapter image={processImages.alchemy}>
        <div className="text-center px-6">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="text-[8px] uppercase tracking-[0.5em] font-black text-[#B89B5E] mb-4 block"
          >
            Chapter I
          </motion.span>
          <motion.h2
            initial={{ filter: "blur(20px)", opacity: 0 }}
            whileInView={{ filter: "blur(0px)", opacity: 1 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-5xl md:text-8xl lg:text-9xl font-serif font-black text-[#333333] tracking-tighter uppercase"
          >
            The <span className="italic text-[#B89B5E]">Alchemy</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.4, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-6 text-[10px] md:text-xs uppercase tracking-[0.8em] font-black text-[#333333]"
          >
            Where raw elements transform
          </motion.p>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#B89B5E]/40"
        >
          <span className="text-[8px] uppercase tracking-[0.4em] font-black">Scroll to Begin</span>
          <ChevronDown size={16} />
        </motion.div>
      </Chapter>

      {/* Chapter 2: THE CRAFT */}
      <Chapter image={processImages.craft}>
        <div className="text-center px-6">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="text-[8px] uppercase tracking-[0.5em] font-black text-[#B89B5E] mb-4 block"
          >
            Chapter II
          </motion.span>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.8 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                }
              }
            }}
            className="text-5xl md:text-8xl lg:text-9xl font-serif font-black text-[#333333] tracking-tighter uppercase flex flex-wrap justify-center gap-x-4 md:gap-x-8"
          >
            <span className="flex">
              {["T", "H", "E"].map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <span className="flex italic text-[#B89B5E]">
              {["C", "R", "A", "F", "T"].map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.4, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-6 text-[10px] md:text-xs uppercase tracking-[0.8em] font-black text-[#333333]"
          >
            Precision in every movement
          </motion.p>
        </div>
      </Chapter>

      {/* Chapter 3: THE MASTERPIECE */}
      <Chapter image={processImages.masterpiece}>
        <div className="text-center px-6">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="text-[8px] uppercase tracking-[0.5em] font-black text-[#B89B5E] mb-4 block"
          >
            Chapter III
          </motion.span>
          <motion.div
            initial={{ scale: 1.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-serif font-black text-[#333333] tracking-tighter uppercase">
              The <span className="italic text-[#B89B5E]">Masterpiece</span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-6 text-[10px] md:text-xs uppercase tracking-[0.8em] font-black text-[#333333]"
            >
              The final reveal awaits
            </motion.p>
          </motion.div>
        </div>
      </Chapter>
    </div>
  );
};
