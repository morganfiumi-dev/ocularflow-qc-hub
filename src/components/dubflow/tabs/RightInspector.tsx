/**
 * DubFlow Right Inspector
 * 5-tab container: INCIDENTS | VISUAL | EDITOR | RECOMMEND | SCORE
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, Eye, Edit3, Lightbulb, TrendingUp } from 'lucide-react';
import { IncidentsTab } from './IncidentsTab';
import { VisualTab } from './VisualTab';
import { EditorTab } from '../../dubflow/EditorTab';
import { RecommendTab } from '../../dubflow/RecommendTab';
import { ScoreTab } from '../../dubflow/ScoreTab';

type TabId = 'incidents' | 'visual' | 'editor' | 'recommend' | 'score';

interface Issue {
  id: number;
  timecode: string;
  timeSeconds: number;
  type: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  categoryId: string;
  checkId: string;
}

interface DialogueLine {
  id: number;
  timeIn: string;
  timeInSeconds: number;
  timeOutSeconds: number;
  enText: string;
  dubText: string;
  issues: Issue[];
  score?: number;
}

interface RightInspectorProps {
  issues: Issue[];
  dialogueLines: DialogueLine[];
  selectedIssueId: number | null;
  selectedLineId: number | null;
  currentTime: number;
  notes: string;
  assetScore: number;
  clipScores: number[];
  onSelectIssue: (id: number) => void;
  onSelectLine: (id: number) => void;
  onNotesChange: (notes: string) => void;
}

export function RightInspector({
  issues,
  dialogueLines,
  selectedIssueId,
  selectedLineId,
  currentTime,
  notes,
  assetScore,
  clipScores,
  onSelectIssue,
  onSelectLine,
  onNotesChange
}: RightInspectorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('incidents');

  // Auto-switch to appropriate tab when issue is selected
  useEffect(() => {
    if (selectedIssueId) {
      const issue = issues.find(i => i.id === selectedIssueId);
      if (issue) {
        // Script Doctor Mode categories switch to VISUAL
        if (['timing_sync', 'dialogue_integrity', 'translation'].includes(issue.categoryId)) {
          setActiveTab('visual');
        } else if (['channel_integrity', 'synthetic_voice', 'audio_deficiency'].includes(issue.categoryId)) {
          setActiveTab('visual');
        }
      }
    }
  }, [selectedIssueId, issues]);

  const tabs = [
    { id: 'incidents' as TabId, label: 'Incidents', icon: AlertCircle },
    { id: 'visual' as TabId, label: 'Visual', icon: Eye },
    { id: 'editor' as TabId, label: 'Editor', icon: Edit3 },
    { id: 'recommend' as TabId, label: 'Recommend', icon: Lightbulb },
    { id: 'score' as TabId, label: 'Score', icon: TrendingUp }
  ];

  const selectedIssue = issues.find(i => i.id === selectedIssueId) || null;
  const selectedLine = dialogueLines.find(l => l.id === selectedLineId) || null;

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border-l border-slate-800">
      {/* Tab Bar */}
      <div className="flex border-b border-slate-800 bg-slate-900/40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all
                ${isActive
                  ? 'bg-slate-800/60 text-cyan-400 border-b-2 border-cyan-500'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'incidents' && (
          <IncidentsTab
            issues={issues}
            selectedIssueId={selectedIssueId}
            onSelectIssue={onSelectIssue}
          />
        )}

        {activeTab === 'visual' && (
          <VisualTab selectedIssue={selectedIssue} />
        )}

        {activeTab === 'editor' && (
          <EditorTab
            lines={dialogueLines}
            selectedLineId={selectedLineId}
            currentTime={currentTime}
            onSelectLine={onSelectLine}
            onLineUpdate={() => {}}
          />
        )}

        {activeTab === 'recommend' && (
          <RecommendTab
            issueCount={issues.length}
            assetScore={assetScore}
          />
        )}

        {activeTab === 'score' && (
          <ScoreTab
            assetScore={assetScore}
            clipScores={clipScores}
            issues={issues}
          />
        )}
      </div>
    </div>
  );
}
