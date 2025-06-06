
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Book, Play, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type CourseLesson = {
  id: string;
  order_index: number;
  lesson: {
    id: string;
    title: string;
    content: string;
    video_url: string | null;
  };
};

type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
};

export default function CourseLessonsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      if (!courseId || !userDetails?.id) return;

      try {
        // Verificar se o usuário comprou o curso
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('course_purchases')
          .select('*')
          .eq('student_id', userDetails.id)
          .eq('course_id', courseId)
          .eq('status', 'completed')
          .single();

        if (purchaseError || !purchaseData) {
          toast({
            title: 'Acesso negado',
            description: 'Você não possui acesso a este curso.',
            variant: 'destructive',
          });
          navigate('/student/courses');
          return;
        }

        // Buscar dados do curso
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('id, title, description, image_url')
          .eq('id', courseId)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Buscar aulas do curso
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('course_lessons')
          .select(`
            id,
            order_index,
            lesson:lessons(
              id,
              title,
              content,
              video_url
            )
          `)
          .eq('course_id', courseId)
          .order('order_index', { ascending: true });

        if (lessonsError) throw lessonsError;
        setLessons(lessonsData as unknown as CourseLesson[] || []);

      } catch (error: any) {
        console.error('Error fetching course data:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados do curso.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [courseId, userDetails, navigate, toast]);

  const handleLessonClick = (lessonId: string) => {
    // Por enquanto, apenas mostrar que a aula foi clicada
    // Aqui você pode implementar a navegação para a página específica da aula
    console.log('Clicked lesson:', lessonId);
    toast({
      title: 'Aula selecionada',
      description: 'Funcionalidade de visualização da aula será implementada em breve.',
    });
  };

  if (loading) {
    return (
      <MainLayout requireAuth allowedRoles={['student']}>
        <div className="flex min-h-screen">
          <StudentSidebar />
          <div className="flex-1 p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-8 w-64" />
              </div>
              
              <div className="grid gap-4">
                {Array(5).fill(0).map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-10 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout requireAuth allowedRoles={['student']}>
        <div className="flex min-h-screen">
          <StudentSidebar />
          <div className="flex-1 p-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Curso não encontrado</h2>
              <p className="text-gray-600 mb-6">
                O curso solicitado não foi encontrado ou você não tem acesso a ele.
              </p>
              <Button onClick={() => navigate('/student/courses')}>
                Voltar aos Cursos
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth allowedRoles={['student']}>
      <div className="flex min-h-screen">
        <StudentSidebar />
        <div className="flex-1 p-8">
          <div className="space-y-6">
            {/* Header do curso */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{course.title}</h1>
                {course.description && (
                  <p className="text-gray-600 mt-2">{course.description}</p>
                )}
              </div>
            </div>

            {/* Lista de aulas */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Aulas do Curso ({lessons.length})</h2>
              
              {lessons.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Book className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Nenhuma aula disponível</h3>
                    <p className="text-gray-600">
                      Este curso ainda não possui aulas. Verifique novamente mais tarde.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {lessons.map((courseLesson, index) => (
                    <Card 
                      key={courseLesson.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleLessonClick(courseLesson.lesson.id)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              Aula {index + 1}
                            </span>
                            <span>{courseLesson.lesson.title}</span>
                          </span>
                          {courseLesson.lesson.video_url && (
                            <Play className="h-5 w-5 text-gray-400" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {courseLesson.lesson.content.substring(0, 150)}...
                        </p>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLessonClick(courseLesson.lesson.id);
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Assistir Aula
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
