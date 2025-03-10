
import React from 'react';
import { PostgresConnection } from '@/types/connection';
import { Database, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import BlurCard from '@/components/ui/blur-card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ConnectionCardProps {
  connection: PostgresConnection;
  onEdit: (id: string) => void;
  onTest: (id: string) => void;
  onDelete: (id: string) => void;
}

const ConnectionCard = ({ connection, onEdit, onTest, onDelete }: ConnectionCardProps) => {
  const statusIcon = {
    connected: <CheckCircle className="w-5 h-5 text-green-500" />,
    disconnected: <XCircle className="w-5 h-5 text-gray-400" />,
    error: <AlertCircle className="w-5 h-5 text-destructive" />,
    unknown: <Clock className="w-5 h-5 text-muted-foreground" />
  };

  const lastConnectedDate = connection.lastConnected 
    ? new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit'
      }).format(new Date(connection.lastConnected))
    : 'Jamais';

  return (
    <BlurCard isHoverable className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className={cn(
            "p-2 rounded-full mr-3",
            connection.status === 'connected' ? "bg-green-100 dark:bg-green-900/20" :
            connection.status === 'error' ? "bg-red-100 dark:bg-red-900/20" :
            "bg-gray-100 dark:bg-gray-800/40"
          )}>
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-lg leading-tight">{connection.name}</h3>
            <p className="text-sm text-muted-foreground">{connection.host}:{connection.port}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {statusIcon[connection.status || 'unknown']}
          <span className={cn(
            "text-xs",
            connection.status === 'connected' ? "text-green-500" :
            connection.status === 'error' ? "text-destructive" :
            "text-muted-foreground"
          )}>
            {connection.status || 'Inconnu'}
          </span>
        </div>
      </div>

      <div className="text-sm mb-4 flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-muted-foreground">Base de données:</span>
          <span className="font-medium">{connection.database}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-muted-foreground">Utilisateur:</span>
          <span className="font-medium">{connection.username}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-muted-foreground">SSL:</span>
          <span className="font-medium">{connection.ssl ? 'Activé' : 'Désactivé'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dernière connexion:</span>
          <span className="font-medium">{lastConnectedDate}</span>
        </div>
      </div>

      <div className="flex space-x-2 pt-3 border-t border-border">
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1"
          onClick={() => onTest(connection.id)}
        >
          Tester
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          onClick={() => onEdit(connection.id)}
        >
          Modifier
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(connection.id)}
        >
          <XCircle className="w-4 h-4" />
        </Button>
      </div>
    </BlurCard>
  );
};

export default ConnectionCard;
