/**
 * Media Router - TRPC routes for subtitle and audio data
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import {
  GetSubtitleTrackInputSchema,
  GetAudioTrackInputSchema,
  UploadMediaInputSchema,
} from '../schemas/media.schema';
import { MediaService } from '../services/media.service';

export const mediaRouter = router({
  /**
   * Get subtitle track data
   * Used by: OcularFlow
   * Returns parsed subtitle segments with QC data
   */
  getSubtitleTrack: publicProcedure
    .input(GetSubtitleTrackInputSchema)
    .output(z.any()) // SubtitleTrackSchema
    .query(async ({ input }) => {
      const mediaService = new MediaService();
      const track = await mediaService.getSubtitleTrack(input.assetId);
      
      if (!track) {
        throw new Error(`Subtitle track not found: ${input.assetId}`);
      }
      
      return track;
    }),

  /**
   * Get audio track data
   * Used by: DubFlow
   * Returns waveform data and audio QC issues
   */
  getAudioTrack: publicProcedure
    .input(GetAudioTrackInputSchema)
    .output(z.any()) // AudioTrackSchema
    .query(async ({ input }) => {
      const mediaService = new MediaService();
      const track = await mediaService.getAudioTrack(input.assetId);
      
      if (!track) {
        throw new Error(`Audio track not found: ${input.assetId}`);
      }
      
      return track;
    }),

  /**
   * Upload media file
   * Handles video, audio, and subtitle uploads
   */
  upload: publicProcedure
    .input(UploadMediaInputSchema)
    .output(z.object({
      assetId: z.string().uuid(),
      uploadUrl: z.string().optional(),
      status: z.string(),
    }))
    .mutation(async ({ input }) => {
      const mediaService = new MediaService();
      const result = await mediaService.uploadMedia(input);
      
      return result;
    }),

  /**
   * Get media file URL (for download/playback)
   */
  getMediaUrl: publicProcedure
    .input(z.object({
      assetId: z.string().uuid(),
    }))
    .output(z.object({
      url: z.string(),
      expiresAt: z.date(),
    }))
    .query(async ({ input }) => {
      const mediaService = new MediaService();
      const result = await mediaService.getMediaUrl(input.assetId);
      
      return result;
    }),

  /**
   * Process uploaded media
   * Triggers parsing and QC analysis
   */
  process: publicProcedure
    .input(z.object({
      assetId: z.string().uuid(),
    }))
    .output(z.object({
      status: z.string(),
      jobId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const mediaService = new MediaService();
      const result = await mediaService.processMedia(input.assetId);
      
      return result;
    }),
});
