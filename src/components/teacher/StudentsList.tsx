
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

// Definição do tipo Student
type Student = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  status: 'active' | 'blocked';
  lesson_count: number;
};

export default function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { t } = useLanguage();
  const { toast } = useToast();

  const loadStudents = async () => {
    setLoading(true);
    try {
      // Obter todos os estudantes do user_profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('role', 'student');

      if (profileError) throw profileError;

      if (profileData) {
        // Para cada estudante, contar suas lições atribuídas
        const studentsWithCounts = await Promise.all(
          profileData.map(async (student) => {
            const { count, error: countError } = await supabase
              .from('student_lessons')
              .select('*', { count: 'exact', head: true })
              .eq('student_id', student.id);

            if (countError) {
              console.error('Erro ao contar lições:', countError);
              return { 
                ...student, 
                lesson_count: 0,
                status: 'active' as const // Default status if not present
              };
            }

            return { 
              ...student, 
              lesson_count: count || 0,
              status: 'active' as const // Default status if not present
            };
          })
        );
        
        setStudents(studentsWithCounts);
      }
    } catch (error: any) {
      console.error('Erro ao carregar estudantes:', error.message);
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
    loadStudents();
  }, []);

  const toggleStudentStatus = async (studentId: string, currentStatus: 'active' | 'blocked') => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    
    try {
      // Update the status in user_profile instead of users
      const { error } = await supabase
        .from('user_profile')
        .update({ status: newStatus })
        .eq('id', studentId);

      if (error) throw error;

      // Update the local state
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId ? { ...student, status: newStatus } : student
        )
      );

      toast({
        title: t('success'),
        description: `Aluno ${newStatus === 'active' ? 'ativado' : 'bloqueado'} com sucesso.`
      });
    } catch (error: any) {
      console.error('Erro ao alterar status do aluno:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const filteredStudents = students.filter(student =>
    (student.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (student.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar alunos..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('email')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('lessons')}</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  {t('loading')}
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Nenhum aluno encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map(student => (
                <TableRow key={student.id}>
                  <TableCell>{student.name || 'Sem nome'}</TableCell>
                  <TableCell>{student.email || 'Sem email'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={student.status === 'active' ? 'default' : 'destructive'}
                    >
                      {t(student.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.lesson_count}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={student.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => toggleStudentStatus(student.id, student.status)}
                    >
                      {student.status === 'active' ? t('block') : t('unblock')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
