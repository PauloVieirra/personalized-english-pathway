
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://upsbzccqprpwurrhffms.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwc2J6Y2NxcHJwd3VycmhmZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNDgwODAsImV4cCI6MjA2MjkyNDA4MH0.gVbyjQgm65IT9jM5vdYlGwCiP4lh_grHXGE-pibNrNI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Criar as funções necessárias no banco de dados
export async function setupSupabaseFunctions() {
  try {
    // Criar função para extensão UUID
    await supabase.rpc('create_uuid_extension').catch(async (error) => {
      if (error.message.includes('does not exist')) {
        console.log('Criando função create_uuid_extension...');
        await supabase.rpc('create_function', {
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
      }
    });
    
    // Criar função para executar SQL
    await supabase.rpc('execute_sql', { sql_query: 'SELECT 1' }).catch(async (error) => {
      if (error.message.includes('does not exist')) {
        console.log('Criando função execute_sql...');
        await supabase.rpc('create_function', {
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
      }
    });
    
    // Criar função para criar função
    await supabase.rpc('create_function', { name: 'test', definition: 'SELECT 1' }).catch(async (error) => {
      if (error.message.includes('does not exist')) {
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
    });
    
    console.log('Configuração das funções do Supabase concluída');
  } catch (error) {
    console.error('Erro ao configurar funções do Supabase:', error);
  }
}

// Chamar a configuração quando o módulo for carregado
setupSupabaseFunctions();

export type Tables = {
  users: {
    id: string;
    email: string;
    name: string;
    role: 'teacher' | 'student';
    status: 'active' | 'blocked';
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
