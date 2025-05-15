
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  
  // Verificar se o usuário já está logado e redirecionar para o dashboard apropriado
  useEffect(() => {
    if (userDetails) {
      if (userDetails.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (userDetails.role === 'student') {
        navigate('/student/dashboard');
      }
    }
  }, [userDetails, navigate]);
  
  return (
    <MainLayout>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <LoginForm />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {t('register')} 
              <Link to="/register" className="ml-1 font-medium text-brand-blue hover:text-brand-darkBlue">
                {t('register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
