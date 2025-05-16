import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Type } from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';

export default function FontSizeMenu() {
  const { fontSize, setFontSize } = useAccessibility();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-9 px-0">
          <Type className="h-4 w-4" />
          <span className="sr-only">Ajustar tamanho da fonte</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setFontSize('normal')}
          className={fontSize === 'normal' ? 'bg-accent' : ''}
        >
          <span>Fonte Normal</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setFontSize('large')}
          className={fontSize === 'large' ? 'bg-accent' : ''}
        >
          <span>Fonte Grande</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setFontSize('larger')}
          className={fontSize === 'larger' ? 'bg-accent' : ''}
        >
          <span>Fonte Maior</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}