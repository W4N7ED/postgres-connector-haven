
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck } from 'lucide-react';

const SecuritySettings = () => {
  return (
    <>
      <h2 className="text-xl font-medium mb-4 flex items-center">
        <ShieldCheck className="h-5 w-5 text-primary mr-2" />
        Sécurité
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="encryption-key">Clé de chiffrement (pour les mots de passe stockés)</Label>
          <Input id="encryption-key" type="password" defaultValue="" placeholder="••••••••••••••••" />
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch id="verify-ssl" defaultChecked />
          <Label htmlFor="verify-ssl" className="cursor-pointer">
            Vérifier les certificats SSL
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="save-passwords" defaultChecked />
          <Label htmlFor="save-passwords" className="cursor-pointer">
            Enregistrer les mots de passe localement (chiffrés)
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="audit-log" defaultChecked />
          <Label htmlFor="audit-log" className="cursor-pointer">
            Activer les journaux d'audit
          </Label>
        </div>
      </div>
    </>
  );
};

export default SecuritySettings;
