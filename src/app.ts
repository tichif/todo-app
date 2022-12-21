import { config } from './utils/config';
import { createServer } from './utils/createServer';
import { connectToDB, disconnectToDB } from './utils/db';
import { logger } from './utils/logger';

const signals = ['SIGINT', 'SIGTERM', 'SIGHUP'] as const;

async function gracefulShutDown({
  signal,
  server,
}: {
  signal: typeof signals[number];
  server: Awaited<ReturnType<typeof createServer>>;
}) {
  logger.info(`Got signal: ${signal}. Good Bye.`);
  await server.close();

  await disconnectToDB();
  process.exit(0);
}

async function startServer() {
  const server = await createServer();

  server.listen({
    port: config.PORT,
    host: config.HOST,
  });

  await connectToDB();

  logger.info('App is listening');

  for (let i = 0; i < signals.length; i++) {
    process.on(signals[i], () => {
      gracefulShutDown({ signal: signals[i], server });
    });
  }
}

startServer();
