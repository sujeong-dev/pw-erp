import { setupWorker } from 'msw/browser';
import { salesHandlers } from './salesHandlers';
import { clientHandlers } from './clientHandlers';
import { paymentHandlers } from './paymentsHandlers';

export const worker = setupWorker(...clientHandlers, ...salesHandlers, ...paymentHandlers);
