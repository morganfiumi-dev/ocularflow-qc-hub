/**
 * Mock tRPC Client - Runs in browser without backend
 */

import { createTRPCReact } from '@trpc/react-query';
import { observable } from '@trpc/server/observable';
import type { AppRouter } from '../server/routers/_app';
import { generateMockSubtitleTrack, generateMockAudioTrack } from '../server/mocks/media.mocks';
import { mockDemoProject, generateMockProjects } from '../server/mocks/project.mocks';
import { generateMockAssetTree } from '../server/mocks/asset.mocks';

export const trpc = createTRPCReact<AppRouter>();

// Mock implementation that returns data immediately
export function createMockTRPCClient() {
  return trpc.createClient({
    links: [
      () => {
        return ({ op }) => {
          return observable((observer) => {
            // Simulate network delay
            setTimeout(() => {
              const { path, input } = op;
              
              // Route to appropriate mock
              let result: any;
              
              if (path === 'media.getSubtitleTrack') {
                result = generateMockSubtitleTrack((input as any)?.assetId || 'demo');
              } else if (path === 'media.getAudioTrack') {
                result = generateMockAudioTrack((input as any)?.assetId || 'demo');
              } else if (path === 'projects.get') {
                result = mockDemoProject();
              } else if (path === 'projects.list') {
                const mockProjects = generateMockProjects(10);
                result = {
                  projects: mockProjects,
                  total: mockProjects.length,
                };
              } else if (path === 'assets.getTree') {
                result = generateMockAssetTree((input as any)?.projectId || 'demo');
              } else {
                result = null;
              }
              
              observer.next({
                result: {
                  data: result,
                },
              });
              observer.complete();
            }, 300); // 300ms delay to simulate network
          });
        };
      },
    ],
  });
}
