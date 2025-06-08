import React, { createContext, useContext } from 'react'
// TODO: Migrate any missing dependencies

const MarketScheduleContext = createContext<any>(null)

export function useMarketSchedule() {
  return useContext(MarketScheduleContext)
}

export function MarketScheduleProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Implement logic or migrate from the other project
  return (
    <MarketScheduleContext.Provider value={{}}>
      {children}
    </MarketScheduleContext.Provider>
  )
}
