/**
 * Demo Project Loader
 * Loads real media files from /public/demo-project/
 */

import { loadITTFile, ParsedSubtitle } from './ittParser';

export interface DemoProject {
  id: string;
  name: string;
  source: 'demo' | 'mock';
  metadata: {
    title: string;
    client: string;
    sourceLanguage: string;
    targetLanguages: string[];
  };
}

export interface DemoAsset {
  id: string;
  name: string;
  type: 'master' | 'audio' | 'subtitle' | 'metadata';
  language?: string;
  path: string;
  status: string;
}

/**
 * Load demo project metadata
 */
export async function loadDemoProjectMetadata(): Promise<any> {
  try {
    const response = await fetch('/demo-project/metadata.json');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error loading demo project metadata:', error);
    return null;
  }
}

/**
 * Load demo project asset map
 */
export async function loadDemoAssetMap(): Promise<DemoAsset[]> {
  try {
    const response = await fetch('/demo-project/assetmap.json');
    if (!response.ok) return [];
    const data = await response.json();
    return data.assets || [];
  } catch (error) {
    console.error('Error loading demo asset map:', error);
    return [];
  }
}

/**
 * Load subtitle file by asset ID
 */
export async function loadDemoSubtitles(assetId: string): Promise<ParsedSubtitle[]> {
  const assetMap = await loadDemoAssetMap();
  const asset = assetMap.find(a => a.id === assetId);
  
  if (!asset || asset.type !== 'subtitle') {
    console.warn(`Asset ${assetId} not found or not a subtitle`);
    return [];
  }
  
  return loadITTFile(asset.path);
}

/**
 * Get video URL for demo project
 */
export function getDemoVideoUrl(): string {
  // Using public domain Big Buck Bunny for now
  // Replace with /demo-project/master.mp4 when you upload real video
  return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
}

/**
 * Get audio URL for asset
 */
export function getDemoAudioUrl(assetId: string): string | null {
  // Will be implemented when audio files are added
  // For now return null to use mock audio
  return null;
}

/**
 * Check if asset is from demo project
 */
export function isDemoAsset(assetId: string): boolean {
  return assetId.startsWith('subtitle-') || 
         assetId.startsWith('audio-') || 
         assetId === 'master-video';
}
