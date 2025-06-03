import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import MainLayout from '@/components/layout/MainLayout';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateCourseForm from '@/components/teacher/CreateCourseForm';
import EditCourseForm from '@/components/teacher/EditCourseForm';
import ManageCourseLessonsForm from '@/components/teacher/ManageCourseLessonsForm';
import { Plus, Edit, Layers, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  teacher_id: string;
  is_free: boolean | null;
  price: number | null;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [managingCourse, setManagingCourse] = useState<Course | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [manageLessonsOpen, setManageLessonsOpen] = useState(false);
  const { t } = useLanguage();
  const { userDetails } = useAuth();

  const fetchCourses = async () => {
    if (!userDetails?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', userDetails.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setCourses(data || []);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [userDetails]);

  const handleCourseCreated = () => {
    setCreateDialogOpen(false);
    fetchCourses();
  };

  const handleCourseUpdated = () => {
    setEditDialogOpen(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setEditDialogOpen(true);
  };

  const handleManageLessons = (course: Course) => {
    setManagingCourse(course);
    setManageLessonsOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
        
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Curso excluído com sucesso!'
      });
      
      fetchCourses();
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir o curso',
        variant: 'destructive'
      });
    }
  };

  const formatPrice = (course: Course) => {
    if (course.is_free) {
      return 'Grátis';
    }
    
    if (course.price !== null) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(course.price);
    }
    
    return '-';
  };

  return (
    <MainLayout requireAuth allowedRoles={['teacher']}>
      <div className="flex min-h-screen">
        <TeacherSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Meus Cursos</h1>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Curso
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Curso</DialogTitle>
                </DialogHeader>
                <CreateCourseForm onCourseCreated={handleCourseCreated} />
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="space-y-6">
              {Array(5).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Nenhum curso encontrado</CardTitle>
                <CardDescription>
                  Você ainda não criou nenhum curso. Clique em "Novo Curso" para começar.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lista de Cursos</CardTitle>
                <CardDescription>
                  Gerencie seus cursos aqui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <span>{course.title}</span>
                            {course.is_free && (
                              <span className="text-green-600 font-medium text-sm">Grátis</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {course.description || 'Sem descrição'}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            {!course.is_free && course.price && (
                              <span className="font-medium">{formatPrice(course)}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(course.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCourse(course)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleManageLessons(course)}
                            >
                              <Layers className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Edit Course Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Curso</DialogTitle>
              </DialogHeader>
              {editingCourse && (
                <EditCourseForm 
                  course={editingCourse} 
                  onCourseUpdated={handleCourseUpdated} 
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Manage Course Lessons Dialog */}
          <Dialog open={manageLessonsOpen} onOpenChange={setManageLessonsOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  Gerenciar Aulas: {managingCourse?.title}
                </DialogTitle>
              </DialogHeader>
              {managingCourse && (
                <ManageCourseLessonsForm 
                  course={managingCourse} 
                  onClose={() => setManageLessonsOpen(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  );
}
