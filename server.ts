import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  askNexusCoach,
  getNextBestAction,
  generateJourneyPlan,
  generateDriftRecovery
} from './server/gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Coach Chat
  app.post('/api/coach/chat', async (req, res) => {
    try {
      const response = await askNexusCoach(req.body);
      res.json(response);
    } catch (err: any) {
      console.error('API /api/coach/chat error:', err);
      res.status(500).json({ error: 'Failed to process AI chat', message: err?.message });
    }
  });

  // What Should I Do Now Engine
  app.post('/api/coach/what-next', async (req, res) => {
    try {
      const result = await getNextBestAction(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('API /api/coach/what-next error:', err);
      res.status(500).json({ error: 'Failed to generate next action', message: err?.message });
    }
  });

  // Journey & Plan Generation
  app.post('/api/coach/generate-plan', async (req, res) => {
    try {
      const result = await generateJourneyPlan(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('API /api/coach/generate-plan error:', err);
      res.status(500).json({ error: 'Failed to generate journey plan', message: err?.message });
    }
  });

  // Drift Recovery Engine
  app.post('/api/coach/drift-recovery', async (req, res) => {
    try {
      const result = await generateDriftRecovery(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('API /api/coach/drift-recovery error:', err);
      res.status(500).json({ error: 'Failed to generate recovery plan', message: err?.message });
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXUS] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[NEXUS] Failed to start server:', err);
});
