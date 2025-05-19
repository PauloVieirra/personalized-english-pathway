
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Award, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

type RankingUser = {
  id: string;
  name: string;
  averageScore: number;
  rank: number;
  completedLessons: number;
  lastCompletionDate: string | null;
};

interface StudentRankingProps {
  limit: number;
  currentUserId?: string;
}

export default function StudentRanking({ limit = 10, currentUserId }: StudentRankingProps) {
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        // Calculate the date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        console.log('Fetching student lessons since:', sevenDaysAgo.toISOString());
        
        // First, get completed student lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('student_lessons')
          .select(`
            student_id,
            score,
            assigned_at,
            completed
          `)
          .eq('completed', true)
          .gte('assigned_at', sevenDaysAgo.toISOString())
          .order('assigned_at', { ascending: false });

        if (lessonsError) throw lessonsError;
        
        console.log('Fetched student_lessons data:', lessonsData);
        
        if (!lessonsData || lessonsData.length === 0) {
          console.log('No completed lessons found in the last 7 days');
          setUsers([]);
          setLoading(false);
          return;
        }
        
        // Get unique student IDs from the lessons data
        const studentIds = [...new Set(lessonsData.map(lesson => lesson.student_id))];
        console.log('Unique student IDs:', studentIds);
        
        // Then fetch profile data for these students
        const { data: profilesData, error: profilesError } = await supabase
          .from('user_profile')
          .select('id, name')
          .in('id', studentIds);
          
        if (profilesError) throw profilesError;
        
        console.log('Fetched user profiles:', profilesData);
        
        // Map profiles to a dictionary for easy lookup
        const profilesMap = new Map();
        profilesData?.forEach(profile => {
          profilesMap.set(profile.id, profile.name);
        });
        
        // Group lessons by student and calculate average score
        const studentData: Record<string, {
          id: string;
          name: string;
          scores: number[];
          completedLessons: number;
          lastCompletionDate: string | null;
        }> = {};
        
        lessonsData?.forEach((item) => {
          const studentId = item.student_id;
          const studentName = profilesMap.get(studentId) || 'Unknown Student';
          const score = item.score || 0; // Default to 0 if no score
          
          if (!studentData[studentId]) {
            studentData[studentId] = {
              id: studentId,
              name: studentName,
              scores: [],
              completedLessons: 0,
              lastCompletionDate: null
            };
          }
          
          // Add score to the array
          if (item.score !== null) {
            studentData[studentId].scores.push(score);
          }
          
          // Increment completed lessons count
          studentData[studentId].completedLessons += 1;
          
          // Track the most recent completion date
          if (!studentData[studentId].lastCompletionDate || 
              new Date(item.assigned_at) > new Date(studentData[studentId].lastCompletionDate)) {
            studentData[studentId].lastCompletionDate = item.assigned_at;
          }
        });
        
        console.log('Processed student data:', studentData);
        
        // Calculate average score for each student and convert to array
        const rankingArray = Object.values(studentData)
          .map(student => {
            // Calculate average score
            const averageScore = student.scores.length > 0
              ? student.scores.reduce((sum, score) => sum + score, 0) / student.scores.length
              : 0;
              
            return {
              id: student.id,
              name: student.name,
              averageScore: Number(averageScore.toFixed(1)),
              completedLessons: student.completedLessons,
              lastCompletionDate: student.lastCompletionDate,
              rank: 0 // Will be assigned after sorting
            };
          })
          // Sort by average score (desc), then by lastCompletionDate (asc)
          .sort((a, b) => {
            // First by average score (higher first)
            if (b.averageScore !== a.averageScore) {
              return b.averageScore - a.averageScore;
            }
            // Then by completion date (earlier first)
            if (a.lastCompletionDate && b.lastCompletionDate) {
              return new Date(a.lastCompletionDate).getTime() - new Date(b.lastCompletionDate).getTime();
            }
            return 0;
          })
          // Slice to get the requested number of entries
          .slice(0, limit)
          // Assign ranks
          .map((student, index) => ({
            ...student,
            rank: index + 1
          }));
        
        console.log('Final ranking array:', rankingArray);
        setUsers(rankingArray);
      } catch (error) {
        console.error('Error loading ranking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [limit]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Award className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-700" />;
      default:
        return <span className="text-xs font-medium w-4 h-4 flex items-center justify-center">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.length > 0 ? (
        <ul className="space-y-2">
          {users.map((user) => (
            <li 
              key={user.id} 
              className={cn(
                "flex items-center justify-between p-2 rounded-md transition-colors",
                user.rank <= 3 ? "bg-gray-50" : "",
                user.id === currentUserId ? "border border-brand-blue/50 bg-brand-blue/5" : ""
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6">
                  {getRankIcon(user.rank)}
                </div>
                <span className="font-medium truncate max-w-[150px]">
                  {user.name} {user.id === currentUserId && "(Você)"}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1">
                  <span className="font-bold">{user.averageScore}</span>
                  <span className="text-xs text-gray-500">média</span>
                </div>
                <span className="text-xs text-gray-500">{user.completedLessons} aulas</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Sem atividades completadas nos últimos 7 dias</p>
        </div>
      )}
    </div>
  );
}
