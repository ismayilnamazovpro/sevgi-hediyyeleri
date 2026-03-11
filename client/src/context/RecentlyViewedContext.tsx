import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ViewedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface RecentlyViewedContextType {
  items: ViewedProduct[];
  addViewed: (product: ViewedProduct) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  items: [],
  addViewed: () => {},
});

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ViewedProduct[]>(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(items));
  }, [items]);

  const addViewed = (product: ViewedProduct) => {
    setItems(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ items, addViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext);
}
