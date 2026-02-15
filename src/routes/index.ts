import { Router } from 'express';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Vercel Cron — event lifecycle (runs every 5 min)
// Vercel sets this header to prevent external callers from triggering it
router.get('/cron/event-lifecycle', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // TODO (Phase 7): Check for ended events → send notifications
  // TODO (Phase 7): Check for destroyed events → archive/cleanup
  res.json({ status: 'ok', message: 'Event lifecycle check complete' });
});

// Sub-routers will be mounted here in later phases:
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/events', eventRoutes);
// router.use('/poke', pokeRoutes);

export default router;
