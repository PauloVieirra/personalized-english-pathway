import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import StudentSidebar from '@/components/student/StudentSidebar';
import PaymentModal from '@/components/student/PaymentModal';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_free: boolean | null;
  price: number | null;
  teacher_id: string;
};

type Lesson = {
  id: string;
  title: string;
  content: string;
  order_index: number;
};

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { userDetails } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;

      try {
        // Buscar detalhes do curso
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('id, title, description, image_url, is_free, price, teacher_id')
          .eq('id', courseId)
          .single();

        if (courseError) throw courseError;

        setCourse(courseData);

        // Verificar se o usuário já comprou o curso
        if (userDetails?.id) {
          const { data: purchaseData } = await supabase
            .from('course_purchases')
            .select('*')
            .eq('course_id', courseId)
            .eq('status', 'completed')
            .maybeSingle();

          setHasPurchased(!!purchaseData);
        }

        // Buscar aulas do curso
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('course_lessons')
          .select(`
            lesson:lessons(id, title, content),
            order_index
          `)
          .eq('course_id', courseId)
          .order('order_index');

        if (lessonsError) throw lessonsError;

        const formattedLessons = lessonsData.map((item: any) => ({
          id: item.lesson.id,
          title: item.lesson.title,
          content: item.lesson.content,
          order_index: item.order_index
        }));

        setLessons(formattedLessons);
      } catch (error) {
        console.error('Erro ao buscar detalhes do curso:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do curso",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, userDetails]);

  const handleEnrollCourse = async () => {
    if (!userDetails?.id || !course) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para se inscrever em um curso",
        variant: "destructive"
      });
      return;
    }

    // Se o curso é gratuito, inscrever diretamente
    if (course.is_free) {
      setEnrolling(true);
      try {
        const { error } = await supabase
          .from('course_purchases')
          .insert({
            course_id: course.id,
            amount: 0,
            payment_method: 'free',
            status: 'completed'
          });

        if (error) throw error;

        setHasPurchased(true);
        toast({
          title: "Sucesso!",
          description: "Você foi inscrito no curso gratuito com sucesso!",
        });
      } catch (error) {
        console.error('Erro ao se inscrever no curso gratuito:', error);
        toast({
          title: "Erro",
          description: "Erro ao se inscrever no curso",
          variant: "destructive"
        });
      } finally {
        setEnrolling(false);
      }
    } else {
      // Se o curso é pago, abrir modal de pagamento
      setPaymentModalOpen(true);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!userDetails?.id || !course) return;

    try {
      const { error } = await supabase
        .from('course_purchases')
        .insert({
          course_id: course.id,
          amount: course.price || 0,
          payment_method: 'card',
          status: 'completed'
        });

      if (error) throw error;

      setHasPurchased(true);
      toast({
        title: "Curso adquirido!",
        description: "Você agora tem acesso ao curso. Aproveite seus estudos!",
      });
      
      // Navegar para a área do aluno após 2 segundos
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erro ao registrar compra:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar a compra do curso",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <MainLayout requireAuth allowedRoles={['student']}>
        <div className="flex min-h-screen">
          <StudentSidebar />
          <div className="flex-1 p-8">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div>
                <Skeleton className="h-48 w-full" />
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
            <Button
              variant="ghost"
              onClick={() => navigate('/student/courses')}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos cursos
            </Button>
            <div className="text-center">
              <p className="text-muted-foreground">Curso não encontrado</p>
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
          <Button
            variant="ghost"
            onClick={() => navigate('/student/courses')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos cursos
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo principal do curso */}
            <div className="lg:col-span-2">
              {/* Imagem do curso */}
              {course.image_url && (
                <div className="mb-6">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Título e preço */}
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold">
                  {course.title}
                  {course.is_free && (
                    <span className="ml-2 text-green-600 font-medium">Grátis</span>
                  )}
                </h1>
                {!course.is_free && course.price && (
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(course.price)}
                  </div>
                )}
              </div>

              {/* Descrição */}
              {course.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Sobre este curso</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                </div>
              )}

              {/* Lista de aulas */}
              {lessons.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">
                    Conteúdo do curso ({lessons.length} aulas)
                  </h2>
                  <div className="space-y-2">
                    {lessons.map((lesson, index) => (
                      <Card key={lesson.id} className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">{lesson.title}</h3>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar com informações e botão de inscrição */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {hasPurchased ? 'Curso Adquirido' : 'Inscrever-se no curso'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasPurchased ? (
                    <div className="text-center">
                      <div className="text-green-600 font-medium mb-4">
                        ✓ Você já possui este curso
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => navigate('/student/dashboard')}
                      >
                        Ir para Meus Cursos
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {course.is_free ? 'Grátis' : formatPrice(course.price)}
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleEnrollCourse}
                        disabled={enrolling}
                      >
                        {enrolling ? 'Inscrevendo...' : 'Inscrever-se agora'}
                      </Button>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Aulas:</span>
                      <span className="font-medium">{lessons.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">
                        {course.is_free ? 'Gratuito' : 'Pago'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Modal de Pagamento */}
          {course && (
            <PaymentModal
              isOpen={paymentModalOpen}
              onClose={() => setPaymentModalOpen(false)}
              course={course}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
