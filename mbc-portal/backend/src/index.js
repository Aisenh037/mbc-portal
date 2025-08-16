// index.js
import app from './app.js';
import { connectToDatabase } from './config/db.js';
import { env } from './config/env.js';

const port = Number(env.PORT);

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}).catch((err) => {
  console.error('Failed to connect to DB:', err);
  process.exit(1);
});
