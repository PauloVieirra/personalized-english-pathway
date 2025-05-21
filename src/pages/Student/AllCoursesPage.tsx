
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import MainLayout from '@/components/layout/MainLayout';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useLanguage } from '@/context/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import CourseCard from '@/components/student/CourseCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
};

export default function AllCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { userDetails } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Buscar todos os cursos disponíveis
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, description, image_url');
          
        if (error) throw error;
        
        setCourses(data || []);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollCourse = async (courseId: string) => {
    if (!userDetails?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para se inscrever em um curso",
        variant: "destructive"
      });
      return;
    }

    // Aqui seria implementada a lógica para associar o aluno ao curso
    // Por exemplo, adicionando registros na tabela student_lessons para cada aula do curso
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A inscrição em cursos será implementada em breve!",
    });
  };

  return (
    <MainLayout requireAuth allowedRoles={['student']}>
      <div className="flex min-h-screen">
        <StudentSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('allCourses')}</h1>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-[160px] w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-muted/50 rounded-md p-6 text-center">
              <p className="text-muted-foreground">
                {t('noCoursesAvailable')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="flex flex-col">
                  <CourseCard
                    title={course.title}
                    imageUrl={course.image_url}
                  />
                  <div className="mt-2">
                    <Button 
                      className="w-full" 
                      onClick={() => handleEnrollCourse(course.id)}
                    >
                      Inscrever-se
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
