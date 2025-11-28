/**
 * CardView Component
 * Grid layout of asset cards
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AssetCard, Asset } from './AssetCard';

interface CardViewProps {
  assets: Asset[];
}

export function CardView({ assets }: CardViewProps) {
  const navigate = useNavigate();

  const handleAssetClick = (asset: Asset) => {
    if (asset.type === 'subtitle') {
      navigate('/ocularflow');
    } else if (asset.type === 'audio') {
      navigate(`/qc/dub/${asset.id}`);
    }
    // master and metadata don't navigate
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onClick={() => handleAssetClick(asset)}
        />
      ))}
    </div>
  );
}
