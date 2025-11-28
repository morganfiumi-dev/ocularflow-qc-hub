/**
 * QC Router - TRPC routes for quality control scoring
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import {
  ScoreAssetInputSchema,
  GetQcScoreInputSchema,
  GenerateQcReportInputSchema,
} from '../schemas/qc.schema';
import { QcService } from '../services/qc.service';

export const qcRouter = router({
  /**
   * Score subtitle asset
   * Calculate QC score for subtitle track
   */
  scoreSubtitleAsset: publicProcedure
    .input(ScoreAssetInputSchema)
    .output(z.any()) // QcScoreSchema
    .mutation(async ({ input }) => {
      const qcService = new QcService();
      const score = await qcService.scoreSubtitleAsset(input);
      
      return score;
    }),

  /**
   * Score audio asset
   * Calculate QC score for audio track
   */
  scoreAudioAsset: publicProcedure
    .input(ScoreAssetInputSchema)
    .output(z.any()) // QcScoreSchema
    .mutation(async ({ input }) => {
      const qcService = new QcService();
      const score = await qcService.scoreAudioAsset(input);
      
      return score;
    }),

  /**
   * Get QC score for an asset
   */
  getScore: publicProcedure
    .input(GetQcScoreInputSchema)
    .output(z.any()) // QcScoreSchema
    .query(async ({ input }) => {
      const qcService = new QcService();
      const score = await qcService.getScore(input.assetId);
      
      if (!score) {
        throw new Error(`QC score not found for asset: ${input.assetId}`);
      }
      
      return score;
    }),

  /**
   * Generate QC report
   */
  generateReport: publicProcedure
    .input(GenerateQcReportInputSchema)
    .output(z.any()) // QcReportSchema
    .mutation(async ({ input }) => {
      const qcService = new QcService();
      const report = await qcService.generateReport(input);
      
      return report;
    }),

  /**
   * List QC scores for a project
   */
  listScores: publicProcedure
    .input(z.object({
      projectId: z.string().uuid(),
    }))
    .output(z.object({
      scores: z.array(z.any()), // QcScoreSchema[]
      total: z.number(),
    }))
    .query(async ({ input }) => {
      const qcService = new QcService();
      const scores = await qcService.listScoresByProject(input.projectId);
      
      return {
        scores,
        total: scores.length,
      };
    }),
});
