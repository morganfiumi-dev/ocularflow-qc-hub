import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalNav from "./components/GlobalNav";
import CommandCenter from "./pages/CommandCenter";
import AssetMap from "./pages/AssetMap";
import DubFlow from "./pages/DubFlow";
import NotFound from "./pages/NotFound";
import OcularFlow from "./pages/OcularFlow";
import { trpc } from './lib/trpc';

const App = () => {
  // Create clients inside component to avoid stale instances
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));
  
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API_URL || 'http://localhost:3000/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <GlobalNav />
            <Routes>
              <Route path="/" element={<CommandCenter />} />
              <Route path="/ocularflow" element={<OcularFlow />} />
              <Route path="/qc/dub/:assetId" element={<DubFlow />} />
              <Route path="/asset-map/:titleId" element={<AssetMap />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
