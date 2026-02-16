import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`Afterparty server running on port ${env.PORT} [${env.NODE_ENV}]`);
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down...');
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
