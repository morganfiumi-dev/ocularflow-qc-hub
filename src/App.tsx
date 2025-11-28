import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CommandCenter from "./pages/CommandCenter";
import NotFound from "./pages/NotFound";
import OcularFlow from "./pages/OcularFlow";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/ocularflow" element={<OcularFlow />} />
          <Route path="/asset-map/:titleId" element={<div className="flex min-h-screen items-center justify-center bg-background"><div className="text-center"><h1 className="text-2xl font-bold">AssetMap Placeholder</h1><p className="text-muted-foreground mt-2">This will be replaced later</p></div></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
