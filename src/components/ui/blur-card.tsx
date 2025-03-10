
import React from 'react';
import { cn } from "@/lib/utils";

interface BlurCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
}

const BlurCard = ({ 
  children, 
  className, 
  isHoverable = false, 
  ...props 
}: BlurCardProps) => {
  return (
    <div 
      className={cn(
        "glass rounded-xl p-6 relative animate-fade-in",
        isHoverable && "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BlurCard;
