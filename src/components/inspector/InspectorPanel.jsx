/**
 * InspectorPanel Component for OcularFlow v10.5
 * Right panel with analysis, queue, and glossary tabs
 */

import React from 'react';
import { Layout, List, BookOpen, AlertOctagon, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { PanelTabs, ResizeHandle, Card } from '../atoms/Panel';
import { MetricBadge } from '../atoms/Badge';
import { IssueList } from './IssueList';
import { isCPSExceeded, isCPLExceeded } from '../../utils/subtitleParser';

/**
 * InspectorPanel component
 * @param {Object} props
 */
export function InspectorPanel({
  // Dimensions
  width = 420,
  
  // Current subtitle
  currentSubtitle = null,
  contextMetadata = null,
  
  // Inspector state
  activeTab = 'ANALYSIS',
  expandedIssueId = null,
  showScoreBreakdown = false,
  showAnnotations = { source: false, target: false },
  
  // Queue and glossary
  reviewQueue = [],
  knpGlossary = [],
  subtitles = [],
  
  // Callbacks
  onWidthChange,
  onTabChange,
  onToggleIssue,
  onToggleScoreBreakdown,
  onToggleSourceAnnotations,
  onToggleTargetAnnotations,
  onQueueItemClick,
  onGlossaryItemClick,
  
  className = ''
}) {
  const tabs = [
    { id: 'ANALYSIS', label: 'Analysis', icon: Layout },
    { id: 'QUEUE', label: 'Queue', icon: List },
    { id: 'KNP', label: 'Glossary', icon: BookOpen }
  ];
  
  // Handle resize
  const handleResize = (delta) => {
    if (onWidthChange) {
      onWidthChange(-delta); // Negative because dragging left should increase width
    }
  };
  
  return (
    <>
      {/* Resize handle */}
      <ResizeHandle
        direction="horizontal"
        onDrag={handleResize}
      />
      
      <div
        className={`of-right-panel ${className}`}
        style={{ width }}
      >
        {/* Tabs */}
        <PanelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        
        {/* Tab content */}
        <div className="of-inspector-content of-scrollbar">
          {activeTab === 'ANALYSIS' && currentSubtitle && (
            <AnalysisTab
              subtitle={currentSubtitle}
              contextMetadata={contextMetadata}
              expandedIssueId={expandedIssueId}
              showScoreBreakdown={showScoreBreakdown}
              showAnnotations={showAnnotations}
              onToggleIssue={onToggleIssue}
              onToggleScoreBreakdown={onToggleScoreBreakdown}
              onToggleSourceAnnotations={onToggleSourceAnnotations}
              onToggleTargetAnnotations={onToggleTargetAnnotations}
            />
          )}
          
          {activeTab === 'QUEUE' && (
            <QueueTab
              queue={reviewQueue}
              subtitles={subtitles}
              onItemClick={onQueueItemClick}
            />
          )}
          
          {activeTab === 'KNP' && (
            <GlossaryTab
              glossary={knpGlossary}
              onItemClick={onGlossaryItemClick}
            />
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Analysis Tab Content
 */
function AnalysisTab({
  subtitle,
  contextMetadata,
  expandedIssueId,
  showScoreBreakdown,
  showAnnotations,
  onToggleIssue,
  onToggleScoreBreakdown,
  onToggleSourceAnnotations,
  onToggleTargetAnnotations
}) {
  const cps = subtitle.cps || 0;
  const cpl = subtitle.cpl || 0;
  
  // Find matching annotation for current subtitle
  const matchingAnnotation = contextMetadata?.annotations?.annotations?.find(
    (ann) => subtitle.sourceText && subtitle.sourceText.includes(ann.line)
  );
  
  return (
    <div className="space-y-4">
      {/* Telemetry Strip */}
      <div className="of-telemetry-strip">
        <div className="of-telemetry-left">
          <span className="font-bold text-slate-400">ID {subtitle.index}</span>
          <span>|</span>
          <span>DUR: {subtitle.duration?.toFixed(1)}s</span>
        </div>
        <div className="of-telemetry-right">
          <MetricBadge label="CPS" value={cps} isError={isCPSExceeded(cps)} />
          <MetricBadge label="CPL" value={cpl} isError={isCPLExceeded(cpl)} />
        </div>
      </div>
      
      {/* Source Card */}
      <Card variant="source">
        <div className="flex justify-between items-center mb-2">
          <span className="of-context-label">Source</span>
          <button
            className="text-slate-500 hover:text-purple-400 transition-colors"
            onClick={onToggleSourceAnnotations}
          >
            <Eye size={12} />
          </button>
        </div>
        <p className="of-context-text">{subtitle.sourceText}</p>
        {showAnnotations.source && (
          <div className="mt-2 text-xs border-t border-purple-500/20 pt-2">
            {matchingAnnotation ? (
              <div className="text-purple-300/70 italic">
                <div className="font-semibold text-purple-400 mb-1">📝 Linguistic Note:</div>
                {matchingAnnotation.note}
              </div>
            ) : (
              <div className="text-slate-600 text-center">—</div>
            )}
          </div>
        )}
      </Card>
      
      {/* Target Card */}
      <Card variant="target">
        <div className="flex justify-between items-center mb-2">
          <span className="of-context-label">Target</span>
          <button
            className="text-slate-500 hover:text-cyan-400 transition-colors"
            onClick={onToggleTargetAnnotations}
          >
            <Eye size={12} />
          </button>
        </div>
        <p className="of-context-text">{subtitle.text}</p>
        {showAnnotations.target && (
          <div className="mt-2 text-xs border-t border-cyan-500/20 pt-2">
            <div className="text-slate-600 text-center">—</div>
          </div>
        )}
      </Card>
      
      {/* Divider */}
      <div className="border-t border-cyan-900/30 shadow-[0_1px_0_rgba(6,182,212,0.1)]" />
      
      {/* Quality Score Header */}
      <button
        className="w-full flex items-center justify-between pb-2 border-b border-slate-800 hover:bg-slate-900/50 rounded transition-colors"
        onClick={onToggleScoreBreakdown}
      >
        <div className="flex items-center gap-2">
          <AlertOctagon size={12} className="text-emerald-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Quality Engine
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-slate-500 uppercase font-bold">Score</span>
          <div className={`
            w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-[10px]
            ${subtitle.qualityScore >= 90 
              ? 'border-emerald-500/30 text-emerald-400' 
              : subtitle.qualityScore >= 70
                ? 'border-amber-500/30 text-amber-400'
                : 'border-rose-500/30 text-rose-400'
            }
          `}>
            {subtitle.qualityScore || 100}
          </div>
        </div>
      </button>
      
      {/* Score Breakdown (expandable) */}
      {showScoreBreakdown && (
        <div className="p-3 bg-slate-900 rounded border border-slate-800 of-animate-in">
          <div className="flex justify-between text-[10px] font-mono text-emerald-400 mb-2">
            <span>Base Score</span>
            <span>100</span>
          </div>
          {subtitle.issues?.map(issue => (
            <div key={issue.id} className="flex justify-between text-[10px] font-mono text-rose-400">
              <span>{issue.ruleName}</span>
              <span>{issue.scoreHit}</span>
            </div>
          ))}
          <div className="border-t border-slate-800 mt-2 pt-2 flex justify-between text-[10px] font-bold">
            <span className="text-slate-400">Final</span>
            <span className="text-cyan-400">{subtitle.qualityScore}</span>
          </div>
        </div>
      )}
      
      {/* Issues List */}
      <IssueList
        issues={subtitle.issues}
        analysisDetails={subtitle.analysisDetails}
        expandedIssueId={expandedIssueId}
        onToggleIssue={onToggleIssue}
      />
    </div>
  );
}

/**
 * Queue Tab Content
 */
function QueueTab({ queue = [], onItemClick, subtitles = [] }) {
  const [expandedId, setExpandedId] = React.useState(null);
  
  if (queue.length === 0) {
    return (
      <div className="text-center text-slate-600 text-xs py-8">
        No items in review queue
      </div>
    );
  }
  
  const formatTimecode = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 24);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };
  
  const handleToggle = (id, e) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };
  
  return (
    <div className="px-3 pt-3 pb-2">
      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-3">
        Priority Review ({queue.length})
      </div>
      
      <div className="of-issue-list">
        {queue.map((item, idx) => {
          const subtitle = subtitles.find(s => s.index === item.subIndex);
          const timecode = subtitle ? formatTimecode(subtitle.startTime) : '00:00:00:00';
          const isExpanded = expandedId === `${item.subIndex}-${item.id}`;
          
          return (
            <div
              key={`${item.subIndex}-${item.id}-${idx}`}
              className={`of-issue-item ${item.severity}`}
            >
              <button
                className="of-issue-header"
                onClick={() => onItemClick?.(item.subIndex)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="of-issue-dot" />
                    <span className="of-issue-title">{item.ruleName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
                    <span>Sub #{item.subIndex}</span>
                    <span>•</span>
                    <span>{timecode}</span>
                  </div>
                </div>
                
                <button
                  className="flex-shrink-0 p-1 hover:bg-slate-700/30 rounded transition-colors"
                  onClick={(e) => handleToggle(`${item.subIndex}-${item.id}`, e)}
                >
                  {isExpanded ? (
                    <ChevronUp size={10} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={10} className="text-slate-500" />
                  )}
                </button>
              </button>
              
              {isExpanded && (
                <div className="of-issue-details">
                  <div className="of-issue-explanation">
                    {item.description}
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Score Impact</span>
                    <span className={`font-bold ${
                      item.severity === 'error' ? 'text-rose-400' : 
                      item.severity === 'warning' ? 'text-amber-400' : 
                      'text-blue-400'
                    }`}>
                      {item.scoreHit}
                    </span>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">Quality Score</span>
                      <span className={`font-bold ${
                        item.score >= 90 ? 'text-emerald-400' : 
                        item.score >= 70 ? 'text-amber-400' : 
                        'text-rose-400'
                      }`}>
                        {item.score}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Glossary (KNP) Tab Content
 */
function GlossaryTab({ glossary = [], onItemClick }) {
  if (glossary.length === 0) {
    return (
      <div className="text-center text-slate-600 text-xs py-8">
        No glossary entries
      </div>
    );
  }
  
  return (
    <div className="of-glossary-list">
      {glossary.map((item, idx) => (
        <div
          key={idx}
          className="of-glossary-item"
          onClick={() => onItemClick?.(item)}
        >
          <div className="of-glossary-header">
            <span className="of-glossary-term">{item.term}</span>
            <span className="of-glossary-type">{item.type}</span>
          </div>
          <div className="of-glossary-tc">{item.tc}</div>
        </div>
      ))}
    </div>
  );
}

export default InspectorPanel;
