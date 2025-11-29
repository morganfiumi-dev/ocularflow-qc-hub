/**
 * Mock Project Data
 */

import type { Project } from '../schemas/project.schema';

/**
 * Mock demo project (uses generated data)
 */
export function mockDemoProject(): Project {
  return {
    id: 'demo-mock',
    name: '[MOCK] Sample QC Project',
    type: 'demo-fixture',
    status: 'in-progress',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date(),
    metadata: {
      originalLanguage: 'EN',
      duration: 3600,
      description: 'Mock demo project with generated data',
    },
  };
}

/**
 * Real demo project (uses real files from /public/demo-project/)
 */
export function realDemoProject(): Project {
  return {
    id: 'demo-default',
    name: 'The Witcher S3E01',
    type: 'demo-fixture',
    status: 'in-progress',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    metadata: {
      originalLanguage: 'EN',
      releaseDate: '2024-12-15',
      duration: 3600,
      videoFormat: 'mp4',
      aspectRatio: '16:9',
      fps: 24,
      description: 'Real demo project with actual media files',
    },
    storage: {
      masterVideo: '/demo-project/master.mp4',
      audioTracks: {
        'en': '/demo-project/audio-en.wav',
        'de': '/demo-project/audio-de.wav',
      },
      subtitleFiles: {
        'en': '/demo-project/subtitles-en.itt',
        'es': '/demo-project/subtitles-es.itt',
      },
      metadataFiles: {
        sceneCuts: '/demo-project/scene-cuts.json',
        knpList: '/demo-project/knp.json',
        forcedNarrative: '/demo-project/fn-events.json',
      },
    },
  };
}

/**
 * Generate array of mock projects (includes both demo types)
 */
export function generateMockProjects(count: number): Project[] {
  const projects: Project[] = [
    // Real demo project (loads from /public/demo-project/)
    realDemoProject(),
    // Mock demo project (generated data)
    mockDemoProject(),
  ];
  
  for (let i = 0; i < count - 2; i++) {
    projects.push({
      id: crypto.randomUUID(),
      name: `Project ${i + 1}`,
      type: 'user-uploaded',
      status: ['draft', 'in-progress', 'review', 'completed'][Math.floor(Math.random() * 4)] as any,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      metadata: {
        originalLanguage: 'EN',
        duration: 2400 + Math.random() * 3600,
        description: `Mock project ${i + 1}`,
      },
    });
  }
  
  return projects;
}
