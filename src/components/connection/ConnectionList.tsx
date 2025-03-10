
import React from 'react';
import { PostgresConnection } from '@/types/connection';
import ConnectionCard from './ConnectionCard';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ConnectionListProps {
  connections: PostgresConnection[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onTest: (id: string) => void;
  onDelete: (id: string) => void;
}

const ConnectionList = ({ 
  connections, 
  onAdd, 
  onEdit, 
  onTest, 
  onDelete 
}: ConnectionListProps) => {
  const isMobile = useIsMobile();

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="mb-6 p-4 rounded-full bg-primary/10">
          <PlusCircle className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-2xl font-medium mb-2">Aucune connexion</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Vous n'avez pas encore ajouté de connexion PostgreSQL. 
          Commencez par ajouter votre première connexion.
        </p>
        <Button onClick={onAdd} className="animate-pulse-subtle">
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une connexion
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Connexions ({connections.length})</h2>
        <Button onClick={onAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
      
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {connections.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            onEdit={onEdit}
            onTest={onTest}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ConnectionList;
