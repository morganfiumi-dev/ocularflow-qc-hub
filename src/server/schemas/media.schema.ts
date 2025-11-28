/**
 * Media Schemas - Zod validation for subtitle and audio data
 */

import { z } from 'zod';

/**
 * Subtitle segment schema
 */
export const SubtitleSegmentSchema = z.object({
  index: z.number().int().positive(),
  startTime: z.number().nonnegative(), // Seconds
  endTime: z.number().positive(), // Seconds
  duration: z.number().positive(),
  sourceText: z.string(),
  text: z.string(),
  
  // Computed metrics
  cps: z.number().nonnegative(), // Characters per second
  cpl: z.number().int().nonnegative(), // Characters per line
  lineCount: z.number().int().positive(),
  
  // Context
  contextType: z.enum(['DIALOGUE', 'FN', 'SONG', 'CAPTION']).default('DIALOGUE'),
  
  // QC data
  issues: z.array(z.object({
    id: z.string(),
    ruleName: z.string(),
    severity: z.enum(['error', 'warning', 'info']),
    type: z.enum(['semantic', 'contextual', 'technical', 'timing', 'grammar']),
    description: z.string(),
    scoreHit: z.number(),
  })),
  
  qualityScore: z.number().min(0).max(100),
});

/**
 * Subtitle track schema (full response for OcularFlow)
 */
export const SubtitleTrackSchema = z.object({
  assetId: z.string().uuid(),
  projectId: z.string().uuid(),
  language: z.string().length(2),
  format: z.string(), // 'itt', 'srt', 'vtt'
  
  // Parsed segments
  segments: z.array(SubtitleSegmentSchema),
  
  // Metadata
  metadata: z.object({
    totalSegments: z.number().int().nonnegative(),
    duration: z.number().positive(),
    averageCps: z.number().nonnegative(),
    averageCpl: z.number().nonnegative(),
    encoding: z.string(),
  }),
  
  // QC Summary
  qcSummary: z.object({
    overallScore: z.number().min(0).max(100),
    totalIssues: z.number().int().nonnegative(),
    errorCount: z.number().int().nonnegative(),
    warningCount: z.number().int().nonnegative(),
    infoCount: z.number().int().nonnegative(),
  }),
  
  // Review queue
  reviewQueue: z.array(z.object({
    segmentIndex: z.number().int().positive(),
    priority: z.enum(['high', 'medium', 'low']),
    reason: z.string(),
  })),
  
  // Additional context
  sceneCuts: z.array(z.object({
    time: z.number().nonnegative(),
    type: z.string(),
  })).optional(),
  
  knpGlossary: z.array(z.object({
    term: z.string(),
    type: z.enum(['Character', 'Location', 'Organization', 'Term']),
    tc: z.string(),
    subId: z.number().int().positive(),
    seconds: z.number().nonnegative(),
  })).optional(),
});

/**
 * Audio waveform data point
 */
export const WaveformDataPointSchema = z.object({
  time: z.number().nonnegative(),
  amplitude: z.number().min(-1).max(1),
  rms: z.number().nonnegative().optional(),
});

/**
 * Audio issue schema
 */
export const AudioIssueSchema = z.object({
  id: z.number().int().positive(),
  time: z.string(), // SMPTE timecode
  timeSeconds: z.number().nonnegative(),
  type: z.enum(['Clipping', 'Silence Gap', 'Timing Offset', 'Background Noise', 'Mouth Mismatch']),
  severity: z.enum(['high', 'medium', 'low']),
  description: z.string(),
  suggestedFix: z.string(),
});

/**
 * Audio track schema (full response for DubFlow)
 */
export const AudioTrackSchema = z.object({
  assetId: z.string().uuid(),
  projectId: z.string().uuid(),
  language: z.string().length(2),
  codec: z.string(),
  
  // Waveform data
  waveform: z.object({
    sampleRate: z.number().int().positive(),
    channels: z.number().int().positive(),
    duration: z.number().positive(),
    format: z.string(),
    // Simplified waveform for visualization
    visualData: z.array(z.number().min(0).max(1)), // Normalized amplitude values
  }),
  
  // Metadata
  metadata: z.object({
    bitrate: z.number().int().positive(),
    bitsPerSample: z.number().int().positive(),
    fileSize: z.number().int().positive(),
    encoding: z.string(),
  }),
  
  // QC data
  issues: z.array(AudioIssueSchema),
  
  qcSummary: z.object({
    overallScore: z.number().min(0).max(100),
    totalIssues: z.number().int().nonnegative(),
    clippingCount: z.number().int().nonnegative(),
    silenceGapCount: z.number().int().nonnegative(),
    timingIssueCount: z.number().int().nonnegative(),
  }),
  
  // Segments for sync markers
  segments: z.array(z.object({
    startTime: z.number().nonnegative(),
    endTime: z.number().positive(),
    type: z.enum(['dialogue', 'silence', 'music', 'effect']),
    confidence: z.number().min(0).max(1),
  })).optional(),
});

/**
 * Get subtitle track input
 */
export const GetSubtitleTrackInputSchema = z.object({
  assetId: z.string().uuid(),
});

/**
 * Get audio track input
 */
export const GetAudioTrackInputSchema = z.object({
  assetId: z.string().uuid(),
});

/**
 * Upload media input
 */
export const UploadMediaInputSchema = z.object({
  projectId: z.string().uuid(),
  type: z.enum(['video', 'audio', 'subtitle']),
  language: z.string().length(2).optional(),
  file: z.instanceof(File).or(z.string()), // File object or base64 string
});

/**
 * TypeScript types
 */
export type SubtitleSegment = z.infer<typeof SubtitleSegmentSchema>;
export type SubtitleTrack = z.infer<typeof SubtitleTrackSchema>;
export type WaveformDataPoint = z.infer<typeof WaveformDataPointSchema>;
export type AudioIssue = z.infer<typeof AudioIssueSchema>;
export type AudioTrack = z.infer<typeof AudioTrackSchema>;
export type GetSubtitleTrackInput = z.infer<typeof GetSubtitleTrackInputSchema>;
export type GetAudioTrackInput = z.infer<typeof GetAudioTrackInputSchema>;
export type UploadMediaInput = z.infer<typeof UploadMediaInputSchema>;
