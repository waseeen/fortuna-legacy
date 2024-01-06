import dotenv from 'dotenv';
dotenv.config();

import './connection';
import './client';
import { sendErrorLog } from './utils/sendErrorLog';
import { register } from 'trace-unhandled';
import { logger } from 'trace-unhandled/dist/lib/core';
register();

process.on('unhandledRejection', (reason: Error, promise: Promise<unknown>) => {
  logger(reason, promise, process.pid);
  console.log(
    `Caught unhandled rejection: ${reason}\n\n${reason.name}\n\n${reason.message}\n\n${reason.stack}\n` +
      'Rejected promise:',
  );
  console.log(promise);

  sendErrorLog(reason.name, reason.message, promise);
});
process.on('uncaughtException', (err, origin) => {
  console.log(
    `Caught exception: ${err}\n\n${err.name}\n\n${err.message}\n\n${err.stack}\n` +
      `Exception origin: ${origin}`,
  );
  sendErrorLog(err.name, err.message, err);
});
