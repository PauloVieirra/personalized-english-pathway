
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

interface CreateCourseFormProps {
  onSuccess?: () => void;
}

export default function CreateCourseForm({ onSuccess }: CreateCourseFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { t } = useLanguage();
  const { user, userDetails } = useAuth();
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
        description: 'Você precisa estar logado para criar um curso.',
        variant: 'destructive',
      });
      return;
    }

    if (!userDetails || userDetails.role !== 'teacher') {
      toast({
        title: t('error'),
        description: 'Apenas professores podem criar cursos.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Creating course with teacher_id:', user.id);
      console.log('User details:', userDetails);
      
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title,
          description: description || null,
          teacher_id: user.id,
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: t('success'),
        description: 'Curso criado com sucesso!',
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      
      // Trigger success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Erro ao criar curso:', error.message);
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
          {isLoading ? t('loading') : 'Criar Curso'}
        </Button>
      </div>
    </form>
  );
}
