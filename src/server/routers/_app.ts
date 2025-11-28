/**
 * Main TRPC App Router
 * Combines all sub-routers
 */

import { router } from '../trpc';
import { projectsRouter } from './projects.router';
import { assetsRouter } from './assets.router';
import { mediaRouter } from './media.router';
import { qcRouter } from './qc.router';

export const appRouter = router({
  projects: projectsRouter,
  assets: assetsRouter,
  media: mediaRouter,
  qc: qcRouter,
});

export type AppRouter = typeof appRouter;
