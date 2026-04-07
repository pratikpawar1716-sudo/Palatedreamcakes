import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, Product } from '../data/products';

export interface Flavor {
  name: string;
  pricePerKg: number;
  color: string;
  accent: string;
}

export interface Topping {
  name: string;
  price: number;
  icon: string;
}

export interface BespokePricing {
  flavors: {
    Premium: Flavor[];
    Classic: Flavor[];
  };
  toppingOptions: Topping[];
  tierPremium: number;
  shapePremium: number;
}

interface StoreContextType {
  products: Product[];
  heroImage: string;
  heroHeadline: string;
  heroSubheadline: string;
  bespokePricing: BespokePricing;
  setHeroImage: (url: string) => void;
  setHeroHeadline: (text: string) => void;
  setHeroSubheadline: (text: string) => void;
  setBespokePricing: (pricing: BespokePricing) => void;
  addProduct: (product: Omit<Product, 'id' | 'priority'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxury_studio_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('luxury_studio_hero_image') || '';
  });

  const [heroHeadline, setHeroHeadline] = useState<string>(() => {
    return localStorage.getItem('luxury_studio_hero_headline') || "Come, let's create your story";
  });

  const [heroSubheadline, setHeroSubheadline] = useState<string>(() => {
    return localStorage.getItem('luxury_studio_hero_subheadline') || "A culinary sanctuary where art meets flavor, crafting bespoke cakes and confections that define your unique legacy.";
  });

  const [bespokePricing, setBespokePricing] = useState<BespokePricing>(() => {
    const saved = localStorage.getItem('luxury_studio_bespoke_pricing');
    if (saved) return JSON.parse(saved);
    
    return {
      flavors: {
        Premium: [
          { name: 'Gold Dusted Truffle', pricePerKg: 4500, color: '#2D1B14', accent: '#B89B5E' },
          { name: 'Ratnagiri Alphonso', pricePerKg: 3800, color: '#FFB347', accent: '#004F39' },
          { name: 'Belgian Truffle', pricePerKg: 3500, color: '#3D2B1F', accent: '#004F39' },
          { name: 'Champagne Sparkle', pricePerKg: 4200, color: '#F7E7CE', accent: '#B89B5E' },
          { name: 'Saffron Pistachio', pricePerKg: 4000, color: '#E9D66B', accent: '#004F39' },
          { name: 'Rose', pricePerKg: 3900, color: '#FFC0CB', accent: '#004F39' },
        ],
        Classic: [
          { name: 'Chocolate', pricePerKg: 1800, color: '#3D2B1F', accent: '#004F39' },
          { name: 'Vanilla', pricePerKg: 1500, color: '#FFFACA', accent: '#004F39' },
          { name: 'Butterscotch', pricePerKg: 1600, color: '#E9D66B', accent: '#004F39' },
          { name: 'Velvet Crimson', pricePerKg: 2200, color: '#9B111E', accent: '#151613' },
          { name: 'Roasted Hazelnut', pricePerKg: 2500, color: '#8E7618', accent: '#004F39' },
        ]
      },
      toppingOptions: [
        { name: 'Macarons', price: 600, icon: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=100&auto=format&fit=crop' },
        { name: 'Gold Leaves', price: 1200, icon: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=100&auto=format&fit=crop' },
        { name: 'Orchids', price: 800, icon: 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?q=80&w=100&auto=format&fit=crop' },
        { name: 'Chocolate', price: 500, icon: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=100&auto=format&fit=crop' },
        { name: 'Florals', price: 700, icon: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=100&auto=format&fit=crop' },
      ],
      tierPremium: 1000,
      shapePremium: 200
    };
  });

  useEffect(() => {
    localStorage.setItem('luxury_studio_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('luxury_studio_hero_image', heroImage);
  }, [heroImage]);

  useEffect(() => {
    localStorage.setItem('luxury_studio_hero_headline', heroHeadline);
  }, [heroHeadline]);

  useEffect(() => {
    localStorage.setItem('luxury_studio_hero_subheadline', heroSubheadline);
  }, [heroSubheadline]);

  useEffect(() => {
    localStorage.setItem('luxury_studio_bespoke_pricing', JSON.stringify(bespokePricing));
  }, [bespokePricing]);

  const addProduct = (product: Omit<Product, 'id' | 'priority'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      priority: true
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      products,
      heroImage,
      heroHeadline,
      heroSubheadline,
      bespokePricing,
      setHeroImage,
      setHeroHeadline,
      setHeroSubheadline,
      setBespokePricing,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
