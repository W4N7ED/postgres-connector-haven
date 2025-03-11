
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import AccessRestrictions from './AccessRestrictions';
import ConnectionSettings from './ConnectionSettings';
import SecuritySettings from './SecuritySettings';
import MaintenanceSettings from './MaintenanceSettings';

const SettingsForm = () => {
  const { handleSave, validateForm } = useSettings();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleSave(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <AccessRestrictions />
      
      <Separator className="my-6" />
      
      <ConnectionSettings />
      
      <Separator className="my-6" />
      
      <SecuritySettings />
      
      <Separator className="my-6" />
      
      <MaintenanceSettings />
      
      <div className="mt-6 flex justify-end">
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les paramètres
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
