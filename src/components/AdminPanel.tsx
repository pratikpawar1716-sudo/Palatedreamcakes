import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Edit2, Check, X, Eye, EyeOff, LogOut, Package, TrendingUp, DollarSign, Search, Sparkles, LayoutDashboard, ClipboardList, RefreshCw, Clock, CheckCircle2, Cake } from 'lucide-react';
import Papa from 'papaparse';
import { products as initialProducts, Product } from '../data/products';
import { Order, OrderStatus, orderDatabase as localOrders } from '../data/orders';

const ADMIN_PASSWORD = "1818";
const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_CSV_URL;

type AdminTab = 'dashboard' | 'inventory' | 'orders';

export const AdminPanel = ({ onExit }: { onExit: () => void }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  // Inventory State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editShortcode, setEditShortcode] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Orders State
  const [orders, setOrders] = useState<Order[]>(localOrders);
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const fetchLiveOrders = async () => {
    if (!GOOGLE_SHEET_URL) return;
    
    setIsSyncingOrders(true);
    try {
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error("Fetch failed");
      const csvText = await response.text();
      
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

  const toggleAvailability = (id: string) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, priority: !p.priority } : p
    ));
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditPrice(product.price);
    setEditShortcode(product.shortcode || "");
  };

  const saveProduct = (id: string) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, price: editPrice, shortcode: editShortcode } : p
    ));
    setEditingId(null);
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
              <p className="text-[9px] uppercase tracking-widest opacity-40 font-bold">The Palette Stories Official</p>
            </div>
          </div>

          <div className="flex bg-[#151613]/5 p-1 rounded-full">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Work Manager', icon: ClipboardList },
              { id: 'inventory', label: 'Inventory', icon: Package },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
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
          <div className="bg-white rounded-[3rem] shadow-sm border border-black/5 overflow-hidden">
            <div className="p-10 border-b border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <h2 className="text-3xl font-serif">Live Inventory</h2>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#151613]/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Search products or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#151613]/5 border-none rounded-full py-4 pl-14 pr-8 text-sm focus:ring-2 focus:ring-[#004F39]/20 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#151613]/5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#151613]/50">
                    <th className="px-10 py-6">Product</th>
                    <th className="px-10 py-6">Category</th>
                    <th className="px-10 py-6">Price</th>
                    <th className="px-10 py-6">Insta Link</th>
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
                            src={product.shortcode ? `https://www.instagram.com/p/${product.shortcode}/media/?size=l` : product.images[0]} 
                            alt="" 
                            className="w-12 h-12 rounded-xl object-cover" 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (product.images && product.images[0] && target.src !== product.images[0]) {
                                target.src = product.images[0];
                              }
                            }}
                          />
                          <span className="font-serif text-lg">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 bg-[#151613]/5 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        {editingId === product.id ? (
                          <input 
                            type="number" 
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-24 bg-[#151613]/5 border border-[#004F39] rounded-lg px-3 py-2 text-sm focus:outline-none"
                          />
                        ) : (
                          <span className="font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="px-10 py-8">
                        {editingId === product.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={editShortcode}
                              onChange={(e) => setEditShortcode(e.target.value)}
                              placeholder="Shortcode"
                              className="w-32 bg-[#151613]/5 border border-[#004F39] rounded-lg px-3 py-2 text-xs focus:outline-none"
                            />
                            <button onClick={() => saveProduct(product.id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg">
                              <Check size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 group">
                            <span className="text-[10px] text-[#151613]/40 font-mono">{product.shortcode || "None"}</span>
                            <button onClick={() => startEditing(product)} className="opacity-0 group-hover:opacity-100 p-1.5 text-[#151613]/30 hover:text-[#004F39] transition-all">
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-10 py-8">
                        <div className={`inline-flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold ${product.priority ? 'text-emerald-500' : 'text-rose'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${product.priority ? 'bg-emerald-500' : 'bg-rose'}`} />
                          {product.priority ? 'In Stock' : 'Out of Stock'}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => toggleAvailability(product.id)}
                          className={`p-3 rounded-xl transition-all ${
                            product.priority 
                              ? 'bg-rose/10 text-rose hover:bg-rose hover:text-white' 
                              : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                          }`}
                        >
                          {product.priority ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
