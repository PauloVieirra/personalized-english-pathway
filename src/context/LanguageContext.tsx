
import React, { createContext, useContext, useState } from 'react';

type Language = 'pt' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
};

const translations = {
  // Auth
  login: {
    pt: 'Entrar',
    en: 'Login',
  },
  register: {
    pt: 'Registrar',
    en: 'Register',
  },
  email: {
    pt: 'Email',
    en: 'Email',
  },
  password: {
    pt: 'Senha',
    en: 'Password',
  },
  name: {
    pt: 'Nome',
    en: 'Name',
  },
  role: {
    pt: 'Função',
    en: 'Role',
  },
  teacher: {
    pt: 'Professor',
    en: 'Teacher',
  },
  student: {
    pt: 'Aluno',
    en: 'Student',
  },
  submit: {
    pt: 'Enviar',
    en: 'Submit',
  },
  // Dashboard
  welcome: {
    pt: 'Bem-vindo',
    en: 'Welcome',
  },
  dashboard: {
    pt: 'Painel',
    en: 'Dashboard',
  },
  lessons: {
    pt: 'Aulas',
    en: 'Lessons',
  },
  students: {
    pt: 'Alunos',
    en: 'Students',
  },
  createLesson: {
    pt: 'Criar Aula',
    en: 'Create Lesson',
  },
  title: {
    pt: 'Título',
    en: 'Title',
  },
  content: {
    pt: 'Conteúdo',
    en: 'Content',
  },
  videoUrl: {
    pt: 'URL do Vídeo',
    en: 'Video URL',
  },
  save: {
    pt: 'Salvar',
    en: 'Save',
  },
  logout: {
    pt: 'Sair',
    en: 'Logout',
  },
  // General
  loading: {
    pt: 'Carregando...',
    en: 'Loading...',
  },
  error: {
    pt: 'Erro',
    en: 'Error',
  },
  success: {
    pt: 'Sucesso',
    en: 'Success',
  },
  // Student
  myLessons: {
    pt: 'Minhas Aulas',
    en: 'My Lessons',
  },
  progress: {
    pt: 'Progresso',
    en: 'Progress',
  },
  completed: {
    pt: 'Concluído',
    en: 'Completed',
  },
  pending: {
    pt: 'Pendente',
    en: 'Pending',
  },
  score: {
    pt: 'Nota',
    en: 'Score',
  },
  feedback: {
    pt: 'Feedback',
    en: 'Feedback',
  },
  // Teacher - Students management
  addStudent: {
    pt: 'Adicionar Aluno',
    en: 'Add Student',
  },
  status: {
    pt: 'Status',
    en: 'Status',
  },
  active: {
    pt: 'Ativo',
    en: 'Active',
  },
  blocked: {
    pt: 'Bloqueado',
    en: 'Blocked',
  },
  block: {
    pt: 'Bloquear',
    en: 'Block',
  },
  unblock: {
    pt: 'Desbloquear',
    en: 'Unblock',
  },
  assignLesson: {
    pt: 'Atribuir Aula',
    en: 'Assign Lesson',
  },
  // Teacher - Lesson management
  editLesson: {
    pt: 'Editar Aula',
    en: 'Edit Lesson',
  },
  deleteLesson: {
    pt: 'Excluir Aula',
    en: 'Delete Lesson',
  },
  selectStudents: {
    pt: 'Selecionar Alunos',
    en: 'Select Students',
  },
  assign: {
    pt: 'Atribuir',
    en: 'Assign',
  },
  evaluate: {
    pt: 'Avaliar',
    en: 'Evaluate',
  },
  // Added missing translations
  lessonsAssignedSuccessfully: {
    pt: 'Aulas atribuídas com sucesso',
    en: 'Lessons assigned successfully',
  },
  selectStudentsToAssignLesson: {
    pt: 'Selecione os alunos para atribuir a aula',
    en: 'Select students to assign lesson',
  },
  noStudentsFound: {
    pt: 'Nenhum aluno encontrado',
    en: 'No students found',
  },
  unnamed: {
    pt: 'Sem nome',
    en: 'Unnamed',
  },
  noEmail: {
    pt: 'Sem email',
    en: 'No email',
  },
  saving: {
    pt: 'Salvando...',
    en: 'Saving...',
  },
  saveAssignments: {
    pt: 'Salvar Atribuições',
    en: 'Save Assignments',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: keyof typeof translations) => {
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
