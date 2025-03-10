
import React, { useState } from 'react';
import { PostgresConnection, ConnectionTestResult } from '@/types/connection';
import BlurCard from '@/components/ui/blur-card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestConnectionProps {
  connection: PostgresConnection;
  onBack: () => void;
}

const TestConnection = ({ connection, onBack }: TestConnectionProps) => {
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const [testing, setTesting] = useState(false);

  const runTest = async () => {
    setTesting(true);
    // Simulons un test de connexion
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Résultat simulé - dans une vraie application, cela serait fait par une API
    const testResult: ConnectionTestResult = {
      success: Math.random() > 0.3, // Parfois succès, parfois échec pour la démo
      message: Math.random() > 0.3 ? 
        "Connexion établie avec succès" : 
        "Impossible de se connecter au serveur PostgreSQL",
      timestamp: new Date(),
      details: {
        latency: Math.floor(Math.random() * 100 + 5),
        serverVersion: Math.random() > 0.3 ? "PostgreSQL 14.5" : undefined,
        error: Math.random() > 0.3 ? undefined : "FATAL: password authentication failed for user 'postgres'"
      }
    };
    
    setResult(testResult);
    setTesting(false);
  };

  return (
    <BlurCard className="max-w-2xl mx-auto animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-medium">
            Test de connexion : {connection.name}
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack} 
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>
      </div>
      
      <div className="border border-border rounded-md p-4 mb-4 bg-secondary/50">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Hôte:</div>
          <div className="font-medium">{connection.host}</div>
          
          <div className="text-muted-foreground">Port:</div>
          <div className="font-medium">{connection.port}</div>
          
          <div className="text-muted-foreground">Base de données:</div>
          <div className="font-medium">{connection.database}</div>
          
          <div className="text-muted-foreground">Utilisateur:</div>
          <div className="font-medium">{connection.username}</div>
          
          <div className="text-muted-foreground">SSL:</div>
          <div className="font-medium">{connection.ssl ? 'Activé' : 'Désactivé'}</div>
        </div>
      </div>
      
      {!testing && !result && (
        <div className="flex justify-center py-8">
          <Button onClick={runTest} className="px-8">
            Tester la connexion
          </Button>
        </div>
      )}
      
      {testing && (
        <div className="text-center py-6 animate-pulse-subtle">
          <Loader2 className="animate-spin h-10 w-10 mx-auto mb-4 text-primary" />
          <p className="text-lg">Test de connexion en cours...</p>
          <p className="text-sm text-muted-foreground">Tentative de connexion à {connection.host}:{connection.port}</p>
        </div>
      )}
      
      {!testing && result && (
        <div className={cn(
          "rounded-md p-4 mb-4 animate-fade-in",
          result.success ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
        )}>
          <div className="flex items-center mb-3">
            {result.success ? 
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" /> : 
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />}
            <h3 className={cn(
              "text-lg font-medium",
              result.success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
            )}>
              {result.message}
            </h3>
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Horodatage:</span>
              <span>
                {new Intl.DateTimeFormat('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                }).format(result.timestamp)}
              </span>
              
              {result.details?.latency && (
                <>
                  <span className="text-muted-foreground">Latence:</span>
                  <span>{result.details.latency} ms</span>
                </>
              )}
              
              {result.details?.serverVersion && (
                <>
                  <span className="text-muted-foreground">Version du serveur:</span>
                  <span>{result.details.serverVersion}</span>
                </>
              )}
            </div>
            
            {result.details?.error && (
              <div className="mt-3 p-2 bg-red-200 dark:bg-red-900/40 rounded text-red-800 dark:text-red-200 font-mono text-xs overflow-auto">
                {result.details.error}
              </div>
            )}
          </div>
        </div>
      )}
      
      {!testing && result && (
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" onClick={onBack}>
            Retour
          </Button>
          <Button variant="default" onClick={runTest}>
            <Clock className="mr-2 h-4 w-4" />
            Tester à nouveau
          </Button>
        </div>
      )}
    </BlurCard>
  );
};

export default TestConnection;
