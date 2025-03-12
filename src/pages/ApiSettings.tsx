
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import BlurCard from '@/components/ui/blur-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, Key, Server, Database, Cloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ApiSettings = () => {
  const { toast } = useToast();
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Paramètres API enregistrés",
      description: "Vos paramètres d'API ont été mis à jour",
    });
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2 flex items-center">
            <Server className="h-6 w-6 mr-2" />
            Paramètres API
          </h1>
          <p className="text-muted-foreground">
            Configurez les paramètres de l'API pour votre système ERP
          </p>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="database">Base de données</TabsTrigger>
            <TabsTrigger value="integrations">Intégrations</TabsTrigger>
            <TabsTrigger value="auth">Authentification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <BlurCard>
                  <form onSubmit={handleSave}>
                    <h2 className="text-xl font-medium mb-4 flex items-center">
                      <Settings className="h-5 w-5 text-primary mr-2" />
                      Paramètres généraux
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-url">URL de l'API</Label>
                        <Input id="api-url" type="text" defaultValue="http://localhost:3001/api" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="api-version">Version de l'API</Label>
                        <Input id="api-version" type="text" defaultValue="v1" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cors-origin">CORS Origin</Label>
                        <Input id="cors-origin" type="text" defaultValue="http://localhost:3000" />
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch id="enable-logging" defaultChecked />
                        <Label htmlFor="enable-logging" className="cursor-pointer">
                          Activer les logs détaillés
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="enable-metrics" defaultChecked />
                        <Label htmlFor="enable-metrics" className="cursor-pointer">
                          Activer les métriques Prometheus
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
                  <h2 className="text-xl font-medium mb-4">Informations API</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version</span>
                      <span className="font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Statut</span>
                      <span className="font-medium text-green-500">En ligne</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mode</span>
                      <span className="font-medium">Développement</span>
                    </div>
                  </div>
                </BlurCard>
                
                <BlurCard className="bg-secondary/50">
                  <h2 className="text-lg font-medium mb-3">Documentation</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    La documentation complète de l'API est disponible via Swagger/OpenAPI.
                  </p>
                  <Button variant="outline" className="w-full">
                    Accéder à la documentation
                  </Button>
                </BlurCard>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="database">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <BlurCard>
                  <form onSubmit={handleSave}>
                    <h2 className="text-xl font-medium mb-4 flex items-center">
                      <Database className="h-5 w-5 text-primary mr-2" />
                      Connexion à la base de données
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="db-url">URL de connexion Prisma</Label>
                        <Input 
                          id="db-url" 
                          type="text" 
                          defaultValue="postgresql://postgres:postgres@localhost:5432/postgres?schema=public" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="db-host">Hôte</Label>
                          <Input id="db-host" type="text" defaultValue="localhost" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="db-port">Port</Label>
                          <Input id="db-port" type="number" defaultValue="5432" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="db-name">Nom de la base</Label>
                          <Input id="db-name" type="text" defaultValue="postgres" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="db-schema">Schéma</Label>
                          <Input id="db-schema" type="text" defaultValue="public" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="db-user">Utilisateur</Label>
                          <Input id="db-user" type="text" defaultValue="postgres" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="db-password">Mot de passe</Label>
                          <Input id="db-password" type="password" defaultValue="postgres" />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch id="db-ssl" />
                        <Label htmlFor="db-ssl" className="cursor-pointer">
                          Utiliser SSL
                        </Label>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h2 className="text-xl font-medium mb-4">Options avancées</h2>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="migrations-path">Chemin des migrations</Label>
                        <Input id="migrations-path" type="text" defaultValue="./prisma/migrations" />
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch id="auto-migrate" defaultChecked />
                        <Label htmlFor="auto-migrate" className="cursor-pointer">
                          Exécuter les migrations au démarrage
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="seed-db" defaultChecked />
                        <Label htmlFor="seed-db" className="cursor-pointer">
                          Alimenter la base avec des données initiales
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
                  <h2 className="text-xl font-medium mb-4">Actions</h2>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <span className="mr-2">🔄</span> Tester la connexion
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <span className="mr-2">📊</span> Afficher les schémas
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <span className="mr-2">⬆️</span> Appliquer les migrations
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                      <span className="mr-2">⚠️</span> Réinitialiser la base
                    </Button>
                  </div>
                </BlurCard>
                
                <BlurCard className="bg-secondary/50">
                  <h2 className="text-lg font-medium mb-3">État de la base</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connexion</span>
                      <span className="font-medium text-green-500">Connecté</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version Postgres</span>
                      <span className="font-medium">14.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Migration</span>
                      <span className="font-medium">20230615001</span>
                    </div>
                  </div>
                </BlurCard>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <BlurCard>
                  <form onSubmit={handleSave}>
                    <h2 className="text-xl font-medium mb-4 flex items-center">
                      <Cloud className="h-5 w-5 text-primary mr-2" />
                      Stockage cloud
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="storage-provider">Fournisseur</Label>
                        <select 
                          id="storage-provider" 
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        >
                          <option value="local">Stockage local</option>
                          <option value="aws">Amazon S3</option>
                          <option value="cloudinary">Cloudinary</option>
                          <option value="firebase">Firebase Storage</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="storage-path">Chemin de stockage local</Label>
                        <Input id="storage-path" type="text" defaultValue="./uploads" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cloud-name">Nom du cloud (Cloudinary)</Label>
                        <Input id="cloud-name" type="text" defaultValue="" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="api-key">Clé API</Label>
                        <Input id="api-key" type="password" defaultValue="" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="api-secret">Secret API</Label>
                        <Input id="api-secret" type="password" defaultValue="" />
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h2 className="text-xl font-medium mb-4">Passerelles de paiement</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch id="enable-stripe" />
                        <Label htmlFor="enable-stripe" className="cursor-pointer">
                          Activer Stripe
                        </Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="stripe-secret-key">Clé secrète Stripe</Label>
                        <Input id="stripe-secret-key" type="password" defaultValue="" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="stripe-webhook-secret">Secret Webhook Stripe</Label>
                        <Input id="stripe-webhook-secret" type="password" defaultValue="" />
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-4">
                        <Switch id="enable-paypal" />
                        <Label htmlFor="enable-paypal" className="cursor-pointer">
                          Activer PayPal
                        </Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paypal-client-id">Client ID PayPal</Label>
                        <Input id="paypal-client-id" type="password" defaultValue="" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paypal-client-secret">Secret client PayPal</Label>
                        <Input id="paypal-client-secret" type="password" defaultValue="" />
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
                  <h2 className="text-xl font-medium mb-4">Intégrations actives</h2>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>Stockage local</span>
                      </div>
                      <Button variant="ghost" size="sm">Configurer</Button>
                    </div>
                    <div className="p-3 border rounded-md flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                        <span>Stripe</span>
                      </div>
                      <Button variant="ghost" size="sm">Configurer</Button>
                    </div>
                    <div className="p-3 border rounded-md flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                        <span>PayPal</span>
                      </div>
                      <Button variant="ghost" size="sm">Configurer</Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <Button variant="outline" className="w-full">
                    Ajouter une intégration
                  </Button>
                </BlurCard>
                
                <BlurCard className="bg-secondary/50">
                  <h2 className="text-lg font-medium mb-3">Webhooks</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configurez des webhooks pour connecter vos services externes à l'API.
                  </p>
                  <Button variant="outline" className="w-full">
                    Gérer les webhooks
                  </Button>
                </BlurCard>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="auth">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <BlurCard>
                  <form onSubmit={handleSave}>
                    <h2 className="text-xl font-medium mb-4 flex items-center">
                      <Key className="h-5 w-5 text-primary mr-2" />
                      Authentification & Sécurité
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="jwt-secret">Secret JWT</Label>
                        <Input 
                          id="jwt-secret" 
                          type="password" 
                          defaultValue="your_jwt_secret_key_change_this_in_production" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="jwt-expiration">Expiration JWT (heures)</Label>
                        <Input id="jwt-expiration" type="number" defaultValue="24" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="salt-rounds">Rounds de salt (bcrypt)</Label>
                        <Input id="salt-rounds" type="number" defaultValue="10" />
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch id="enable-api-keys" defaultChecked />
                        <Label htmlFor="enable-api-keys" className="cursor-pointer">
                          Activer les clés API
                        </Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="api-key-header">Nom de l'en-tête pour les clés API</Label>
                        <Input id="api-key-header" type="text" defaultValue="x-api-key" />
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch id="enable-rate-limit" defaultChecked />
                        <Label htmlFor="enable-rate-limit" className="cursor-pointer">
                          Activer la limitation de débit
                        </Label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rate-limit-window">Fenêtre (ms)</Label>
                          <Input id="rate-limit-window" type="number" defaultValue="900000" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="rate-limit-max">Requêtes max</Label>
                          <Input id="rate-limit-max" type="number" defaultValue="100" />
                        </div>
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
                  <h2 className="text-xl font-medium mb-4">Gestion des clés API</h2>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Clé principale</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Active</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Créée le 01/06/2023 • Utilisée récemment
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Intégration CRM</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Active</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Créée le 15/07/2023 • Utilisée il y a 2 jours
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <Button variant="outline" className="w-full">
                    Générer une nouvelle clé API
                  </Button>
                </BlurCard>
                
                <BlurCard className="bg-secondary/50">
                  <h2 className="text-lg font-medium mb-3">Utilisateur administrateur</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nom</span>
                      <span className="font-medium">admin</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mot de passe</span>
                      <span className="font-medium">••••••••</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <Button variant="outline" className="w-full">
                    Modifier l'administrateur
                  </Button>
                </BlurCard>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ApiSettings;
