'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, createContext, useContext, ReactNode } from 'react';

// Create a context for the query client
const QueryClientContext = createContext<QueryClient | null>(null);

// Hook to access the query client
export function useQueryClient() {
  const context = useContext(QueryClientContext);
  if (!context) {
    throw new Error('useQueryClient must be used within Providers');
  }
  return context;
}

// Optimistic update helper types
interface OptimisticUpdate<T> {
  variables: T;
  optimisticData: any;
  rollbackData?: any;
}

interface MutationContext<T> {
  previousData: any;
  variables: T;
}

// Default query client configuration
const defaultQueryClientOptions = {
  queries: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 0,
  },
};

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: defaultQueryClientOptions,
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <QueryClientContext.Provider value={queryClient}>
        {children}
      </QueryClientContext.Provider>
    </QueryClientProvider>
  );
}
