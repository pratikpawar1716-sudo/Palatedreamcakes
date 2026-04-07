import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Edit2, Check, X, Eye, EyeOff, LogOut, Package, TrendingUp, DollarSign, Search, Sparkles, LayoutDashboard, ClipboardList, RefreshCw, Clock, CheckCircle2, Cake, Plus, Image as ImageIcon, Trash2, Wand2, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import { Product } from '../data/products';
import { Order, OrderStatus, orderDatabase as localOrders } from '../data/orders';
import { useStore } from '../context/StoreContext';
import { GoogleGenAI } from "@google/genai";

const ADMIN_PASSWORD = "1818";
const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_CSV_URL;

type AdminTab = 'dashboard' | 'inventory' | 'orders' | 'hero' | 'bespoke' | 'settings';

export const AdminPanel = ({ onExit }: { onExit: () => void }) => {
  const { products, heroImage, setHeroImage, heroHeadline, setHeroHeadline, heroSubheadline, setHeroSubheadline, bespokePricing, setBespokePricing, addProduct, updateProduct, deleteProduct } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  // Inventory State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Hero State
  const [heroPrompt, setHeroPrompt] = useState("A hyper-realistic, ultra-luxury 3-tier wedding cake with intricate gold leaf detailing, white orchids, and a minimalist marble background, cinematic lighting, 8k resolution, professional food photography");
  const [isGeneratingHero, setIsGeneratingHero] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(localOrders);
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  // Bespoke Pricing Modals
  const [isAddingFlavor, setIsAddingFlavor] = useState(false);
  const [isAddingTopping, setIsAddingTopping] = useState(false);
  const [flavorForm, setFlavorForm] = useState({ name: '', pricePerKg: 0, category: 'Classic' as 'Premium' | 'Classic', color: '#3D2B1F' });
  const [toppingForm, setToppingForm] = useState({ name: '', price: 0 });

  const fetchLiveOrders = async () => {
    if (!GOOGLE_SHEET_URL) return;
    
    setIsSyncingOrders(true);
    try {
      if (!GOOGLE_SHEET_URL.startsWith('http')) {
        throw new Error("Invalid URL format");
      }

      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
        },
        cache: 'no-cache'
      });

      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      const csvText = await response.text();

      if (!csvText || csvText.includes('<!DOCTYPE html>')) {
        throw new Error("Invalid CSV format received");
      }
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim().toUpperCase(),
        complete: (results) => {
          const parsed = results.data as any[];
          const formatted: Order[] = parsed.map(row => {
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
          
          if (formatted.length > 0) {
            setOrders(formatted);
            setLastSynced(new Date().toLocaleTimeString());
          }
        }
      });
    } catch (err) {
      console.error("Order sync failed:", err);
    } finally {
      setIsSyncingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && GOOGLE_SHEET_URL) {
      fetchLiveOrders();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid Credentials");
      setPassword("");
    }
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleSaveProduct = () => {
    if (editingId && editForm) {
      updateProduct(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    addProduct({
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      images: [(formData.get('image') as string) || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'],
      shortcode: formData.get('shortcode') as string
    });
    
    setIsAdding(false);
  };

  const generateHeroImage = async () => {
    setIsGeneratingHero(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: heroPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
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
      console.error("Hero generation failed:", err);
      alert("Failed to generate image. Please check your API key and try again.");
    } finally {
      setIsGeneratingHero(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#151613] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[3rem] text-center space-y-8"
        >
          <div className="w-20 h-20 bg-[#004F39]/20 rounded-full flex items-center justify-center mx-auto">
            <Lock className="text-[#004F39]" size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-serif text-[#FFFACA]">Admin Command</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#FFFACA]/40 font-bold">Secure Business Layer</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER ACCESS KEY"
                className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 text-center text-xs tracking-[0.3em] focus:outline-none focus:border-[#004F39] transition-all text-[#FFFACA]"
              />
              {error && <p className="text-rose text-[9px] uppercase tracking-widest mt-4 font-bold">{error}</p>}
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-[#004F39] text-[#FFFACA] text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:bg-[#FFFACA] hover:text-[#151613] transition-all duration-500 shadow-xl shadow-[#004F39]/20"
            >
              Authorize Access
            </button>
          </form>
          <button onClick={onExit} className="text-[9px] uppercase tracking-widest text-[#FFFACA]/40 hover:text-[#FFFACA] transition-colors font-bold">Return to Storefront</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#151613] font-sans">
      {/* Header */}
      <nav className="bg-white border-b border-black/5 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#004F39] rounded-full flex items-center justify-center text-white">
              <TrendingUp size={20} />
            </div>
            <div>
              <h1 className="font-serif text-xl">Command Center</h1>
              <p className="text-[9px] uppercase tracking-widest opacity-40 font-bold">THE LUXURY CAKE STUDIO Official</p>
            </div>
          </div>

          <div className="flex bg-[#151613]/5 p-1 rounded-full overflow-x-auto max-w-full">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Work Manager', icon: ClipboardList },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'bespoke', label: 'Bespoke Pricing', icon: DollarSign },
              { id: 'hero', label: 'Hero Design', icon: Wand2 },
              { id: 'settings', label: 'Site Settings', icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white text-[#004F39] shadow-sm' 
                    : 'text-[#151613]/40 hover:text-[#151613]'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={onExit}
            className="flex items-center gap-3 px-6 py-3 bg-[#151613] text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-rose transition-all"
          >
            <LogOut size={14} /> Exit Admin
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 space-y-12">
        {activeTab === 'dashboard' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Total Products', value: products.length, icon: Package },
                { label: 'Active Stock', value: products.filter(p => p.priority).length, icon: TrendingUp },
                { label: 'Live Orders', value: orders.length, icon: ClipboardList, color: 'text-amber-500' },
                { label: 'WhatsApp Status', value: 'Connected', icon: Sparkles, color: 'text-emerald-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5 flex items-center gap-6">
                  <div className={`w-14 h-14 bg-[#004F39]/10 rounded-2xl flex items-center justify-center ${stat.color || 'text-[#004F39]'}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">{stat.label}</p>
                    <p className="text-2xl font-serif">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Config Section */}
            <div className="bg-[#004F39] p-10 rounded-[3rem] text-[#FFFACA] flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-serif">WhatsApp Integration</h2>
                <p className="text-sm opacity-70 font-light italic">All orders are currently routed to +91 9322772234</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10">
                  <p className="text-[8px] uppercase tracking-widest opacity-50 mb-1">Active Number</p>
                  <p className="text-sm font-mono">9322772234</p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("https://wa.me/919322772234");
                    alert("Business Link Copied!");
                  }}
                  className="px-8 py-4 bg-[#FFFACA] text-[#004F39] rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-1 bg-white rounded-[3rem] p-10 shadow-sm border border-black/5 space-y-8">
                <h3 className="text-2xl font-serif">Recent Activity</h3>
                <div className="space-y-6">
                  {[
                    { type: 'Quiz', detail: 'Mood Match: Signature Dark Chocolate', time: '2 mins ago' },
                    { type: 'Order', detail: 'Bespoke Cake Inquiry', time: '15 mins ago' },
                    { type: 'Quiz', detail: 'Mood Match: Red Velvet Rose', time: '1 hour ago' },
                  ].map((activity, i) => (
                    <div key={activity.type + i} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-[#004F39] mt-1.5" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#004F39]">{activity.type}</p>
                        <p className="text-sm text-[#151613]/70">{activity.detail}</p>
                        <p className="text-[9px] text-[#151613]/30 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Work Overview */}
              <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-sm border border-black/5 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-serif">Workload Overview</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-[10px] uppercase tracking-widest font-bold text-[#004F39] hover:underline">View All Orders</button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: 'Baking', count: orders.filter(o => o.status === 'Baking').length, color: 'bg-amber-500' },
                    { label: 'Decorating', count: orders.filter(o => o.status === 'Decorating').length, color: 'bg-blue-500' },
                    { label: 'Ready', count: orders.filter(o => o.status === 'Ready').length, color: 'bg-emerald-500' },
                  ].map((stage, i) => (
                    <div key={stage.label} className="bg-[#F9F7F4] p-6 rounded-2xl border border-black/5">
                      <div className={`w-2 h-2 rounded-full ${stage.color} mb-3`} />
                      <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">{stage.label}</p>
                      <p className="text-3xl font-serif">{stage.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-4xl font-serif">Work Manager</h2>
                <p className="text-sm text-[#151613]/50 italic">Live order pipeline from Google Sheets</p>
              </div>
              <div className="flex items-center gap-4">
                {lastSynced && (
                  <span className="text-[9px] uppercase tracking-widest font-bold opacity-30">Last Synced: {lastSynced}</span>
                )}
                <button 
                  onClick={fetchLiveOrders}
                  disabled={isSyncingOrders}
                  className="flex items-center gap-2 px-6 py-3 bg-[#004F39] text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#151613] transition-all disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isSyncingOrders ? 'animate-spin' : ''} />
                  Sync Pipeline
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {(['Baking', 'Decorating', 'Ready'] as OrderStatus[]).map((status) => (
                <div key={status} className="bg-white rounded-[2.5rem] shadow-sm border border-black/5 overflow-hidden">
                  <div className={`p-6 border-b border-black/5 flex items-center justify-between ${
                    status === 'Baking' ? 'bg-amber-50' : 
                    status === 'Decorating' ? 'bg-blue-50' : 'bg-emerald-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      {status === 'Baking' && <Cake size={18} className="text-amber-600" />}
                      {status === 'Decorating' && <Sparkles size={18} className="text-blue-600" />}
                      {status === 'Ready' && <CheckCircle2 size={18} className="text-emerald-600" />}
                      <h3 className="font-serif text-lg">{status}</h3>
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 bg-white/50 rounded-full">
                      {orders.filter(o => o.status === status).length}
                    </span>
                  </div>
                  <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                    {orders.filter(o => o.status === status).length === 0 ? (
                      <div className="py-12 text-center space-y-2 opacity-20">
                        <Clock size={32} className="mx-auto" />
                        <p className="text-[10px] uppercase tracking-widest font-bold">No Orders</p>
                      </div>
                    ) : (
                      orders.filter(o => o.status === status).map((order, i) => (
                        <motion.div 
                          key={order.phoneNumber + i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-[#F9F7F4] p-5 rounded-2xl border border-black/5 space-y-3 hover:border-[#004F39]/20 transition-all group"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Customer</p>
                              <p className="font-serif text-base">{order.customerName}</p>
                            </div>
                            <span className="text-[8px] font-mono opacity-30 group-hover:opacity-100 transition-opacity">#{order.phoneNumber.slice(-4)}</span>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Creation</p>
                            <p className="text-xs italic text-[#151613]/70">{order.cakeName}</p>
                          </div>
                          <div className="pt-2 border-t border-black/5 flex justify-between items-center">
                            <a 
                              href={`https://wa.me/91${order.phoneNumber}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[9px] uppercase tracking-widest font-bold text-[#004F39] hover:underline"
                            >
                              Contact Client
                            </a>
                            <div className="flex gap-1">
                              <div className="w-1 h-1 rounded-full bg-[#004F39]/20" />
                              <div className="w-1 h-1 rounded-full bg-[#004F39]/20" />
                              <div className="w-1 h-1 rounded-full bg-[#004F39]/20" />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <h2 className="text-4xl font-serif">Live Inventory</h2>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#151613]/30" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-black/5 rounded-full py-4 pl-14 pr-8 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-[#004F39] text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#151613] transition-all shadow-lg shadow-[#004F39]/20"
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-black/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#151613]/5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#151613]/50">
                      <th className="px-10 py-6">Product</th>
                      <th className="px-10 py-6">Category</th>
                      <th className="px-10 py-6">Price</th>
                      <th className="px-10 py-6">Status</th>
                      <th className="px-10 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#151613]/5">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-[#151613]/[0.02] transition-colors">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <img 
                              src={product.images[0]} 
                              alt="" 
                              className="w-12 h-12 rounded-xl object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-serif text-lg">{product.name}</p>
                              <p className="text-[9px] text-[#151613]/40 uppercase tracking-widest font-bold">{product.shortcode || 'No Shortcode'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 bg-[#151613]/5 rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-10 py-8">
                          <span className="font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                        </td>
                        <td className="px-10 py-8">
                          <button 
                            onClick={() => updateProduct(product.id, { priority: !product.priority })}
                            className={`inline-flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold ${product.priority ? 'text-emerald-500' : 'text-rose'}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${product.priority ? 'bg-emerald-500' : 'bg-rose'}`} />
                            {product.priority ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => startEditing(product)}
                              className="p-3 bg-[#151613]/5 text-[#151613] rounded-xl hover:bg-[#004F39] hover:text-white transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                if(confirm('Are you sure you want to delete this masterpiece?')) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="p-3 bg-rose/10 text-rose rounded-xl hover:bg-rose hover:text-white transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bespoke' && (
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="flex justify-between items-center">
              <div className="text-left space-y-1">
                <h2 className="text-5xl font-serif">Bespoke Studio Pricing</h2>
                <p className="text-charcoal/60 font-bold italic">Configure the investment tiers for your 3D custom creations.</p>
              </div>
              <button 
                onClick={() => {
                  if (confirm("Reset all bespoke pricing to studio defaults? This cannot be undone.")) {
                    localStorage.removeItem('luxury_studio_bespoke_pricing');
                    window.location.reload();
                  }
                }}
                className="px-6 py-3 bg-rose/10 text-rose rounded-full text-[10px] uppercase tracking-widest font-black hover:bg-rose hover:text-white transition-all"
              >
                Reset to Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Flavor Pricing */}
              <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-black/5 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-serif">Flavors (per kg)</h3>
                  <button 
                    onClick={() => setIsAddingFlavor(true)}
                    className="p-2 bg-[#004F39]/10 text-[#004F39] rounded-full hover:bg-[#004F39] hover:text-white transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {Object.entries(bespokePricing.flavors).map(([category, flavors]) => (
                    <div key={category} className="space-y-4">
                      <p className="text-[10px] uppercase tracking-widest font-black text-[#004F39]">{category} Collection</p>
                      <div className="space-y-3">
                        {flavors.map((f, idx) => (
                          <div key={f.name} className="flex items-center justify-between bg-[#F9F7F4] p-4 rounded-2xl border border-black/5">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: f.color }} />
                              <span className="text-sm font-medium">{f.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] opacity-40">₹</span>
                                <input 
                                  type="number" 
                                  value={f.pricePerKg}
                                  onChange={(e) => {
                                    const newPricing = { ...bespokePricing };
                                    newPricing.flavors[category as "Premium" | "Classic"][idx].pricePerKg = Number(e.target.value);
                                    setBespokePricing(newPricing);
                                  }}
                                  className="w-24 bg-white border border-black/10 rounded-lg pl-5 pr-2 py-1 text-xs text-right font-bold"
                                />
                              </div>
                              <button 
                                onClick={() => {
                                  if (confirm(`Remove ${f.name}?`)) {
                                    const newPricing = { ...bespokePricing };
                                    newPricing.flavors[category as "Premium" | "Classic"].splice(idx, 1);
                                    setBespokePricing(newPricing);
                                  }
                                }}
                                className="text-rose hover:scale-110 transition-transform"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toppings & Extras */}
              <div className="space-y-8">
                <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-black/5 space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-serif">Artisanal Toppings</h3>
                    <button 
                      onClick={() => setIsAddingTopping(true)}
                      className="p-2 bg-[#004F39]/10 text-[#004F39] rounded-full hover:bg-[#004F39] hover:text-white transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {bespokePricing.toppingOptions.map((t, idx) => (
                      <div key={t.name} className="flex items-center justify-between bg-[#F9F7F4] p-4 rounded-2xl border border-black/5">
                        <span className="text-sm font-medium">{t.name}</span>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] opacity-40">₹</span>
                            <input 
                              type="number" 
                              value={t.price}
                              onChange={(e) => {
                                const newPricing = { ...bespokePricing };
                                newPricing.toppingOptions[idx].price = Number(e.target.value);
                                setBespokePricing(newPricing);
                              }}
                              className="w-24 bg-white border border-black/10 rounded-lg pl-5 pr-2 py-1 text-xs text-right font-bold"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              if (confirm(`Remove ${t.name}?`)) {
                                const newPricing = { ...bespokePricing };
                                newPricing.toppingOptions.splice(idx, 1);
                                setBespokePricing(newPricing);
                              }
                            }}
                            className="text-rose hover:scale-110 transition-transform"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-black/5 space-y-8">
                  <h3 className="text-2xl font-serif">Structural Premiums</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Tier Premium</p>
                        <p className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Per additional tier</p>
                      </div>
                      <input 
                        type="number" 
                        value={bespokePricing.tierPremium}
                        onChange={(e) => setBespokePricing({ ...bespokePricing, tierPremium: Number(e.target.value) })}
                        className="w-24 bg-[#F9F7F4] border border-black/10 rounded-xl px-4 py-2 text-sm text-right font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Shape Premium</p>
                        <p className="text-[9px] uppercase tracking-widest opacity-40 font-bold">For Square/Heart shapes</p>
                      </div>
                      <input 
                        type="number" 
                        value={bespokePricing.shapePremium}
                        onChange={(e) => setBespokePricing({ ...bespokePricing, shapePremium: Number(e.target.value) })}
                        className="w-24 bg-[#F9F7F4] border border-black/10 rounded-xl px-4 py-2 text-sm text-right font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-serif">Hero Masterpiece</h2>
              <p className="text-charcoal/60 font-bold italic">Reimagine your storefront with AI-driven visual storytelling.</p>
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-black/5 space-y-10">
              <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-cream relative group">
                <img 
                  src={heroImage} 
                  alt="Current Hero" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-[10px] uppercase tracking-[0.5em] font-black">Current Masterpiece</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-[#004F39] font-black flex items-center gap-2">
                    <Sparkles size={14} /> AI Vision Prompt
                  </label>
                  <textarea 
                    value={heroPrompt}
                    onChange={(e) => setHeroPrompt(e.target.value)}
                    className="w-full bg-[#F9F7F4] border-2 border-black/5 rounded-3xl p-8 text-sm focus:outline-none focus:border-[#004F39]/20 transition-all min-h-[150px] font-serif italic"
                    placeholder="Describe the ultimate luxury cake visual..."
                  />
                </div>

                <button 
                  onClick={generateHeroImage}
                  disabled={isGeneratingHero}
                  className="w-full py-7 bg-[#004F39] text-[#FFFACA] text-[12px] uppercase tracking-[0.5em] font-black rounded-3xl hover:bg-[#151613] hover:text-white transition-all duration-700 shadow-2xl shadow-[#004F39]/40 flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isGeneratingHero ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Manifesting Vision...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate AI Masterpiece
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-serif">Site Settings</h2>
              <p className="text-charcoal/60 font-bold italic">Control the voice and message of your luxury studio.</p>
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-black/5 space-y-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-[#004F39] font-black">Hero Headline</label>
                  <input 
                    type="text"
                    value={heroHeadline}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    className="w-full bg-[#F9F7F4] border-2 border-black/5 rounded-2xl px-8 py-5 text-xl font-serif focus:outline-none focus:border-[#004F39]/20 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-[#004F39] font-black">Hero Subheadline</label>
                  <textarea 
                    value={heroSubheadline}
                    onChange={(e) => setHeroSubheadline(e.target.value)}
                    className="w-full bg-[#F9F7F4] border-2 border-black/5 rounded-3xl p-8 text-sm focus:outline-none focus:border-[#004F39]/20 transition-all min-h-[120px] font-bold italic"
                  />
                </div>

                <div className="pt-6 border-t border-black/5">
                  <div className="flex items-center gap-4 p-6 bg-[#004F39]/5 rounded-2xl">
                    <div className="w-10 h-10 bg-[#004F39] rounded-full flex items-center justify-center text-white">
                      <Check size={20} />
                    </div>
                    <p className="text-xs font-bold text-[#004F39]">Changes are saved automatically to your local business profile.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="absolute inset-0 bg-[#151613]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] p-12 shadow-2xl space-y-10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-serif">{isAdding ? 'Add New Masterpiece' : 'Refine Creation'}</h3>
                <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  if (isAdding) {
                    handleAddProduct(e);
                  } else {
                    e.preventDefault();
                    handleSaveProduct();
                  }
                }} 
                className="grid grid-cols-2 gap-8"
              >
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Product Name</label>
                  <input 
                    name="name"
                    required
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#F9F7F4] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Price (₹)</label>
                  <input 
                    name="price"
                    type="number"
                    required
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full bg-[#F9F7F4] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Category</label>
                  <select 
                    name="category"
                    required
                    value={editForm.category || 'Signature'}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#F9F7F4] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none"
                  >
                    <option value="Signature">Signature</option>
                    <option value="Couture">Couture</option>
                    <option value="Bento">Bento</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Instagram Shortcode</label>
                  <input 
                    name="shortcode"
                    value={editForm.shortcode || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, shortcode: e.target.value }))}
                    className="w-full bg-[#F9F7F4] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none"
                    placeholder="e.g. C_xY123"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Image URL</label>
                  <input 
                    name="image"
                    value={editForm.images?.[0] || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, images: [e.target.value] }))}
                    className="w-full bg-[#F9F7F4] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Description</label>
                  <textarea 
                    name="description"
                    required
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#F9F7F4] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none min-h-[100px]"
                  />
                </div>
                <button 
                  type="submit"
                  className="col-span-2 py-5 bg-[#004F39] text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:bg-[#151613] transition-all duration-500"
                >
                  {isAdding ? 'Add to Collection' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {isAddingTopping && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingTopping(false)}
              className="absolute inset-0 bg-[#151613]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-serif">Add Topping</h3>
                <button onClick={() => setIsAddingTopping(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Topping Name</label>
                  <input 
                    value={toppingForm.name}
                    onChange={(e) => setToppingForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#F9F7F4] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none"
                    placeholder="e.g. Edible Pearls"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Price (₹)</label>
                  <input 
                    type="number"
                    value={toppingForm.price}
                    onChange={(e) => setToppingForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full bg-[#F9F7F4] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none"
                  />
                </div>
                <button 
                  onClick={() => {
                    if (toppingForm.name && toppingForm.price > 0) {
                      const newPricing = { ...bespokePricing };
                      newPricing.toppingOptions.push({
                        ...toppingForm,
                        icon: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=100&auto=format&fit=crop'
                      });
                      setBespokePricing(newPricing);
                      setIsAddingTopping(false);
                      setToppingForm({ name: '', price: 0 });
                    }
                  }}
                  className="w-full py-5 bg-[#004F39] text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:bg-[#151613] transition-all"
                >
                  Add Topping
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isAddingFlavor && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingFlavor(false)}
              className="absolute inset-0 bg-[#151613]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-serif">Add Flavor</h3>
                <button onClick={() => setIsAddingFlavor(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Flavor Name</label>
                  <input 
                    value={flavorForm.name}
                    onChange={(e) => setFlavorForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#F9F7F4] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none"
                    placeholder="e.g. Madagascar Vanilla"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Price per kg (₹)</label>
                  <input 
                    type="number"
                    value={flavorForm.pricePerKg}
                    onChange={(e) => setFlavorForm(prev => ({ ...prev, pricePerKg: Number(e.target.value) }))}
                    className="w-full bg-[#F9F7F4] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Category</label>
                  <div className="flex gap-2">
                    {['Classic', 'Premium'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFlavorForm(prev => ({ ...prev, category: cat as any }))}
                        className={`flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all ${
                          flavorForm.category === cat 
                            ? 'bg-[#004F39] text-white border-[#004F39]' 
                            : 'bg-white text-[#151613] border-black/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Visual Color</label>
                  <input 
                    type="color"
                    value={flavorForm.color}
                    onChange={(e) => setFlavorForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-12 bg-transparent border-none cursor-pointer"
                  />
                </div>
                <button 
                  onClick={() => {
                    if (flavorForm.name && flavorForm.pricePerKg > 0) {
                      const newPricing = { ...bespokePricing };
                      newPricing.flavors[flavorForm.category].push({
                        ...flavorForm,
                        accent: '#004F39'
                      });
                      setBespokePricing(newPricing);
                      setIsAddingFlavor(false);
                      setFlavorForm({ name: '', pricePerKg: 0, category: 'Classic', color: '#3D2B1F' });
                    }
                  }}
                  className="w-full py-5 bg-[#004F39] text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:bg-[#151613] transition-all"
                >
                  Add Flavor
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
