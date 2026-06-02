import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number; // in cents
  quantity: number;
  image?: string;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const { items } = get();
        const existingItem = items.find(item => item.productId === newItem.productId);

        if (existingItem) {
          // Increase quantity if item already exists
          set({
            items: items.map(item =>
              item.productId === newItem.productId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            )
          });
        } else {
          // Add new item with generated ID
          const itemWithId = {
            ...newItem,
            id: `${newItem.productId}-${Date.now()}`
          };
          set({ items: [...items, itemWithId] });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.productId !== productId)
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      setIsOpen: (isOpen) => {
        set({ isOpen });
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist items, not isOpen state
      partialize: (state) => ({ items: state.items })
    }
  )
);
