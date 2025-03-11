
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck } from 'lucide-react';

const SecuritySettings = () => {
  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEncryptionKey = (value: string) => {
    if (value && value.length < 8) {
      setErrors(prev => ({ 
        ...prev, 
        encryptionKey: 'La clé de chiffrement doit contenir au moins 8 caractères' 
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.encryptionKey;
        return newErrors;
      });
    }
  };

  const handleEncryptionKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEncryptionKey(value);
    validateEncryptionKey(value);
  };

  return (
    <>
      <h2 className="text-xl font-medium mb-4 flex items-center">
        <ShieldCheck className="h-5 w-5 text-primary mr-2" />
        Sécurité
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="encryption-key">Clé de chiffrement (pour les mots de passe stockés)</Label>
          <Input 
            id="encryption-key" 
            type="password" 
            value={encryptionKey}
            onChange={handleEncryptionKeyChange}
            placeholder="••••••••••••••••" 
            className={errors.encryptionKey ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {errors.encryptionKey && (
            <p className="text-sm text-red-500 mt-1">{errors.encryptionKey}</p>
          )}
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
