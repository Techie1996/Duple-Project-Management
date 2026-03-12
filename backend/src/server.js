import http from 'http';
import app from './app.js';
import env from './config/env.js';
import { connectDB } from './config/db.js';

const server = http.createServer(app);

const start = async () => {
  await connectDB();

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
  });
};

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});

