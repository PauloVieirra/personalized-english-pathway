
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Book, Users, BarChart, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeacherSidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    {
      label: t('dashboard'),
      href: '/teacher/dashboard',
      icon: <BarChart size={18} />,
    },
    {
      label: t('lessons'),
      href: '/teacher/lessons',
      icon: <Book size={18} />,
    },
    {
      label: 'Cursos',
      href: '/teacher/courses',
      icon: <Layers size={18} />,
    },
    {
      label: t('students'),
      href: '/teacher/students',
      icon: <Users size={18} />,
    },
  ];

  return (
    <aside className="bg-gray-50 w-64 p-4 hidden md:block">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
              location.pathname === item.href
                ? "bg-brand-blue text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
