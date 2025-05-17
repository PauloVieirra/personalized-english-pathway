
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: (key) => key,
});

// Translation strings
const translations: Record<string, Record<string, string>> = {
  pt: {
    active: 'Ativo',
    blocked: 'Bloqueado',
    students: 'Alunos',
    loading: 'Carregando...',
    progress: 'Progresso',
    title: 'Título',
    role: 'Papel',
    content: 'Conteúdo',
    name: 'Nome',
    login: 'Entrar',
    register: 'Registrar',
    email: 'E-mail',
    password: 'Senha',
    teacher: 'Professor',
    student: 'Aluno',
    submit: 'Enviar',
    save: 'Salvar',
    dashboard: 'Painel',
    lessons: 'Aulas',
    logout: 'Sair',
    error: 'Erro',
    success: 'Sucesso',
    videoUrl: 'URL do vídeo',
    createLesson: 'Criar aula',
    yourProgress: 'Seu progresso',
    completed: 'Concluído',
    viewLesson: 'Ver aula',
    assignments: 'Tarefas',
    evaluate: 'Avaliar',
    continue: 'Continuar',
    
    // New translations for questions
    addQuestions: 'Adicionar Questões',
    question: 'Questão',
    questionText: 'Pergunta',
    questionWeight: 'Peso da Questão',
    questionType: 'Tipo de Questão',
    singleAnswer: 'Resposta Única',
    multipleAnswers: 'Múltiplas Respostas',
    answerOptions: 'Opções de Resposta',
    addOption: 'Adicionar opção',
    option: 'Opção',
    correctAnswers: 'Resposta(s) Correta(s)',
    remove: 'Remover',
    removeOption: 'Remover opção',
    backToContent: 'Voltar ao Conteúdo',
    noQuestionsYet: 'Nenhuma questão adicionada ainda',
    addQuestion: 'Adicionar Questão',
    noOptionsAdded: 'Nenhuma opção adicionada',
    enterQuestionText: 'Digite aqui o enunciado da pergunta',
    pleaseFillAllRequiredFields: 'Por favor, preencha todos os campos obrigatórios',
    allQuestionsNeedText: 'Todas as questões precisam ter um enunciado',
    allQuestionsNeedOptions: 'Todas as questões precisam ter pelo menos uma opção de resposta',
    allQuestionsNeedCorrectAnswer: 'Todas as questões precisam ter pelo menos uma resposta correta',
    
    // Fix for errors in AssignLessonForm.tsx
    lessonsAssignedSuccessfully: 'Aulas atribuídas com sucesso',
    selectStudentsToAssignLesson: 'Selecione os alunos para atribuir esta aula',
    noStudentsFound: 'Nenhum aluno encontrado',
    unnamed: 'Sem nome',
    noEmail: 'Sem e-mail',
    saving: 'Salvando...',
    saveAssignments: 'Salvar Atribuições'
  },
  en: {
    active: 'Active',
    blocked: 'Blocked',
    students: 'Students',
    loading: 'Loading...',
    progress: 'Progress',
    title: 'Title',
    role: 'Role',
    content: 'Content',
    name: 'Name',
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    teacher: 'Teacher',
    student: 'Student',
    submit: 'Submit',
    save: 'Save',
    dashboard: 'Dashboard',
    lessons: 'Lessons',
    logout: 'Logout',
    error: 'Error',
    success: 'Success',
    videoUrl: 'Video URL',
    createLesson: 'Create Lesson',
    yourProgress: 'Your Progress',
    completed: 'Completed',
    viewLesson: 'View Lesson',
    assignments: 'Assignments',
    evaluate: 'Evaluate',
    continue: 'Continue',
    
    // New translations for questions
    addQuestions: 'Add Questions',
    question: 'Question',
    questionText: 'Question Text',
    questionWeight: 'Question Weight',
    questionType: 'Question Type',
    singleAnswer: 'Single Answer',
    multipleAnswers: 'Multiple Answers',
    answerOptions: 'Answer Options',
    addOption: 'Add Option',
    option: 'Option',
    correctAnswers: 'Correct Answer(s)',
    remove: 'Remove',
    removeOption: 'Remove option',
    backToContent: 'Back to Content',
    noQuestionsYet: 'No questions added yet',
    addQuestion: 'Add Question',
    noOptionsAdded: 'No options added',
    enterQuestionText: 'Enter the question text here',
    pleaseFillAllRequiredFields: 'Please fill all required fields',
    allQuestionsNeedText: 'All questions need to have a text',
    allQuestionsNeedOptions: 'All questions need to have at least one answer option',
    allQuestionsNeedCorrectAnswer: 'All questions need to have at least one correct answer',
    
    // Fix for errors in AssignLessonForm.tsx
    lessonsAssignedSuccessfully: 'Lessons assigned successfully',
    selectStudentsToAssignLesson: 'Select students to assign this lesson',
    noStudentsFound: 'No students found',
    unnamed: 'Unnamed',
    noEmail: 'No email',
    saving: 'Saving...',
    saveAssignments: 'Save Assignments'
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<string>('pt');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const translate = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
