/**
 * QC Schemas - Zod validation for quality control scoring
 */

import { z } from 'zod';

/**
 * QC score category
 */
export const QcScoreCategorySchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(1),
  details: z.string().optional(),
});

/**
 * QC score input
 */
export const ScoreAssetInputSchema = z.object({
  assetId: z.string().uuid(),
  overallScore: z.number().min(0).max(100),
  categories: z.array(QcScoreCategorySchema),
  notes: z.string().optional(),
  reviewer: z.string().optional(),
});

/**
 * QC score response
 */
export const QcScoreSchema = z.object({
  id: z.string().uuid(),
  assetId: z.string().uuid(),
  overallScore: z.number().min(0).max(100),
  categories: z.array(QcScoreCategorySchema),
  notes: z.string().optional(),
  reviewer: z.string().optional(),
  scoredAt: z.date(),
  
  // Breakdown
  breakdown: z.object({
    technical: z.number().min(0).max(100),
    linguistic: z.number().min(0).max(100),
    timing: z.number().min(0).max(100),
    context: z.number().min(0).max(100),
  }),
  
  // Issue summary
  issueSummary: z.object({
    total: z.number().int().nonnegative(),
    byType: z.record(z.number().int().nonnegative()),
    bySeverity: z.record(z.number().int().nonnegative()),
  }),
});

/**
 * Get QC score input
 */
export const GetQcScoreInputSchema = z.object({
  assetId: z.string().uuid(),
});

/**
 * QC report schema
 */
export const QcReportSchema = z.object({
  assetId: z.string().uuid(),
  projectId: z.string().uuid(),
  generatedAt: z.date(),
  
  score: QcScoreSchema,
  
  // Detailed findings
  findings: z.array(z.object({
    id: z.string(),
    severity: z.enum(['error', 'warning', 'info']),
    type: z.string(),
    description: z.string(),
    location: z.string(), // Timecode or segment index
    recommendation: z.string(),
  })),
  
  // Summary statistics
  statistics: z.object({
    totalSegments: z.number().int().positive(),
    analyzedSegments: z.number().int().nonnegative(),
    passRate: z.number().min(0).max(100),
    averageSegmentScore: z.number().min(0).max(100),
  }),
  
  // Recommendations
  recommendations: z.array(z.string()),
});

/**
 * Generate QC report input
 */
export const GenerateQcReportInputSchema = z.object({
  assetId: z.string().uuid(),
  includeDetails: z.boolean().default(true),
  format: z.enum(['json', 'pdf', 'csv']).default('json'),
});

/**
 * TypeScript types
 */
export type QcScoreCategory = z.infer<typeof QcScoreCategorySchema>;
export type ScoreAssetInput = z.infer<typeof ScoreAssetInputSchema>;
export type QcScore = z.infer<typeof QcScoreSchema>;
export type GetQcScoreInput = z.infer<typeof GetQcScoreInputSchema>;
export type QcReport = z.infer<typeof QcReportSchema>;
export type GenerateQcReportInput = z.infer<typeof GenerateQcReportInputSchema>;
