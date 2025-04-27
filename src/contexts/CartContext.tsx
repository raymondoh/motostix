"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/types/product";

// Define cart item type
export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

// Define cart context type
type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
  closeCart: () => void;
  itemCount: number;
  subtotal: number;
};

// Create context with default values
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const storedCart = localStorage.getItem("motorstix-cart");
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("motorstix-cart");
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("motorstix-cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  // Calculate total item count
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Add item to cart
  const addItem = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
      } else {
        // Add new item
        return [...prevItems, { id: product.id, product, quantity }];
      }
    });

    // Open cart when adding items
    setIsOpen(true);
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setItems(prevItems => prevItems.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setIsOpen(prev => !prev);
  };

  // Close cart
  const closeCart = () => {
    setIsOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        toggleCart,
        closeCart,
        itemCount,
        subtotal
      }}>
      {children}
    </CartContext.Provider>
  );
}
