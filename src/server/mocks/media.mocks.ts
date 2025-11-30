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
      duration: 420,
      language: 'EN-US',
      codec: 'AAC 256kbps',
    },
    issues: [
      // Beginning issues
      {
        id: 1,
        timecode: '00:00:05:12',
        timeSeconds: 5.5,
        type: 'Clipping',
        severity: 'error',
        description: 'Audio levels exceed 0dB, causing distortion in the dialogue.',
        suggestedFix: 'Apply limiter or reduce gain by 3-6dB in this section.',
      },
      {
        id: 2,
        timecode: '00:00:06:18',
        timeSeconds: 6.75,
        type: 'Repetition',
        severity: 'info',
        description: 'Word "vast" repeated twice, may be unintentional stutter.',
        suggestedFix: 'Review script and remove duplicate if not intended.',
      },
      
      // Middle section issues (3-4 minutes in)
      {
        id: 3,
        timecode: '00:03:46:12',
        timeSeconds: 226.5,
        type: 'Sync Drift',
        severity: 'error',
        description: 'Audio sync drifts +180ms from video reference, lip sync is off.',
        suggestedFix: 'Re-align audio track or apply time-stretch correction.',
      },
      {
        id: 4,
        timecode: '00:03:48:00',
        timeSeconds: 228.0,
        type: 'Early Entry',
        severity: 'warning',
        description: 'Dialogue starts 120ms before visual cue, breaking immersion.',
        suggestedFix: 'Shift audio segment forward by 120ms.',
      },
      {
        id: 5,
        timecode: '00:04:13:06',
        timeSeconds: 253.25,
        type: 'Tone Mismatch',
        severity: 'warning',
        description: 'Emotional tone is flat compared to source performance.',
        suggestedFix: 'Request re-performance with direction notes.',
      },
      {
        id: 6,
        timecode: '00:04:15:12',
        timeSeconds: 255.5,
        type: 'RMS Low',
        severity: 'warning',
        description: 'Average RMS level is -32dB, significantly below target of -23dB LUFS.',
        suggestedFix: 'Normalize audio or apply gain to meet broadcast standards.',
      },
      
      // Later section issues (6+ minutes)
      {
        id: 7,
        timecode: '00:06:16:00',
        timeSeconds: 376.0,
        type: 'Missing Words',
        severity: 'error',
        description: 'Expected phrase "decide the" is missing from dubbed audio.',
        suggestedFix: 'Re-record missing portion or ADR this line.',
      },
      {
        id: 8,
        timecode: '00:06:17:18',
        timeSeconds: 377.75,
        type: 'Noise Floor High',
        severity: 'warning',
        description: 'Background noise floor exceeds -60dB, audible hiss detected.',
        suggestedFix: 'Apply noise reduction filter to reduce ambient noise.',
      },
      {
        id: 9,
        timecode: '00:06:51:06',
        timeSeconds: 411.25,
        type: 'Speaker Mismatch',
        severity: 'warning',
        description: 'Voice characteristics differ from established character voice.',
        suggestedFix: 'Verify correct voice actor or apply EQ matching.',
      },
      {
        id: 10,
        timecode: '00:06:52:12',
        timeSeconds: 412.5,
        type: 'Synthetic Artifacts',
        severity: 'info',
        description: 'Slight robotic quality detected in prosody pattern.',
        suggestedFix: 'If TTS was used, consider human re-recording for this line.',
      },
    ],
    qcSummary: {
      overallScore: 82,
      totalIssues: 10,
      clippingCount: 1,
      silenceGapCount: 0,
      timingIssueCount: 3,
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
