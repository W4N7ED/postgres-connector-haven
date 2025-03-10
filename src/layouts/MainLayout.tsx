
import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={cn("container py-6 animate-fade-in", className)}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
