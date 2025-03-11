
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Clock } from 'lucide-react';

const MaintenanceSettings = () => {
  return (
    <>
      <h2 className="text-xl font-medium mb-4 flex items-center">
        <Clock className="h-5 w-5 text-primary mr-2" />
        Maintenance
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="health-check-interval">Intervalle de vérification de santé (minutes)</Label>
          <Input id="health-check-interval" type="number" defaultValue={15} />
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch id="auto-update" defaultChecked />
          <Label htmlFor="auto-update" className="cursor-pointer">
            Mise à jour automatique des statistiques
          </Label>
        </div>
      </div>
    </>
  );
};

export default MaintenanceSettings;
