
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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

console.log('AuthContext created');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('AuthProvider rendering');
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<AuthContextType['userDetails']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserDetails = useCallback(async (userId: string) => {
    try {
      console.log('Fetching user details for ID:', userId);
      
      // Primeiro tentar buscar da tabela user_profile
      let { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.log('No data in user_profile, trying users table');
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
          console.log('Found user data in users table:', userData);
          data = userData;
        }
      } else {
        console.log('Found user data in user_profile:', data);
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
  }, []);

  useEffect(() => {
    console.log('AuthProvider useEffect running');
    let mounted = true;

    // Configurar listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user && event !== 'TOKEN_REFRESHED') {
        await fetchUserDetails(newSession.user.id);
      } else if (!newSession) {
        setUserDetails(null);
      }
      
      setIsLoading(false);
    });

    // Verificar sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        console.log('Initial session check:', initialSession ? 'Found session' : 'No session');
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await fetchUserDetails(initialSession.user.id);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      console.log('Unsubscribing from auth changes');
      subscription.unsubscribe();
    };
  }, [fetchUserDetails]);

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

  console.log('AuthProvider providing value:', { 
    session: !!session, 
    user: !!user, 
    userDetails: !!userDetails, 
    isLoading 
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  console.log('useAuth called');
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
