import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PurchasedCourse = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_free: boolean | null;
  price: number | null;
  purchased_at: string;
};

export default function MyCourses() {
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!userDetails?.id) return;

      try {
        // Usar a query correta que funciona com as políticas RLS
        const { data, error } = await supabase
          .from('course_purchases')
          .select(`
            created_at,
            course:courses(
              id,
              title,
              description,
              image_url,
              is_free,
              price
            )
          `)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro na query:', error);
          throw error;
        }

        console.log('Cursos encontrados:', data);

        const formattedCourses = data
          .filter(item => item.course) // Filtrar apenas itens com curso válido
          .map((item: any) => ({
            id: item.course.id,
            title: item.course.title,
            description: item.course.description,
            image_url: item.course.image_url,
            is_free: item.course.is_free,
            price: item.course.price,
            purchased_at: item.created_at
          }));

        setCourses(formattedCourses);
      } catch (error) {
        console.error('Erro ao buscar cursos comprados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [userDetails]);

  const formatPrice = (price: number | null, isFree: boolean | null) => {
    if (isFree) return 'Grátis';
    if (price === null) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Função para navegar para o conteúdo do curso
  const handleCourseClick = (courseId: string) => {
    navigate(`/student/course/${courseId}/lessons`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Meus Cursos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-40 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Nenhum curso adquirido</h2>
        <p className="text-gray-600 mb-6">
          Você ainda não possui cursos. Explore nosso catálogo e encontre o curso perfeito para você!
        </p>
        <Button onClick={() => navigate('/student/courses')}>
          Explorar Cursos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meus Cursos ({courses.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCourseClick(course.id)}
          >
            {course.image_url && (
              <div className="aspect-video">
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <span className="text-lg leading-tight">{course.title}</span>
                {course.is_free && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    Grátis
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {course.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Adquirido em {new Date(course.purchased_at).toLocaleDateString('pt-BR')}</span>
                {!course.is_free && (
                  <span className="font-medium">
                    {formatPrice(course.price, course.is_free)}
                  </span>
                )}
              </div>
              
              <Button 
                className="w-full" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCourseClick(course.id);
                }}
              >
                <Play className="mr-2 h-4 w-4" />
                Acessar Conteúdo
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
