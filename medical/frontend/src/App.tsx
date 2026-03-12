import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import your i18n configuration
import "./i18n/index"; 
// Import your main dashboard page
import Index from "./pages/Index";

// Create the data-fetching client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* The Toaster component allows those toast.success() popups to show up */}
        <Toaster position="top-center" richColors closeButton />
        
        <BrowserRouter>
          <Routes>
            {/* This Route renders your Index.tsx dashboard. 
               The path "/" means it is the home page.
            */}
            <Route path="/" element={<Index />} />
            
            {/* If you add a login page later, you would add:
               <Route path="/login" element={<Login />} /> 
            */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;