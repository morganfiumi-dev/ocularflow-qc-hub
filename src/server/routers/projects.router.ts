/**
 * Projects Router - TRPC routes for project management
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import {
  ListProjectsInputSchema,
  GetProjectInputSchema,
  CreateProjectInputSchema,
  UpdateProjectInputSchema,
  type Project,
  type ProjectListItem,
} from '../schemas/project.schema';
import { ProjectService } from '../services/project.service';

export const projectsRouter = router({
  /**
   * List all projects
   * Used by: CommandCenter
   */
  list: publicProcedure
    .input(ListProjectsInputSchema)
    .output(z.object({
      projects: z.array(z.any()), // ProjectListItemSchema
      total: z.number(),
      hasMore: z.boolean(),
    }))
    .query(async ({ input }) => {
      const projectService = new ProjectService();
      const result = await projectService.listProjects(input);
      
      return {
        projects: result.projects,
        total: result.total,
        hasMore: (input.offset || 0) + result.projects.length < result.total,
      };
    }),

  /**
   * Get single project by ID
   * Used by: AssetMap
   */
  get: publicProcedure
    .input(GetProjectInputSchema)
    .output(z.any()) // ProjectSchema
    .query(async ({ input }) => {
      const projectService = new ProjectService();
      const project = await projectService.getProject(input.id);
      
      if (!project) {
        throw new Error(`Project not found: ${input.id}`);
      }
      
      return project;
    }),

  /**
   * Create new project
   */
  create: publicProcedure
    .input(CreateProjectInputSchema)
    .output(z.any()) // ProjectSchema
    .mutation(async ({ input }) => {
      const projectService = new ProjectService();
      const project = await projectService.createProject(input);
      
      return project;
    }),

  /**
   * Update existing project
   */
  update: publicProcedure
    .input(UpdateProjectInputSchema)
    .output(z.any()) // ProjectSchema
    .mutation(async ({ input }) => {
      const projectService = new ProjectService();
      const project = await projectService.updateProject(input);
      
      return project;
    }),

  /**
   * Delete project
   */
  delete: publicProcedure
    .input(GetProjectInputSchema)
    .output(z.object({
      success: z.boolean(),
      deletedId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const projectService = new ProjectService();
      await projectService.deleteProject(input.id);
      
      return {
        success: true,
        deletedId: input.id,
      };
    }),

  /**
   * Get demo project
   * Loads from /public/demo-project/
   */
  getDemo: publicProcedure
    .output(z.any()) // ProjectSchema
    .query(async () => {
      const projectService = new ProjectService();
      const demoProject = await projectService.getDemoProject();
      
      return demoProject;
    }),
});
