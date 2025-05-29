import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";

import Index from "./pages/Index";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import LessonsPage from "./pages/Teacher/LessonsPage";
import CoursesPage from "./pages/Teacher/CoursesPage";
import StudentsPage from "./pages/Teacher/StudentsPage";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentLessonsPage from "./pages/Student/StudentLessonsPage";
import AllCoursesPage from "./pages/Student/AllCoursesPage";
import RankingPage from "./pages/Student/RankingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Get the last visited route from localStorage on initial load
  const lastRoute = localStorage.getItem('lastRoute') || '/';

  // Update localStorage whenever the route changes
  React.useEffect(() => {
    const handleRouteChange = () => {
      localStorage.setItem('lastRoute', window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LanguageProvider>
              <AccessibilityProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Redirect to last visited route on initial load */}
                    <Route path="/" element={lastRoute !== '/' ? <Navigate to={lastRoute} /> : <Index />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Teacher routes */}
                    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                    <Route path="/teacher/lessons" element={<LessonsPage />} />
                    <Route path="/teacher/courses" element={<CoursesPage />} />
                    <Route path="/teacher/students" element={<StudentsPage />} />
                    
                    {/* Student routes */}
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/lessons" element={<StudentLessonsPage />} />
                    <Route path="/student/courses" element={<AllCoursesPage />} />
                    <Route path="/student/ranking" element={<RankingPage />} />
                    
                    {/* Catch-all route for 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TooltipProvider>
              </AccessibilityProvider>
            </LanguageProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;