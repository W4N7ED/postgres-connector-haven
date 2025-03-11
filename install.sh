
#!/bin/bash

# Script d'installation pour PostgreSQL Manager API
# Usage: sudo bash install.sh [--dev]

set -e

# Couleurs pour une meilleure lisibilité
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Vérifier les privilèges sudo
if [ "$EUID" -ne 0 ]; then
  error "Ce script doit être exécuté avec des privilèges sudo"
fi

# Récupérer le nom d'utilisateur réel (qui a exécuté sudo)
if [ -n "$SUDO_USER" ]; then
  REAL_USER=$SUDO_USER
else
  REAL_USER=$(whoami)
fi

REAL_USER_HOME=$(eval echo ~$REAL_USER)

# Vérifier si mode développement
DEV_MODE=false
if [ "$1" == "--dev" ]; then
  DEV_MODE=true
  log "Mode développement activé"
fi

# Définir le répertoire d'installation
if [ "$DEV_MODE" = true ]; then
  INSTALL_DIR="$PWD"
else
  INSTALL_DIR="/opt/postgres-manager"
fi

# 1. Mise à jour du système
log "Mise à jour du système..."
apt update && apt upgrade -y

# 2. Installation des dépendances
log "Installation des dépendances..."
apt install -y curl git build-essential nginx certbot python3-certbot-nginx

# 3. Installation de Node.js via NVM
log "Installation de Node.js via NVM..."
if [ ! -d "$REAL_USER_HOME/.nvm" ]; then
  su - $REAL_USER -c "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash"
  su - $REAL_USER -c "source $REAL_USER_HOME/.nvm/nvm.sh && nvm install 16 && nvm use 16 && nvm alias default 16"
else
  warn "NVM déjà installé, vérification de Node.js..."
  su - $REAL_USER -c "source $REAL_USER_HOME/.nvm/nvm.sh && nvm install 16 && nvm use 16 && nvm alias default 16"
fi

# Vérifier si Node.js est correctement installé
NODE_VERSION=$(su - $REAL_USER -c "source $REAL_USER_HOME/.nvm/nvm.sh && node -v")
if [[ ! $NODE_VERSION =~ ^v16 ]]; then
  error "Installation de Node.js v16 échouée. Version actuelle: $NODE_VERSION"
fi

log "Node.js $NODE_VERSION installé avec succès"

# 4. Installation de PostgreSQL
log "Installation de PostgreSQL..."
apt install -y postgresql postgresql-contrib

# 5. Création du répertoire d'installation
if [ "$DEV_MODE" = false ]; then
  log "Création du répertoire d'installation..."
  mkdir -p $INSTALL_DIR
  chown -R $REAL_USER:$REAL_USER $INSTALL_DIR

  # Cloner le repository (en mode production)
  log "Téléchargement du code source..."
  su - $REAL_USER -c "git clone https://github.com/votre-repo/postgres-manager.git $INSTALL_DIR"
fi

# 6. Installation des dépendances Node.js
log "Installation des dépendances Node.js..."
su - $REAL_USER -c "cd $INSTALL_DIR && source $REAL_USER_HOME/.nvm/nvm.sh && npm ci"

# 7. Configuration du fichier .env
if [ ! -f "$INSTALL_DIR/.env" ]; then
  log "Configuration du fichier .env..."
  cp $INSTALL_DIR/.env.example $INSTALL_DIR/.env
  
  # Génération d'un JWT_SECRET sécurisé
  JWT_SECRET=$(openssl rand -base64 32)
  ADMIN_PASSWORD=$(openssl rand -base64 12)
  
  # Remplacer les valeurs dans .env
  sed -i "s/your_jwt_secret_key_change_this_in_production/$JWT_SECRET/" $INSTALL_DIR/.env
  sed -i "s/admin123/$ADMIN_PASSWORD/" $INSTALL_DIR/.env
  
  # Configurer l'IP_WHITELIST
  SERVER_IP=$(hostname -I | awk '{print $1}')
  sed -i "s/IP_WHITELIST=127.0.0.1,::1,localhost/IP_WHITELIST=127.0.0.1,::1,localhost,$SERVER_IP/" $INSTALL_DIR/.env
  
  log "Fichier .env créé avec succès"
  log "Mot de passe admin généré: $ADMIN_PASSWORD"
  log "IMPORTANT: Notez ce mot de passe, il sera nécessaire pour la première connexion"
