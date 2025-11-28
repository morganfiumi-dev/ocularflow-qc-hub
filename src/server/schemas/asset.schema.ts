/**
 * Asset Schemas - Zod validation for MediaQC assets
 */

import { z } from 'zod';

/**
 * Asset types
 */
export const AssetTypeEnum = z.enum(['master', 'audio', 'subtitle', 'metadata']);

/**
 * Asset status
 */
export const AssetStatusEnum = z.enum(['pending', 'ready', 'in-progress', 'review', 'completed', 'qc-required', 'failed']);

/**
 * Base asset schema
 */
export const AssetSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: AssetTypeEnum,
  status: AssetStatusEnum,
  language: z.string().length(2).optional(), // ISO 639-1 code
  parentAssetId: z.string().uuid().optional(), // For hierarchical structure
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Asset-specific metadata
  metadata: z.object({
    codec: z.string().optional(),
    bitrate: z.number().optional(),
    sampleRate: z.number().optional(),
    channels: z.number().optional(),
    format: z.string().optional(),
    duration: z.number().optional(),
    fileSize: z.number().optional(),
    version: z.string().optional(),
  }).optional(),
  
  // Storage path
  storagePath: z.string().optional(),
  
  // QC data
  qc: z.object({
    score: z.number().min(0).max(100).optional(),
    issueCount: z.number().min(0).optional(),
    lastQcDate: z.date().optional(),
    assignee: z.string().optional(),
  }).optional(),
});

/**
 * Asset tree node
 */
export const AssetTreeNodeSchema = z.object({
  asset: AssetSchema,
  children: z.array(z.lazy(() => AssetTreeNodeSchema)).optional(),
});

/**
 * Asset tree structure
 */
export const AssetTreeSchema = z.object({
  projectId: z.string().uuid(),
  root: AssetTreeNodeSchema,
  flatList: z.array(AssetSchema),
});

/**
 * Get asset tree input
 */
export const GetAssetTreeInputSchema = z.object({
  projectId: z.string().uuid(),
});

/**
 * Get asset input
 */
export const GetAssetInputSchema = z.object({
  assetId: z.string().uuid(),
});

/**
 * Create asset input
 */
export const CreateAssetInputSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: AssetTypeEnum,
  language: z.string().length(2).optional(),
  parentAssetId: z.string().uuid().optional(),
  metadata: AssetSchema.shape.metadata.optional(),
  storagePath: z.string().optional(),
});

/**
 * Update asset input
 */
export const UpdateAssetInputSchema = z.object({
  assetId: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  status: AssetStatusEnum.optional(),
  metadata: z.object({
    codec: z.string().optional(),
    bitrate: z.number().optional(),
    sampleRate: z.number().optional(),
    channels: z.number().optional(),
    format: z.string().optional(),
    duration: z.number().optional(),
    fileSize: z.number().optional(),
    version: z.string().optional(),
  }).optional(),
  qc: z.object({
    score: z.number().min(0).max(100).optional(),
    issueCount: z.number().min(0).optional(),
    lastQcDate: z.date().optional(),
    assignee: z.string().optional(),
  }).optional(),
});

/**
 * TypeScript types
 */
export type Asset = z.infer<typeof AssetSchema>;
export type AssetTreeNode = z.infer<typeof AssetTreeNodeSchema>;
export type AssetTree = z.infer<typeof AssetTreeSchema>;
export type GetAssetTreeInput = z.infer<typeof GetAssetTreeInputSchema>;
export type GetAssetInput = z.infer<typeof GetAssetInputSchema>;
export type CreateAssetInput = z.infer<typeof CreateAssetInputSchema>;
export type UpdateAssetInput = z.infer<typeof UpdateAssetInputSchema>;
