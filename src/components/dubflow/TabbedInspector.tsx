/**
 * TabbedInspector - Right panel with tabs for different views
 * Tabs: INCIDENTS | VISUAL | DIALOGUE EDITOR | RECOMMEND | SCORE
 */

import React, { useState } from 'react';
import { AlertTriangle, Eye, FileText, Sparkles, BarChart3 } from 'lucide-react';
import { IssueList } from './IssueList';
import { IssueDetails } from './IssueDetails';
import { DialogueEditor } from './DialogueEditor';
import { ScriptDoctorMode } from './ScriptDoctorMode';
import { ScoreTab } from './ScoreTab';

type TabId = 'incidents' | 'visual' | 'dialogue' | 'score';

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
  enText: string;
  dubText: string;
  issues: Issue[];
  score?: number;
}

interface TabbedInspectorProps {
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

export function TabbedInspector({
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
  onNotesChange,
}: TabbedInspectorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('incidents');

  const tabs = [
    { id: 'incidents' as TabId, label: 'Incidents', icon: AlertTriangle },
    { id: 'visual' as TabId, label: 'Visual', icon: Eye },
    { id: 'dialogue' as TabId, label: 'Dialogue', icon: FileText },
    { id: 'score' as TabId, label: 'Score', icon: BarChart3 },
  ];

  const selectedIssue = issues.find(i => i.id === selectedIssueId);
  const selectedLine = dialogueLines.find(l => l.id === selectedLineId);

  // Determine if we should show Script Doctor Mode
  const shouldShowScriptDoctor = selectedIssue && [
    'timing_sync',
    'dialogue_integrity',
    'translation',
  ].includes(selectedIssue.categoryId);

  // Map issues to legacy format for IssueList/IssueDetails
  const mapSeverity = (severity: 'error' | 'warning' | 'info'): 'high' | 'medium' | 'low' => {
    switch (severity) {
      case 'error': return 'high';
      case 'warning': return 'medium';
      case 'info': return 'low';
    }
  };

  const legacyIssues = issues.map(issue => ({
    id: issue.id,
    time: issue.timecode,
    timeSeconds: issue.timeSeconds,
    type: issue.type,
    severity: mapSeverity(issue.severity),
    description: issue.description,
    suggestedFix: 'Review and adjust as needed',
  }));

  const selectedLegacyIssue = selectedIssue ? {
    id: selectedIssue.id,
    time: selectedIssue.timecode,
    timeSeconds: selectedIssue.timeSeconds,
    type: selectedIssue.type,
    severity: mapSeverity(selectedIssue.severity),
    description: selectedIssue.description,
    suggestedFix: 'Review and adjust as needed',
  } : null;

  return (
    <div className="h-full bg-slate-900/60 border border-slate-800 rounded-md shadow-lg shadow-black/40 flex flex-col overflow-hidden">
      {/* Tab Headers */}
      <div className="h-12 border-b border-slate-800 flex items-center flex-shrink-0">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 h-full flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider
                transition-all border-b-2
                ${isActive
                  ? 'bg-slate-800/60 text-cyan-400 border-cyan-500'
                  : 'text-slate-500 border-transparent hover:bg-slate-800/40 hover:text-slate-300'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'incidents' && (
          <div className="h-full flex flex-col overflow-hidden">
            {shouldShowScriptDoctor && selectedIssue ? (
              <ScriptDoctorMode
                issue={selectedIssue}
                dialogueLine={selectedLine || undefined}
                currentTime={currentTime}
              />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  <IssueList
                    issues={legacyIssues}
                    selectedIssueId={selectedIssueId}
                    onSelectIssue={onSelectIssue}
                  />
                </div>
                <div className="h-64 border-t border-slate-800 overflow-y-auto">
                  <IssueDetails
                    issue={selectedLegacyIssue}
                    notes={notes}
                    onNotesChange={onNotesChange}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'visual' && (
          <div className="h-full overflow-y-auto p-4">
            {/* Visual QC Summary */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Visual Quality Checks</h3>
              
              {/* Issue Category Breakdown */}
              <div className="space-y-2">
                <div className="text-xs text-slate-500 uppercase tracking-wider">Issues by Category</div>
                <div className="space-y-1.5">
                  {[
                    { icon: '👄', name: 'Lip Sync', color: 'pink', count: issues.filter(i => i.categoryId === 'timing_sync').length },
                    { icon: '💬', name: 'Dialogue', color: 'purple', count: issues.filter(i => i.categoryId === 'dialogue_integrity').length },
                    { icon: '🌐', name: 'Translation', color: 'blue', count: issues.filter(i => i.categoryId === 'translation').length },
                    { icon: '🔊', name: 'Audio', color: 'amber', count: issues.filter(i => i.categoryId === 'audio_deficiency').length },
                    { icon: '📢', name: 'Channel', color: 'green', count: issues.filter(i => i.categoryId === 'channel_integrity').length },
                  ].map(cat => (
                    <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-xs text-slate-300">{cat.name}</span>
                      </div>
                      <span className={`text-sm font-bold font-mono ${
                        cat.count > 0 ? `text-${cat.color}-400` : 'text-slate-600'
                      }`}>
                        {cat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Severity Distribution */}
              <div className="space-y-2">
                <div className="text-xs text-slate-500 uppercase tracking-wider">Severity Distribution</div>
                <div className="space-y-1.5">
                  {[
                    { label: 'Errors', severity: 'error', color: 'red', count: issues.filter(i => i.severity === 'error').length },
                    { label: 'Warnings', severity: 'warning', color: 'amber', count: issues.filter(i => i.severity === 'warning').length },
                    { label: 'Info', severity: 'info', color: 'blue', count: issues.filter(i => i.severity === 'info').length },
                  ].map(sev => (
                    <div key={sev.severity} className="flex items-center gap-3 p-2 bg-slate-950/60 border border-slate-800 rounded">
                      <div className={`w-2 h-2 rounded-full bg-${sev.color}-500`} />
                      <span className="text-xs text-slate-300 flex-1">{sev.label}</span>
                      <span className={`text-sm font-bold font-mono text-${sev.color}-400`}>{sev.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Density */}
              <div className="space-y-2">
                <div className="text-xs text-slate-500 uppercase tracking-wider">Issue Timeline</div>
                <div className="h-12 bg-slate-950/60 border border-slate-800 rounded p-2">
                  <div className="relative h-full bg-slate-900 rounded">
                    {issues.map(issue => {
                      const position = (issue.timeSeconds / 420) * 100; // Using 420 as mock duration
                      return (
                        <div
                          key={issue.id}
                          className={`absolute top-0 bottom-0 w-0.5 ${
                            issue.severity === 'error' ? 'bg-red-500' :
                            issue.severity === 'warning' ? 'bg-amber-500' :
                            'bg-blue-500'
                          }`}
                          style={{ left: `${position}%` }}
                          title={issue.type}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dialogue' && (
          <div className="h-full overflow-hidden">
            <DialogueEditor
              lines={dialogueLines}
              selectedLineId={selectedLineId}
              currentTime={currentTime}
              onSelectLine={onSelectLine}
            />
          </div>
        )}

        {activeTab === 'score' && (
          <div className="h-full overflow-y-auto">
            <ScoreTab
              assetScore={assetScore}
              clipScores={clipScores}
              issues={issues}
            />
          </div>
        )}
      </div>
    </div>
  );
}