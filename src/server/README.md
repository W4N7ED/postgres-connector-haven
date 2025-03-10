
# API de gestion de connexions PostgreSQL

Cette API permet de gérer des connexions PostgreSQL, y compris l'authentification des utilisateurs, la gestion des pools de connexions, et l'exécution de requêtes SQL.

## Installation

1. Cloner le projet
2. Installer les dépendances: `npm install`
3. Copier `.env.example` vers `.env` et configurer les variables d'environnement
4. Démarrer le serveur: `npm run server`

## Routes API

### Authentification

- `POST /api/auth/login` - Se connecter à l'API
- `GET /api/auth/me` - Obtenir les informations de l'utilisateur connecté
- `POST /api/auth/register` - Enregistrer un nouvel utilisateur (admin uniquement)

### Connexions PostgreSQL

- `GET /api/connections` - Obtenir toutes les connexions
- `GET /api/connections/:id` - Obtenir une connexion par ID
- `POST /api/connections` - Créer une nouvelle connexion (admin uniquement)
- `PUT /api/connections/:id` - Mettre à jour une connexion (admin uniquement)
- `DELETE /api/connections/:id` - Supprimer une connexion (admin uniquement)
- `POST /api/connections/:id/test` - Tester une connexion
- `GET /api/connections/:id/stats` - Obtenir les statistiques d'une connexion
- `POST /api/connections/:id/query` - Exécuter une requête SQL

## Sécurité

- Toutes les routes sont protégées par JWT
- Les routes d'administration nécessitent un rôle admin
- Les mots de passe sont hachés avec bcrypt
- Protection contre les injections SQL avec des requêtes préparées
- SSL/TLS pour la connexion à PostgreSQL
- Protection CSRF (à activer dans .env)
- Limitation de débit pour prévenir les attaques par force brute
- Helmet pour sécuriser les en-têtes HTTP

## Surveillance

- Métriques Prometheus disponibles à `/metrics`
- Journalisation avec Winston
- Surveillance des performances PostgreSQL

## Développement

Pour le développement, un utilisateur admin par défaut est créé:
- Username: admin (configurable dans .env)
- Password: admin123 (configurable dans .env)

## Exemple d'utilisation

### Se connecter à l'API

```javascript
const login = async () => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    return data.data.token;
  }
  
  throw new Error(data.error);
};
```

### Créer une connexion PostgreSQL

```javascript
const createConnection = async (token, connectionData) => {
  const response = await fetch('http://localhost:3001/api/connections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(connectionData)
  });
  
  return response.json();
};
```

### Tester une connexion

```javascript
const testConnection = async (token, connectionId) => {
  const response = await fetch(`http://localhost:3001/api/connections/${connectionId}/test`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

### Exécuter une requête SQL

```javascript
const executeQuery = async (token, connectionId, query, params = []) => {
  const response = await fetch(`http://localhost:3001/api/connections/${connectionId}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query, params })
  });
  
  return response.json();
};
```
