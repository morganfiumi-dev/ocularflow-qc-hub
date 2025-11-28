/**
 * Project Service
 * Business logic for project management
 */

import type {
  Project,
  ProjectListItem,
  CreateProjectInput,
  UpdateProjectInput,
  ListProjectsInput,
} from '../schemas/project.schema';
import { mockDemoProject, generateMockProjects } from '../mocks/project.mocks';

export class ProjectService {
  private projects: Map<string, Project> = new Map();

  constructor() {
    // Initialize with mock data
    const mockProjects = generateMockProjects(5);
    mockProjects.forEach(p => this.projects.set(p.id, p));
    
    // Add demo project
    const demoProject = mockDemoProject();
    this.projects.set(demoProject.id, demoProject);
  }

  /**
   * List projects with filtering and pagination
   */
  async listProjects(input: ListProjectsInput): Promise<{
    projects: ProjectListItem[];
    total: number;
  }> {
    let filtered = Array.from(this.projects.values());

    // Apply filters
    if (input.status) {
      filtered = filtered.filter(p => p.status === input.status);
    }
    if (input.type) {
      filtered = filtered.filter(p => p.type === input.type);
    }

    // Calculate stats for each project (simplified)
    const projectListItems: ProjectListItem[] = filtered.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      stats: {
        totalAssets: 6, // Mock
        completedAssets: 2, // Mock
        totalIssues: 15, // Mock
      },
    }));

    // Apply pagination
    const offset = input.offset || 0;
    const limit = input.limit || 20;
    const paginated = projectListItems.slice(offset, offset + limit);

    return {
      projects: paginated,
      total: filtered.length,
    };
  }

  /**
   * Get single project by ID
   */
  async getProject(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  /**
   * Create new project
   */
  async createProject(input: CreateProjectInput): Promise<Project> {
    const newProject: Project = {
      id: crypto.randomUUID(),
      ...input,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      storage: {
        masterVideo: undefined,
        audioTracks: {},
        subtitleFiles: {},
        metadataFiles: {
          sceneCuts: undefined,
          knpList: undefined,
          forcedNarrative: undefined,
        },
      },
    };

    this.projects.set(newProject.id, newProject);
    return newProject;
  }

  /**
   * Update project
   */
  async updateProject(input: UpdateProjectInput): Promise<Project> {
    const existing = this.projects.get(input.id);
    if (!existing) {
      throw new Error(`Project not found: ${input.id}`);
    }

    const updated: Project = {
      ...existing,
      ...(input.name && { name: input.name }),
      ...(input.status && { status: input.status }),
      ...(input.metadata && {
        metadata: { ...existing.metadata, ...input.metadata },
      }),
      updatedAt: new Date(),
    };

    this.projects.set(input.id, updated);
    return updated;
  }

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    const existing = this.projects.get(id);
    if (!existing) {
      throw new Error(`Project not found: ${id}`);
    }

    this.projects.delete(id);
  }

  /**
   * Get demo project from /public/demo-project/
   */
  async getDemoProject(): Promise<Project> {
    return mockDemoProject();
  }
}
