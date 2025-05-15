
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Index() {
  const { user, userDetails } = useAuth();
  const { t } = useLanguage();

  // Redirect logic based on user role
  const getDashboardLink = () => {
    if (!userDetails) return '/login';
    return userDetails.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
  };

  return (
    <MainLayout>
      <section className="bg-gradient-to-b from-white to-gray-100 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                EngLearn: Aprenda inglês com uma experiência personalizada
              </h1>
              <p className="text-xl text-gray-700">
                Uma plataforma inovadora para professores e alunos, oferecendo aulas personalizadas e progresso monitorado.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to={getDashboardLink()}>
                    <Button size="lg" className="btn-primary">
                      {t('dashboard')}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <Button size="lg" className="btn-primary">
                        {t('login')}
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="lg" variant="outline">
                        {t('register')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Recursos Principais</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-green mr-2 mt-1"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Aulas personalizadas com texto e vídeo</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-green mr-2 mt-1"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Acompanhamento detalhado do progresso</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-green mr-2 mt-1"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Disponível em português e inglês</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
