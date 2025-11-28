/**
 * Asset Service
 * Business logic for asset management and tree generation
 */

import type {
  Asset,
  AssetTree,
  AssetTreeNode,
  CreateAssetInput,
  UpdateAssetInput,
} from '../schemas/asset.schema';
import { generateMockAssetTree } from '../mocks/asset.mocks';

export class AssetService {
  private assets: Map<string, Asset> = new Map();

  /**
   * Get asset tree for a project
   */
  async getAssetTree(projectId: string): Promise<AssetTree> {
    // Generate mock tree (in production, fetch from DB and build tree)
    const tree = generateMockAssetTree(projectId);
    
    // Cache assets
    tree.flatList.forEach(asset => {
      this.assets.set(asset.id, asset);
    });

    return tree;
  }

  /**
   * Get single asset
   */
  async getAsset(assetId: string): Promise<Asset | null> {
    return this.assets.get(assetId) || null;
  }

  /**
   * Create asset
   */
  async createAsset(input: CreateAssetInput): Promise<Asset> {
    const newAsset: Asset = {
      id: crypto.randomUUID(),
      ...input,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      qc: {
        score: undefined,
        issueCount: 0,
        lastQcDate: undefined,
        assignee: undefined,
      },
    };

    this.assets.set(newAsset.id, newAsset);
    return newAsset;
  }

  /**
   * Update asset
   */
  async updateAsset(input: UpdateAssetInput): Promise<Asset> {
    const existing = this.assets.get(input.assetId);
    if (!existing) {
      throw new Error(`Asset not found: ${input.assetId}`);
    }

    const updated: Asset = {
      ...existing,
      updatedAt: new Date(),
    };

    if (input.name) {
      updated.name = input.name;
    }
    if (input.status) {
      updated.status = input.status;
    }
    if (input.metadata) {
      updated.metadata = { ...existing.metadata, ...input.metadata };
    }
    if (input.qc) {
      updated.qc = { ...existing.qc, ...input.qc };
    }

    this.assets.set(input.assetId, updated);
    return updated;
  }

  /**
   * Delete asset
   */
  async deleteAsset(assetId: string): Promise<void> {
    const existing = this.assets.get(assetId);
    if (!existing) {
      throw new Error(`Asset not found: ${assetId}`);
    }

    this.assets.delete(assetId);
  }

  /**
   * List assets by project
   */
  async listAssetsByProject(
    projectId: string,
    type?: 'master' | 'audio' | 'subtitle' | 'metadata'
  ): Promise<Asset[]> {
    let filtered = Array.from(this.assets.values())
      .filter(a => a.projectId === projectId);

    if (type) {
      filtered = filtered.filter(a => a.type === type);
    }

    return filtered;
  }

  /**
   * Build hierarchical tree from flat asset list
   */
  private buildTree(assets: Asset[]): AssetTreeNode | null {
    // Find root (master video)
    const root = assets.find(a => a.type === 'master' && !a.parentAssetId);
    if (!root) return null;

    const buildNode = (asset: Asset): AssetTreeNode => {
      const children = assets
        .filter(a => a.parentAssetId === asset.id)
        .map(buildNode);

      return {
        asset,
        children: children.length > 0 ? children : undefined,
      };
    };

    return buildNode(root);
  }
}
