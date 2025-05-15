
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, ensureTables } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userDetails: {
    id: string;
    name: string;
    email: string;
    role: 'teacher' | 'student' | 'admin';
    status: 'active' | 'blocked';
  } | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'teacher' | 'student' | 'admin') => Promise<void>;
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
    await ensureTables();
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
      // Garantir que as tabelas existem
      await ensureTablesExist();
      
      // Primeiro tentar buscar da tabela user_profile
      let { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // Se não encontrar no user_profile, tentar da tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (userError) {
          console.error('Error fetching user details:', userError);
          setUserDetails(null);
          return;
        }
        
        if (userData) {
          data = userData;
        }
      }

      if (data) {
        setUserDetails({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status || 'active'
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

  const signUp = async (email: string, password: string, name: string, role: 'teacher' | 'student' | 'admin') => {
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

      console.log('Usuário criado. Inserindo dados nas tabelas...');
      
      // Adicionar detalhes do usuário na tabela users (para compatibilidade)
      const { error: usersError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email,
          name,
          role,
          status: 'active',
        },
      ]);

      if (usersError) {
        console.error('Erro ao criar registro na tabela users:', usersError);
        // Não impede o fluxo - vamos tentar registrar no user_profile
      }
      
      // Adicionar detalhes do usuário na nova tabela user_profile
      const { error: profileError } = await supabase.from('user_profile').insert([
        {
          id: authData.user.id,
          email,
          name,
          role,
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