else
  warn "Le fichier .env existe déjà, utilisation du fichier existant"
fi

# 8. Construction de l'application
log "Construction de l'application..."
su - $REAL_USER -c "cd $INSTALL_DIR && source $REAL_USER_HOME/.nvm/nvm.sh && npm run build"

# 9. Création du service systemd
if [ "$DEV_MODE" = false ]; then
  log "Création du service systemd..."
  NODE_PATH=$(su - $REAL_USER -c "source $REAL_USER_HOME/.nvm/nvm.sh && which node")
  
  cat > /etc/systemd/system/postgres-manager.service << EOF
[Unit]
Description=PostgreSQL Manager API Service
After=network.target

[Service]
Type=simple
User=$REAL_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=$NODE_PATH dist/server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable postgres-manager
  systemctl start postgres-manager
  
  log "Service postgres-manager activé et démarré"
fi

# 10. Configuration de Nginx (optionnel en mode dev)
if [ "$DEV_MODE" = false ]; then
  log "Configuration de Nginx..."
  read -p "Voulez-vous configurer Nginx comme proxy inverse? (o/n) " SETUP_NGINX
  
  if [[ $SETUP_NGINX =~ ^[Oo]$ ]]; then
    read -p "Entrez le nom de domaine pour l'API (ex: api.mondomaine.com): " DOMAIN_NAME
    
    cat > /etc/nginx/sites-available/postgres-manager << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    ln -sf /etc/nginx/sites-available/postgres-manager /etc/nginx/sites-enabled/
    nginx -t && systemctl restart nginx
    
    log "Configuration Nginx terminée"
    
    # 11. Configuration SSL avec Certbot
    read -p "Voulez-vous configurer SSL avec Certbot? (o/n) " SETUP_SSL
    
    if [[ $SETUP_SSL =~ ^[Oo]$ ]]; then
      read -p "Entrez votre adresse e-mail pour Let's Encrypt: " EMAIL
      certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos -m $EMAIL
      log "Configuration SSL terminée"
    fi
  fi
fi

# 12. Affichage des informations finales
PORT=$(grep -oP 'PORT=\K[0-9]+' $INSTALL_DIR/.env)
IP_WHITELIST=$(grep -oP 'IP_WHITELIST=\K[^[:space:]]+' $INSTALL_DIR/.env)

echo ""
echo "======================= INSTALLATION TERMINÉE ========================"
echo ""
log "PostgreSQL Manager API installé avec succès!"
echo ""
echo "Informations importantes:"
echo "-------------------------"
echo "- Répertoire d'installation: $INSTALL_DIR"
echo "- Port API: $PORT"
echo "- Adresses IP autorisées: $IP_WHITELIST"
if [ "$DEV_MODE" = false ]; then
  echo "- Service systemd: postgres-manager"
  echo "- Logs: sudo journalctl -u postgres-manager -f"
fi
echo ""
echo "Pour accéder à l'interface d'administration:"
if [ "$DEV_MODE" = false ] && [[ $SETUP_NGINX =~ ^[Oo]$ ]]; then
  if [[ $SETUP_SSL =~ ^[Oo]$ ]]; then
    echo "- URL: https://$DOMAIN_NAME"
  else
    echo "- URL: http://$DOMAIN_NAME"
  fi
else
  echo "- URL: http://$(hostname -I | awk '{print $1}'):$PORT"
fi
echo "- Username: admin"
if [ ! -f "$INSTALL_DIR/.env.bak" ]; then
  echo "- Password: $ADMIN_PASSWORD"
else
  echo "- Password: Utilisez le mot de passe configuré dans le fichier .env"
fi
echo ""
echo "Pour modifier la configuration:"
echo "- Éditer le fichier $INSTALL_DIR/.env"
if [ "$DEV_MODE" = false ]; then
  echo "- Redémarrer le service: sudo systemctl restart postgres-manager"
fi
echo ""
echo "======================================================================="
