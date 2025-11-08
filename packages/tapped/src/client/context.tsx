import React, { createContext, useContext } from "react"

import { debugLog } from "../index.js"

interface SSRContextType {
  loaderData: any
}

const SSRContext = createContext<SSRContextType | null>(null)

type WouterLoaderProviderProps = {
  children: React.ReactNode
  loaderData: any
}

/**
 * Provider component that supplies SSR loader data to child components
 */
export const WouterLoaderProvider = (props: WouterLoaderProviderProps) => {
  const { children, loaderData } = props
  return <SSRContext.Provider value={{ loaderData }}>{children}</SSRContext.Provider>
}

/**
 * Hook to access SSR loader data from context or window object (client-side hydration)
 */
export const useSSRData = () => {
  const context = useContext(SSRContext)

  if (!context?.loaderData && typeof window !== "undefined") {
    const windowLoaderData = (window as any).__LOADER_DATA
    debugLog("Using window.__LOADER_DATA:", windowLoaderData)
    if (windowLoaderData) {
      return windowLoaderData
    }
  }

  if (!context) {
    throw new Error("useSSRData must be used within a WouterLoaderProvider")
  }

  debugLog("Using context loader data:", context.loaderData)
  return context.loaderData
}
