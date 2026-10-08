"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import AllProductsDrawer from "./AllProductsDrawer";

interface AllProductsDrawerContextValue {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const AllProductsDrawerContext = createContext<AllProductsDrawerContextValue | null>(null);

export const useAllProductsDrawer = () => {
  const context = useContext(AllProductsDrawerContext);

  if (!context) {
    throw new Error("useAllProductsDrawer must be used within AllProductsProvider");
  }

  return context;
};

const AllProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const value = useMemo(
    () => ({ open, openDrawer, closeDrawer }),
    [open, openDrawer, closeDrawer]
  );

  return (
    <AllProductsDrawerContext.Provider value={value}>
      {children}
      <AllProductsDrawer open={open} onClose={closeDrawer} />
    </AllProductsDrawerContext.Provider>
  );
};

export default AllProductsProvider;
