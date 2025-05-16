import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Type } from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';

export default function AccessibilityMenu() {
  const { theme, toggleTheme, fontSize, setFontSize } = useAccessibility();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-9 px-0">
          {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="sr-only">Acessibilidade</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === 'dark' ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Modo Escuro</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setFontSize('normal')}>
          <Type className="mr-2 h-4 w-4" />
          <span>Fonte Normal</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFontSize('large')}>
          <Type className="mr-2 h-4 w-4" />
          <span>Fonte Grande</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFontSize('larger')}>
          <Type className="mr-2 h-4 w-4" />
          <span>Fonte Maior</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}