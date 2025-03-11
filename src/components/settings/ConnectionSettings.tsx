
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Database } from 'lucide-react';

const ConnectionSettings = () => {
  return (
    <>
      <h2 className="text-xl font-medium mb-4 flex items-center">
        <Database className="h-5 w-5 text-primary mr-2" />
        Paramètres de connexion
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="connection-timeout">Délai de connexion (secondes)</Label>
          <Input id="connection-timeout" type="number" defaultValue={30} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="query-timeout">Délai d'exécution de requête (secondes)</Label>
          <Input id="query-timeout" type="number" defaultValue={60} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max-connections">Nombre maximal de connexions</Label>
          <Input id="max-connections" type="number" defaultValue={10} />
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
