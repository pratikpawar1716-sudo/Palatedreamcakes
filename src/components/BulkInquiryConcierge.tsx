import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Minus, 
  Plus, 
  Calendar, 
  MapPin, 
  Navigation, 
  Send,
  Sparkles
} from 'lucide-react';

interface BulkInquiryConciergeProps {
  productName?: string;
}

const BulkInquiryConcierge: React.FC<BulkInquiryConciergeProps> = ({ 
  productName: initialProductName = "Artisanal Selection" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [product, setProduct] = useState(initialProductName);
  const [address, setAddress] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const detectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          const data = await response.json();
          setAddress(data.display_name || `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`);
        } catch (error) {
          console.error("Error fetching address:", error);
          setAddress(`Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`);
        } finally {
          setIsDetecting(false);
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        setIsDetecting(false);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsDetecting(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const message = `⚜️ NEW BULK INQUIRY: THE LUXURY CAKE STUDIO ⚜️
-----------------------------------
👤 Name: ${name || 'Not specified'}
🍰 Product: ${product}
🔢 Quantity: ${quantity} Units
📍 Address: ${address || 'Not specified'}
-----------------------------------
ACTION: Please verify availability and calculate delivery.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919322772234?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 bg-luxury-forest text-luxury-cream rounded-full font-sans font-bold text-xs tracking-[0.3em] uppercase border border-luxury-gold/30 shadow-xl flex items-center gap-3 group"
      >
        <Sparkles size={16} className="text-luxury-gold group-hover:rotate-12 transition-transform" />
        Request Bespoke Bulk Quote
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-luxury-forest/40 backdrop-blur-md"
            />

            {/* Modal / Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[101] w-full md:max-w-lg bg-luxury-cream rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-t md:border border-luxury-gold/20"
            >
              <div className="p-8 md:p-10 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-3xl md:text-4xl font-display text-luxury-forest tracking-tight">
                      Event <span className="italic text-luxury-gold">Concierge</span>
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-forest/40 font-bold">
                      Bespoke Bulk Inquiries
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-luxury-forest/5 rounded-full transition-colors text-luxury-forest"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Form Content */}
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        delayChildren: 0.2,
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  className="space-y-6"
                >
                  {/* Name Input */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-forest/60 font-bold">Name</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="YOUR FULL NAME"
                      className="w-full bg-luxury-forest/5 border border-luxury-forest/10 rounded-2xl py-4 px-6 text-sm font-sans text-luxury-forest focus:outline-none focus:border-luxury-gold/50 transition-all placeholder:text-luxury-forest/20"
                    />
                  </motion.div>

                  {/* Quantity Counter */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-forest/60 font-bold">Quantity</label>
                    <div className="flex items-center justify-between bg-luxury-forest/5 p-2 rounded-2xl border border-luxury-forest/10">
                      <button 
                        onClick={() => setQuantity(Math.max(10, quantity - 5))}
                        className="w-12 h-12 rounded-xl bg-luxury-forest text-luxury-cream flex items-center justify-center hover:bg-luxury-forest/90 transition-colors"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="text-2xl font-display text-luxury-forest">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 5)}
                        className="w-12 h-12 rounded-xl bg-luxury-forest text-luxury-cream flex items-center justify-center hover:bg-luxury-forest/90 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </motion.div>

                  {/* Product Input */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-forest/60 font-bold">Product</label>
                    <input 
                      type="text"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="PRODUCT NAME"
                      className="w-full bg-luxury-forest/5 border border-luxury-forest/10 rounded-2xl py-4 px-6 text-sm font-sans text-luxury-forest focus:outline-none focus:border-luxury-gold/50 transition-all placeholder:text-luxury-forest/20"
                    />
                  </motion.div>

                  {/* Address Textarea */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-luxury-forest/60 font-bold">Address</label>
                      <button 
                        onClick={detectLocation}
                        disabled={isDetecting}
                        className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-bold text-luxury-gold hover:text-luxury-forest transition-colors disabled:opacity-50"
                      >
                        <Navigation size={10} className={isDetecting ? "animate-spin" : ""} />
                        {isDetecting ? "Detecting..." : "Detect Location"}
                      </button>
                    </div>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-4 text-luxury-forest/40 group-focus-within:text-luxury-forest transition-colors" size={18} />
                      <textarea 
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="STREET, AREA, CITY"
                        className="w-full bg-luxury-forest/5 border border-luxury-forest/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-sans text-luxury-forest focus:outline-none focus:border-luxury-gold/50 transition-all resize-none placeholder:text-luxury-forest/20"
                      />
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateWhatsAppMessage}
                    className="w-full py-5 bg-luxury-forest text-luxury-cream rounded-2xl font-sans font-bold text-xs tracking-[0.4em] uppercase relative overflow-hidden group shadow-2xl shadow-luxury-forest/30"
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                    
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Submit Inquiry
                      <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  </motion.button>
                </motion.div>
              </div>

              {/* Footer Accent */}
              <div className="h-2 bg-luxury-gold" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </>
  );
};

export default BulkInquiryConcierge;
