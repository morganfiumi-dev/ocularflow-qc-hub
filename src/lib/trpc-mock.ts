/**
 * Mock tRPC Client - Runs in browser without backend
 */

import { createTRPCReact } from '@trpc/react-query';
import { observable } from '@trpc/server/observable';
import type { AppRouter } from '../server/routers/_app';
import { generateMockSubtitleTrack, generateMockAudioTrack } from '../server/mocks/media.mocks';
import { mockDemoProject, realDemoProject, generateMockProjects } from '../server/mocks/project.mocks';
import { generateMockAssetTree } from '../server/mocks/asset.mocks';
import { loadDemoAssetMap, loadDemoSubtitles, isDemoAsset } from '../utils/demoProjectLoader';

export const trpc = createTRPCReact<AppRouter>();

// Mock implementation that returns data immediately
export function createMockTRPCClient() {
  return trpc.createClient({
    links: [
      () => {
        return ({ op }) => {
          return observable((observer) => {
            // Simulate network delay
            setTimeout(async () => {
              const { path, input } = op;
              
              // Route to appropriate mock
              let result: any;
              
              if (path === 'media.getSubtitleTrack') {
                const assetId = (input as any)?.assetId || 'demo';
                // Check if it's a real demo asset
                if (isDemoAsset(assetId)) {
                  const subtitles = await loadDemoSubtitles(assetId);
                  result = {
                    assetId,
                    segments: subtitles,
                    qcData: {
                      overallScore: 85,
                      issues: subtitles.flatMap(s => s.issues),
                    },
                  };
                } else {
                  result = generateMockSubtitleTrack(assetId);
                }
              } else if (path === 'media.getAudioTrack') {
                result = generateMockAudioTrack((input as any)?.assetId || 'demo');
              } else if (path === 'projects.get') {
                const projectId = (input as any)?.id || 'demo-default';
                result = projectId === 'demo-default' ? realDemoProject() : mockDemoProject();
              } else if (path === 'projects.list') {
                const mockProjects = generateMockProjects(10);
                result = {
                  projects: mockProjects,
                  total: mockProjects.length,
                };
              } else if (path === 'assets.getTree') {
                const projectId = (input as any)?.projectId || 'demo-default';
                // Check if it's the real demo project
                if (projectId === 'demo-default') {
                  const assets = await loadDemoAssetMap();
                  result = {
                    projectId,
                    tree: null,
                    flatList: assets,
                  };
                } else {
                  result = generateMockAssetTree(projectId);
                }
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
