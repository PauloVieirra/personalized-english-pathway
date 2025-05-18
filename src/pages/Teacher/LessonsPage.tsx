
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';
import CreateLessonForm from '@/components/teacher/CreateLessonForm';
import AssignLessonForm from '@/components/teacher/AssignLessonForm';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database } from '@/integrations/supabase/types';
import { PlusCircle, Edit, Trash, Users, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the Lesson type using the Database type from Supabase
type Lesson = Database['public']['Tables']['lessons']['Row'];

export default function LessonsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateSheet, setOpenCreateSheet] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const loadLessons = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLessons(data || []);
    } catch (error: any) {
      console.error('Error loading lessons:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, [user]);

  const handleCreateSuccess = () => {
    setOpenCreateSheet(false);
    loadLessons();
  };

  const handleAssignSuccess = () => {
    setOpenAssignDialog(false);
    toast({
      title: t('success'),
      description: 'Aula atribuída com sucesso!'
    });
  };

  const handleAssignLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setOpenAssignDialog(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) {
      return;
    }

    try {
      // First delete any student assignments for this lesson
      const { error: assignmentError } = await supabase
        .from('student_lessons')
        .delete()
        .eq('lesson_id', lessonId);

      if (assignmentError) throw assignmentError;

      // Then delete the lesson
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      // Update the local state
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));

      toast({
        title: t('success'),
        description: 'Aula excluída com sucesso.'
      });
    } catch (error: any) {
      console.error('Error deleting lesson:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout requireAuth allowedRoles={['teacher']}>
      <div className="flex min-h-screen">
        <TeacherSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{t('lessons')}</h1>
            <Button className="btn-primary" onClick={() => setOpenCreateSheet(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              {t('createLesson')}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('lessons')}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">{t('loading')}</div>
              ) : lessons.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Você ainda não criou nenhuma aula.</p>
                  <Button onClick={() => setOpenCreateSheet(true)}>
                    {t('createLesson')}
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('title')}</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessons.map(lesson => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">{lesson.title}</TableCell>
                        <TableCell>
                          {new Date(lesson.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => {
                                toast({
                                  title: "Funcionalidade em breve",
                                  description: "A edição de aulas estará disponível em breve."
                                });
                              }}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1 text-brand-blue"
                              onClick={() => handleAssignLesson(lesson.id)}
                            >
                              <Users className="h-3.5 w-3.5" />
                              <span className="sr-only">Atribuir</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1 text-red-500"
                              onClick={() => handleDeleteLesson(lesson.id)}
                            >
                              <Trash className="h-3.5 w-3.5" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Full screen sheet for creating lessons */}
          <Sheet open={openCreateSheet} onOpenChange={setOpenCreateSheet}>
            <SheetContent side="right" className="w-full sm:max-w-full p-0 border-none">
              <div className="flex flex-col h-screen">
                <SheetHeader className="bg-gray-100 p-6 flex flex-row items-center justify-between">
                  <SheetTitle className="text-2xl">{t('createLesson')}</SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </SheetHeader>
                
                <ScrollArea className="flex-1 p-6">
                  <div className="max-w-3xl mx-auto">
                    <CreateLessonForm onSuccess={handleCreateSuccess} />
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>

          <Dialog open={openAssignDialog} onOpenChange={setOpenAssignDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Atribuir Aula aos Alunos</DialogTitle>
              </DialogHeader>
              {selectedLessonId && (
                <AssignLessonForm 
                  lessonId={selectedLessonId} 
                  onSuccess={handleAssignSuccess} 
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  );
}
