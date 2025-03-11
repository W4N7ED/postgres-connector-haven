
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import BlurCard from '@/components/ui/blur-card';
import { Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SettingsProvider } from '@/contexts/SettingsContext';
import SettingsForm from '@/components/settings/SettingsForm';
import AboutCard from '@/components/settings/AboutCard';
import TipsCard from '@/components/settings/TipsCard';

const Settings = () => {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Paramètres enregistrés",
      description: "Vos paramètres ont été mis à jour",
    });
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2 flex items-center">
            <SettingsIcon className="h-6 w-6 mr-2" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Configurez les options de votre gestionnaire de connexions PostgreSQL
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <BlurCard>
              <SettingsProvider>
                <SettingsForm />
              </SettingsProvider>
            </BlurCard>
          </div>
          
          <div className="space-y-6">
            <AboutCard />
            <TipsCard />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
