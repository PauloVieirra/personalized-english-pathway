
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Database } from '@/integrations/supabase/types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';

type Course = Database['public']['Tables']['courses']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];

interface CourseLessonItem extends Lesson {
  isSelected: boolean;
  order: number;
}

interface ManageCourseLessonsFormProps {
  course: Course;
  onSuccess?: () => void;
}

export default function ManageCourseLessonsForm({ course, onSuccess }: ManageCourseLessonsFormProps) {
  const [availableLessons, setAvailableLessons] = useState<CourseLessonItem[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<CourseLessonItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, course.id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Buscar todas as aulas do professor
      const { data: teacherLessons, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('teacher_id', user?.id)
        .order('created_at', { ascending: false });

      if (lessonError) throw lessonError;

      // Buscar aulas já associadas ao curso
      const { data: courseLessons, error: courseLessonError } = await supabase
        .from('course_lessons')
        .select('*, lesson:lesson_id(*)')
        .eq('course_id', course.id)
        .order('order_index', { ascending: true });

      if (courseLessonError) throw courseLessonError;

      // Preparar lista de aulas já selecionadas
      const courseLessonIds = courseLessons ? courseLessons.map(cl => cl.lesson_id) : [];
      const orderedSelectedLessons = courseLessons ? courseLessons.map((cl, index) => ({
        ...(cl.lesson as Lesson),
        isSelected: true,
        order: cl.order_index
      })) : [];

      // Preparar lista de aulas disponíveis (não selecionadas)
      const availableLessonsList = teacherLessons 
        ? teacherLessons
          .filter(lesson => !courseLessonIds.includes(lesson.id))
          .map(lesson => ({ ...lesson, isSelected: false, order: 0 }))
        : [];
      
      setAvailableLessons(availableLessonsList);
      setSelectedLessons(orderedSelectedLessons);

    } catch (error: any) {
      console.error('Erro ao carregar dados:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLessonSelection = (lesson: CourseLessonItem) => {
    if (lesson.isSelected) {
      // Remover da lista de selecionados
      setSelectedLessons(prev => prev.filter(l => l.id !== lesson.id));
      
      // Adicionar de volta na lista de disponíveis
      setAvailableLessons(prev => [...prev, { ...lesson, isSelected: false }]);
    } else {
      // Adicionar na lista de selecionados
      const newOrder = selectedLessons.length > 0 
        ? Math.max(...selectedLessons.map(l => l.order)) + 1 
        : 0;
      
      setSelectedLessons(prev => [...prev, { ...lesson, isSelected: true, order: newOrder }]);
      
      // Remover da lista de disponíveis
      setAvailableLessons(prev => prev.filter(l => l.id !== lesson.id));
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(selectedLessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setSelectedLessons(updatedItems);
  };

  const moveLesson = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === selectedLessons.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newLessons = [...selectedLessons];
    const temp = newLessons[index];
    newLessons[index] = newLessons[newIndex];
    newLessons[newIndex] = temp;

    // Update order values
    const updatedItems = newLessons.map((item, i) => ({
      ...item,
      order: i
    }));
    
    setSelectedLessons(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: t('error'),
        description: 'Você precisa estar logado para gerenciar aulas do curso.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Primeiro, remover todas as associações atuais
      const { error: deleteError } = await supabase
        .from('course_lessons')
        .delete()
        .eq('course_id', course.id);

      if (deleteError) throw deleteError;

      // Depois, inserir as novas associações
      if (selectedLessons.length > 0) {
        const courseLessonsData = selectedLessons.map((lesson, index) => ({
          course_id: course.id,
          lesson_id: lesson.id,
          order_index: lesson.order
        }));

        const { error: insertError } = await supabase
          .from('course_lessons')
          .insert(courseLessonsData);

        if (insertError) throw insertError;
      }

      toast({
        title: t('success'),
        description: 'Aulas do curso atualizadas com sucesso!',
      });
      
      // Trigger success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Erro ao atualizar aulas do curso:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de aulas disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle>Aulas Disponíveis</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[50vh] overflow-y-auto">
            {availableLessons.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Todas as aulas já foram adicionadas ao curso
              </div>
            ) : (
              <ul className="space-y-2">
                {availableLessons.map((lesson) => (
                  <li key={lesson.id} className="border rounded-md p-3 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id={`lesson-${lesson.id}`}
                        checked={lesson.isSelected}
                        onCheckedChange={() => toggleLessonSelection(lesson)}
                      />
                      <label 
                        htmlFor={`lesson-${lesson.id}`}
                        className="flex-grow cursor-pointer"
                      >
                        {lesson.title}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Lista de aulas selecionadas */}
        <Card>
          <CardHeader>
            <CardTitle>Aulas do Curso</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[50vh] overflow-y-auto">
            {selectedLessons.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Nenhuma aula adicionada ao curso
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="selected-lessons">
                  {(provided) => (
                    <ul 
                      className="space-y-2" 
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                    >
                      {selectedLessons.map((lesson, index) => (
                        <Draggable 
                          key={lesson.id} 
                          draggableId={lesson.id} 
                          index={index}
                        >
                          {(provided) => (
                            <li 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border rounded-md p-3 bg-white"
                            >
                              <div className="flex items-center space-x-3">
                                <div 
                                  {...provided.dragHandleProps}
                                  className="cursor-move"
                                >
                                  <GripVertical size={18} />
                                </div>
                                <div className="flex-grow">{lesson.title}</div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => moveLesson(index, 'up')}
                                    disabled={index === 0}
                                  >
                                    <ChevronUp size={16} />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => moveLesson(index, 'down')}
                                    disabled={index === selectedLessons.length - 1}
                                  >
                                    <ChevronDown size={16} />
                                  </Button>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 h-8"
                                  onClick={() => toggleLessonSelection(lesson)}
                                >
                                  Remover
                                </Button>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          type="submit" 
          className="w-full md:w-auto" 
          disabled={isSaving}
          size="lg"
        >
          {isSaving ? t('loading') : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
