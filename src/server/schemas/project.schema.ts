/**
 * Project Schemas - Zod validation for MediaQC projects
 */

import { z } from 'zod';

/**
 * Project types
 */
export const ProjectTypeEnum = z.enum(['user-uploaded', 'demo-fixture']);

/**
 * Project status
 */
export const ProjectStatusEnum = z.enum(['draft', 'in-progress', 'review', 'completed']);

/**
 * Base project schema
 */
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: ProjectTypeEnum,
  status: ProjectStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
  metadata: z.object({
    originalLanguage: z.string().length(2), // ISO 639-1 code
    releaseDate: z.string().optional(),
    duration: z.number().positive(), // Duration in seconds
    videoFormat: z.string().optional(),
    aspectRatio: z.string().optional(),
    fps: z.number().optional(),
    description: z.string().optional(),
  }),
  // Storage references
  storage: z.object({
    masterVideo: z.string().optional(), // S3 key or local path
    audioTracks: z.record(z.string()), // { 'en': 's3://path', 'de': 's3://path' }
    subtitleFiles: z.record(z.string()), // { 'en': 's3://path', 'es': 's3://path' }
    metadataFiles: z.object({
      sceneCuts: z.string().optional(),
      knpList: z.string().optional(),
      forcedNarrative: z.string().optional(),
    }),
  }).optional(),
});

/**
 * Project list item (summary)
 */
export const ProjectListItemSchema = ProjectSchema.pick({
  id: true,
  name: true,
  type: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  stats: z.object({
    totalAssets: z.number(),
    completedAssets: z.number(),
    totalIssues: z.number(),
  }),
});

/**
 * Create project input
 */
export const CreateProjectInputSchema = z.object({
  name: z.string().min(1).max(255),
  type: ProjectTypeEnum,
  metadata: ProjectSchema.shape.metadata,
});

/**
 * Update project input
 */
export const UpdateProjectInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  status: ProjectStatusEnum.optional(),
  metadata: ProjectSchema.shape.metadata.partial().optional(),
});

/**
 * Get project input
 */
export const GetProjectInputSchema = z.object({
  id: z.string().uuid(),
});

/**
 * List projects input
 */
export const ListProjectsInputSchema = z.object({
  status: ProjectStatusEnum.optional(),
  type: ProjectTypeEnum.optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

/**
 * TypeScript types
 */
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectListItem = z.infer<typeof ProjectListItemSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;
export type GetProjectInput = z.infer<typeof GetProjectInputSchema>;
export type ListProjectsInput = z.infer<typeof ListProjectsInputSchema>;
