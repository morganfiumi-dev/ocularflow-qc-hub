/**
 * RecommendTab - AI-powered recommendations and insights
 * UI-only mock component
 */

import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { Button } from '../atoms/Button';

interface RecommendTabProps {
  issueCount: number;
  assetScore: number;
}

export function RecommendTab({ issueCount, assetScore }: RecommendTabProps) {
  
  // Mock recommendations (UI-only)
  const recommendations = [
    {
      id: 1,
      priority: 'high',
      category: 'Timing & Sync',
      title: 'Adjust sync on 3 clips for better lip accuracy',
      description: 'Clips at 00:00:05, 00:00:18, and 00:01:23 show lip-sync drift > 150ms',
      impact: 'Could improve asset score by +2.3 points',
      icon: TrendingUp,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      id: 2,
      priority: 'medium',
      category: 'Dialogue Integrity',
      title: 'Review prosody on emotional scenes',
      description: '2 clips have tone mismatch flags - consider re-recording or adjusting delivery',
      impact: 'Could improve asset score by +1.5 points',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
    {
      id: 3,
      priority: 'low',
      category: 'Audio Quality',
      title: 'Minor breath cleanup opportunities',
      description: '4 clips have subtle breath artifacts that could be cleaned',
      impact: 'Could improve asset score by +0.8 points',
      icon: Lightbulb,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
  ];

  const insights = [
    'Average clip score: 87.3 (good)',
    'Most common issue: Timing drift (-120ms avg)',
    'Channel integrity: 100% pass',
    'Translation accuracy: 94%',
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-10 border-b border-slate-800 flex items-center justify-between px-4 flex-shrink-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">AI Recommendations</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Insights */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Quick Insights</h3>
          
          <div className="bg-slate-950/60 rounded border border-slate-800 p-3 space-y-2">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Recommended Actions</h3>
          
          <div className="space-y-3">
            {recommendations.map(rec => {
              const Icon = rec.icon;
              
              return (
                <div
                  key={rec.id}
                  className={`
                    ${rec.bgColor} rounded border ${rec.borderColor} p-4 hover:shadow-md transition-all cursor-pointer
                  `}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded ${rec.bgColor} border ${rec.borderColor}`}>
                      <Icon className={`w-4 h-4 ${rec.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`text-sm font-semibold ${rec.color}`}>
                          {rec.title}
                        </h4>
                        <span className={`
                          px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                          ${rec.priority === 'high' ? 'bg-red-500/20 text-red-400' : ''}
                          ${rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' : ''}
                          ${rec.priority === 'low' ? 'bg-blue-500/20 text-blue-400' : ''}
                        `}>
                          {rec.priority}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-400 mb-2">
                        {rec.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-[10px] text-slate-600">
                        <TrendingUp className="w-3 h-3" />
                        <span>{rec.impact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1">
                      Apply Suggestion
                    </Button>
                    <Button variant="secondary" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Auto-fix options */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Auto-Fix (Coming Soon)</h3>
          
          <div className="bg-slate-950/60 rounded border border-slate-800 p-4 space-y-2 opacity-60">
            <label className="flex items-center gap-3 cursor-not-allowed">
              <input type="checkbox" disabled className="w-4 h-4 rounded border-slate-700" />
              <span className="text-xs text-slate-400">Auto-adjust timing within ±100ms</span>
            </label>
            <label className="flex items-center gap-3 cursor-not-allowed">
              <input type="checkbox" disabled className="w-4 h-4 rounded border-slate-700" />
              <span className="text-xs text-slate-400">Auto-normalize loudness</span>
            </label>
            <label className="flex items-center gap-3 cursor-not-allowed">
              <input type="checkbox" disabled className="w-4 h-4 rounded border-slate-700" />
              <span className="text-xs text-slate-400">Auto-remove breath artifacts</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
