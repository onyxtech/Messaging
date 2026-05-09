// src/providers/Providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { BrandProvider } from "./BrandProvider";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // useState ensures QueryClient is not recreated on every render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // 30s
            retry:     1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrandProvider>
        {children}
        <Toaster richColors position="top-right" />
      </BrandProvider>
    </QueryClientProvider>
  );
}