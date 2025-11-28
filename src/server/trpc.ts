/**
 * TRPC Base Configuration
 */

import { initTRPC } from '@trpc/server';
import { z } from 'zod';

/**
 * Initialize TRPC
 */
const t = initTRPC.create();

/**
 * Export router and procedure builders
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

/**
 * Context type (extend as needed for auth, etc.)
 */
export type Context = {
  // Add your context properties here
  // userId?: string;
  // session?: Session;
};

/**
 * Create context function
 */
export const createContext = async (): Promise<Context> => {
  return {
    // Initialize context here
  };
};
