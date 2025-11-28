/**
 * Mock Media Data (Subtitle and Audio)
 */

import type { SubtitleTrack, AudioTrack } from '../schemas/media.schema';

export function generateMockSubtitleTrack(assetId: string): SubtitleTrack {
  const segments = generateMockSubtitleSegments(50);
  
  return {
    assetId,
    projectId: 'demo-001',
    language: 'EN',
    format: 'itt',
    segments,
    metadata: {
      totalSegments: segments.length,
      duration: 3600,
      averageCps: 18.5,
      averageCpl: 38,
      encoding: 'UTF-8',
    },
    qcSummary: {
      overallScore: 75,
      totalIssues: 12,
      errorCount: 2,
      warningCount: 8,
      infoCount: 2,
    },
    reviewQueue: [
      { segmentIndex: 5, priority: 'high', reason: 'CPS exceeds threshold' },
      { segmentIndex: 12, priority: 'medium', reason: 'Possible timing issue' },
    ],
    sceneCuts: [
      { time: 300, type: 'hard-cut' },
      { time: 850, type: 'fade' },
    ],
    knpGlossary: [
      { term: 'Geralt', type: 'Character', tc: '00:01:03:00', subId: 2, seconds: 63 },
      { term: 'Rivia', type: 'Location', tc: '00:01:08:12', subId: 7, seconds: 68.5 },
    ],
  };
}

export function generateMockAudioTrack(assetId: string): AudioTrack {
  return {
    assetId,
    projectId: 'demo-001',
    language: 'EN',
    codec: 'AAC 256kbps',
    waveform: {
      sampleRate: 24000,
      channels: 1,
      duration: 420,
      format: 'PCM16',
      visualData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
    },
    metadata: {
      bitrate: 256000,
      bitsPerSample: 16,
      fileSize: 10485760,
      encoding: 'AAC',
    },
    issues: [
      {
        id: 1,
        time: '00:01:02:12',
        timeSeconds: 62.5,
        type: 'Clipping',
        severity: 'high',
        description: 'Audio levels exceed 0dB, causing distortion in the dialogue.',
        suggestedFix: 'Apply limiter or reduce gain by 3-6dB in this section.',
      },
      {
        id: 2,
        time: '00:02:11:04',
        timeSeconds: 131.17,
        type: 'Silence Gap',
        severity: 'medium',
        description: 'Unexpected silence detected for 1.2 seconds during dialogue.',
        suggestedFix: 'Check source material and fill gap with room tone if needed.',
      },
    ],
    qcSummary: {
      overallScore: 88,
      totalIssues: 4,
      clippingCount: 1,
      silenceGapCount: 1,
      timingIssueCount: 2,
    },
    segments: [
      { startTime: 0, endTime: 5.2, type: 'dialogue', confidence: 0.95 },
      { startTime: 5.2, endTime: 7.8, type: 'silence', confidence: 0.99 },
    ],
  };
}

function generateMockSubtitleSegments(count: number) {
  const segments = [];
  
  for (let i = 0; i < count; i++) {
    const startTime = i * 5 + 60;
    const duration = 2 + Math.random() * 3;
    const text = `Mock subtitle text for segment ${i + 1}. This is a longer piece of dialogue.`;
    
    segments.push({
      index: i + 1,
      startTime,
      endTime: startTime + duration,
      duration,
      sourceText: text,
      text,
      cps: text.length / duration,
      cpl: Math.max(...text.split('\n').map(l => l.length)),
      lineCount: 1,
      contextType: 'DIALOGUE' as const,
      issues: Math.random() > 0.7 ? [{
        id: `iss_${i}_1`,
        ruleName: 'Reading Speed',
        severity: 'warning' as const,
        type: 'technical' as const,
        description: 'CPS slightly elevated',
        scoreHit: -5,
      }] : [],
      qualityScore: 70 + Math.random() * 30,
    });
  }
  
  return segments;
}
