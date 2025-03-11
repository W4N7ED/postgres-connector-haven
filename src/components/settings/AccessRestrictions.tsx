
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Network } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const AccessRestrictions = () => {
  const { 
    ipWhitelist, 
    setIpWhitelist, 
    isIpRestrictionEnabled, 
    setIsIpRestrictionEnabled 
  } = useSettings();

  return (
    <>
      <h2 className="text-xl font-medium mb-4 flex items-center">
        <Network className="h-5 w-5 text-primary mr-2" />
        Restrictions d'accès
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="ip-restriction" 
            checked={isIpRestrictionEnabled}
            onCheckedChange={setIsIpRestrictionEnabled}
          />
          <Label htmlFor="ip-restriction" className="cursor-pointer">
            Activer la restriction par IP
          </Label>
        </div>
        
        {isIpRestrictionEnabled && (
          <div className="space-y-2">
            <Label htmlFor="ip-whitelist">Adresses IP autorisées (séparées par des virgules)</Label>
            <Textarea 
              id="ip-whitelist" 
              placeholder="127.0.0.1,::1,localhost" 
              value={ipWhitelist}
              onChange={(e) => setIpWhitelist(e.target.value)}
              className="h-24"
            />
            <p className="text-sm text-muted-foreground">
              Entrez les adresses IP ou noms d'hôtes autorisés à se connecter à votre serveur. 
              Utilisez des virgules pour séparer les entrées.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AccessRestrictions;
