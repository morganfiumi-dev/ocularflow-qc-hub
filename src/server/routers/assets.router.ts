/**
 * Assets Router - TRPC routes for asset management
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import {
  GetAssetTreeInputSchema,
  GetAssetInputSchema,
  CreateAssetInputSchema,
  UpdateAssetInputSchema,
} from '../schemas/asset.schema';
import { AssetService } from '../services/asset.service';

export const assetsRouter = router({
  /**
   * Get asset tree for a project
   * Used by: AssetMap (tree view and card view)
   */
  getTree: publicProcedure
    .input(GetAssetTreeInputSchema)
    .output(z.any()) // AssetTreeSchema
    .query(async ({ input }) => {
      const assetService = new AssetService();
      const tree = await assetService.getAssetTree(input.projectId);
      
      return tree;
    }),

  /**
   * Get single asset by ID
   */
  getAsset: publicProcedure
    .input(GetAssetInputSchema)
    .output(z.any()) // AssetSchema
    .query(async ({ input }) => {
      const assetService = new AssetService();
      const asset = await assetService.getAsset(input.assetId);
      
      if (!asset) {
        throw new Error(`Asset not found: ${input.assetId}`);
      }
      
      return asset;
    }),

  /**
   * Create new asset
   */
  create: publicProcedure
    .input(CreateAssetInputSchema)
    .output(z.any()) // AssetSchema
    .mutation(async ({ input }) => {
      const assetService = new AssetService();
      const asset = await assetService.createAsset(input);
      
      return asset;
    }),

  /**
   * Update asset
   */
  update: publicProcedure
    .input(UpdateAssetInputSchema)
    .output(z.any()) // AssetSchema
    .mutation(async ({ input }) => {
      const assetService = new AssetService();
      const asset = await assetService.updateAsset(input);
      
      return asset;
    }),

  /**
   * Delete asset
   */
  delete: publicProcedure
    .input(GetAssetInputSchema)
    .output(z.object({
      success: z.boolean(),
      deletedId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const assetService = new AssetService();
      await assetService.deleteAsset(input.assetId);
      
      return {
        success: true,
        deletedId: input.assetId,
      };
    }),

  /**
   * List assets for a project
   */
  listByProject: publicProcedure
    .input(z.object({
      projectId: z.string().uuid(),
      type: z.enum(['master', 'audio', 'subtitle', 'metadata']).optional(),
    }))
    .output(z.object({
      assets: z.array(z.any()), // AssetSchema[]
      total: z.number(),
    }))
    .query(async ({ input }) => {
      const assetService = new AssetService();
      const assets = await assetService.listAssetsByProject(input.projectId, input.type);
      
      return {
        assets,
        total: assets.length,
      };
    }),
});
