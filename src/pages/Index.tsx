
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection vers le tableau de bord
    navigate('/dashboard');
  }, [navigate]);

  // Ce composant ne sera jamais rendu à cause de la redirection,
  // mais nous retournons quand même un élément au cas où
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirection...</p>
    </div>
  );
};

export default Index;
