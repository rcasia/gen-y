const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const STATE_DIR = process.env.STATE_DIR || '/app/state';
const LOCK_DIR = path.join(STATE_DIR, '.locks');

// Middleware
app.use(bodyParser.raw({ type: '*/*', limit: '50mb' }));

// Asegurar que los directorios existen
async function ensureDirectories() {
  try {
    await fs.mkdir(STATE_DIR, { recursive: true });
    await fs.mkdir(LOCK_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creando directorios:', error);
  }
}

// Inicializar directorios al arrancar
ensureDirectories();

// Función para obtener la ruta del archivo de estado
function getStatePath(key) {
  // Sanitizar la key para evitar path traversal
  const safeKey = key.replace(/\.\./g, '').replace(/^\//, '');
  return path.join(STATE_DIR, safeKey);
}

// Función para obtener la ruta del lock
function getLockPath(key) {
  const safeKey = key.replace(/\.\./g, '').replace(/^\//, '');
  return path.join(LOCK_DIR, `${safeKey}.lock`);
}

// GET /<key> - Obtener estado
app.get('/*', async (req, res) => {
  try {
    const key = req.path.substring(1); // Remover el leading slash
    const statePath = getStatePath(key);
    
    try {
      const data = await fs.readFile(statePath);
      res.set('Content-Type', 'application/json');
      res.status(200).send(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({ error: 'State not found' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error leyendo estado:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /<key> - Guardar estado
app.post('/*', async (req, res) => {
  try {
    const key = req.path.substring(1);
    const statePath = getStatePath(key);
    
    // Crear directorio si no existe
    const dir = path.dirname(statePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Escribir estado
    await fs.writeFile(statePath, req.body);
    
    res.status(200).json({ message: 'State saved successfully' });
  } catch (error) {
    console.error('Error guardando estado:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LOCK /<key>/lock - Bloquear estado
app.post('/*/lock', async (req, res) => {
  try {
    const key = req.path.replace(/\/lock$/, '').substring(1);
    const lockPath = getLockPath(key);
    
    try {
      // Intentar crear el lock
      const lockId = crypto.randomBytes(16).toString('hex');
      const lockData = {
        ID: lockId,
        Operation: 'OperationTypeDefault',
        Info: '',
        Who: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown',
        Version: '1.0.0',
        Created: new Date().toISOString(),
        Path: key
      };
      
      await fs.writeFile(lockPath, JSON.stringify(lockData, null, 2), { flag: 'wx' });
      
      res.status(200).json(lockData);
    } catch (error) {
      if (error.code === 'EEXIST') {
        // Lock ya existe, leerlo y retornarlo
        const existingLock = await fs.readFile(lockPath, 'utf8');
        res.status(423).json(JSON.parse(existingLock));
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error creando lock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UNLOCK /<key>/lock - Desbloquear estado
app.delete('/*/lock', async (req, res) => {
  try {
    const key = req.path.replace(/\/lock$/, '').substring(1);
    const lockPath = getLockPath(key);
    
    try {
      await fs.unlink(lockPath);
      res.status(200).json({ message: 'Lock released' });
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({ error: 'Lock not found' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error eliminando lock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Terraform Backend HTTP server running on port ${PORT}`);
  console.log(`State directory: ${STATE_DIR}`);
});
