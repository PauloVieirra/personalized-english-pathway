
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';
import StudentsList from '@/components/teacher/StudentsList';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

export default function StudentsPage() {
  const { t } = useLanguage();

  return (
    <MainLayout requireAuth allowedRoles={['teacher']}>
      <div className="flex min-h-screen">
        <TeacherSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{t('students')}</h1>
            <Button className="btn-primary">
              <PlusCircle className="w-4 h-4 mr-2" />
              {t('addStudent')}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('students')}</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentsList />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
