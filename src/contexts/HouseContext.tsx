import { createContext, useContext, useState, type ReactNode } from 'react';
import type { HouseSummary } from '../types';

interface HouseContextValue {
  currentHouse: HouseSummary | null;
  setCurrentHouse: (house: HouseSummary | null) => void;
}

const HouseContext = createContext<HouseContextValue | null>(null);

export function HouseProvider({ children }: { children: ReactNode }) {
  const [currentHouse, setCurrentHouse] = useState<HouseSummary | null>(null);

  return (
    <HouseContext.Provider value={{ currentHouse, setCurrentHouse }}>
      {children}
    </HouseContext.Provider>
  );
}

export function useHouse() {
  const ctx = useContext(HouseContext);
  if (!ctx) throw new Error('useHouse must be used within HouseProvider');
  return ctx;
}
