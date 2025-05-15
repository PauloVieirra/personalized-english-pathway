
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Tables } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

type Student = Tables['users'] & {
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
      // Get all students and count their assigned lessons
      const { data, error } = await supabase
        .from('users')
        .select('*, student_lessons(count)')
        .eq('role', 'student');

      if (error) throw error;

      if (data) {
        // Transform the data to include lesson count
        const studentsWithCount = data.map(student => ({
          ...student,
          lesson_count: student.student_lessons?.[0]?.count || 0
        }));
        
        setStudents(studentsWithCount);
      }
    } catch (error: any) {
      console.error('Error loading students:', error.message);
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
      const { error } = await supabase
        .from('users')
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
      console.error('Error toggling student status:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
              <TableHead className="text-right">{t('actions')}</TableHead>
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
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
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
