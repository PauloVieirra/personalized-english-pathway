
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StudentSidebar from '@/components/student/StudentSidebar';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, TrendingUp, Award, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

type RankingUser = {
  id: string;
  name: string;
  averageScore: number;
  rank: number;
  completedLessons: number;
  lastCompletionDate: string | null;
};

type StudyTip = {
  id: number;
  title: string;
  content: string;
  icon: React.ReactNode;
};

export default function RankingPage() {
  const { t } = useLanguage();
  const { userDetails } = useAuth();
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  const studyTips: StudyTip[] = [
    {
      id: 1,
      title: 'Técnica Pomodoro',
      content: 'Estude por 25 minutos e descanse por 5. A cada 4 ciclos, faça uma pausa mais longa de 15-30 minutos.',
      icon: <div className="rounded-full bg-orange-100 p-2"><TrendingUp className="h-6 w-6 text-orange-500" /></div>
    },
    {
      id: 2,
      title: 'Revisão Espaçada',
      content: 'Revise o conteúdo em intervalos crescentes: 1 dia depois, 3 dias depois, 1 semana depois, 2 semanas depois.',
      icon: <div className="rounded-full bg-blue-100 p-2"><Star className="h-6 w-6 text-blue-500" /></div>
    },
    {
      id: 3,
      title: 'Active Recall',
      content: 'Tente lembrar ativamente do conteúdo antes de revisar suas anotações. Isso reforça a memória muito mais que apenas reler.',
      icon: <div className="rounded-full bg-green-100 p-2"><Award className="h-6 w-6 text-green-500" /></div>
    }
  ];

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

        if (lessonsError) {
          console.error('Error fetching student lessons:', lessonsError);
          throw lessonsError;
        }
        
        console.log('Fetched student_lessons data for ranking page:', lessonsData);
        
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
          
        if (profilesError) {
          console.error('Error fetching user profiles:', profilesError);
          throw profilesError;
        }
        
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
        
        console.log('Processed student data for ranking page:', studentData);
        
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
          // Slice to get the top 100
          .slice(0, 100)
          // Assign ranks
          .map((student, index) => ({
            ...student,
            rank: index + 1
          }));
        
        console.log('Final ranking array for ranking page:', rankingArray);
        setUsers(rankingArray);
      } catch (error) {
        console.error('Error loading ranking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Award className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="font-medium w-5 h-5 flex items-center justify-center">{rank}</span>;
    }
  };

  return (
    <MainLayout requireAuth allowedRoles={['student']}>
      <div className="flex min-h-screen">
        <StudentSidebar />
        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-8">Ranking Semanal</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-brand-blue to-brand-lightBlue text-white">
                  <CardTitle>Top 100 Estudantes da Semana</CardTitle>
                  <CardDescription className="text-white/80">
                    Baseado nas notas das atividades nos últimos 7 dias
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Top 3 students with highlight */}
                      {users.slice(0, 3).length > 0 && (
                        <div className="p-6 pb-8 bg-gradient-to-b from-gray-50 to-white">
                          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            {/* Second place */}
                            {users[1] && (
                              <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mb-2 relative">
                                  <Award className="w-10 h-10 text-gray-100" />
                                  <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full w-7 h-7 flex items-center justify-center border-2 border-white">
                                    <span className="text-white font-bold">2</span>
                                  </div>
                                </div>
                                <h3 className="font-semibold text-sm">{users[1].name}</h3>
                                <div className="text-center">
                                  <p className="text-sm font-medium">{users[1].averageScore.toFixed(1)} <span className="text-xs text-gray-500">média</span></p>
                                  <p className="text-xs text-gray-500">{users[1].completedLessons} aulas</p>
                                </div>
                              </div>
                            )}
                            
                            {/* First place */}
                            {users[0] && (
                              <div className="flex flex-col items-center relative animate-[pulse_4s_ease-in-out_infinite]">
                                <div className="w-28 h-28 rounded-full bg-yellow-500 flex items-center justify-center mb-2 border-4 border-yellow-300 shadow-lg relative">
                                  <Trophy className="w-14 h-14 text-yellow-100" />
                                  <div className="absolute -top-1 -right-1 bg-yellow-600 rounded-full w-8 h-8 flex items-center justify-center border-2 border-white">
                                    <span className="text-white font-bold">1</span>
                                  </div>
                                </div>
                                <h3 className="font-bold">{users[0].name}</h3>
                                <div className="text-center">
                                  <p className="text-sm font-bold">{users[0].averageScore.toFixed(1)} <span className="text-xs font-medium text-gray-600">média</span></p>
                                  <p className="text-xs text-gray-600">{users[0].completedLessons} aulas</p>
                                </div>
                                {/* Stars animation */}
                                <div className="absolute top-0 left-0 right-0">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={cn(
                                        "absolute text-yellow-300 opacity-75",
                                        "animate-[scale-in_2s_ease-in-out_infinite]"
                                      )}
                                      style={{
                                        top: `${Math.random() * 30}px`,
                                        left: `${Math.random() * 100}%`,
                                        transform: `rotate(${Math.random() * 360}deg)`,
                                        fontSize: `${Math.random() * 10 + 10}px`,
                                        animationDelay: `${Math.random() * 2}s`
                                      }}
                                      size={Math.random() * 10 + 10}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Third place */}
                            {users[2] && (
                              <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-amber-700 flex items-center justify-center mb-2 relative">
                                  <Award className="w-10 h-10 text-amber-200" />
                                  <div className="absolute -top-1 -right-1 bg-amber-800 rounded-full w-7 h-7 flex items-center justify-center border-2 border-white">
                                    <span className="text-white font-bold">3</span>
                                  </div>
                                </div>
                                <h3 className="font-semibold text-sm">{users[2].name}</h3>
                                <div className="text-center">
                                  <p className="text-sm font-medium">{users[2].averageScore.toFixed(1)} <span className="text-xs text-gray-500">média</span></p>
                                  <p className="text-xs text-gray-500">{users[2].completedLessons} aulas</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Rest of students */}
                      <div className="max-h-[600px] overflow-y-auto p-4">
                        <ul className="space-y-1">
                          {users.slice(3).map((user) => (
                            <li 
                              key={user.id} 
                              className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-md hover:bg-gray-50 transition-colors",
                                user.id === userDetails?.id ? "border border-brand-blue/50 bg-brand-blue/5" : ""
                              )}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                                  {getRankIcon(user.rank)}
                                </div>
                                <span className="font-medium">
                                  {user.name} {user.id === userDetails?.id && "(Você)"}
                                </span>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="flex items-center space-x-1">
                                  <span className="font-bold">{user.averageScore.toFixed(1)}</span>
                                  <span className="text-sm text-gray-500">média</span>
                                </div>
                                <span className="text-xs text-gray-500">{user.completedLessons} aulas</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                        
                        {users.length === 0 && !loading && (
                          <div className="text-center py-12 text-gray-500">
                            <p>Nenhuma atividade concluída nos últimos 7 dias</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Study tips section */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-xl font-semibold">Dicas de Estudo</h2>
              {studyTips.map((tip) => (
                <Card key={tip.id} className="hover:shadow-md transition-shadow hover:scale-[1.01] hover-scale">
                  <CardHeader className="pb-2 flex flex-row items-start space-y-0">
                    {tip.icon}
                    <div className="ml-4">
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.content}</p>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="bg-gradient-to-r from-sky-50 to-indigo-50 border-none hover:shadow-md transition-shadow hover:scale-[1.01]">
                <CardHeader>
                  <CardTitle className="text-lg">Organize seu Tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Estude um pouco todos os dias em vez de grandes sessões de uma vez. Consistência é mais importante que duração.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
