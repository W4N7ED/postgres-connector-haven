
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Database } from 'lucide-react';

const ConnectionSettings = () => {
  const [connectionTimeout, setConnectionTimeout] = useState<number>(30);
  const [queryTimeout, setQueryTimeout] = useState<number>(60);
  const [maxConnections, setMaxConnections] = useState<number>(10);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validatePositiveNumber = (value: number, fieldName: string) => {
    if (isNaN(value) || value <= 0) {
      setErrors(prev => ({ ...prev, [fieldName]: 'La valeur doit être un nombre positif' }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    }
  };

  const handleConnectionTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setConnectionTimeout(value);
    validatePositiveNumber(value, 'connectionTimeout');
  };

  const handleQueryTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQueryTimeout(value);
    validatePositiveNumber(value, 'queryTimeout');
  };

  const handleMaxConnectionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMaxConnections(value);
    validatePositiveNumber(value, 'maxConnections');
  };

  return (
    <>
      <h2 className="text-xl font-medium mb-4 flex items-center">
        <Database className="h-5 w-5 text-primary mr-2" />
        Paramètres de connexion
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="connection-timeout">Délai de connexion (secondes)</Label>
          <Input 
            id="connection-timeout" 
            type="number" 
            value={connectionTimeout}
            onChange={handleConnectionTimeoutChange}
            className={errors.connectionTimeout ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {errors.connectionTimeout && (
            <p className="text-sm text-red-500 mt-1">{errors.connectionTimeout}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="query-timeout">Délai d'exécution de requête (secondes)</Label>
          <Input 
            id="query-timeout" 
            type="number" 
            value={queryTimeout}
            onChange={handleQueryTimeoutChange}
            className={errors.queryTimeout ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {errors.queryTimeout && (
            <p className="text-sm text-red-500 mt-1">{errors.queryTimeout}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max-connections">Nombre maximal de connexions</Label>
          <Input 
            id="max-connections" 
            type="number" 
            value={maxConnections}
            onChange={handleMaxConnectionsChange}
            className={errors.maxConnections ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {errors.maxConnections && (
            <p className="text-sm text-red-500 mt-1">{errors.maxConnections}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch id="pool-connections" defaultChecked />
          <Label htmlFor="pool-connections" className="cursor-pointer">
            Utiliser un pool de connexions
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="auto-reconnect" defaultChecked />
          <Label htmlFor="auto-reconnect" className="cursor-pointer">
            Reconnexion automatique
          </Label>
        </div>
      </div>
    </>
  );
};

export default ConnectionSettings;
