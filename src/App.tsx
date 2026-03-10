import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Instagram, Facebook, Plus, Upload, Sparkles, Lock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Float, Text, Center, Html } from '@react-three/drei';
import { NarrativeScroll } from './components/NarrativeScroll';
import { products as initialProducts, Product } from './data/products';
import { sendSweetstoryOrder } from './utils/whatsapp';
import { AdminPanel } from './components/AdminPanel';
import { TasteProfileQuiz } from './components/TasteProfileQuiz';
import { MoodFlavourQuiz } from './components/MoodFlavourQuiz';
import { GeneratedHeroImage } from './components/GeneratedHeroImage';
import { OrderTracker } from './components/OrderTracker';
import BulkInquiryConcierge from './components/BulkInquiryConcierge';

gsap.registerPlugin(ScrollTrigger);

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Background blur logic
      setIsScrolled(currentScrollY > 50);

      // Show/Hide logic
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-[100] px-4 md:px-8 py-6 pointer-events-none"
    >
      <div className={`
        max-w-7xl mx-auto flex justify-between items-center px-6 py-4 rounded-full transition-all duration-500 pointer-events-auto relative overflow-hidden
        ${isScrolled ? 'bg-white/70 backdrop-blur-xl border border-black/5 shadow-2xl' : 'bg-transparent'}
      `}>
        {/* Scroll Progress Bar */}
        <motion.div 
          className="absolute bottom-0 left-0 h-[2px] bg-[#004F39]/30 origin-left"
          style={{ scaleX: scrollYProgress, width: '100%' }}
        />
        {/* Left: Navigation Links */}
        <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-[#151613]">
          <a href="#bespoke-studio" className="hover:text-[#004F39] transition-colors">Studio</a>
          <a href="#collection" className="hover:text-[#004F39] transition-colors">Collection</a>
          <a href="#order-tracking" className="hover:text-[#004F39] transition-colors">Track Order</a>
        </div>

        {/* Center: Logo */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004F39] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#004F39]"></span>
            </span>
            <span className="text-[7px] uppercase tracking-[0.4em] text-[#004F39] font-bold">Live Studio</span>
          </div>
          <div className="text-xl md:text-2xl font-serif italic tracking-tighter text-[#151613]">
            The Palette Stories
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex gap-4 md:gap-8 items-center">
          <a href="#story" className="hidden md:block text-[10px] uppercase tracking-[0.3em] font-bold text-[#151613] hover:text-[#004F39] transition-colors">
            Our Story
          </a>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-[#004F39] text-[#FFFACA] rounded-full text-[9px] tracking-[0.2em] font-bold uppercase shadow-lg shadow-[#004F39]/20 flex items-center gap-2"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Consultation</span>
            <span className="sm:hidden">Book</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

const Hero = () => {
  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col md:flex-row overflow-hidden bg-[#FFFACA] snap-start">
      {/* Left Side: Content (Mobile: Second) */}
      <div className="order-2 md:order-1 w-full md:w-[55%] flex flex-col justify-center px-8 md:px-24 py-20 md:py-0 bg-[#FFFACA] relative z-10">
        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-12 left-8 md:left-24"
        >
          <span className="text-[11px] md:text-xs uppercase tracking-[0.6em] font-bold text-[#004F39] font-sans">
            THE PALETTE STORIES
          </span>
        </motion.div>

        {/* Main Headline */}
        <div className="max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-display text-[#151613] leading-[0.9] tracking-tight mb-8"
            style={{ fontOpticalSizing: 'auto' }}
          >
            Come, let's create <span className="italic font-serif">your</span> story
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-[#151613]/70 text-base md:text-lg font-sans font-light leading-relaxed mb-12 max-w-md"
          >
            A culinary sanctuary where art meets flavor, crafting bespoke cakes and confections that define your unique legacy.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="flex flex-col md:flex-row gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const studio = document.querySelector('#bespoke-studio');
                studio?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative px-10 py-5 bg-[#004F39] text-[#FFFACA] border border-[#B89B5E]/30 rounded-full text-[10px] tracking-[0.3em] font-bold uppercase overflow-hidden transition-all duration-500 hover:bg-[#004F39]/90 hover:border-[#B89B5E] shadow-2xl"
            >
              <span className="relative z-10 flex items-center gap-3">
                BEGIN YOUR CHAPTER <span className="text-lg">→</span>
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Sparkles (Subtle) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity, 
                delay: Math.random() * 5,
              }}
              className="absolute text-[#B89B5E] text-xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              ✦
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Side: Visual (Mobile: First) */}
      <div className="order-1 md:order-2 w-full md:w-[45%] h-[60vh] md:h-full relative overflow-hidden">
        <GeneratedHeroImage />
        {/* Subtle dark gradient overlay at the bottom for better depth and contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#151613]/60 via-transparent to-transparent pointer-events-none" />
        
        {/* Mobile-only overlay to help text transition */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FFFACA]" />
      </div>
    </section>
  );
};

const FloatingIngredients = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".petal-1", {
        y: -200,
        rotation: 360,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
      gsap.to(".petal-2", {
        y: -400,
        rotation: -180,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
      gsap.to(".macaron-1", {
        y: -300,
        rotation: 90,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
      <div className="petal-1 absolute top-[20%] left-[10%] w-12 h-12 bg-rose/40 rounded-full blur-sm" />
      <div className="petal-2 absolute top-[60%] right-[15%] w-8 h-8 bg-rose/30 rounded-full blur-md" />
      <div className="macaron-1 absolute top-[40%] left-[80%] w-16 h-16 border-2 border-rose/20 rounded-full flex items-center justify-center">
        <div className="w-12 h-2 bg-rose/10 rounded-full" />
      </div>
    </div>
  );
};

// --- 3D Components ---

const CakeModel = ({ color, customName, activeToppings }: { color: string, customName: string, activeToppings: string[] }) => {
  const cakeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cakeRef.current) {
      cakeRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={cakeRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Tiers */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.8, 32]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[1.1, 1.1, 0.8, 32]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.8, 32]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Toppings */}
        <group position={[0, 2.0, 0]}>
          {activeToppings.includes('Macarons') && (
            <group position={[0, 0, 0]}>
              {[0, 1, 2].map((i) => (
                <mesh key={i} position={[Math.cos(i * 2) * 0.4, 0.1, Math.sin(i * 2) * 0.4]} castShadow>
                  <sphereGeometry args={[0.12, 16, 16]} />
                  <meshStandardMaterial color={i === 0 ? "#FFB7C5" : i === 1 ? "#98FF98" : "#E0B0FF"} roughness={0.3} />
                </mesh>
              ))}
            </group>
          )}
          {activeToppings.includes('Gold Leaves') && (
            <group>
              {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} position={[Math.random() * 1.2 - 0.6, -0.2 - Math.random() * 1.5, 0.6 + Math.random() * 0.4]} rotation={[Math.random(), Math.random(), 0]}>
                  <planeGeometry args={[0.15, 0.15]} />
                  <meshStandardMaterial color="#B89B5E" metalness={1} roughness={0.1} side={THREE.DoubleSide} />
                </mesh>
              ))}
            </group>
          )}
          {activeToppings.includes('Orchids') && (
            <group position={[0.3, 0.1, 0.3]}>
              {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} position={[Math.cos(i) * 0.15, Math.sin(i) * 0.1, 0]} rotation={[0, 0, i]}>
                  <sphereGeometry args={[0.1, 8, 8]} scale={[1, 0.3, 1]} />
                  <meshStandardMaterial color="#E0B0FF" roughness={0.5} />
                </mesh>
              ))}
            </group>
          )}
          {activeToppings.includes('Chocolate') && (
            <group>
              {[0, 1, 2].map((i) => (
                <mesh key={i} position={[-0.4 + i * 0.3, 0.1, -0.2]} rotation={[0.5, 0.5, 0]} castShadow>
                  <boxGeometry args={[0.2, 0.2, 0.05]} />
                  <meshStandardMaterial color="#3D2B1F" roughness={0.2} />
                </mesh>
              ))}
            </group>
          )}
          {activeToppings.includes('Florals') && (
            <group position={[-0.3, 0.1, 0.4]}>
              {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} position={[Math.cos(i) * 0.1, 0, Math.sin(i) * 0.1]}>
                  <sphereGeometry args={[0.08, 8, 8]} />
                  <meshStandardMaterial color="#FFF0F5" roughness={0.6} />
                </mesh>
              ))}
            </group>
          )}
        </group>

        {/* Nameplate on Cake */}
        <group position={[0, 1.2, 1.15]} rotation={[-0.1, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.3, 0.02]} />
            <meshStandardMaterial color="white" roughness={0.2} />
          </mesh>
          <Center position={[0, 0, 0.02]}>
            <Text 
              fontSize={0.08}
              color="#333"
              anchorX="center"
              anchorY="middle"
            >
              {customName}
            </Text>
          </Center>
        </group>
      </Float>

      {/* Pedestal */}
      <group position={[0, -0.8, 0]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[1.8, 2.0, 0.2, 32]} />
          <meshStandardMaterial color="#f8f8f8" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.6, 1.0, 16]} />
          <meshStandardMaterial color="#f8f8f8" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, -1.2, 0]} castShadow>
          <cylinderGeometry args={[1.0, 1.2, 0.2, 32]} />
          <meshStandardMaterial color="#f8f8f8" roughness={0.2} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

