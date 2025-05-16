
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Users, Star, MessageCircle, Mail, Phone, Home, Info, Award } from 'lucide-react';

export default function Index() {
  const { user, userDetails } = useAuth();
  const { t } = useLanguage();

  // Redirect logic based on user role
  const getDashboardLink = () => {
    if (!userDetails) return '/login';
    return userDetails.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
  };

  // Cities data
  const cityImages = [
    {
      city: 'London',
      country: 'UK',
      image: '/london.jpg',
      description: 'Explore the historic streets of London and learn English in its birthplace'
    },
    {
      city: 'New York',
      country: 'USA',
      image: '/new-york.jpg',
      description: 'Immerse yourself in the vibrant culture of New York while perfecting your American English'
    },
    {
      city: 'Sydney',
      country: 'Australia',
      image: '/sydney.jpg',
      description: 'Experience Australian English and the unique culture of Sydney'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Carlos Silva',
      avatar: '/avatar1.jpg',
      role: 'Student',
      content: 'After 6 months with Orsheep, I went from basic to advanced English. The personalized lessons made all the difference!',
      rating: 5
    },
    {
      name: 'Ana Martins',
      avatar: '/avatar2.jpg',
      role: 'Business Professional',
      content: 'The platform helped me gain confidence for international business meetings. The lessons focused exactly on what I needed.',
      rating: 5
    },
    {
      name: 'Pedro Almeida',
      avatar: '/avatar3.jpg',
      role: 'Travel Enthusiast',
      content: 'Learning English for travel was my goal, and Orsheep provided exactly the vocabulary and practice I needed.',
      rating: 4
    }
  ];

  // Team members
  const team = [
    {
      name: 'Maria Pereira',
      role: 'Founder & Lead Teacher',
      avatar: '/team1.jpg',
      bio: 'With over 15 years of experience teaching English worldwide, Maria created Orsheep to bring personalized language learning to everyone.'
    },
    {
      name: 'João Oliveira',
      role: 'Curriculum Director',
      avatar: '/team2.jpg',
      bio: 'João specializes in creating engaging learning materials that adapt to each student's goals and learning style.'
    },
    {
      name: 'Luisa Santos',
      role: 'Technology Lead',
      avatar: '/team3.jpg',
      bio: 'Luisa ensures that our platform leverages the latest technology to provide an immersive learning experience.'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-100 py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Orsheep: Aprenda inglês com uma experiência personalizada
              </h1>
              <p className="text-xl text-gray-700">
                Uma plataforma inovadora para professores e alunos, oferecendo aulas personalizadas e progresso monitorado.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to={getDashboardLink()}>
                    <Button size="lg" className="btn-primary">
                      {t('dashboard')}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <Button size="lg" className="btn-primary">
                        {t('login')}
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="lg" variant="outline">
                        {t('register')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Recursos Principais</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-green mr-2 mt-1"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Aulas personalizadas com texto e vídeo</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-green mr-2 mt-1"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Acompanhamento detalhado do progresso</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-green mr-2 mt-1"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Disponível em português e inglês</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* English-speaking Cities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Conheça o Mundo Através do Inglês</h2>
            <p className="mt-4 text-xl text-gray-600">Aprenda o idioma e explore cidades incríveis ao redor do mundo</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cityImages.map((city, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
                <div className="h-64 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">{city.city}</h3>
                      <p className="text-white/80">{city.country}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-gray-700">{city.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Por que escolher a Orsheep?</h2>
            <p className="mt-4 text-xl text-gray-600">Nossa metodologia única torna o aprendizado de inglês eficiente e agradável</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-brand-blue">
              <CardHeader>
                <CardTitle>Aprendizado Personalizado</CardTitle>
                <CardDescription>Conteúdo adaptado ao seu nível e objetivos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Nossos professores criam aulas específicas para as suas necessidades, 
                  seja para viagens, negócios ou comunicação cotidiana.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-brand-green">
              <CardHeader>
                <CardTitle>Progresso Mensurável</CardTitle>
                <CardDescription>Acompanhamento detalhado da sua evolução</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Veja seu progresso em tempo real com métricas claras e feedback 
                  personalizado dos professores após cada aula.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-brand-darkBlue">
              <CardHeader>
                <CardTitle>Conteúdo Interativo</CardTitle>
                <CardDescription>Vídeos, textos e exercícios envolventes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Aprenda com conteúdo multimídia que torna o estudo mais dinâmico 
                  e aumenta a retenção do conhecimento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white" id="testimonials">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 flex items-center justify-center gap-3">
            <Star className="text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900">Avaliações de Clientes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <div className="h-10 w-10 rounded-full bg-brand-lightBlue flex items-center justify-center">
                        {testimonial.name.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </CardContent>
                <div className="px-6 pb-6 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Us Section */}
      <section className="py-16 bg-gray-50" id="about">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 flex items-center justify-center gap-3">
            <Users className="text-brand-blue" />
            <h2 className="text-3xl font-bold text-gray-900">Quem Somos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <div className="h-24 w-24 rounded-full bg-brand-blue/20 flex items-center justify-center text-2xl font-semibold text-brand-blue">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-brand-blue font-medium mt-1">{member.role}</p>
                  <p className="mt-4 text-gray-700">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Comments Section */}
      <section className="py-16 bg-white" id="comments">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 flex items-center justify-center gap-3">
            <MessageCircle className="text-brand-green" />
            <h2 className="text-3xl font-bold text-gray-900">O que dizem nossos alunos</h2>
          </div>
          
          <div className="max-h-80 overflow-hidden">
            <ScrollArea className="h-80 rounded-md border p-4">
              <div className="space-y-6">
                {Array.from({length: 8}).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Avatar>
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {String.fromCharCode(65 + i)}
                      </div>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Aluno {i + 1}</h4>
                        <span className="text-sm text-gray-500">há {Math.floor(Math.random() * 30) + 1} dias</span>
                      </div>
                      <p className="text-gray-700 mt-1">
                        {[
                          "As aulas são excelentes! Já consigo me comunicar muito melhor em inglês.",
                          "Estou muito satisfeito com o progresso que tenho feito. Os professores são muito atenciosos.",
                          "A plataforma é muito fácil de usar e as aulas são bem estruturadas.",
                          "Finalmente encontrei um método que funciona para mim!",
                          "Recomendo para todos que querem aprender inglês de verdade."
                        ][i % 5]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-gray-50" id="contact">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Entre em Contato</h2>
            <p className="mt-4 text-xl text-gray-600">Estamos aqui para responder suas dúvidas</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="text-brand-blue" />
                  Envie-nos uma mensagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input type="text" className="form-input w-full" placeholder="Seu nome" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="form-input w-full" placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                    <input type="text" className="form-input w-full" placeholder="Assunto da mensagem" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                    <textarea className="form-input w-full h-32 resize-none" placeholder="Sua mensagem..."></textarea>
                  </div>
                  <Button className="w-full">Enviar Mensagem</Button>
                </form>
              </CardContent>
            </Card>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="text-brand-blue" />
                    Telefone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">+55 (11) 9999-8888</p>
                  <p className="text-gray-700 mt-2">Segunda a Sexta, 9h às 18h</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="text-brand-blue" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">contato@orsheep.com</p>
                  <p className="text-gray-700 mt-2">suporte@orsheep.com</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Orsheep</h3>
              <p className="text-gray-400">Transformando o aprendizado de inglês com tecnologia e personalização.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Início</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">Quem Somos</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Avaliações</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-700" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Orsheep. Todos os direitos reservados.</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Feito com</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span className="text-gray-400">no Brasil</span>
            </div>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
