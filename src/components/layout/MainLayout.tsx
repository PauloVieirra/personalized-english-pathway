
import React from 'react';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2 } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('teacher' | 'student' | 'admin')[];
}

export default function MainLayout({ 
  children, 
  requireAuth = false,
  allowedRoles = ['teacher', 'student', 'admin']
}: MainLayoutProps) {
  const { user, userDetails, isLoading } = useAuth();
  const { t } = useLanguage();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          <p className="text-lg">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role is allowed
  if (requireAuth && userDetails && !allowedRoles.includes(userDetails.role)) {
    return <Navigate to="/" replace />;
  }

  // Check if user is blocked
  if (requireAuth && userDetails && userDetails.status === 'blocked') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-2">Conta Bloqueada</h1>
            <p className="text-gray-600">Sua conta foi bloqueada. Por favor, entre em contato com o administrador.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
