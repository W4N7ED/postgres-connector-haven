
# Procédure d'installation pour la gestion d'API PostgreSQL Manager

Cette documentation détaille les étapes nécessaires pour installer et configurer l'API PostgreSQL Manager sur un serveur.

## Prérequis

- Node.js 16.x ou supérieur
- npm 8.x ou supérieur
- PostgreSQL 12.x ou supérieur
- Serveur Linux (Ubuntu 20.04 LTS recommandé)
- Accès root ou sudo

## Étapes d'installation

### 1. Préparation du serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer les dépendances nécessaires
sudo apt install -y curl git build-essential nginx

# Installer Node.js via NVM (recommandé pour une meilleure gestion des versions)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install 16
nvm use 16

# Vérifier l'installation
node -v
npm -v
```

### 2. Installation de l'application

```bash
# Cloner le repository (remplacer par votre URL de repository)
git clone https://github.com/votre-repo/postgres-manager.git
cd postgres-manager

# Installer les dépendances
npm ci

# Construire l'application
npm run build
```

### 3. Configuration

```bash
# Copier et modifier le fichier .env
cp .env.example .env
nano .env
```

Configurez votre fichier `.env` avec les paramètres suivants:

```
# Configuration du serveur
PORT=3001
CORS_ORIGIN=https://votre-domaine.com
BODY_LIMIT=1mb
IP_WHITELIST=127.0.0.1,::1,localhost,VOTRE_IP_FIXE

# JWT (générez une clé forte avec `openssl rand -base64 32`)
JWT_SECRET=votre_jwt_secret_key_securise
JWT_EXPIRATION=24h

# Postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=postgres_manager
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=postgres_password_securise
POSTGRES_SSL=true
POSTGRES_REJECT_UNAUTHORIZED=true

# Sécurité
BCRYPT_SALT_ROUNDS=12
CSRF_PROTECTION=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=50
CONTENT_SECURITY_POLICY=true

# Admin (changez ces informations pour la production)
ADMIN_USERNAME=admin_securise
ADMIN_PASSWORD=admin_password_complexe
```

### 4. Création du service systemd

Créez un fichier de service systemd pour gérer le démarrage automatique:

```bash
sudo nano /etc/systemd/system/postgres-manager.service
```

Contenu du fichier:

```
[Unit]
Description=PostgreSQL Manager API Service
After=network.target

[Service]
Type=simple
User=votre_utilisateur
WorkingDirectory=/chemin/complet/vers/postgres-manager
ExecStart=/home/votre_utilisateur/.nvm/versions/node/v16.x.x/bin/node dist/server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Activez et démarrez le service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable postgres-manager
sudo systemctl start postgres-manager
sudo systemctl status postgres-manager
```

### 5. Configuration de Nginx comme proxy inverse

```bash
sudo nano /etc/nginx/sites-available/postgres-manager
```

Contenu du fichier:

```
server {
    listen 80;
    server_name votre-api.domaine.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activer le site et redémarrer Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/postgres-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Configuration SSL avec Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d votre-api.domaine.com
```

### 7. Finalisation

Vérifiez que tout fonctionne en accédant à `https://votre-api.domaine.com` dans votre navigateur.

## Configuration des restrictions IP

Pour limiter l'accès à l'API à certaines adresses IP:

1. Modifiez la variable `IP_WHITELIST` dans le fichier `.env` avec les adresses IP autorisées, séparées par des virgules
2. Redémarrez le service: `sudo systemctl restart postgres-manager`

## Mise à jour de l'application

```bash
cd /chemin/vers/postgres-manager
git pull
npm ci
npm run build
sudo systemctl restart postgres-manager
```

## Surveillance et maintenance

### Journaux du service

```bash
sudo journalctl -u postgres-manager -f
```

### Vérification de l'état du service

```bash
sudo systemctl status postgres-manager
```

### Surveillance des performances

L'API expose des métriques Prometheus à l'adresse `/metrics` qui peuvent être collectées par un serveur Prometheus.
