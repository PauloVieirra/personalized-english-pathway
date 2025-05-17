import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { t } = useLanguage();
  const { user, userDetails } = useAuth();

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {t('welcome')}!
          </h1>
          <p className="text-gray-700">
            {t('homePageDescription')}
          </p>
        </section>

        {user ? (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t('yourDashboard')}
            </h2>
            {userDetails?.role === 'teacher' ? (
              <Card>
                <CardHeader>
                  <CardTitle>{t('teacherDashboard')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('teacherDashboardDescription')}</p>
                  <Link to="/teacher/dashboard">
                    <Button>{t('goToDashboard')}</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : userDetails?.role === 'student' ? (
              <Card>
                <CardHeader>
                  <CardTitle>{t('studentDashboard')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('studentDashboardDescription')}</p>
                  <Link to="/student/dashboard">
                    <Button>{t('goToDashboard')}</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <p>{t('unrecognizedRole')}</p>
            )}
          </section>
        ) : (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t('getStarted')}
            </h2>
            <p className="text-gray-700">
              {t('notLoggedInMessage')}
            </p>
            <div className="space-x-4">
              <Link to="/login">
                <Button>{t('login')}</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">{t('register')}</Button>
              </Link>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-4">
            {t('aboutUs')}
          </h2>
          <p className="text-gray-700">
            {t('aboutUsDescription')}
          </p>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
