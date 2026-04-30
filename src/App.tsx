import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GridProvider } from "@/context/GridContext";
import { GridShell } from "@/components/grid/GridShell";
import Home from "./pages/Home.tsx";
import News from "./pages/News.tsx";
import Drivers, { DriverDetail } from "./pages/Drivers.tsx";
import Teams, { TeamDetail } from "./pages/Teams.tsx";
import Calendar from "./pages/Calendar.tsx";
import Standings from "./pages/Standings.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GridProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<GridShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/noticias" element={<News />} />
              <Route path="/pilotos" element={<Drivers />} />
              <Route path="/pilotos/:id" element={<DriverDetail />} />
              <Route path="/equipes" element={<Teams />} />
              <Route path="/equipes/:id" element={<TeamDetail />} />
              <Route path="/calendario" element={<Calendar />} />
              <Route path="/classificacao" element={<Standings />} />
              <Route path="/sobre" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GridProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
