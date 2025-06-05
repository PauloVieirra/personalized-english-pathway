
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StudentSidebar from '@/components/student/StudentSidebar';
import MyCourses from '@/components/student/MyCourses';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, CheckCircle, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import StudentRanking from '@/components/student/StudentRanking';
import StudentCourseCarousel from '@/components/student/StudentCourseCarousel';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type DashboardStats = {
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  totalCourses: number;
};

export default function StudentDashboard() {
  const { t } = useLanguage();
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
    totalCourses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      if (!userDetails?.id) return;
      
      setLoading(true);
      try {
        // Get assigned lessons count and completed count
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('student_lessons')
          .select('*')
          .eq('student_id', userDetails.id);

        if (lessonsError) throw lessonsError;

        const totalLessons = lessonsData?.length || 0;
        const completedLessons = lessonsData?.filter(lesson => lesson.completed)?.length || 0;
        
        // Calculate average score from completed lessons
        let averageScore = 0;
        if (completedLessons > 0) {
          const scores = lessonsData
            ?.filter(lesson => lesson.completed && lesson.score !== null)
            .map(lesson => lesson.score as number) || [];
            
          if (scores.length > 0) {
            averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
          }
        }

        // Get purchased courses count
        const { data: coursesData, error: coursesError } = await supabase
          .from('course_purchases')
          .select('*')
          .eq('student_id', userDetails.id)
          .eq('status', 'completed');

        if (coursesError) throw coursesError;

        const totalCourses = coursesData?.length || 0;

        setStats({
          totalLessons,
          completedLessons,
          averageScore,
          totalCourses,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, [userDetails]);

  const completionPercentage = stats.totalLessons > 0 
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100) 
    : 0;

  const handleViewFullRanking = () => {
    navigate('/student/ranking');
  };

  return (
    <MainLayout requireAuth allowedRoles={['student']}>
      <div className="flex min-h-screen">
        <StudentSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('dashboard')}</h1>
          
          {/* Carrossel de Cursos */}
          <div className="mb-8">
            <StudentCourseCarousel />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cursos Adquiridos</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? '...' : stats.totalCourses}</div>
                    <p className="text-xs text-muted-foreground">
                      Total de cursos comprados
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('lessons')}</CardTitle>
                    <Book className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? '...' : stats.totalLessons}</div>
                    <p className="text-xs text-muted-foreground">
                      Total de aulas atribuídas
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('completed')}</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? '...' : stats.completedLessons}</div>
                    <p className="text-xs text-muted-foreground">
                      Total de aulas concluídas
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('progress')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso Total</span>
                      <span>{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                  
                  {stats.completedLessons > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">{t('score')}</h3>
                      <div className="text-2xl font-bold">
                        {stats.averageScore > 0 
                          ? `${stats.averageScore.toFixed(1)}/10` 
                          : 'Sem avaliações'
                        }
                      </div>
                    </div>
                  )}
                  
                  {stats.totalLessons === 0 && !loading && (
                    <div className="text-center py-4 text-muted-foreground">
                      Você ainda não tem aulas atribuídas.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Seção de Meus Cursos */}
              <div>
                <MyCourses />
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Ranking Semanal</span>
                    <Button variant="ghost" size="sm" onClick={handleViewFullRanking}>
                      Ver todos
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StudentRanking limit={10} currentUserId={userDetails?.id} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
