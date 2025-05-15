
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

  useEffect(() => {
    // Set up auth state listener
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

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchUserDetails(initialSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
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

      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo de volta!',
      });
      
      // Session and user will be set by the auth state listener
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'teacher' | 'student') => {
    try {
      // Create auth user
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

      // Add user details to the users table
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
        // If profile creation fails, we should ideally delete the auth user,
        // but Supabase doesn't have a convenient method for this
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
      console.error('Sign up error:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
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
