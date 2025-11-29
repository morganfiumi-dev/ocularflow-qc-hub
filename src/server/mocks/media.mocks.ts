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
        timecode: '00:00:09:06',
        timeSeconds: 9.25,
        type: 'RMS Low',
        severity: 'warning',
        description: 'Average RMS level is -32dB, significantly below target of -23dB LUFS.',
        suggestedFix: 'Normalize audio or apply gain to meet broadcast standards.',
      },
      {
        id: 3,
        timecode: '00:00:15:00',
        timeSeconds: 15.0,
        type: 'Noise Floor High',
        severity: 'warning',
        description: 'Background noise floor exceeds -60dB, audible hiss detected.',
        suggestedFix: 'Apply noise reduction filter to reduce ambient noise.',
      },
      // Timing & Sync Issues
      {
        id: 4,
        timecode: '00:00:10:18',
        timeSeconds: 10.75,
        type: 'Sync Drift',
        severity: 'error',
        description: 'Audio sync drifts +180ms from video reference, lip sync is off.',
        suggestedFix: 'Re-align audio track or apply time-stretch correction.',
      },
      {
        id: 5,
        timecode: '00:00:14:12',
        timeSeconds: 14.5,
        type: 'Early Entry',
        severity: 'warning',
        description: 'Dialogue starts 120ms before visual cue, breaking immersion.',
        suggestedFix: 'Shift audio segment forward by 120ms.',
      },
      // Dialogue Integrity Issues
      {
        id: 6,
        timecode: '00:00:19:00',
        timeSeconds: 19.0,
        type: 'Missing Words',
        severity: 'error',
        description: 'Expected phrase "could change" is missing from dubbed audio.',
        suggestedFix: 'Re-record missing portion or ADR this line.',
      },
      {
        id: 7,
        timecode: '00:00:23:08',
        timeSeconds: 23.33,
        type: 'Tone Mismatch',
        severity: 'warning',
        description: 'Emotional tone is flat compared to source performance.',
        suggestedFix: 'Request re-performance with direction notes.',
      },
      {
        id: 8,
        timecode: '00:00:06:18',
        timeSeconds: 6.75,
        type: 'Repetition',
        severity: 'info',
        description: 'Word "vast" repeated twice, may be unintentional stutter.',
        suggestedFix: 'Review script and remove duplicate if not intended.',
      },
      // Speaker Checks
      {
        id: 9,
        timecode: '00:00:11:06',
        timeSeconds: 11.25,
        type: 'Speaker Mismatch',
        severity: 'warning',
        description: 'Voice characteristics differ from established character voice.',
        suggestedFix: 'Verify correct voice actor or apply EQ matching.',
      },
      // Synthetic Voice
      {
        id: 10,
        timecode: '00:00:20:12',
        timeSeconds: 20.5,
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
