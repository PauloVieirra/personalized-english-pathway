
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch all available courses instead of only those assigned to the student
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, description, image_url');
          
        if (error) throw error;
        
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Render skeletons during loading
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

  // If no courses, show message
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
