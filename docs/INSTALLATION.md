
# Procédure d'installation manuelle pour PostgreSQL Manager

Cette documentation détaille les étapes nécessaires pour installer et configurer manuellement l'API PostgreSQL Manager sur un serveur, sans utiliser de scripts d'installation automatisés.

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
```

### 2. Installation de Node.js

```bash
# Option 1: Installer Node.js via NVM (recommandé)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install 16
nvm use 16

# Option 2: Installer Node.js via apt
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier l'installation
node -v  # Doit afficher v16.x.x
npm -v   # Doit afficher 8.x.x
```

### 3. Installation de PostgreSQL (si non installé)

```bash
# Ajouter le dépôt PostgreSQL
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Installer PostgreSQL
sudo apt install -y postgresql-12 postgresql-contrib-12

# Démarrer et activer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier l'installation
sudo -u postgres psql -c "SELECT version();"
```

### 4. Configuration de PostgreSQL

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans l'invite PostgreSQL, exécuter:
CREATE USER postgres_user WITH PASSWORD 'postgres_password_securise';
CREATE DATABASE postgres_manager;
GRANT ALL PRIVILEGES ON DATABASE postgres_manager TO postgres_user;
\q
```

### 5. Installation de l'application

```bash
# Cloner le dépôt (remplacer par votre URL de dépôt)
git clone https://github.com/votre-organisation/postgres-manager.git
cd postgres-manager

# Installer les dépendances
npm ci

# Construire l'application
npm run build
```

### 6. Configuration de l'application

```bash
# Créer et configurer le fichier .env
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
POSTGRES_SSL=false
POSTGRES_REJECT_UNAUTHORIZED=false

# Sécurité
BCRYPT_SALT_ROUNDS=12
CSRF_PROTECTION=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=50
CONTENT_SECURITY_POLICY=true

# Admin (à modifier pour la production)
ADMIN_USERNAME=admin_securise
ADMIN_PASSWORD=admin_password_complexe
```

### 7. Création du service systemd

```bash
# Créer un fichier de service systemd
sudo nano /etc/systemd/system/postgres-manager.service
```

Contenu du fichier service:

```ini
[Unit]
Description=PostgreSQL Manager API Service
After=network.target postgresql.service

[Service]
Type=simple
User=votre_utilisateur
WorkingDirectory=/chemin/complet/vers/postgres-manager
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
```

### 8. Activation et démarrage du service

```bash
# Recharger systemd
sudo systemctl daemon-reload

# Activer le service
sudo systemctl enable postgres-manager

# Démarrer le service
sudo systemctl start postgres-manager

# Vérifier l'état du service
sudo systemctl status postgres-manager
```

### 9. Configuration de Nginx comme proxy inverse

```bash
# Créer un fichier de configuration Nginx
sudo nano /etc/nginx/sites-available/postgres-manager
```

Contenu du fichier de configuration Nginx:

```nginx
server {
    listen 80;
    server_name api.votre-domaine.com;

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

### 10. Activation de la configuration Nginx

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/postgres-manager /etc/nginx/sites-enabled/

# Vérifier la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

### 11. Configuration SSL (recommandé pour la production)

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir un certificat SSL
sudo certbot --nginx -d api.votre-domaine.com

# Suivre les instructions à l'écran pour terminer la configuration
```

## Vérification de l'installation

Accédez à `https://api.votre-domaine.com` dans votre navigateur. Vous devriez voir un message indiquant que le serveur est en ligne.

## Dépannage

### Problèmes de connexion à PostgreSQL

1. Vérifier que PostgreSQL est en cours d'exécution:
   ```bash
   sudo systemctl status postgresql
   ```

2. Vérifier les paramètres de connexion dans `.env`

3. Vérifier les logs PostgreSQL:
   ```bash
   sudo tail -f /var/log/postgresql/postgresql-12-main.log
   ```

### Problèmes avec le service

1. Vérifier les logs du service:
   ```bash
   sudo journalctl -u postgres-manager -f
   ```

2. Vérifier que les ports sont correctement configurés et non bloqués:
   ```bash
   sudo ss -tulpn | grep 3001
   ```

### Problèmes de réseau ou firewall

1. Vérifier que le port est ouvert sur le firewall:
   ```bash
   sudo ufw status
   # Si nécessaire, ouvrir le port
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

## Maintenance

### Mise à jour de l'application

```bash
# Accéder au répertoire de l'application
cd /chemin/vers/postgres-manager

# Récupérer les dernières modifications
git pull

# Mettre à jour les dépendances
npm ci

# Reconstruire l'application
npm run build

# Redémarrer le service
sudo systemctl restart postgres-manager
```

### Sauvegarde de la base de données

```bash
# Créer une sauvegarde
sudo -u postgres pg_dump postgres_manager > backup_$(date +%Y%m%d).sql

# Restaurer une sauvegarde
sudo -u postgres psql postgres_manager < backup_20230101.sql
```

### Surveillance des performances

L'API expose des métriques Prometheus à l'adresse `/metrics` qui peuvent être collectées par un serveur Prometheus pour surveiller les performances et l'état du système.
