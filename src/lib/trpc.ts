/**
 * tRPC Client Configuration
 * Frontend client for MediaQC tRPC backend
 */

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: import.meta.env.VITE_API_URL || 'http://localhost:3000/trpc',
      }),
    ],
  });
}
