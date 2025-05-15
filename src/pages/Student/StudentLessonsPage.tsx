
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tables } from '@/lib/supabase';
import { CheckCircle, AlertCircle, Star } from 'lucide-react';

type StudentLesson = {
  id: string;
  lesson: {
    id: string;
    title: string;
    content: string;
    video_url: string | null;
  };
  completed: boolean;
  score: number | null;
  feedback: string | null;
  assigned_at: string;
};

export default function StudentLessonsPage() {
  const { t } = useLanguage();
  const { userDetails } = useAuth();
  const { toast } = useToast();
  
  const [lessons, setLessons] = useState<StudentLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<StudentLesson | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const loadLessons = async () => {
    if (!userDetails?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_lessons')
        .select('*, lesson:lessons(*)')
        .eq('student_id', userDetails.id)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      
      setLessons(data as unknown as StudentLesson[] || []);
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
  }, [userDetails]);

  const markLessonAsCompleted = async (studentLessonId: string) => {
    try {
      const { error } = await supabase
        .from('student_lessons')
        .update({ completed: true })
        .eq('id', studentLessonId);

      if (error) throw error;

      // Update local state
      setLessons(prev =>
        prev.map(item =>
          item.id === studentLessonId ? { ...item, completed: true } : item
        )
      );

      toast({
        title: t('success'),
        description: 'Aula marcada como concluída.'
      });
    } catch (error: any) {
      console.error('Error marking lesson as completed:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openLessonDetail = (lesson: StudentLesson) => {
    setSelectedLesson(lesson);
    setIsDetailDialogOpen(true);
  };

  const pendingLessons = lessons.filter(lesson => !lesson.completed);
  const completedLessons = lessons.filter(lesson => lesson.completed);

  return (
    <MainLayout requireAuth allowedRoles={['student']}>
      <div className="flex min-h-screen">
        <StudentSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">{t('myLessons')}</h1>
          
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">
                {t('pending')} ({pendingLessons.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                {t('completed')} ({completedLessons.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>{t('pending')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">{t('loading')}</div>
                  ) : pendingLessons.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Você não tem aulas pendentes.
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {pendingLessons.map(item => (
                        <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{item.lesson.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.assigned_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => openLessonDetail(item)}
                            >
                              Ver Aula
                            </Button>
                            <Button 
                              onClick={() => markLessonAsCompleted(item.id)}
                              className="btn-primary"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marcar Concluída
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>{t('completed')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">{t('loading')}</div>
                  ) : completedLessons.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Você ainda não concluiu nenhuma aula.
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {completedLessons.map(item => (
                        <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{item.lesson.title}</h3>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {t('completed')}
                              </Badge>
                              
                              {item.score !== null && (
                                <div className="ml-2 flex items-center text-amber-500">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span className="ml-1 text-xs font-medium">{item.score}/10</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => openLessonDetail(item)}
                          >
                            Ver Aula
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Lesson Detail Dialog */}
          <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{selectedLesson?.lesson.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {selectedLesson?.lesson.video_url && (
                  <div className="aspect-video rounded-md overflow-hidden">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={selectedLesson.lesson.video_url} 
                      title={selectedLesson.lesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none">
                  {selectedLesson?.lesson.content.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
                
                {selectedLesson?.completed && (
                  <div className="bg-gray-50 rounded-md p-4">
                    <h3 className="font-medium mb-2">{t('feedback')}</h3>
                    {selectedLesson.score !== null && (
                      <div className="flex items-center mb-2">
                        <span className="font-medium mr-2">{t('score')}:</span>
                        <div className="flex items-center text-amber-500">
                          <span className="text-base font-medium">{selectedLesson.score}/10</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedLesson.feedback ? (
                      <p>{selectedLesson.feedback}</p>
                    ) : (
                      <p className="text-muted-foreground">Nenhum feedback disponível ainda.</p>
                    )}
                  </div>
                )}
                
                {!selectedLesson?.completed && (
                  <Button 
                    className="w-full"
                    onClick={() => {
                      if (selectedLesson) {
                        markLessonAsCompleted(selectedLesson.id);
                        setIsDetailDialogOpen(false);
                      }
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Concluída
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  );
}
