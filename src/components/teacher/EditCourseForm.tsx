
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Database } from '@/integrations/supabase/types';

type Course = Database['public']['Tables']['courses']['Row'];

interface EditCourseFormProps {
  course: Course;
  onSuccess?: () => void;
}

export default function EditCourseForm({ course, onSuccess }: EditCourseFormProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: t('error'),
        description: 'Por favor, preencha o título do curso.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!user) {
      toast({
        title: t('error'),
        description: 'Você precisa estar logado para atualizar um curso.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({
          title,
          description: description || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', course.id)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: t('success'),
        description: 'Curso atualizado com sucesso!',
      });
      
      // Trigger success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Erro ao atualizar curso:', error.message);
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
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Curso <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input min-h-[100px]"
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
          {isLoading ? t('loading') : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
