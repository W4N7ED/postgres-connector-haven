
import React from 'react';
import BlurCard from '@/components/ui/blur-card';

const TipsCard = () => {
  return (
    <BlurCard className="bg-secondary/50">
      <h2 className="text-lg font-medium mb-3">Conseils</h2>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start">
          <div className="min-w-[6px] h-2 mt-1.5 rounded-full bg-primary mr-2" />
          <span>Utilisez la restriction IP pour limiter l'accès à votre serveur aux adresses connues et fiables.</span>
        </li>
        <li className="flex items-start">
          <div className="min-w-[6px] h-2 mt-1.5 rounded-full bg-primary mr-2" />
          <span>Utilisez SSL pour les connexions de production afin de sécuriser vos données.</span>
        </li>
        <li className="flex items-start">
          <div className="min-w-[6px] h-2 mt-1.5 rounded-full bg-primary mr-2" />
          <span>Pour des performances optimales, configurez un pool de connexions approprié.</span>
        </li>
      </ul>
    </BlurCard>
  );
};

export default TipsCard;
