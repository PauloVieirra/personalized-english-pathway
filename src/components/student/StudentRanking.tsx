
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Award, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

type RankingUser = {
  id: string;
  name: string;
  points: number;
  rank: number;
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
        
        // Get completed lessons from the last 7 days grouped by student
        const { data, error } = await supabase
          .from('student_lessons')
          .select(`
            student_id,
            user_profile:student_id(name)
          `)
          .eq('completed', true)
          .gte('assigned_at', sevenDaysAgo.toISOString())
          .order('assigned_at', { ascending: false });

        if (error) throw error;
        
        // Count points per student (1 point per completed lesson)
        const pointsByStudent: Record<string, { id: string; name: string; points: number }> = {};
        
        data?.forEach((item) => {
          const studentId = item.student_id;
          const studentName = (item.user_profile as any)?.name || 'Unknown Student';
          
          if (!pointsByStudent[studentId]) {
            pointsByStudent[studentId] = {
              id: studentId,
              name: studentName,
              points: 0
            };
          }
          
          pointsByStudent[studentId].points += 1;
        });
        
        // Convert to array and sort by points
        const rankingArray = Object.values(pointsByStudent)
          .sort((a, b) => b.points - a.points)
          .slice(0, limit)
          .map((student, index) => ({
            ...student,
            rank: index + 1
          }));
        
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
              <div className="flex items-center space-x-1">
                <span className="font-bold">{user.points}</span>
                <span className="text-xs text-gray-500">pts</span>
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
