import { setupWorker } from 'msw/browser';
import { salesHandlers } from './salesHandlers';
import { clientHandlers } from './clientHandlers';

export const worker = setupWorker(...clientHandlers, ...salesHandlers);
