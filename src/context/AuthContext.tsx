
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userDetails: {
    id: string;
    name: string;
    email: string;
    role: 'teacher' | 'student';
    status: 'active' | 'blocked';
  } | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'teacher' | 'student') => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<AuthContextType['userDetails']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Função para verificar se as tabelas necessárias existem
  const ensureTablesExist = async () => {
    try {
      // Tabelas que precisamos criar
      const tables = [
        {
          name: 'users',
          query: `
            CREATE TABLE IF NOT EXISTS users (
              id UUID PRIMARY KEY,
              email TEXT NOT NULL,
              name TEXT NOT NULL,
              role TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'active',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
          `
        },
        {
          name: 'lessons',
          query: `
            CREATE TABLE IF NOT EXISTS lessons (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              title TEXT NOT NULL,
              content TEXT NOT NULL,
              video_url TEXT,
              teacher_id UUID REFERENCES users(id),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
          `
        },
        {
          name: 'student_lessons',
          query: `
            CREATE TABLE IF NOT EXISTS student_lessons (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              student_id UUID REFERENCES users(id),
              lesson_id UUID REFERENCES lessons(id),
              completed BOOLEAN DEFAULT false,
              score NUMERIC,
              feedback TEXT,
              assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
          `
        }
      ];

      // Criar extensão uuid se necessário
      await supabase.rpc('create_uuid_extension');

      // Verificar e criar cada tabela
      for (const table of tables) {
        // Verificar se a tabela já existe
        const { error: checkError } = await supabase
          .from(table.name)
          .select('id')
          .limit(1);
          
        if (checkError && checkError.code === '42P01') {
          console.log(`Tabela ${table.name} não existe. Criando...`);
          
          // Criar a tabela
          const { error: createError } = await supabase.rpc('execute_sql', {
            sql_query: table.query
          });
          
          if (createError) {
            console.error(`Erro ao criar tabela ${table.name}:`, createError);
            throw createError;
          }
          console.log(`Tabela ${table.name} criada com sucesso.`);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar/criar tabelas:', error);
    }
  };

  useEffect(() => {
    // Configurar listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        await fetchUserDetails(newSession.user.id);
      } else {
        setUserDetails(null);
      }
      
      setIsLoading(false);
    });

    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchUserDetails(initialSession.user.id);
      }
      
      setIsLoading(false);
    });

    // Verificar/criar as tabelas necessárias
    ensureTablesExist();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      // First check if users table exists
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === '42P01') {
        // Table doesn't exist yet
        console.log('Users table does not exist yet');
        setUserDetails(null);
        return;
      } else if (error) {
        console.error('Error fetching user details:', error);
        setUserDetails(null);
        return;
      }

      if (data) {
        setUserDetails({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Login falhou',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      // Buscar detalhes do usuário após login bem-sucedido
      if (data.user) {
        await fetchUserDetails(data.user.id);
      }

      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo de volta!',
      });
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'teacher' | 'student') => {
    try {
      // Garantir que as tabelas existem
      await ensureTablesExist();
      
      // Criar usuário de autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        toast({
          title: 'Registro falhou',
          description: authError.message,
          variant: 'destructive',
        });
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Falha ao criar usuário');
      }

      console.log('Usuário criado. Inserindo dados na tabela users...');
      
      // Adicionar detalhes do usuário na tabela users
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email,
          name,
          role,
          status: 'active',
        },
      ]);

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        toast({
          title: 'Erro ao criar perfil',
          description: profileError.message,
          variant: 'destructive',
        });
        throw profileError;
      }

      // Atualizar userDetails após registro bem-sucedido
      setUserDetails({
        id: authData.user.id,
        email,
        name,
        role,
        status: 'active'
      });

      toast({
        title: 'Conta criada com sucesso',
        description: 'Bem-vindo ao EngLearn!',
      });

    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserDetails(null);
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
    } catch (error: any) {
      console.error('Sign out error:', error.message);
      toast({
        title: 'Erro ao sair',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    session,
    user,
    userDetails,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
