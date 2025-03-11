
import React from 'react';
import BlurCard from '@/components/ui/blur-card';
import { Separator } from '@/components/ui/separator';

const AboutCard = () => {
  return (
    <BlurCard>
      <h2 className="text-xl font-medium mb-4">À propos</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Version</span>
          <span className="font-medium">1.0.0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dernière mise à jour</span>
          <span className="font-medium">10 Jun 2023</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">PostgreSQL compatible</span>
          <span className="font-medium">9.6 - 15.0</span>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <p className="text-sm text-muted-foreground">
        PostgreSQL Manager est une application développée pour simplifier la gestion des connexions 
        aux bases de données PostgreSQL et fournir une interface utilisateur intuitive pour 
        administrer efficacement vos bases de données.
      </p>
    </BlurCard>
  );
};

export default AboutCard;
