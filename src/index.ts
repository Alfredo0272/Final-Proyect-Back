import { createServer } from 'http';
import { app } from './app.js';
import createDebug from 'debug';
import { dbConnect } from './services/db.conect.js';

const debug = createDebug('W9Final:index');
const PORT = process.env.PORT || 1969;
const server = createServer(app);
debug('Starting server');

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    if (!mongoose.connection.db) {
      throw new Error('Database not initialized');
    }

    debug('Connected to DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit('error', error));

server.on('listening', () => {
  debug('Listening on port', PORT);
});

server.on('error', (error) => {
  debug(`Error ${error.message}`);
});
