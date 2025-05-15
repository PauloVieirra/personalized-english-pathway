
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, User, FileCheck } from 'lucide-react';
import { Tables } from '@/lib/supabase';

type DashboardStats = {
  lessonCount: number;
  studentCount: number;
  assignedLessonCount: number;
};

export default function TeacherDashboard() {
  const { t } = useLanguage();
  const { userDetails } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    lessonCount: 0,
    studentCount: 0,
    assignedLessonCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      if (!userDetails?.id) return;
      
      setLoading(true);
      try {
        // Get lesson count
        const { count: lessonCount, error: lessonError } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('teacher_id', userDetails.id);

        if (lessonError) throw lessonError;

        // Get student count
        const { count: studentCount, error: studentError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student');

        if (studentError) throw studentError;

        // Get assigned lesson count
        const { count: assignedLessonCount, error: assignedError } = await supabase
          .from('student_lessons')
          .select('*', { count: 'exact', head: true });

        if (assignedError) throw assignedError;

        setStats({
          lessonCount: lessonCount || 0,
          studentCount: studentCount || 0,
          assignedLessonCount: assignedLessonCount || 0,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, [userDetails]);

  return (
    <MainLayout requireAuth allowedRoles={['teacher']}>
      <div className="flex min-h-screen">
        <TeacherSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('dashboard')}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('lessons')}</CardTitle>
                <Book className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.lessonCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total de aulas criadas
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('students')}</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.studentCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total de alunos registrados
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('assignLesson')}</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.assignedLessonCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total de aulas atribuídas
                </p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Atividade Recente</h2>
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              {loading 
                ? t('loading') 
                : stats.lessonCount === 0 
                  ? "Você ainda não criou nenhuma aula. Comece criando uma nova aula na seção de aulas."
                  : `Você tem ${stats.lessonCount} aulas criadas e ${stats.assignedLessonCount} atribuições.`
              }
            </p>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
