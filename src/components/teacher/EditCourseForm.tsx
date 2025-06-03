
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { uploadImageToSupabase } from '@/lib/uploadHelpers';

interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_free: boolean | null;
  price: number | null;
}

interface EditCourseFormProps {
  course: Course;
  onCourseUpdated: () => void;
}

export default function EditCourseForm({ course, onCourseUpdated }: EditCourseFormProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || '');
  const [isFree, setIsFree] = useState(course.is_free ?? true);
  const [price, setPrice] = useState(course.price ? course.price.toString() : '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (!isFree && (!price || parseFloat(price) <= 0)) {
      toast({
        title: "Erro",
        description: "Para cursos pagos, o preço deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = course.image_url;

      // Upload da nova imagem se foi selecionada
      if (imageFile) {
        imageUrl = await uploadImageToSupabase(imageFile, 'courses');
      }

      const updateData = {
        title: title.trim(),
        description: description.trim() || null,
        image_url: imageUrl,
        is_free: isFree,
        price: isFree ? null : parseFloat(price),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('id', course.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Curso atualizado com sucesso!"
      });

      onCourseUpdated();
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar o curso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Curso *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título do curso"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digite a descrição do curso"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Imagem do Curso</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        {course.image_url && !imageFile && (
          <div className="mt-2">
            <img
              src={course.image_url}
              alt="Imagem atual do curso"
              className="w-32 h-20 object-cover rounded"
            />
            <p className="text-sm text-muted-foreground mt-1">Imagem atual</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_free"
            checked={isFree}
            onCheckedChange={setIsFree}
          />
          <Label htmlFor="is_free">Curso gratuito</Label>
        </div>

        {!isFree && (
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0,00"
              required={!isFree}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar Curso'}
        </Button>
      </div>
    </form>
  );
}
