
#!/usr/bin/env node

/**
 * Script de démarrage du serveur pour le développement
 */
const path = require('path');
const dotenv = require('dotenv');

// Charge les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Import du serveur
try {
  // Tentative d'importer directement
  const server = require('../server').default;
  console.log('Server loaded successfully');
} catch (error) {
  console.error('Failed to load server:', error);
  process.exit(1);
}

// Le serveur est démarré dans le module server.ts
