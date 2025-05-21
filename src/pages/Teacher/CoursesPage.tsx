
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash, FileText, Image as ImageIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import CreateCourseForm from '@/components/teacher/CreateCourseForm';
import EditCourseForm from '@/components/teacher/EditCourseForm';
import ManageCourseLessonsForm from '@/components/teacher/ManageCourseLessonsForm';
import { X } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { Avatar } from '@/components/ui/avatar';

// Define o tipo Course usando o tipo do Supabase
type Course = Database['public']['Tables']['courses']['Row'];

export default function CoursesPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateSheet, setOpenCreateSheet] = useState(false);
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [openManageLessonsSheet, setOpenManageLessonsSheet] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  const loadCourses = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar cursos:', error.message);
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
    loadCourses();
  }, [user]);

  const handleCreateSuccess = () => {
    setOpenCreateSheet(false);
    loadCourses();
    toast({
      title: t('success'),
      description: 'Curso criado com sucesso!',
    });
  };

  const handleEditSuccess = () => {
    setOpenEditSheet(false);
    setCurrentCourse(null);
    loadCourses();
    toast({
      title: t('success'),
      description: 'Curso atualizado com sucesso!',
    });
  };

  const handleManageLessonsSuccess = () => {
    setOpenManageLessonsSheet(false);
    loadCourses();
    toast({
      title: t('success'),
      description: 'Aulas do curso atualizadas com sucesso!',
    });
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setOpenEditSheet(true);
  };

  const handleManageLessons = (course: Course) => {
    setCurrentCourse(course);
    setOpenManageLessonsSheet(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      setCourses(prev => prev.filter(course => course.id !== courseId));

      toast({
        title: t('success'),
        description: 'Curso excluído com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao excluir curso:', error.message);
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
            <h1 className="text-3xl font-bold">Cursos</h1>
            <Button className="btn-primary" onClick={() => setOpenCreateSheet(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar Curso
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Meus Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">{t('loading')}</div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Você ainda não criou nenhum curso.</p>
                  <Button onClick={() => setOpenCreateSheet(true)}>
                    Criar Curso
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagem</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map(course => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="h-12 w-16 relative overflow-hidden rounded-md">
                            {course.image_url ? (
                              <img 
                                src={course.image_url} 
                                alt={course.title} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>
                          {new Date(course.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleEditCourse(course)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1 text-brand-blue"
                              onClick={() => handleManageLessons(course)}
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span className="sr-only">Gerenciar Aulas</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1 text-red-500"
                              onClick={() => handleDeleteCourse(course.id)}
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

          {/* Sheet para criar cursos */}
          <Sheet open={openCreateSheet} onOpenChange={setOpenCreateSheet}>
            <SheetContent side="right" className="w-full sm:max-w-full p-0 border-none">
              <div className="flex flex-col h-screen">
                <SheetHeader className="bg-gray-100 p-6 flex flex-row items-center justify-between">
                  <SheetTitle className="text-2xl">Criar Curso</SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </SheetHeader>
                
                <ScrollArea className="flex-1 p-6">
                  <div className="max-w-3xl mx-auto">
                    <CreateCourseForm onSuccess={handleCreateSuccess} />
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sheet para editar cursos */}
          <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
            <SheetContent side="right" className="w-full sm:max-w-full p-0 border-none">
              <div className="flex flex-col h-screen">
                <SheetHeader className="bg-gray-100 p-6 flex flex-row items-center justify-between">
                  <SheetTitle className="text-2xl">Editar Curso</SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </SheetHeader>
                
                <ScrollArea className="flex-1 p-6">
                  <div className="max-w-3xl mx-auto">
                    {currentCourse && (
                      <EditCourseForm 
                        course={currentCourse} 
                        onSuccess={handleEditSuccess} 
                      />
                    )}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sheet para gerenciar aulas do curso */}
          <Sheet open={openManageLessonsSheet} onOpenChange={setOpenManageLessonsSheet}>
            <SheetContent side="right" className="w-full sm:max-w-full p-0 border-none">
              <div className="flex flex-col h-screen">
                <SheetHeader className="bg-gray-100 p-6 flex flex-row items-center justify-between">
                  <SheetTitle className="text-2xl">Gerenciar Aulas do Curso</SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </SheetHeader>
                
                <ScrollArea className="flex-1 p-6">
                  <div className="max-w-3xl mx-auto">
                    {currentCourse && (
                      <ManageCourseLessonsForm
                        course={currentCourse}
                        onSuccess={handleManageLessonsSuccess}
                      />
                    )}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </MainLayout>
  );
}
