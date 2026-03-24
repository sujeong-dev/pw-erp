import { setupWorker } from 'msw/browser';
import { salesHandlers } from './salesHandlers';
import { clientHandlers } from './clientHandlers';
import { paymentHandlers } from './paymentsHandlers';
import { ledgerHandlers } from './ledgerHandlers';

export const worker = setupWorker(...clientHandlers, ...salesHandlers, ...paymentHandlers, ...ledgerHandlers);
