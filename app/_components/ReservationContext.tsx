"use client";

import { DateRange } from "@daypicker/react";
import { createContext, useContext, useState } from "react";

type DateContextType = {
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  resetRang: () => void;
};

const ReservationContext = createContext<DateContextType | undefined>(
  undefined,
);

function ReservationProviders({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const resetRang = () => setRange(undefined);
  return (
    <>
      <ReservationContext.Provider value={{ range, setRange, resetRang }}>
        {children}
      </ReservationContext.Provider>
    </>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("Context was used outside provider");
  }

  return context;
}

export { ReservationProviders, useReservation };
