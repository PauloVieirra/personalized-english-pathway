
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://upsbzccqprpwurrhffms.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwc2J6Y2NxcHJwd3VycmhmZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNDgwODAsImV4cCI6MjA2MjkyNDA4MH0.gVbyjQgm65IT9jM5vdYlGwCiP4lh_grHXGE-pibNrNI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: {
      'X-Client-Info': 'lovable-app'
    }
  }
});

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
