/**
 * Mock Asset Data
 */

import type { Asset, AssetTree, AssetTreeNode } from '../schemas/asset.schema';

export function generateMockAssetTree(projectId: string): AssetTree {
  // Master video asset
  const masterAsset: Asset = {
    id: 'master-vid',
    projectId,
    name: 'Master Video',
    type: 'master',
    status: 'ready',
    language: undefined,
    parentAssetId: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      codec: 'H.264',
      format: 'mp4',
      duration: 3600,
      fileSize: 5368709120, // 5GB
    },
    storagePath: '/demo-project/master.mp4',
  };

  // Audio tracks
  const audioAssets: Asset[] = [
    {
      id: 'en-dub',
      projectId,
      name: 'English Dub',
      type: 'audio',
      status: 'ready',
      language: 'EN',
      parentAssetId: masterAsset.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        codec: 'AAC',
        bitrate: 256000,
        sampleRate: 48000,
        channels: 2,
        duration: 3600,
      },
      storagePath: '/demo-project/audio-source.wav',
      qc: {
        score: 92,
        issueCount: 2,
        lastQcDate: new Date(),
        assignee: 'System',
      },
    },
    {
      id: 'de-dub',
      projectId,
      name: 'German Dub',
      type: 'audio',
      status: 'ready',
      language: 'DE',
      parentAssetId: masterAsset.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        codec: 'AAC',
        bitrate: 256000,
        sampleRate: 48000,
        channels: 2,
        duration: 3600,
      },
      storagePath: '/demo-project/audio-de.wav',
      qc: {
        score: 88,
        issueCount: 4,
        lastQcDate: new Date(),
      },
    },
  ];

  // Subtitle tracks
  const subtitleAssets: Asset[] = [
    {
      id: 'en-sub',
      projectId,
      name: 'EN Subtitles',
      type: 'subtitle',
      status: 'qc-required',
      language: 'EN',
      parentAssetId: masterAsset.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        format: 'itt',
        version: 'v2.3',
      },
      storagePath: '/demo-project/subtitles-en.itt',
      qc: {
        score: 75,
        issueCount: 12,
        lastQcDate: new Date(),
      },
    },
    {
      id: 'es-sub',
      projectId,
      name: 'ES Subtitles',
      type: 'subtitle',
      status: 'qc-required',
      language: 'ES',
      parentAssetId: masterAsset.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        format: 'itt',
        version: 'v1.8',
      },
      storagePath: '/demo-project/subtitles-es.itt',
      qc: {
        score: 68,
        issueCount: 18,
        lastQcDate: new Date(),
      },
    },
  ];

  // Metadata assets
  const metadataAssets: Asset[] = [
    {
      id: 'metadata-fn',
      projectId,
      name: 'Forced Narrative',
      type: 'metadata',
      status: 'ready',
      language: undefined,
      parentAssetId: masterAsset.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        format: 'json',
      },
      storagePath: '/demo-project/fn-events.json',
    },
  ];

  const flatList = [masterAsset, ...audioAssets, ...subtitleAssets, ...metadataAssets];

  const root: AssetTreeNode = {
    asset: masterAsset,
    children: [
      ...audioAssets.map(a => ({ asset: a, children: undefined })),
      ...subtitleAssets.map(a => ({ asset: a, children: undefined })),
      ...metadataAssets.map(a => ({ asset: a, children: undefined })),
    ],
  };

  return {
    projectId,
    root,
    flatList,
  };
}
