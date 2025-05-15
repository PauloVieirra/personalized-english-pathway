
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://upsbzccqprpwurrhffms.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwc2J6Y2NxcHJwd3VycmhmZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNDgwODAsImV4cCI6MjA2MjkyNDA4MH0.gVbyjQgm65IT9jM5vdYlGwCiP4lh_grHXGE-pibNrNI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Criar as funções necessárias no banco de dados
export async function setupSupabaseFunctions() {
  try {
    // Criar função para extensão UUID
    const { error: createUuidExtError } = await supabase.rpc('create_uuid_extension');
    if (createUuidExtError && createUuidExtError.message.includes('does not exist')) {
      console.log('Criando função create_uuid_extension...');
      const { error: createFuncError } = await supabase.rpc('create_function', {
        name: 'create_uuid_extension',
        definition: `
          CREATE OR REPLACE FUNCTION create_uuid_extension()
          RETURNS void AS $$
          BEGIN
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
          END;
          $$ LANGUAGE plpgsql;
        `
      });
      if (createFuncError) {
        console.error('Erro ao criar create_uuid_extension:', createFuncError);
      }
    }
    
    // Criar função para executar SQL
    const { error: executeSqlError } = await supabase.rpc('execute_sql', { sql_query: 'SELECT 1' });
    if (executeSqlError && executeSqlError.message.includes('does not exist')) {
      console.log('Criando função execute_sql...');
      const { error: createFuncError } = await supabase.rpc('create_function', {
        name: 'execute_sql',
        definition: `
          CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
          RETURNS void AS $$
          BEGIN
            EXECUTE sql_query;
          END;
          $$ LANGUAGE plpgsql;
        `
      });
      if (createFuncError) {
        console.error('Erro ao criar execute_sql:', createFuncError);
      }
    }
    
    // Criar função para criar função
    const { error: createFuncError } = await supabase.rpc('create_function', { name: 'test', definition: 'SELECT 1' });
    if (createFuncError && createFuncError.message.includes('does not exist')) {
      console.log('Criando função create_function...');
      // Infelizmente não podemos criar esta função através da API,
      // então precisamos instruir o usuário a criá-la manualmente no SQL Editor do Supabase
      console.warn(
        'Para poder criar as tabelas automaticamente, por favor execute o seguinte SQL no SQL Editor do Supabase:\n' +
        'CREATE OR REPLACE FUNCTION create_function(name TEXT, definition TEXT)\n' +
        'RETURNS void AS $$\n' +
        'BEGIN\n' +
        '  EXECUTE definition;\n' +
        'END;\n' +
        '$$ LANGUAGE plpgsql;'
      );
    }
    
    // Criar função para criar a tabela de usuários
    const { error: createUsersTableError } = await supabase.rpc('create_users_table');
    if (createUsersTableError && createUsersTableError.message.includes('does not exist')) {
      console.log('Criando função create_users_table...');
      const { error: createFuncError } = await supabase.rpc('create_function', {
        name: 'create_users_table',
        definition: `
          CREATE OR REPLACE FUNCTION create_users_table()
          RETURNS void AS $$
          BEGIN
            CREATE TABLE IF NOT EXISTS public.users (
              id UUID PRIMARY KEY,
              email TEXT UNIQUE NOT NULL,
              name TEXT NOT NULL,
              role TEXT NOT NULL CHECK (role IN ('teacher', 'student', 'admin')),
              status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
          END;
          $$ LANGUAGE plpgsql;
        `
      });
      if (createFuncError) {
        console.error('Erro ao criar create_users_table:', createFuncError);
      }
    }
    
    // Criar função para criar a tabela de perfil de usuário
    const { error: createProfileTableError } = await supabase.rpc('create_user_profile_table');
    if (createProfileTableError && createProfileTableError.message.includes('does not exist')) {
      console.log('Criando função create_user_profile_table...');
      const { error: createFuncError } = await supabase.rpc('create_function', {
        name: 'create_user_profile_table',
        definition: `
          CREATE OR REPLACE FUNCTION create_user_profile_table()
          RETURNS void AS $$
          BEGIN
            CREATE TABLE IF NOT EXISTS public.user_profile (
              id UUID PRIMARY KEY,
              name TEXT,
              email TEXT,
              role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
              created_at TIMESTAMP DEFAULT now()
            );
          END;
          $$ LANGUAGE plpgsql;
        `
      });
      if (createFuncError) {
        console.error('Erro ao criar create_user_profile_table:', createFuncError);
      }
    }
    
    console.log('Configuração das funções do Supabase concluída');
  } catch (error) {
    console.error('Erro ao configurar funções do Supabase:', error);
  }
}

// Chamar a configuração quando o módulo for carregado
setupSupabaseFunctions();

// Função auxiliar para garantir que as tabelas existem
export async function ensureTables() {
  try {
    // Criar tabela de usuários se não existir
    await supabase.rpc('create_users_table').then(({ error }) => {
      if (error && !error.message.includes('does not exist')) {
        console.error('Erro ao criar tabela de usuários:', error);
      }
    });
    
    // Criar tabela de perfil de usuário se não existir
    await supabase.rpc('create_user_profile_table').then(({ error }) => {
      if (error && !error.message.includes('does not exist')) {
        console.error('Erro ao criar tabela de perfil de usuário:', error);
      }
    });
  } catch (error) {
    console.error('Erro ao garantir existência das tabelas:', error);
  }
}

export type Tables = {
  users: {
    id: string;
    email: string;
    name: string;
    role: 'teacher' | 'student' | 'admin';
    status: 'active' | 'blocked';
    created_at: string;
  };
  user_profile: {
    id: string;
    name: string;
    email: string;
    role: 'teacher' | 'student' | 'admin';
    created_at: string;
  };
  lessons: {
    id: string;
    title: string;
    content: string;
    video_url: string | null;
    teacher_id: string;
    created_at: string;
  };
  student_lessons: {
    id: string;
    student_id: string;
    lesson_id: string;
    completed: boolean;
    score: number | null;
    feedback: string | null;
    assigned_at: string;
  };
};
