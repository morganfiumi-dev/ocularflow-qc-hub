import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalNav from "./components/GlobalNav";
import CommandCenter from "./pages/CommandCenter";
import AssetMap from "./pages/AssetMap";
import DubFlow from "./pages/DubFlow";
import NotFound from "./pages/NotFound";
import OcularFlow from "./pages/OcularFlow";

const App = () => (
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
);

export default App;
