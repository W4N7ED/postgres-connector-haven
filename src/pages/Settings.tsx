
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import BlurCard from '@/components/ui/blur-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Save, Database, ShieldCheck, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
              <form onSubmit={handleSave}>
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
                
                <Separator className="my-6" />
                
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
                
                <Separator className="my-6" />
                
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
                
                <div className="mt-6 flex justify-end">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les paramètres
                  </Button>
                </div>
              </form>
            </BlurCard>
          </div>
          
          <div className="space-y-6">
            <BlurCard>
              <h2 className="text-xl font-medium mb-4">À propos</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dernière mise à jour</span>
                  <span className="font-medium">10 Jun 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PostgreSQL compatible</span>
                  <span className="font-medium">9.6 - 15.0</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <p className="text-sm text-muted-foreground">
                PostgreSQL Manager est une application développée pour simplifier la gestion des connexions 
                aux bases de données PostgreSQL et fournir une interface utilisateur intuitive pour 
                administrer efficacement vos bases de données.
              </p>
            </BlurCard>
            
            <BlurCard className="bg-secondary/50">
              <h2 className="text-lg font-medium mb-3">Conseils</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="min-w-[6px] h-2 mt-1.5 rounded-full bg-primary mr-2" />
                  <span>Utilisez SSL pour les connexions de production afin de sécuriser vos données.</span>
                </li>
                <li className="flex items-start">
                  <div className="min-w-[6px] h-2 mt-1.5 rounded-full bg-primary mr-2" />
                  <span>Pour des performances optimales, configurez un pool de connexions approprié.</span>
                </li>
              </ul>
            </BlurCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
