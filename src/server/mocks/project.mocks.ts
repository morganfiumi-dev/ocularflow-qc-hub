/**
 * Mock Project Data
 */

import type { Project } from '../schemas/project.schema';

export function mockDemoProject(): Project {
  return {
    id: 'demo-001',
    name: 'Demo Project - The Witcher S03E08',
    type: 'demo-fixture',
    status: 'in-progress',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    metadata: {
      originalLanguage: 'EN',
      releaseDate: '2024-12-15',
      duration: 3600, // 1 hour
      videoFormat: 'mp4',
      aspectRatio: '16:9',
      fps: 24,
      description: 'Demo project for testing MediaQC features',
    },
    storage: {
      masterVideo: '/demo-project/master.mp4',
      audioTracks: {
        'en': '/demo-project/audio-source.wav',
        'de': '/demo-project/audio-de.wav',
      },
      subtitleFiles: {
        'en': '/demo-project/subtitles-en.itt',
        'es': '/demo-project/subtitles-es.itt',
        'de': '/demo-project/subtitles-de.itt',
      },
      metadataFiles: {
        sceneCuts: '/demo-project/scene-cuts.json',
        knpList: '/demo-project/knp.json',
        forcedNarrative: '/demo-project/fn-events.json',
      },
    },
  };
}

export function generateMockProjects(count: number): Project[] {
  const projects: Project[] = [];
  
  for (let i = 0; i < count; i++) {
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
