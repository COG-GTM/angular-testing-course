import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/** MSW server (Angular `HttpTestingController` equivalent). Started in setupTests.ts. */
export const server = setupServer(...handlers);
