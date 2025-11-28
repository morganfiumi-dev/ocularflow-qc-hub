/**
 * Simple tRPC Client (no React Query)
 * Using vanilla client to avoid React instance conflicts
 */

import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/routers/_app';

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL || 'http://localhost:3000/trpc',
    }),
  ],
});
