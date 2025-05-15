
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

import Index from "./pages/Index";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import LessonsPage from "./pages/Teacher/LessonsPage";
import StudentsPage from "./pages/Teacher/StudentsPage";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentLessonsPage from "./pages/Student/StudentLessonsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Teacher routes */}
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/lessons" element={<LessonsPage />} />
              <Route path="/teacher/students" element={<StudentsPage />} />
              
              {/* Student routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/lessons" element={<StudentLessonsPage />} />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
