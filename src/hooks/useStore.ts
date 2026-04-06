import { useState, useEffect } from 'react';
import { products as initialProducts, Product } from '../data/products';

export const useStore = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxury_studio_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('luxury_studio_hero_image') || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1920&q=80';
  });

  useEffect(() => {
    localStorage.setItem('luxury_studio_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('luxury_studio_hero_image', heroImage);
  }, [heroImage]);

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

  return {
    products,
    heroImage,
    setHeroImage,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
