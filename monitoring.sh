
#!/bin/bash

# Script de surveillance pour PostgreSQL Manager API
# Usage: bash monitoring.sh [--email your@email.com]

# Variables
API_URL="http://localhost:3001"
LOG_FILE="/var/log/postgres-manager-monitoring.log"
SERVICE_NAME="postgres-manager"
EMAIL_RECIPIENT=""

# Traitement des arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --email) EMAIL_RECIPIENT="$2"; shift ;;
    *) echo "Option inconnue: $1"; exit 1 ;;
  esac
  shift
done

# Fonction pour journaliser
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Fonction pour envoyer un email (si configuré)
send_email() {
  if [ -n "$EMAIL_RECIPIENT" ]; then
    echo -e "Subject: [ALERTE] PostgreSQL Manager API - $1\n\n$2" | sendmail "$EMAIL_RECIPIENT"
    log "Email envoyé à $EMAIL_RECIPIENT: $1"
  fi
}

# Vérification du service systemd
check_service() {
  if ! systemctl is-active --quiet "$SERVICE_NAME"; then
    log "ALERTE: Le service $SERVICE_NAME n'est pas en cours d'exécution"
    send_email "Service inactif" "Le service PostgreSQL Manager API n'est pas en cours d'exécution."
    
    # Tentative de redémarrage
    log "Tentative de redémarrage du service..."
    sudo systemctl restart "$SERVICE_NAME"
    
    # Vérification après redémarrage
    sleep 5
    if systemctl is-active --quiet "$SERVICE_NAME"; then
      log "Service redémarré avec succès"
      send_email "Service redémarré" "Le service PostgreSQL Manager API a été redémarré avec succès."
    else
      log "ERREUR: Échec du redémarrage du service"
      send_email "Échec du redémarrage" "Échec du redémarrage du service PostgreSQL Manager API. Une intervention manuelle est requise."
    fi
  else
    log "Service $SERVICE_NAME en cours d'exécution"
  fi
}

# Vérification de l'API
check_api() {
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")
  
  if [ "$RESPONSE" == "200" ]; then
    log "API accessible (code HTTP: $RESPONSE)"
  else
    log "ALERTE: API inaccessible (code HTTP: $RESPONSE)"
    send_email "API inaccessible" "L'API PostgreSQL Manager n'est pas accessible. Code HTTP: $RESPONSE"
  fi
}

# Vérification de l'utilisation du disque
check_disk() {
  DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
  
  if [ "$DISK_USAGE" -gt 90 ]; then
    log "ALERTE: Espace disque critique: $DISK_USAGE%"
    send_email "Espace disque critique" "L'espace disque est critique ($DISK_USAGE%). Une intervention est nécessaire."
  elif [ "$DISK_USAGE" -gt 80 ]; then
    log "AVERTISSEMENT: Espace disque élevé: $DISK_USAGE%"
    send_email "Espace disque faible" "L'espace disque est faible ($DISK_USAGE%). Veuillez vérifier le serveur."
  else
    log "Espace disque normal: $DISK_USAGE%"
  fi
}

# Vérification de l'utilisation de la mémoire
check_memory() {
  MEM_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
  
  if [ "$MEM_USAGE" -gt 90 ]; then
    log "ALERTE: Utilisation mémoire critique: $MEM_USAGE%"
    send_email "Mémoire critique" "L'utilisation de la mémoire est critique ($MEM_USAGE%). Une intervention est nécessaire."
  elif [ "$MEM_USAGE" -gt 80 ]; then
    log "AVERTISSEMENT: Utilisation mémoire élevée: $MEM_USAGE%"
    send_email "Mémoire faible" "L'utilisation de la mémoire est élevée ($MEM_USAGE%). Veuillez vérifier le serveur."
  else
    log "Utilisation mémoire normale: $MEM_USAGE%"
  fi
}

# Vérification des logs d'erreur
check_error_logs() {
  # Vérifier les logs systemd pour les erreurs
  ERROR_COUNT=$(journalctl -u "$SERVICE_NAME" --since "1 hour ago" | grep -i "error\|exception\|fail" | wc -l)
  
  if [ "$ERROR_COUNT" -gt 10 ]; then
    log "ALERTE: Nombre élevé d'erreurs dans les logs: $ERROR_COUNT"
    ERROR_SAMPLE=$(journalctl -u "$SERVICE_NAME" --since "1 hour ago" | grep -i "error\|exception\|fail" | head -n 5)
    send_email "Erreurs dans les logs" "Nombre élevé d'erreurs dans les logs ($ERROR_COUNT). Échantillon:\n\n$ERROR_SAMPLE"
  elif [ "$ERROR_COUNT" -gt 0 ]; then
    log "AVERTISSEMENT: Erreurs détectées dans les logs: $ERROR_COUNT"
  else
    log "Aucune erreur détectée dans les logs"
  fi
}

# Exécution des vérifications
mkdir -p "$(dirname "$LOG_FILE")"
log "==== Début de la surveillance ===="
check_service
check_api
check_disk
check_memory
check_error_logs
log "==== Fin de la surveillance ===="

# Instructions pour configurer une tâche cron:
# Exécutez 'crontab -e' et ajoutez cette ligne pour une vérification toutes les 15 minutes:
# */15 * * * * /chemin/vers/monitoring.sh --email your@email.com