const BespokeStudio = () => {
  const [flavor, setFlavor] = useState('Belgian Truffle');
  const [toppings, setToppings] = useState<string[]>([]);
  const [customName, setCustomName] = useState('IVAAN');
  const [size, setSize] = useState('0.5kg');

  const handleOrder = () => {
    sendSweetstoryOrder('bespoke', {
      base: flavor,
      toppings: toppings,
      size: size,
      customName: customName
    });
  };

  const flavors = {
    Premium: [
      { name: 'Gold Dusted Truffle', price: 4500, color: '#2D1B14', accent: '#B89B5E' },
      { name: 'Ratnagiri Alphonso', price: 3800, color: '#FFB347', accent: '#004F39' },
      { name: 'Belgian Truffle', price: 3500, color: '#3D2B1F', accent: '#004F39' },
      { name: 'Champagne Sparkle', price: 4200, color: '#F7E7CE', accent: '#B89B5E' },
      { name: 'Saffron Pistachio', price: 4000, color: '#E9D66B', accent: '#004F39' },
    ],
    Classic: [
      { name: 'Chocolate', price: 1800, color: '#3D2B1F', accent: '#004F39' },
      { name: 'Vanilla', price: 1500, color: '#FFFACA', accent: '#004F39' },
      { name: 'Butterscotch', price: 1600, color: '#E9D66B', accent: '#004F39' },
      { name: 'Velvet Crimson', price: 2200, color: '#9B111E', accent: '#151613' },
      { name: 'Roasted Hazelnut', price: 2500, color: '#8E7618', accent: '#004F39' },
    ]
  };

  const toppingOptions = [
    { name: 'Macarons', price: 500, icon: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=100&auto=format&fit=crop' },
    { name: 'Gold Leaves', price: 800, icon: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=100&auto=format&fit=crop' },
    { name: 'Orchids', price: 600, icon: 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?q=80&w=100&auto=format&fit=crop' },
    { name: 'Chocolate', price: 400, icon: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=100&auto=format&fit=crop' },
    { name: 'Florals', price: 550, icon: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=100&auto=format&fit=crop' },
  ];

  const currentFlavor = [...flavors.Premium, ...flavors.Classic].find(f => f.name === flavor) || flavors.Classic[0];
  const toppingsPrice = toppings.reduce((acc, t) => acc + (toppingOptions.find(opt => opt.name === t)?.price || 0), 0);
  const totalPrice = currentFlavor.price + toppingsPrice;

  const toggleTopping = (name: string) => {
    setToppings(prev => prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]);
  };

  return (
    <section id="bespoke-studio" className="py-32 px-4 md:px-20 bg-[#FFFACA] min-h-screen flex items-center justify-center overflow-hidden snap-start">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: 3D Stage */}
        <div className="relative flex flex-col items-center justify-center h-[500px] md:h-[700px] w-full bg-white/50 rounded-[3rem] backdrop-blur-sm border border-black/5 shadow-2xl overflow-hidden order-2 lg:order-1">
          <Canvas 
            shadows 
            dpr={[1, 1.5]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 2, 8], fov: 45 }}
          >
            <React.Suspense fallback={<Html center><div className="text-charcoal/20 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">Initializing Studio...</div></Html>}>
              <OrbitControls 
                enablePan={false} 
                minPolarAngle={Math.PI / 4} 
                maxPolarAngle={Math.PI / 1.5} 
                autoRotate 
                autoRotateSpeed={0.5}
                makeDefault
              />
              
              <ambientLight intensity={0.8} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
              <pointLight position={[-10, 5, -10]} intensity={1} />
              <directionalLight position={[0, 5, 5]} intensity={0.5} />
              
              <CakeModel color={currentFlavor.color} customName={customName} activeToppings={toppings} />
              
              <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
            </React.Suspense>
          </Canvas>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-40">
            <div className="w-12 h-1 bg-black/20 rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: [-48, 48] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-black/60"
              />
            </div>
            <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-[#151613]">360° Inspection</span>
          </div>
        </div>

        {/* Right: UI Panel */}
        <div className="text-[#151613] space-y-10 lg:pl-10 order-1 lg:order-2">
          <div className="space-y-2">
            <h2 className="text-6xl font-serif tracking-tighter uppercase leading-none">Bespoke<br/><span className="italic text-[#004F39]">Studio</span></h2>
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Crafting your unique story, layer by layer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Flavor Palette - Organized in Lines */}
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.4em] opacity-60 font-bold">Flavor Palette</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-[#004F39] font-bold mb-3">Premium Selection</p>
                  <div className="flex flex-wrap gap-2">
                    {flavors.Premium.map(f => (
                      <motion.button
                        key={f.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFlavor(f.name)}
                        className={`px-4 py-2 rounded-full text-[9px] tracking-widest uppercase border transition-all duration-300 ${
                          flavor === f.name 
                            ? 'bg-[#004F39] border-[#004F39] text-white shadow-lg shadow-[#004F39]/20' 
                            : 'bg-black/5 border-black/10 text-[#151613]/60 hover:border-black/30'
                        }`}
                      >
                        {f.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-[#151613]/40 font-bold mb-3">Classic Selection</p>
                  <div className="flex flex-wrap gap-2">
                    {flavors.Classic.map(f => (
                      <motion.button
                        key={f.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFlavor(f.name)}
                        className={`px-4 py-2 rounded-full text-[9px] tracking-widest uppercase border transition-all duration-300 ${
                          flavor === f.name 
                            ? 'bg-[#004F39] border-[#004F39] text-white shadow-lg shadow-[#004F39]/20' 
                            : 'bg-black/5 border-black/10 text-[#151613]/60 hover:border-black/30'
                        }`}
                      >
                        {f.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Topping Deck & Card */}
            <div className="space-y-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.4em] opacity-60 mb-4 font-bold">Topping Deck</h3>
                  <div className="flex flex-wrap gap-2">
                    {toppingOptions.map(opt => (
                      <motion.button 
                        key={opt.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTopping(opt.name)}
                        className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold border transition-all ${
                          toppings.includes(opt.name) 
                            ? 'bg-[#004F39] text-white border-[#004F39] shadow-lg' 
                            : 'bg-black/5 border-black/10 text-[#151613]/60 hover:border-black/30'
                        }`}
                      >
                        {opt.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.4em] opacity-60 mb-4 font-bold">Size Selection</h3>
                  <div className="flex gap-2">
                    {['0.5kg', '1kg', '2kg'].map(s => (
                      <button 
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold border transition-all ${
                          size === s 
                            ? 'bg-[#004F39] text-white border-[#004F39]' 
                            : 'bg-black/5 border-black/10 text-[#151613]/60 hover:border-black/30'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Card */}
              <div className="bg-black/5 rounded-3xl p-6 border border-black/10 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[8px] uppercase tracking-widest opacity-40">Selected Base</p>
                    <p className="text-sm font-serif italic">{flavor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-widest opacity-40">Est. Total</p>
                    <p className="text-xl font-serif text-[#004F39]">₹{totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[8px] uppercase tracking-widest opacity-40">Personalization</p>
                  <input 
                    type="text" 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-2 text-xs tracking-[0.2em] focus:outline-none focus:border-[#004F39] transition-colors uppercase font-serif italic"
                    placeholder="NAME ON CAKE"
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOrder}
                  className="w-full py-4 bg-[#004F39] text-[#FFFACA] text-[10px] uppercase tracking-[0.2em] font-bold rounded-xl hover:bg-[#151613] hover:text-white transition-all duration-500 shadow-xl"
                >
                  Confirm Creation
                </motion.button>
              </div>

              <div className="pt-4">
                <BulkInquiryConcierge productName={flavor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ProductCardProps {
  product: Product;
  priority: boolean;
  index: number;
  key?: string | number;
}

const ProductCard = ({ product, priority, index }: ProductCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(
    product.shortcode 
      ? `https://www.instagram.com/p/${product.shortcode}/media/?size=l` 
      : (product.images?.[0] || '')
  );
  const [hasError, setHasError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Fallback to Unsplash if Instagram fails
  const handleImageError = () => {
    if (!hasError && product.images?.[0]) {
      console.warn(`Instagram image failed for ${product.name}, falling back to Unsplash.`);
      setCurrentSrc(product.images[0]);
      setHasError(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before it enters viewport
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      ref={cardRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index % 3 * 0.1 }}
      whileHover={{ y: -12 }}
      className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-black/5"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FFFACA]/30">
        {/* Shimmer Placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 shimmer z-0" />
        )}
        
        {(isInView || index < 6) && (
          <motion.img
            src={currentSrc}
            alt={product.name}
            onLoad={() => {
              console.log(`Image loaded for ${product.name}`);
              setIsLoaded(true);
            }}
            onError={handleImageError}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full h-full object-cover transition-opacity duration-700 relative z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            referrerPolicy="no-referrer"
            loading={index < 6 ? "eager" : "lazy"}
            decoding="async"
            // @ts-ignore
            fetchPriority={index < 6 ? "high" : "low"}
          />
        )}
        
        {/* Subtle persistent Instagram badge */}
        <div className="absolute top-6 right-6 z-10">
          <a 
            href={`https://www.instagram.com/p/${product.shortcode}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-[#004F39] hover:text-white transition-all duration-500 group/link"
            title="View on Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="p-10 text-center flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[10px] uppercase tracking-[0.4em] text-[#004F39] font-bold mb-3 block"
        >
          {product.category}
        </motion.span>
        <h3 className="text-2xl font-serif mb-3 text-charcoal leading-tight">{product.name}</h3>
        <p className="text-xs text-charcoal/50 mb-6 px-2 font-light leading-relaxed line-clamp-2 italic">"{product.description}"</p>
        
        <a 
          href={`https://www.instagram.com/p/${product.shortcode}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] uppercase tracking-[0.2em] text-[#004F39] font-bold mb-8 hover:underline flex items-center gap-2"
        >
          View on Instagram <span className="text-xs">↗</span>
        </a>
        
        <motion.button 
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendSweetstoryOrder('grid', product)}
          className="w-full py-5 bg-[#004F39] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#151613] transition-all duration-500 rounded-full font-bold shadow-lg shadow-[#004F39]/10"
        >
          INQUIRE
        </motion.button>
      </div>
    </motion.div>
  );
};

const ArtisanalGrid = () => {
  // Unified grid of all products
  const sortedProducts = [...initialProducts].sort((a, b) => a.price - b.price);

  return (
    <section id="collection" className="py-32 px-8 bg-cream snap-start">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.4em] text-[#004F39] font-bold mb-4 block"
          >
            The Full Collection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-serif text-charcoal"
          >
            The Artisanal <span className="italic">Grid</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-charcoal/40 font-light italic text-lg"
          >
            Twenty masterpieces, one continuous story.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {sortedProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              priority={true}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const NarrativeChapter = ({ title, video }: { title: string, video: string, key?: number | string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract ID from Google Drive link to ensure direct streaming format
  const getDirectLink = (url: string) => {
    const idMatch = url.match(/id=([^&]+)/) || url.match(/\/d\/([^/]+)/);
    const id = idMatch ? idMatch[1] : '';
    return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
  };

  const directVideoLink = getDirectLink(video);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      className="relative h-screen w-full flex items-center justify-center bg-charcoal cursor-pointer group"
      onClick={togglePlay}
    >
      <video 
        ref={videoRef}
        muted 
        loop 
        playsInline 
        preload="auto"
        className="w-full h-full object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-80"
      >
        <source src={directVideoLink} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-serif italic text-cream mb-4"
        >
          {title}
        </motion.h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isPlaying ? 0 : 1 }}
          className="text-[10px] uppercase tracking-[0.4em] text-cream/50 font-bold"
        >
          Tap to Play
        </motion.div>
      </div>

      {/* Play/Pause Indicator */}
      <div className="absolute bottom-12 right-12">
        <div className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-cream/40 group-hover:text-cream transition-colors">
          {isPlaying ? <X size={16} /> : <Plus size={16} className="rotate-45" />}
        </div>
      </div>
    </div>
  );
};

const VideoNarrative = () => {
  const chapters = [
    { title: "The Ingredient", video: "https://drive.google.com/uc?export=download&id=1tbp-luJ4BYManxuZ_ed9X02lfEfDtSDo" },
    { title: "The Craft", video: "https://drive.google.com/uc?export=download&id=1_PfDHc2m4N1oSSoxtJv8eg5hFWn4kWRP" },
    { title: "The Masterpiece", video: "https://drive.google.com/uc?export=download&id=16PbzdjfODcAkKslumPxC7LHG7zwY3Sp-" }
  ];

  return (
    <section id="story" className="bg-charcoal">
      {chapters.map((chapter, i) => (
        <NarrativeChapter key={i} title={chapter.title} video={chapter.video} />
      ))}
    </section>
  );
};

const HappyCustomers = () => {
  const [cards, setCards] = useState([
    { id: 1, name: "Ananya Sharma", text: "The most beautiful cake I've ever seen. It was the centerpiece of our wedding!", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=500&auto=format&fit=crop" },
    { id: 2, name: "Rahul Mehta", text: "The Belgian truffle is out of this world. Highly recommend for any celebration.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=500&auto=format&fit=crop" },
    { id: 3, name: "Priya Das", text: "Artistry meets flavor. The Palette Stories is truly a gem in Pune.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&h=500&auto=format&fit=crop" },
    { id: 4, name: "Vikram Singh", text: "Bespoke service at its best. They understood exactly what I wanted.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=500&auto=format&fit=crop" },
  ]);

  const shuffle = () => {
    setCards((prev) => {
      const newCards = [...prev];
      const first = newCards.shift();
      if (first) newCards.push(first);
      return newCards;
    });
  };

  useEffect(() => {
    const interval = setInterval(shuffle, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 px-8 bg-cream overflow-hidden snap-start">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="lg:w-1/2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#004F39] font-bold mb-6 block">Testimonials</span>
          <h2 className="text-5xl md:text-7xl font-serif text-[#151613] mb-8 leading-tight">
            Stories of <br /> <span className="italic">Happiness</span>
          </h2>
          <p className="text-[#151613]/60 text-sm tracking-wide leading-relaxed font-light max-w-md mb-12">
            We don't just bake cakes; we craft memories. Hear from our patrons who have experienced the magic of The Palette Stories.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={shuffle}
            className="px-10 py-4 bg-[#004F39] text-white text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-[#151613] transition-all duration-500 font-bold shadow-xl shadow-[#004F39]/10"
          >
            Next Story
          </motion.button>
        </div>

        <div className="lg:w-1/2 relative h-[500px] w-full max-w-[400px] mx-auto lg:mx-0">
          <AnimatePresence mode="popLayout">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                initial={{ scale: 0.8, opacity: 0, x: 50 }}
                animate={{ 
                  scale: 1 - index * 0.05, 
                  opacity: 1 - index * 0.2, 
                  x: index * 20,
                  y: index * 10,
                  zIndex: cards.length - index
                }}
                exit={{ x: -200, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-charcoal/5 flex flex-col"
              >
                <div className="h-2/3 w-full overflow-hidden">
                  <img src={card.img} alt={card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="p-8 flex-1 flex flex-col justify-center">
                  <p className="text-[#151613]/70 text-sm italic mb-4 font-light leading-relaxed">"{card.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-[1px] bg-[#004F39]/30" />
                    <h4 className="text-[#151613] font-serif text-lg">{card.name}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const SweetCustoms = () => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWhatsAppOrder = () => {
    sendSweetstoryOrder('custom', { description });
  };

  return (
    <section className="py-32 px-8 bg-[#151613] text-[#FFFACA] overflow-hidden snap-start">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="lg:w-1/2 space-y-8">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#004F39] font-bold block">Custom Creations</span>
          <h2 className="text-5xl md:text-7xl font-serif leading-tight">
            Sweet <br /> <span className="italic text-[#FFFACA]">Customs</span>
          </h2>
          <p className="text-[#FFFACA]/60 text-sm tracking-wide leading-relaxed font-light max-w-md">
            Have a specific vision in mind? Upload your reference image and tell us about your dream cake. We'll bring your sweetest imaginations to life.
          </p>
          
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Describe your vision</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about the flavors, occasion, and any specific details..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-light focus:outline-none focus:border-[#004F39] transition-colors min-h-[150px] resize-none"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsAppOrder}
              disabled={!description}
              className="w-full py-5 bg-[#004F39] text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-full shadow-xl shadow-[#004F39]/20 hover:bg-[#FFFACA] hover:text-[#151613] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Custom Order via WhatsApp
            </motion.button>
          </div>
        </div>

        <div className="lg:w-1/2 w-full">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-[3rem] border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-rose transition-colors group relative overflow-hidden bg-white/5"
          >
            {image ? (
              <>
                <img src={image} alt="Custom Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-white text-charcoal px-6 py-3 rounded-full">Change Image</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-rose transition-colors">
                  <Upload className="text-white" size={32} />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Upload Reference Image</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const adminTimeout = useRef<NodeJS.Timeout | null>(null);

  const startTimeout = () => {
    adminTimeout.current = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-admin'));
    }, 3000);
  };

  const clearTimer = () => {
    if (adminTimeout.current) {
      clearTimeout(adminTimeout.current);
      adminTimeout.current = null;
    }
  };

  return (
    <footer className="bg-[#151613] text-white py-32 px-8 md:px-20 overflow-hidden relative snap-start">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#004F39]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 
                onContextMenu={(e) => e.preventDefault()}
                onMouseDown={startTimeout}
                onMouseUp={clearTimer}
                onMouseLeave={clearTimer}
                onTouchStart={startTimeout}
                onTouchEnd={clearTimer}
                className="text-5xl md:text-7xl font-serif tracking-tighter leading-none cursor-default select-none"
              >
                The Palette<br/>
                <span className="italic text-[#B89B5E]">Stories</span>
              </h2>
              <p className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 max-w-sm leading-relaxed">
                Crafting artisanal experiences that transcend the ordinary. Every layer tells a story. Based in Pune, delivering happiness.
              </p>
            </div>
            
            <div className="flex gap-6">
              {[Instagram, Facebook].map((Icon, i) => (
                <motion.a 
                  key={i}
                  href="#" 
                  whileHover={{ y: -5, color: "#B89B5E" }}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/60 transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Navigation */}
            <div className="space-y-8">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#B89B5E] font-bold">Explore</h3>
              <ul className="space-y-4">
                {['The Collection', 'Bespoke Studio', 'Our Story', 'Process'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[10px] tracking-widest uppercase font-bold text-white/40 hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-8">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#B89B5E] font-bold">Connect</h3>
              <div className="space-y-6">
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-white/20 font-bold mb-2">Location</span>
                  <p className="text-[10px] tracking-widest uppercase font-bold text-white/60">Pune, Maharashtra, India</p>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-white/20 font-bold mb-2">Inquiries</span>
                  <p className="text-[10px] tracking-widest uppercase font-bold text-white/60">hello@palettestories.com</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-8">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#B89B5E] font-bold">Newsletter</h3>
              <div className="space-y-6">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="YOUR EMAIL"
                    className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] tracking-[0.3em] focus:outline-none focus:border-[#B89B5E] transition-colors uppercase font-bold"
                  />
                  <button className="absolute right-0 bottom-4 text-[#B89B5E] hover:text-white transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
                <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold leading-relaxed">
                  Join our inner circle for exclusive previews and sweet updates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold">
            © 2024 The Palette Stories. All Rights Reserved.
          </div>
          <div className="flex gap-8 text-[9px] uppercase tracking-[0.4em] text-white/20 font-bold">
            <a href="#" className="hover:text-[#B89B5E] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#B89B5E] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pre-load critical assets for "instant" feel
    const sorted = [...initialProducts].sort((a, b) => a.price - b.price);
    sorted.slice(0, 6).forEach(product => {
      const img = new Image();
      img.src = `https://www.instagram.com/p/${product.shortcode}/media/?size=l`;
    });

    const handleOpenAdmin = () => setIsAdmin(true);
    window.addEventListener('open-admin', handleOpenAdmin);
    
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.to(mainRef.current, {
        backgroundColor: "#DCAE96", // Dusty Rose
        scrollTrigger: {
          trigger: ".artisanal-grid-trigger",
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      });
    }, mainRef);
    return () => {
      window.removeEventListener('open-admin', handleOpenAdmin);
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  if (isAdmin) {
    return <AdminPanel onExit={() => setIsAdmin(false)} />;
  }

  return (
    <div ref={mainRef} className="min-h-screen selection:bg-rose selection:text-white bg-cream transition-colors duration-1000">
      <Navbar />
      <div className="fixed bottom-8 left-8 z-[60] flex flex-col gap-4">
        <button 
          onClick={() => setIsQuizOpen(true)}
          className="p-4 bg-[#B87A62] text-white hover:bg-charcoal transition-all rounded-full border border-white/10 shadow-xl shadow-[#B87A62]/20 flex items-center gap-3 group"
        >
          <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
          <span className="text-[9px] uppercase tracking-widest font-bold pr-2 hidden md:block">Taste Quiz</span>
        </button>
      </div>

      <TasteProfileQuiz 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
        onRecommend={(palette) => setActiveFilter(palette)}
      />

      <div className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar">
        <Hero />
        
        <BespokeStudio />
        <SweetCustoms />
        
        <div className="artisanal-grid-trigger">
          <ArtisanalGrid />
        </div>

        <OrderTracker />

        <NarrativeScroll />
        <VideoNarrative />
        <HappyCustomers />
        <MoodFlavourQuiz />
        <Footer />
      </div>
    </div>
  );
}
