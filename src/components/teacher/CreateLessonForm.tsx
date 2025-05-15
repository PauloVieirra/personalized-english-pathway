
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export default function CreateLessonForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: t('error'),
        description: 'Você precisa estar logado para criar uma aula.',
        variant: 'destructive',
      });
      return;
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t('title')}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-input"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">{t('content')}</Label>
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
      
      <Button 
        type="submit" 
        className="btn-primary" 
        disabled={isLoading}
      >
        {isLoading ? t('loading') : t('save')}
      </Button>
    </form>
  );
}
