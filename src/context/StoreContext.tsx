import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, Product } from '../data/products';

interface StoreContextType {
  products: Product[];
  heroImage: string;
  heroHeadline: string;
  heroSubheadline: string;
  setHeroImage: (url: string) => void;
  setHeroHeadline: (text: string) => void;
  setHeroSubheadline: (text: string) => void;
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
      setHeroImage,
      setHeroHeadline,
      setHeroSubheadline,
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
