import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GridProvider } from "@/shared/context/GridContext";
import { GridShell } from "@/shared/components/layout/GridShell";
import { ApiStatus } from "@/shared/components/ApiStatus";
import Home from "@/features/home/pages/Home";
import News from "@/features/news/pages/News";
import DriversList from "@/features/drivers/pages/DriversList";
import { DriverDetail } from "@/features/drivers/pages/DriverDetail";
import TeamsList from "@/features/teams/pages/TeamsList";
import { TeamDetail } from "@/features/teams/pages/TeamDetail";
import Calendar from "@/features/calendar/pages/Calendar";
import Standings from "@/features/standings/pages/Standings";
import About from "@/features/about/pages/About";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

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
