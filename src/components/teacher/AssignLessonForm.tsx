
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Student = {
  id: string;
  name: string | null;
  email: string | null;
  status: 'active' | 'blocked';
};

export default function AssignLessonForm({
  lessonId,
  onSuccess,
}: {
  lessonId: string;
  onSuccess: () => void;
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assignedStudentIds, setAssignedStudentIds] = useState<string[]>([]);

  const { t } = useLanguage();
  const { toast } = useToast();

  // Load all active students
  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profile')
          .select('*')
          .eq('role', 'student')
          .eq('status', 'active');

        if (error) throw error;

        if (data) {
          setStudents(data.map(student => ({
            id: student.id,
            name: student.name,
            email: student.email,
            status: (student.status as 'active' | 'blocked') || 'active'
          })));
        }

        // Fetch already assigned students for this lesson
        const { data: assignedData, error: assignedError } = await supabase
          .from('student_lessons')
          .select('student_id')
          .eq('lesson_id', lessonId);

        if (assignedError) throw assignedError;

        if (assignedData) {
          const assignedIds = assignedData.map(item => item.student_id);
          setAssignedStudentIds(assignedIds);
          setSelectedStudents(assignedIds);
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

    loadStudents();
  }, [lessonId, t, toast]);

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Find students to add (selected but not already assigned)
      const studentsToAdd = selectedStudents.filter(
        id => !assignedStudentIds.includes(id)
      );

      // Find students to remove (assigned but not selected)
      const studentsToRemove = assignedStudentIds.filter(
        id => !selectedStudents.includes(id)
      );

      // Add new assignments
      if (studentsToAdd.length > 0) {
        const assignments = studentsToAdd.map(studentId => ({
          student_id: studentId,
          lesson_id: lessonId,
        }));

        const { error: addError } = await supabase
          .from('student_lessons')
          .insert(assignments);

        if (addError) throw addError;
      }

      // Remove old assignments
      if (studentsToRemove.length > 0) {
        for (const studentId of studentsToRemove) {
          const { error: removeError } = await supabase
            .from('student_lessons')
            .delete()
            .eq('student_id', studentId)
            .eq('lesson_id', lessonId);

          if (removeError) throw removeError;
        }
      }

      toast({
        title: t('success'),
        description: t('lessonsAssignedSuccessfully'),
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error assigning lessons:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {t('selectStudentsToAssignLesson')}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-4">{t('loading')}</div>
      ) : students.length === 0 ? (
        <div className="text-center py-4">{t('noStudentsFound')}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('email')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleToggleStudent(student.id)}
                  />
                </TableCell>
                <TableCell>{student.name || t('unnamed')}</TableCell>
                <TableCell>{student.email || t('noEmail')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <Button 
          type="submit" 
          disabled={submitting || loading}
        >
          {submitting ? t('saving') : t('saveAssignments')}
        </Button>
      </div>
    </form>
  );
}
