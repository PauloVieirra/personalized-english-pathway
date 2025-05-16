import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAccessibility();

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className="w-9 px-0"
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">
        {theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      </span>
    </Button>
  );
}