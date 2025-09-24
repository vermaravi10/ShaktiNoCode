import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LandingPage from "./components/LandingPage";
import EditorPage from "./components/EditorPage";
import NotFound from "./pages/NotFound";
import { EditorProvider } from "@/context/EditorContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LovableUi from "./components/lovable/editor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <EditorProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/editor1" element={<LovableUi />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Signup" element={<Signup />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </EditorProvider>
        </BrowserRouter>
      </DndProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
