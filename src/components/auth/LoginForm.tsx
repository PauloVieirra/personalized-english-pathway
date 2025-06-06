
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { signIn, userDetails } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      
      // Aguardar um momento para garantir que userDetails foi atualizado
      setTimeout(() => {
        redirectBasedOnRole();
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para redirecionar com base no perfil do usuário
  const redirectBasedOnRole = () => {
    if (!userDetails) return;
    
    if (userDetails.role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (userDetails.role === 'student') {
      navigate('/student/dashboard');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">EngLearn</CardTitle>
        <CardDescription className="text-center">{t('login')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nome@exemplo.com"
              className="form-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full btn-primary" 
            disabled={isLoading}
          >
            {isLoading ? t('loading') : t('login')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
