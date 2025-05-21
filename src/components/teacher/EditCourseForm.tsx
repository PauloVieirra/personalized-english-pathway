
import React, { useState, useEffect } from 'react';
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
import { Upload, ImageIcon, Loader2 } from 'lucide-react';

type Course = Database['public']['Tables']['courses']['Row'];

interface EditCourseFormProps {
  course: Course;
  onSuccess?: () => void;
}

export default function EditCourseForm({ course, onSuccess }: EditCourseFormProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(course.image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  
  const { t } = useLanguage();
  const { user, userDetails } = useAuth();
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: t('error'),
          description: 'Por favor, selecione apenas arquivos de imagem.',
          variant: 'destructive',
        });
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('error'),
          description: 'O arquivo é muito grande. O tamanho máximo permitido é 5MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setImageFile(file);
      setImageChanged(true);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;
    
    setIsUploading(true);
    try {
      // Criar um nome de arquivo único usando timestamp e id do usuário
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${user.id}.${fileExt}`;
      const filePath = `courses/${fileName}`;
      
      // Upload da imagem para o bucket do Supabase
      const { error: uploadError } = await supabase
        .storage
        .from('imagescurse')
        .upload(filePath, imageFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Obter a URL pública da imagem
      const { data: urlData } = supabase
        .storage
        .from('imagescurse')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Erro ao fazer upload da imagem:', error.message);
      toast({
        title: t('error'),
        description: `Erro ao fazer upload da imagem: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

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

    if (!userDetails || userDetails.role !== 'teacher') {
      toast({
        title: t('error'),
        description: 'Apenas professores podem editar cursos.',
        variant: 'destructive',
      });
      return;
    }

    // Check if the logged-in teacher is the owner of this course
    if (course.teacher_id !== user.id) {
      toast({
        title: t('error'),
        description: 'Você não tem permissão para editar este curso.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Processar upload da imagem se uma nova foi selecionada
      let imageUrl = course.image_url;
      
      if (imageChanged) {
        // Se a imagem foi removida, definir como null
        if (!imageFile) {
          imageUrl = null;
        } 
        // Se uma nova imagem foi selecionada, fazer upload
        else {
          imageUrl = await uploadImage();
        }
      }
      
      const { data, error } = await supabase
        .from('courses')
        .update({
          title,
          description: description || null,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', course.id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageChanged(true);
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
          
          <div className="space-y-2">
            <Label htmlFor="image">Imagem do Curso</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              {imagePreview ? (
                <div className="space-y-2">
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <img 
                      src={imagePreview} 
                      alt="Preview da imagem" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <Button 
                    type="button"
                    variant="destructive" 
                    size="sm"
                    onClick={removeImage}
                    className="mt-2"
                  >
                    Remover imagem
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Clique para selecionar uma imagem</span>
                  <span className="text-xs text-gray-400 mt-1">(PNG, JPG, GIF até 5MB)</span>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="w-full md:w-auto" 
          disabled={isLoading || isUploading}
          size="lg"
        >
          {isLoading || isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isUploading ? 'Enviando imagem...' : t('loading')}
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </div>
    </form>
  );
}
