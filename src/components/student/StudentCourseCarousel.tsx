
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import CourseCard from './CourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

export default function StudentCourseCarousel() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userDetails?.id) return;
      
      try {
        // Buscar cursos atribuídos ao aluno através das lições atribuídas
        const { data: studentLessons, error: lessonError } = await supabase
          .from('student_lessons')
          .select('lesson_id')
          .eq('student_id', userDetails.id);

        if (lessonError) throw lessonError;
        
        if (!studentLessons?.length) {
          setLoading(false);
          return;
        }

        const lessonIds = studentLessons.map(sl => sl.lesson_id);
        
        // Buscar informações dos cursos que contêm essas lições
        const { data: courseLessons, error: courseError } = await supabase
          .from('course_lessons')
          .select('course_id')
          .in('lesson_id', lessonIds);

        if (courseError) throw courseError;
        
        if (!courseLessons?.length) {
          setLoading(false);
          return;
        }

        // Remover duplicatas
        const uniqueCourseIds = [...new Set(courseLessons.map(cl => cl.course_id))];
        
        // Buscar detalhes dos cursos
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('id, title, description, image_url')
          .in('id', uniqueCourseIds);
        
        if (coursesError) throw coursesError;
        
        setCourses(coursesData || []);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userDetails]);

  // Renderizar esqueletos durante o carregamento
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">{t('myCourses')}</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="min-w-[250px]">
              <Skeleton className="h-[140px] w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Se não houver cursos, mostrar mensagem
  if (!courses.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">{t('myCourses')}</h2>
        <div className="bg-muted/50 rounded-md p-6 text-center">
          <p className="text-muted-foreground">
            {t('noCoursesAssigned')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">{t('myCourses')}</h2>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {courses.map((course) => (
            <CarouselItem 
              key={course.id} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <CourseCard
                title={course.title}
                imageUrl={course.image_url}
                onClick={() => console.log(`Clicked course: ${course.id}`)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
