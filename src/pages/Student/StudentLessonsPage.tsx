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
import { CheckCircle, AlertCircle, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactPlayer from 'react-player/lazy';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';

type StudentLesson = {
  id: string;
  lesson: {
    id: string;
    title: string;
    content: string;
    video_url: string | null;
    questions: string | null;
  };
  completed: boolean;
  score: number | null;
  feedback: string | null;
  assigned_at: string;
};

type Question = {
  id: string;
  text: string;
  type: 'multiple' | 'single';
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
};

export default function StudentLessonsPage() {
  const { t } = useLanguage();
  const { userDetails } = useAuth();
  const { toast } = useToast();
  
  const [lessons, setLessons] = useState<StudentLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<StudentLesson | null>(null);
  const [isLessonOpen, setIsLessonOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'content' | 'questions' | 'results'>('content');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
  const [score, setScore] = useState<number>(0);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const markLessonAsCompleted = async (studentLessonId: string, finalScore: number) => {
    try {
      const { error } = await supabase
        .from('student_lessons')
        .update({ completed: true, score: finalScore })
        .eq('id', studentLessonId);

      if (error) throw error;

      // Update local state
      setLessons(prev =>
        prev.map(item =>
          item.id === studentLessonId ? { ...item, completed: true, score: finalScore } : item
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
    setCurrentStep('content');
    
    // Parse questions if they exist
    if (lesson.lesson.questions) {
      try {
        const parsedQuestions = JSON.parse(lesson.lesson.questions);
        setQuestions(parsedQuestions);
      } catch (error) {
        console.error("Failed to parse questions:", error);
        setQuestions([]);
      }
    } else {
      setQuestions([]);
    }
    
    // Reset answers and score
    setSelectedAnswers({});
    setScore(0);
    setShowCorrectAnswers(false);
    setIsLessonOpen(true);
  };

  const handleSelectAnswer = (questionId: string, optionId: string, type: 'multiple' | 'single') => {
    if (type === 'single') {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }));
    } else {
      // For multiple choice, maintain an array of selected options
      const currentSelections = selectedAnswers[questionId] as string[] || [];
      let newSelections: string[];
      
      if (currentSelections.includes(optionId)) {
        // If already selected, remove it
        newSelections = currentSelections.filter(id => id !== optionId);
      } else {
        // Otherwise add it
        newSelections = [...currentSelections, optionId];
      }
      
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: newSelections
      }));
    }
  };

  const calculateScore = () => {
    if (questions.length === 0) return 10; // Full score if no questions
    
    let correctAnswers = 0;
    
    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      const correctOptions = question.options.filter(opt => opt.isCorrect).map(opt => opt.id);
      
      if (question.type === 'single') {
        // For single-choice questions
        if (userAnswer && correctOptions.includes(userAnswer as string)) {
          correctAnswers++;
        }
      } else {
        // For multiple-choice questions
        const userAnswerArray = userAnswer as string[] || [];
        const allCorrect = correctOptions.every(id => userAnswerArray.includes(id));
        const noIncorrect = userAnswerArray.every(id => correctOptions.includes(id));
        if (allCorrect && noIncorrect && userAnswerArray.length > 0) {
          correctAnswers++;
        }
      }
    });
    
    // Calculate score out of 10
    return Math.round((correctAnswers / questions.length) * 10);
  };

  const handleSubmitAnswers = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setCurrentStep('results');
    
    if (selectedLesson) {
      markLessonAsCompleted(selectedLesson.id, finalScore);
    }
  };

  const handleGoToQuestions = () => {
    setCurrentStep('questions');
  };

  const handleGoBackToContent = () => {
    setCurrentStep('content');
  };

  const isQuestionAnswered = (question: Question) => {
    const answer = selectedAnswers[question.id];
    if (question.type === 'single') {
      return !!answer;
    } else {
      return Array.isArray(answer) && answer.length > 0;
    }
  };

  const pendingLessons = lessons.filter(lesson => !lesson.completed);
  const completedLessons = lessons.filter(lesson => lesson.completed);

  const LessonModalComponent = isMobile ? Drawer : Sheet;
  const LessonModalContentComponent = isMobile ? DrawerContent : SheetContent;
  const LessonModalHeaderComponent = isMobile ? DrawerHeader : SheetHeader;
  const LessonModalTitleComponent = isMobile ? DrawerTitle : SheetTitle;

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

          {/* Full-screen Lesson View */}
          {isMobile ? (
            <Drawer open={isLessonOpen} onOpenChange={setIsLessonOpen}>
              <DrawerContent className="max-h-[90vh]">
                <DrawerHeader>
                  <DrawerTitle>{selectedLesson?.lesson.title}</DrawerTitle>
                  <DrawerDescription>
                    {currentStep === 'content' && "Conteúdo da aula"}
                    {currentStep === 'questions' && "Questões"}
                    {currentStep === 'results' && "Resultados"}
                  </DrawerDescription>
                </DrawerHeader>
                {renderLessonContent()}
              </DrawerContent>
            </Drawer>
          ) : (
            <Sheet open={isLessonOpen} onOpenChange={setIsLessonOpen}>
              <SheetContent className="w-full max-w-full sm:max-w-full">
                <SheetHeader>
                  <SheetTitle>{selectedLesson?.lesson.title}</SheetTitle>
                </SheetHeader>
                {renderLessonContent()}
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </MainLayout>
  );

  function renderLessonContent() {
    return (
      <ScrollArea className="h-[70vh] mt-6">
        <div className="space-y-6 py-4 px-1">
          {currentStep === 'content' && (
            <>
              {selectedLesson?.lesson.video_url && (
                <div className="aspect-video rounded-md overflow-hidden mb-6">
                  <ReactPlayer
                    url={selectedLesson.lesson.video_url}
                    width="100%"
                    height="100%"
                    controls
                    config={{
                      youtube: {
                        playerVars: { origin: window.location.origin }
                      }
                    }}
                  />
                </div>
              )}
              
              <div className="prose prose-sm max-w-none">
                {selectedLesson?.lesson.content.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              
              <div className="pt-8">
                {questions.length > 0 ? (
                  <Button 
                    className="w-full"
                    onClick={handleGoToQuestions}
                  >
                    Continuar para as Questões
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => {
                      const finalScore = 10; // Full score if no questions
                      if (selectedLesson) {
                        markLessonAsCompleted(selectedLesson.id, finalScore);
                      }
                      setScore(finalScore);
                      setCurrentStep('results');
                    }}
                  >
                    Finalizar Aula
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </>
          )}
          
          {currentStep === 'questions' && (
            <>
              <Button 
                variant="outline" 
                className="mb-6"
                onClick={handleGoBackToContent}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao conteúdo
              </Button>
              
              <div className="space-y-8">
                {questions.map((question, qIndex) => (
                  <div 
                    key={question.id} 
                    className="border rounded-lg p-6 bg-white"
                  >
                    <h3 className="text-lg font-medium mb-4">
                      {qIndex + 1}. {question.text}
                    </h3>
                    
                    {question.type === 'single' ? (
                      <RadioGroup
                        value={selectedAnswers[question.id] as string || ''}
                        onValueChange={(value) => 
                          handleSelectAnswer(question.id, value, 'single')
                        }
                        className="space-y-3"
                      >
                        {question.options.map(option => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <label 
                              htmlFor={option.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option.text}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="space-y-3">
                        {question.options.map(option => {
                          const isChecked = (selectedAnswers[question.id] as string[] || []).includes(option.id);
                          return (
                            <div key={option.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={option.id}
                                checked={isChecked}
                                onChange={() => 
                                  handleSelectAnswer(question.id, option.id, 'multiple')
                                }
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <label 
                                htmlFor={option.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {option.text}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="pt-8">
                <Button 
                  className="w-full"
                  onClick={handleSubmitAnswers}
                  disabled={!questions.every(isQuestionAnswered)}
                >
                  Submeter Respostas
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
                
                {!questions.every(isQuestionAnswered) && (
                  <p className="text-center text-amber-600 text-sm mt-2">
                    Por favor, responda todas as questões antes de continuar.
                  </p>
                )}
              </div>
            </>
          )}
          
          {currentStep === 'results' && (
            <div className="space-y-6">
              <div className="text-center bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-2">Resultado da Aula</h2>
                <div className="mb-4">
                  <div className="flex justify-center items-center text-amber-500 text-3xl">
                    <Star className="w-8 h-8 fill-current mr-2" />
                    <span className="font-bold">{score}/10</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowCorrectAnswers(!showCorrectAnswers)}
                  className="mb-4"
                >
                  {showCorrectAnswers ? 'Ocultar Respostas' : 'Ver Respostas Corretas'}
                </Button>
                
                {showCorrectAnswers && questions.length > 0 && (
                  <div className="mt-6 space-y-6 text-left">
                    <h3 className="font-medium text-lg">Respostas Corretas:</h3>
                    
                    {questions.map((question, qIndex) => {
                      const userAnswer = selectedAnswers[question.id];
                      const correctOptions = question.options.filter(opt => opt.isCorrect);
                      
                      let isCorrect = false;
                      if (question.type === 'single') {
                        isCorrect = correctOptions.some(opt => opt.id === userAnswer);
                      } else {
                        const userAnswerArray = userAnswer as string[] || [];
                        const correctIds = correctOptions.map(opt => opt.id);
                        isCorrect = 
                          correctIds.every(id => userAnswerArray.includes(id)) && 
                          userAnswerArray.every(id => correctIds.includes(id));
                      }
                      
                      return (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex items-start">
                            <div className={`rounded-full p-1 mr-2 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                              {isCorrect ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {qIndex + 1}. {question.text}
                              </h4>
                              <div className="mt-2">
                                <p className="text-sm font-medium">Resposta(s) correta(s):</p>
                                <ul className="list-disc ml-5 text-sm">
                                  {correctOptions.map(option => (
                                    <li key={option.id}>{option.text}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <Button 
                  className="mt-8"
                  onClick={() => setIsLessonOpen(false)}
                >
                  Voltar às Aulas
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  }
}
