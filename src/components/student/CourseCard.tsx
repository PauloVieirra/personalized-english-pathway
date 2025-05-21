
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface CourseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  imageUrl: string | null;
}

const CourseCard = ({ title, imageUrl, className, ...props }: CourseCardProps) => {
  // Usar imagem do curso ou uma imagem placeholder padrão
  const backgroundImage = imageUrl || '/placeholder.svg';
  
  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer transition-all hover:shadow-lg",
        className
      )}
      {...props}
    >
      <AspectRatio ratio={16/9}>
        <div className="w-full h-full relative group">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/50 flex items-end p-4">
            <h3 className="text-white font-medium text-lg line-clamp-2">
              {title}
            </h3>
          </div>
        </div>
      </AspectRatio>
    </Card>
  );
};

export default CourseCard;
