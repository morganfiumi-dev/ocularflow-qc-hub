import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalNav from "./components/GlobalNav";
import CommandCenter from "./pages/CommandCenter";
import AssetMap from "./pages/AssetMap";
import DubFlow from "./pages/DubFlow";
import NotFound from "./pages/NotFound";
import OcularFlow from "./pages/OcularFlow";
import { trpc, createMockTRPCClient } from './lib/trpc-mock';

// Create clients outside component to ensure single instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const trpcClient = createMockTRPCClient();

const App = () => (
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

export default App;
