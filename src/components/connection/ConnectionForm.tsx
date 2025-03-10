
import React from 'react';
import { useForm } from 'react-hook-form';
import { PostgresConnection } from '@/types/connection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import BlurCard from '@/components/ui/blur-card';
import { X, Database, Save } from 'lucide-react';

interface ConnectionFormProps {
  connection?: PostgresConnection;
  onSubmit: (data: Partial<PostgresConnection>) => void;
  onCancel: () => void;
}

const ConnectionForm = ({ connection, onSubmit, onCancel }: ConnectionFormProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Partial<PostgresConnection>>({
    defaultValues: connection || {
      name: '',
      host: 'localhost',
      port: 5432,
      database: '',
      username: 'postgres',
      password: '',
      ssl: false
    }
  });

  const isSSL = watch('ssl');

  React.useEffect(() => {
    if (connection) {
      Object.entries(connection).forEach(([key, value]) => {
        setValue(key as keyof PostgresConnection, value);
      });
    }
  }, [connection, setValue]);

  const onFormSubmit = (data: Partial<PostgresConnection>) => {
    onSubmit(data);
  };

  return (
    <BlurCard className="max-w-2xl mx-auto animate-scale-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-xl font-medium">
            {connection ? 'Modifier la connexion' : 'Nouvelle connexion'}
          </h2>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={onCancel}
          className="rounded-full hover:bg-destructive/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de la connexion</Label>
          <Input 
            id="name" 
            placeholder="Connexion principale" 
            {...register('name', { required: true })}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-xs text-destructive">Le nom est requis</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="host">Hôte</Label>
            <Input 
              id="host" 
              placeholder="localhost" 
              {...register('host', { required: true })}
              className={errors.host ? "border-destructive" : ""}
            />
            {errors.host && <p className="text-xs text-destructive">L'hôte est requis</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input 
              id="port" 
              type="number" 
              placeholder="5432" 
              {...register('port', { 
                required: true,
                valueAsNumber: true,
                min: 1,
                max: 65535
              })}
              className={errors.port ? "border-destructive" : ""}
            />
            {errors.port && <p className="text-xs text-destructive">Port invalide (1-65535)</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="database">Base de données</Label>
          <Input 
            id="database" 
            placeholder="postgres" 
            {...register('database', { required: true })}
            className={errors.database ? "border-destructive" : ""}
          />
          {errors.database && <p className="text-xs text-destructive">La base de données est requise</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input 
              id="username" 
              placeholder="postgres" 
              {...register('username', { required: true })}
              className={errors.username ? "border-destructive" : ""}
            />
            {errors.username && <p className="text-xs text-destructive">Le nom d'utilisateur est requis</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              {...register('password')}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="ssl"
            checked={isSSL}
            onCheckedChange={(checked) => setValue('ssl', checked)}
          />
          <Label htmlFor="ssl" className="cursor-pointer">
            Activer SSL
          </Label>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </form>
    </BlurCard>
  );
};

export default ConnectionForm;
