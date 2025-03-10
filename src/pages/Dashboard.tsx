
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import BlurCard from '@/components/ui/blur-card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Database, Server, Users, Activity, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Ces données seraient normalement récupérées depuis une API
  const stats = {
    connections: 3,
    databases: 8,
    queries: 142,
    users: 5
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Gérez et surveillez vos connections PostgreSQL
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate('/connections')}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle connexion
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <BlurCard className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 mr-4">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-3xl font-medium">{stats.connections}</h3>
              <p className="text-muted-foreground text-sm">Connexions</p>
            </div>
          </BlurCard>
          
          <BlurCard className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 mr-4">
              <Server className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-3xl font-medium">{stats.databases}</h3>
              <p className="text-muted-foreground text-sm">Bases de données</p>
            </div>
          </BlurCard>
          
          <BlurCard className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 mr-4">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-3xl font-medium">{stats.queries}</h3>
              <p className="text-muted-foreground text-sm">Requêtes exécutées</p>
            </div>
          </BlurCard>
          
          <BlurCard className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/20 mr-4">
              <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-3xl font-medium">{stats.users}</h3>
              <p className="text-muted-foreground text-sm">Utilisateurs DB</p>
            </div>
          </BlurCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BlurCard>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Database className="h-5 w-5 text-primary mr-2" />
              Connexions récentes
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Production DB', timestamp: '10:23', status: 'connected' },
                { name: 'Développement', timestamp: 'Hier, 16:45', status: 'disconnected' },
                { name: 'Analytics', timestamp: 'Hier, 09:12', status: 'error' }
              ].map((conn, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      conn.status === 'connected' ? 'bg-green-500' :
                      conn.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                    <span>{conn.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{conn.timestamp}</span>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-3 w-full"
              onClick={() => navigate('/connections')}
            >
              Voir toutes les connexions
            </Button>
          </BlurCard>
          
          <BlurCard>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              Activité récente
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Test de connexion', target: 'Production DB', timestamp: 'Il y a 5 min' },
                { action: 'Nouvelle connexion', target: 'Analytics', timestamp: 'Hier, 09:12' },
                { action: 'Modification', target: 'Développement', timestamp: 'Hier, 08:30' },
                { action: 'Test de connexion', target: 'Développement', timestamp: 'Avant-hier' }
              ].map((activity, i) => (
                <div key={i} className="py-2 border-b border-border last:border-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.target}</span>
                </div>
              ))}
            </div>
          </BlurCard>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
