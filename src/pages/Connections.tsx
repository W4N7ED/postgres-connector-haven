
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import ConnectionList from '@/components/connection/ConnectionList';
import ConnectionForm from '@/components/connection/ConnectionForm';
import TestConnection from '@/components/connection/TestConnection';
import { PostgresConnection } from '@/types/connection';
import { useToast } from '@/hooks/use-toast';

const Connections = () => {
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'form' | 'test'>('list');
  const [selectedConnection, setSelectedConnection] = useState<PostgresConnection | undefined>(undefined);
  
  // Simulons des données pour la démo - dans une application réelle, nous utiliserions une API
  const [connections, setConnections] = useState<PostgresConnection[]>([
    {
      id: '1',
      name: 'Production',
      host: 'postgres.example.com',
      port: 5432,
      database: 'erp_prod',
      username: 'admin',
      password: '********',
      ssl: true,
      status: 'connected',
      lastConnected: new Date(Date.now() - 3600000),
      createdAt: new Date(Date.now() - 86400000 * 30),
      updatedAt: new Date(Date.now() - 86400000 * 2)
    },
    {
      id: '2',
      name: 'Développement',
      host: 'localhost',
      port: 5432,
      database: 'erp_dev',
      username: 'postgres',
      password: '********',
      ssl: false,
      status: 'disconnected',
      createdAt: new Date(Date.now() - 86400000 * 60),
      updatedAt: new Date(Date.now() - 86400000 * 1)
    },
  ]);

  const handleAddConnection = () => {
    setSelectedConnection(undefined);
    setView('form');
  };

  const handleEditConnection = (id: string) => {
    const connection = connections.find(conn => conn.id === id);
    if (connection) {
      setSelectedConnection(connection);
      setView('form');
    }
  };

  const handleTestConnection = (id: string) => {
    const connection = connections.find(conn => conn.id === id);
    if (connection) {
      setSelectedConnection(connection);
      setView('test');
    }
  };

  const handleDeleteConnection = (id: string) => {
    setConnections(connections.filter(conn => conn.id !== id));
    toast({
      title: "Connexion supprimée",
      description: "La connexion a été supprimée avec succès",
    });
  };

  const handleSubmitForm = (data: Partial<PostgresConnection>) => {
    if (selectedConnection) {
      // Mise à jour
      setConnections(connections.map(conn => 
        conn.id === selectedConnection.id 
          ? { ...conn, ...data, updatedAt: new Date() } 
          : conn
      ));
      toast({
        title: "Connexion mise à jour",
        description: "Les modifications ont été enregistrées avec succès",
      });
    } else {
      // Nouvelle connexion
      const newConnection: PostgresConnection = {
        id: Math.random().toString(36).substr(2, 9),
        ...data as Omit<PostgresConnection, 'id' | 'createdAt' | 'updatedAt'>,
        status: 'unknown',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setConnections([...connections, newConnection]);
      toast({
        title: "Nouvelle connexion",
        description: "La connexion a été ajoutée avec succès",
      });
    }
    setView('list');
  };

  return (
    <MainLayout>
      {view === 'list' && (
        <ConnectionList
          connections={connections}
          onAdd={handleAddConnection}
          onEdit={handleEditConnection}
          onTest={handleTestConnection}
          onDelete={handleDeleteConnection}
        />
      )}
      
      {view === 'form' && (
        <ConnectionForm
          connection={selectedConnection}
          onSubmit={handleSubmitForm}
          onCancel={() => setView('list')}
        />
      )}
      
      {view === 'test' && selectedConnection && (
        <TestConnection
          connection={selectedConnection}
          onBack={() => setView('list')}
        />
      )}
    </MainLayout>
  );
};

export default Connections;
