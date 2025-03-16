
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import ArrayVisualizer from "./pages/ArrayVisualizer";
import StackVisualizer from "./pages/StackVisualizer";
import QueueVisualizer from "./pages/QueueVisualizer";
import LinkedListVisualizer from "./pages/LinkedListVisualizer";
import DequeVisualizer from "./pages/DequeVisualizer";
import TreeVisualizer from "./pages/TreeVisualizer";
import BSTVisualizer from "./pages/BSTVisualizer";
import HeapVisualizer from "./pages/HeapVisualizer";
import GraphVisualizer from "./pages/GraphVisualizer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/array" element={<ArrayVisualizer />} />
          <Route path="/stack" element={<StackVisualizer />} />
          <Route path="/queue" element={<QueueVisualizer />} />
          <Route path="/linked-list" element={<LinkedListVisualizer />} />
          <Route path="/deque" element={<DequeVisualizer />} />
          <Route path="/tree" element={<TreeVisualizer />} />
          <Route path="/bst" element={<BSTVisualizer />} />
          <Route path="/heap" element={<HeapVisualizer />} />
          <Route path="/graph" element={<GraphVisualizer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
