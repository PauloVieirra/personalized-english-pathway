
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash } from 'lucide-react';
import QuestionForm, { Question } from './QuestionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateLessonForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState<'content' | 'questions'>('content');
  
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const addQuestion = () => {
    console.log('Adding new question');
    const newQuestion: Question = {
      id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: '',
      weight: 1,
      type: 'single',
      options: []
    };
    
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(
      questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    );
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate required fields for content step
    if (currentStep === 'content') {
      if (!title.trim() || !content.trim()) {
        toast({
          title: t('error'),
          description: t('pleaseFillAllRequiredFields'),
          variant: 'destructive',
        });
        return;
      }
      
      setCurrentStep('questions');
      return;
    }
    
    // Otherwise, we're submitting the full form with questions
    if (!user) {
      toast({
        title: t('error'),
        description: 'Você precisa estar logado para criar uma aula.',
        variant: 'destructive',
      });
      return;
    }

    // Validate questions if there are any
    if (questions.length > 0) {
      // Check for empty questions
      const hasEmptyQuestion = questions.some(q => !q.text.trim());
      if (hasEmptyQuestion) {
        toast({
          title: t('error'),
          description: t('allQuestionsNeedText'),
          variant: 'destructive',
        });
        return;
      }
      
      // Check for questions without options
      const hasQuestionWithoutOptions = questions.some(q => q.options.length === 0);
      if (hasQuestionWithoutOptions) {
        toast({
          title: t('error'),
          description: t('allQuestionsNeedOptions'),
          variant: 'destructive',
        });
        return;
      }
      
      // Check for questions without correct answers
      const hasQuestionWithoutCorrect = questions.some(q => 
        !q.options.some(opt => opt.isCorrect)
      );
      if (hasQuestionWithoutCorrect) {
        toast({
          title: t('error'),
          description: t('allQuestionsNeedCorrectAnswer'),
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert([
          {
            title,
            content,
            video_url: videoUrl || null,
            teacher_id: user.id,
            questions: questions.length > 0 ? questions : null
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: t('success'),
        description: 'Aula criada com sucesso!',
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setVideoUrl('');
      setQuestions([]);
      setCurrentStep('content');
      
      // Trigger success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating lesson:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {currentStep === 'content' ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo da Aula</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('title')} <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">{t('content')} <span className="text-red-500">*</span></Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="form-input min-h-[200px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoUrl">{t('videoUrl')}</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="form-input"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="w-full md:w-auto" 
              disabled={isLoading}
              size="lg"
            >
              {t('continue')}
            </Button>
          </div>
        </>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{t('addQuestions')}</span>
                <Button 
                  type="button" 
                  onClick={() => setCurrentStep('content')}
                  variant="outline"
                >
                  {t('backToContent')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length > 0 ? (
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="border border-gray-200">
                      <CardContent className="pt-6">
                        <QuestionForm
                          questionNumber={index + 1}
                          question={question}
                          onUpdate={updateQuestion}
                          onRemove={() => removeQuestion(question.id)}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">{t('noQuestionsYet')}</p>
                  <Button 
                    type="button" 
                    onClick={addQuestion}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('addQuestion')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button"
              onClick={addQuestion}
              variant="outline"
              className="flex-1 justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('addQuestion')}
            </Button>
            
            <Button 
              type="submit"
              className="flex-1"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? t('loading') : t('save')}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
