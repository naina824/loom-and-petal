import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('crochet_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('crochet_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product, quantity = 1, selectedColor = '') => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i._id === product._id && i.selectedColor === (selectedColor || product.colors?.[0] || '')
      );

      const colorToUse = selectedColor || product.colors?.[0] || 'Standard';

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          image: product.images?.[0] || '',
          category: product.category,
          selectedColor: colorToUse,
          quantity,
        },
      ];
    });
    setIsOpen(true);
  };

  const updateQuantity = (id, color, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item._id === id && item.selectedColor === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id, color) => {
    setItems((prev) => prev.filter((item) => !(item._id === id && item.selectedColor === color)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
