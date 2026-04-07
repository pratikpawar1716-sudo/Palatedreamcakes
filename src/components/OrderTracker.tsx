import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, Cake, Sparkles, CheckCircle2, X, RefreshCw } from 'lucide-react';
import Papa from 'papaparse';
import { orderDatabase as localDatabase, OrderStatus, Order } from '../data/orders';

const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_CSV_URL;

export const OrderTracker = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResult, setSearchResult] = useState<{ status: OrderStatus; name: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [liveDatabase, setLiveDatabase] = useState<Order[]>(localDatabase);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  const fetchLiveOrders = async () => {
    if (!GOOGLE_SHEET_URL) {
      console.log("Google Sheet URL not found.");
      return;
    }
    
    setIsSyncing(true);
    setError("");
    try {
      // Validate URL format
      if (!GOOGLE_SHEET_URL.startsWith('http')) {
        throw new Error("Invalid URL format. Please ensure it starts with http:// or https://");
      }

      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Google Sheet not found. Please check the URL.");
        if (response.status === 403) throw new Error("Access denied. Ensure the sheet is 'Published to the web'.");
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      if (!csvText || csvText.includes('<!DOCTYPE html>')) {
        throw new Error("The URL provided returned HTML instead of CSV. Ensure you selected 'Comma-separated values (.csv)' when publishing.");
      }
      
      // Wrap Papa.parse in a Promise to handle it properly in async/await
      await new Promise<void>((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim().toUpperCase(),
          complete: (results) => {
            const parsedOrders = results.data as any[];
            setDebugInfo({
              headers: results.meta.fields,
              rowCount: parsedOrders.length,
              sampleRow: parsedOrders[0]
            });

            const formattedOrders: Order[] = parsedOrders.map((row) => {
              // Extremely flexible mapping
              const phone = row.CUSTMOER_PHONE || row.CUSTMOER_PHONE_NUMBER || row.PHONE || row.PHONENUMBER || row['PHONE NUMBER'] || row.MOBILE || '';
              const status = row.CURRENT_STATUS || row.STATUS || row.ORDER_STATUS || 'Baking';
              const name = row.CUSTMOER_NAME || row.CUSTOMER_NAME || row.NAME || 'Valued Client';
              const orderId = row.ORDER_ID || row.ID || row.ORDERID || 'Bespoke Creation';

              return {
                phoneNumber: String(phone).replace(/\D/g, '').trim(),
                status: (String(status).trim()) as OrderStatus,
                customerName: String(name).trim(),
                cakeName: String(orderId).trim()
              };
            }).filter(o => o.phoneNumber.length > 0);
            
            if (formattedOrders.length > 0) {
              setLiveDatabase(formattedOrders);
              setLastSynced(new Date().toLocaleTimeString());
              resolve();
            } else {
              console.warn("No valid orders found. Headers:", results.meta.fields);
              setError("We connected to the sheet, but couldn't find any orders with phone numbers. Please check your column headers.");
              resolve();
            }
          },
          error: (error) => reject(error)
        });
      });
    } catch (err: any) {
      console.error("Sync Error:", err);
      setError(`Connection failed: ${err.message}. Please ensure your Google Sheet is 'Published to the web' as a CSV.`);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (GOOGLE_SHEET_URL) {
      fetchLiveOrders();
    }
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError("");
    setSearchResult(null);

    // Clean the input phone number for matching
    const cleanInput = phoneNumber.replace(/\D/g, '').trim();
    console.log("Searching for cleaned number:", cleanInput);
    console.log("Current Database:", liveDatabase);

    // Simulate a brief lookup delay for "artisanal" feel
    setTimeout(() => {
      const order = liveDatabase.find(o => o.phoneNumber === cleanInput);
      
      if (order) {
        console.log("Order found:", order);
        setSearchResult({ status: order.status, name: order.customerName });
      } else {
        console.warn("Order not found for:", cleanInput);
        setError("I apologize, but I cannot locate an order with that number. Please verify the number on your WhatsApp confirmation or contact our studio directly.");
      }
      setIsSearching(false);
    }, 1200);
  };

  const getStatusMessage = (status: OrderStatus) => {
    switch (status) {
      case 'Baking':
        return "Your artisanal cake is currently in the oven. Our master bakers are ensuring the perfect sponge and texture. 🎂";
      case 'Decorating':
        return "Your cake is now with our design team. We are meticulously adding the final artistic details to your masterpiece. ✨";
      case 'Ready':
        return "Excellent news! Your order has passed quality control and is now ready for collection or delivery. 🥳";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Baking':
        return <Cake className="text-[#004F39]" size={40} />;
      case 'Decorating':
        return <Sparkles className="text-[#B89B5E]" size={40} />;
      case 'Ready':
        return <CheckCircle2 className="text-emerald-500" size={40} />;
    }
  };

  return (
    <section id="order-tracking" className="py-32 px-8 bg-[#FFFACA] border-t border-black/5">
      <div className="max-w-3xl mx-auto text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.4em] text-[#004F39] font-black mb-4 block"
        >
          Concierge Service
        </motion.span>
        <h2 className="text-5xl md:text-6xl font-serif font-black mb-8 text-[#151613]">Track Your Masterpiece</h2>
        
        {!GOOGLE_SHEET_URL && (
          <div className="mb-12 p-8 bg-[#004F39]/5 rounded-[2rem] border border-[#004F39]/10 max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <RefreshCw className="text-[#004F39]/40" size={16} />
              <span className="text-[10px] uppercase tracking-widest font-black text-[#004F39]">Connection Pending</span>
            </div>
            <p className="text-xs text-[#151613]/60 leading-relaxed mb-4 font-bold">
              To connect your Google Sheet, please set the <strong>VITE_GOOGLE_SHEET_CSV_URL</strong> environment variable in your AI Studio settings.
            </p>
            <div className="text-[9px] text-[#004F39]/60 font-mono font-black bg-white/50 p-3 rounded-lg break-all">
              Currently using local sample data.
            </div>
          </div>
        )}

        {GOOGLE_SHEET_URL && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-[#B89B5E] animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-[9px] uppercase tracking-widest font-black text-[#151613]/40">
              {isSyncing ? 'Syncing with Google Sheets...' : 'Live Sync Active'}
            </span>
            {!isSyncing && liveDatabase.length > 0 && (
              <div className="flex flex-col items-start">
                <span className="px-2 py-0.5 bg-[#004F39]/10 text-[#004F39] text-[8px] font-black rounded-full">
                  {liveDatabase.length} ORDERS FOUND
                </span>
                {lastSynced && (
                  <span className="text-[7px] text-[#151613]/30 mt-1 uppercase tracking-tighter font-black">
                    Last Synced: {lastSynced}
                  </span>
                )}
              </div>
            )}
            <button 
              onClick={fetchLiveOrders}
              disabled={isSyncing}
              className="ml-2 p-1.5 hover:bg-black/5 rounded-full transition-colors text-[#151613]/30"
              title="Refresh Data"
            >
              <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="ml-1 text-[7px] uppercase tracking-tighter text-[#151613]/20 hover:text-[#151613]/40"
            >
              {showDebug ? 'Hide Debug' : 'Debug'}
            </button>
          </div>
        )}

        {showDebug && debugInfo && (
          <div className="mb-8 p-4 bg-black text-white text-[10px] font-mono text-left rounded-lg max-w-lg mx-auto overflow-auto max-h-40">
            <p className="text-emerald-400 mb-2">--- DEBUG INFO ---</p>
            <p>Rows Found: {debugInfo.rowCount}</p>
            <p>Headers: {debugInfo.headers?.join(', ')}</p>
            <p className="mt-2 text-emerald-400">Sample Data (Row 1):</p>
            <pre>{JSON.stringify(debugInfo.sampleRow, null, 2)}</pre>
          </div>
        )}

        <p className="text-[#151613]/60 font-light mb-12 max-w-lg mx-auto italic">
          Enter your registered phone number to receive a real-time update from our artisanal studio.
        </p>

        <form onSubmit={handleTrack} className="relative max-w-md mx-auto mb-16">
          <input 
            type="tel" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="ENTER PHONE NUMBER"
            className="w-full bg-white border border-black/10 rounded-full py-6 px-10 text-center text-xs tracking-[0.3em] focus:outline-none focus:border-[#004F39] transition-all shadow-sm"
            required
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#004F39] text-white rounded-full flex items-center justify-center hover:bg-[#151613] transition-all disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {searchResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-12 rounded-[3rem] shadow-xl border border-black/5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#004F39]/10" />
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-[#F9F7F4] rounded-full flex items-center justify-center mb-2">
                  {getStatusIcon(searchResult.status)}
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#004F39] font-black">Order Status: {searchResult.status}</p>
                  <h3 className="text-2xl font-serif font-black text-[#151613]">Greetings, {searchResult.name}</h3>
                </div>
                <p className="text-lg font-serif italic font-black text-[#151613]/80 leading-relaxed max-w-md">
                  {getStatusMessage(searchResult.status)}
                </p>
                <button 
                  onClick={() => setSearchResult(null)}
                  className="mt-4 text-[9px] uppercase tracking-widest text-[#151613]/40 hover:text-[#151613] transition-colors font-black"
                >
                  Clear Search
                </button>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-rose/5 p-8 rounded-[2rem] border border-rose/20 flex items-start gap-4 text-left max-w-md mx-auto"
            >
              <div className="w-10 h-10 bg-rose/10 rounded-full flex items-center justify-center shrink-0">
                <X className="text-rose" size={20} />
              </div>
              <p className="text-sm text-rose leading-relaxed font-black">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
