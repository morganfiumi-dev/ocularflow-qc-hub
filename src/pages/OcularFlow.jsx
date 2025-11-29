/**
 * OcularFlow v10.5 - Subtitle QC Cockpit
 * Main orchestration component
 * 
 * Layout:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ TOP BAR (Logo, Project Info, Actions)                          │
 * ├─────────────────────────────────────────────┬───────────────────┤
 * │                                             │                   │
 * │ VIDEO PANEL                                 │   INSPECTOR       │
 * │ (VideoPlayer + Toolbar)                     │   PANEL           │
 * │                                             │   (Analysis/      │
 * ├─────────────────────────────────────────────┤    Queue/KNP)     │
 * │ WAVEFORM PANEL                              │                   │
 * │ (Controls + Timeline + Pills)               │                   │
 * ├─────────────────────────────────────────────┤                   │
 * │ EDITOR PANEL                                │                   │
 * │ (Subtitle Grid)                             │                   │
 * └─────────────────────────────────────────────┴───────────────────┘
 */

import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Zap, ArrowRight, PlayCircle, HelpCircle, Settings } from 'lucide-react';

// Components
import { VideoPanel } from '../components/video/VideoPanel';
import { WaveformPanel } from '../components/waveform/WaveformPanel';
import { EditorPanel } from '../components/editor/EditorPanel';
import { InspectorPanel } from '../components/inspector/InspectorPanel';
import { Button } from '../components/atoms/Button';

// State
import { useSubtitleStore } from '../state/useSubtitleStore';
import { useVideoState } from '../state/useVideoState';
import { useIssueStore, KNP_GLOSSARY } from '../state/useIssueStore';

// Hooks
import { useWaveform } from '../hooks/useWaveform';
import { useHotkeys } from '../hooks/useHotkeys';
import { useVideoSync } from '../hooks/useVideoSync';

// tRPC
import { trpc } from '../lib/trpc-mock';

// Demo project loader
import { isDemoAsset, getDemoVideoUrl } from '../utils/demoProjectLoader';
import { loadContext } from '../demo/loadContextualMetadata';

// Styles
import '../styles/ocularflow.css';

/**
 * OcularFlow main component
 */
export default function OcularFlow() {
  const { assetId } = useParams();
  
  // Fetch subtitle track from tRPC backend
  const { data: subtitleTrack, isLoading: trackLoading } = trpc.media.getSubtitleTrack.useQuery(
    { assetId: assetId || '' },
    { enabled: !!assetId }
  );
  
  // =========================================================================
  // STATE
  // =========================================================================
  
  // Layout state
  const [inspectorWidth, setInspectorWidth] = useState(420);
  const [waveformHeight, setWaveformHeight] = useState(240);
  
  // Contextual metadata
  const [contextMetadata, setContextMetadata] = useState(null);
  
  // Subtitle store
  const subtitles = useSubtitleStore((state) => state.subtitles);
  const currentIndex = useSubtitleStore((state) => state.currentIndex);
  const filter = useSubtitleStore((state) => state.filter);
  const loading = useSubtitleStore((state) => state.loading);
  const loadSubtitles = useSubtitleStore((state) => state.loadSubtitles);
  const selectSubtitle = useSubtitleStore((state) => state.selectSubtitle);
  const selectNext = useSubtitleStore((state) => state.selectNext);
  const selectPrevious = useSubtitleStore((state) => state.selectPrevious);
  const updateText = useSubtitleStore((state) => state.updateText);
  const setFilter = useSubtitleStore((state) => state.setFilter);
  
  // Computed values
  const currentSubtitle = useSubtitleStore((state) => state.getCurrentSubtitle());
  const filteredSubtitles = useSubtitleStore((state) => state.getFilteredSubtitles());
  const reviewQueue = useSubtitleStore((state) => state.getReviewQueue());
  const stats = useSubtitleStore((state) => state.getStats());
  
  // Video state
  const {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    muted,
    togglePlayback,
    seek,
    skipForward,
    skipBackward,
    frameForward,
    frameBackward,
    setPlaybackRate,
    setVolume,
    toggleMute,
    setDuration
  } = useVideoState();
  
  // Issue/Inspector state
  const {
    activeTab,
    expandedIssueId,
    showScoreBreakdown,
    showAnnotations,
    setActiveTab,
    toggleIssue,
    toggleScoreBreakdown,
    toggleSourceAnnotations,
    toggleTargetAnnotations
  } = useIssueStore();
  
  // Waveform state
  const waveform = useWaveform(currentTime, duration);
  
  // Video sync
  const videoSync = useVideoSync({
    currentTime,
    subtitles,
    currentIndex,
    autoScroll: true,
    onSubtitleChange: selectSubtitle,
    onSeek: seek
  });
  
  // =========================================================================
  // EFFECTS
  // =========================================================================
  
  // Load subtitles from tRPC when available
  useEffect(() => {
    if (subtitleTrack?.segments) {
      // Convert backend segments to frontend subtitle format
      const formattedSubtitles = subtitleTrack.segments.map((seg, idx) => ({
        id: idx,
        index: seg.index,
        inTime: seg.inTime,
        outTime: seg.outTime,
        duration: seg.duration,
        sourceText: seg.sourceText || '',
        targetText: seg.targetText || '',
        cps: seg.metrics?.cps || 0,
        chars: seg.metrics?.chars || 0,
        issues: seg.issues || [],
      }));
      
      // Load into store (you may need to update useSubtitleStore to handle this)
      // For now, fallback to mock data
      loadSubtitles();
    } else {
      loadSubtitles();
    }
  }, [subtitleTrack, loadSubtitles]);
  
  // Load contextual metadata
  useEffect(() => {
    async function loadContextData() {
      try {
        const context = await loadContext();
        setContextMetadata(context);
      } catch (error) {
        console.error('Failed to load context metadata:', error);
      }
    }
    
    loadContextData();
  }, []);
  
  // =========================================================================
  // HANDLERS
  // =========================================================================
  
  // Handle subtitle selection (also seeks video)
  const handleSelectSubtitle = useCallback((index) => {
    selectSubtitle(index);
    videoSync.seekToIndex(index);
  }, [selectSubtitle, videoSync]);
  
  // Handle queue item click
  const handleQueueItemClick = useCallback((subIndex) => {
    handleSelectSubtitle(subIndex);
    setActiveTab('ANALYSIS');
  }, [handleSelectSubtitle, setActiveTab]);
  
  // Handle glossary item click
  const handleGlossaryItemClick = useCallback((item) => {
    seek(item.seconds);
    handleSelectSubtitle(item.subId);
  }, [seek, handleSelectSubtitle]);
  
  // Handle waveform seek
  const handleWaveformSeek = useCallback((time) => {
    seek(time);
  }, [seek]);
  
  // Handle inspector width change
  const handleInspectorWidthChange = useCallback((delta) => {
    setInspectorWidth(w => Math.max(300, Math.min(600, w + delta)));
  }, []);
  
  // Handle waveform height change
  const handleWaveformHeightChange = useCallback((delta) => {
    setWaveformHeight(h => Math.max(100, Math.min(600, h + delta)));
  }, []);
  
  // =========================================================================
  // HOTKEYS
  // =========================================================================
  
  useHotkeys({
    togglePlayback,
    skipForward,
    skipBackward,
    frameForward,
    frameBackward,
    nextSubtitle: selectNext,
    previousSubtitle: selectPrevious
  });
  
  // =========================================================================
  // RENDER
  // =========================================================================
  
  // Loading state
  if (loading || trackLoading) {
    return (
      <div className="of-cockpit flex items-center justify-center">
        <div className="text-cyan-500 font-mono animate-pulse text-lg">
          LOADING COCKPIT...
        </div>
      </div>
    );
  }
  
  return (
    <div className="of-cockpit">
      {/* TOP BAR */}
      <div className="of-topbar">
        {/* Left: Logo & Project Info */}
        <div className="flex items-center gap-4">
          <div className="of-logo">
            <Zap size={16} fill="currentColor" />
            <span className="of-logo-text">
              OCULAR<span>FLOW</span> v10.5
            </span>
          </div>
          
          <div className="h-4 w-px bg-slate-800" />
          
          <div className="of-project-info">
            <span className="text-slate-300">NFLX_WITCHER_S3</span>
            <span className="text-cyan-600 flex items-center gap-1">
              EN <ArrowRight size={8} /> ES
            </span>
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="of-topbar-actions">
          <select className="of-select">
            <option>Netflix Standard</option>
            <option>Netflix SDH</option>
            <option>Amazon Prime</option>
            <option>Disney+</option>
          </select>
          
          <Button variant="primary" icon={PlayCircle}>
            RUN QC
          </Button>
          
          <button className="text-slate-500 hover:text-slate-300">
            <HelpCircle size={16} />
          </button>
          
          <button className="text-slate-500 hover:text-slate-300">
            <Settings size={16} />
          </button>
        </div>
      </div>
      
      {/* MAIN CONTENT */}
      <div className="of-main">
        {/* LEFT PANEL: Video + Waveform + Editor */}
        <div className="of-left-panel">
          {/* Video Panel */}
          <VideoPanel
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            currentSubtitle={currentSubtitle}
            contextType={currentSubtitle?.contextType}
            onTogglePlayback={togglePlayback}
            onSkipForward={skipForward}
            onSkipBackward={skipBackward}
            onFrameForward={frameForward}
            onFrameBackward={frameBackward}
            onSeek={seek}
            onPlaybackRateChange={setPlaybackRate}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
            onDurationChange={setDuration}
          />
          
          {/* Waveform Panel */}
          <WaveformPanel
            height={waveformHeight}
            collapsed={waveform.collapsed}
            waveformBars={waveform.waveformBars}
            zoomLevel={waveform.zoomLevel}
            scrollMode={waveform.scrollMode}
            isolateDialogue={waveform.isolateDialogue}
            spectrogramMode={waveform.spectrogramMode}
            issueFilters={waveform.issueFilters}
            subtitles={subtitles}
            currentIndex={currentIndex}
            currentTime={currentTime}
            duration={duration}
            windowStart={waveform.windowStart}
            visibleWindow={waveform.visibleWindow}
            playheadPct={waveform.playheadPct}
            onHeightChange={handleWaveformHeightChange}
            onToggleCollapse={waveform.toggleCollapsed}
            onZoomIn={waveform.zoomIn}
            onZoomOut={waveform.zoomOut}
            onScrollModeChange={waveform.setScrollMode}
            onToggleDialogueIsolation={waveform.toggleDialogueIsolation}
            onToggleSpectrogramMode={waveform.toggleSpectrogramMode}
            onToggleIssueFilter={waveform.toggleIssueFilter}
            onSeek={handleWaveformSeek}
            onSubtitleClick={handleSelectSubtitle}
          />
          
          {/* Editor Panel */}
          <EditorPanel
            subtitles={filteredSubtitles}
            currentIndex={currentIndex}
            stats={stats}
            filter={filter}
            onSelectSubtitle={handleSelectSubtitle}
            onTextChange={updateText}
            onFilterChange={setFilter}
            autoScroll={true}
          />
        </div>
        
        {/* RIGHT PANEL: Inspector */}
        <InspectorPanel
          width={inspectorWidth}
          currentSubtitle={currentSubtitle}
          contextMetadata={contextMetadata}
          activeTab={activeTab}
          expandedIssueId={expandedIssueId}
          showScoreBreakdown={showScoreBreakdown}
          showAnnotations={showAnnotations}
          reviewQueue={reviewQueue}
          knpGlossary={KNP_GLOSSARY}
          onWidthChange={handleInspectorWidthChange}
          onTabChange={setActiveTab}
          onToggleIssue={toggleIssue}
          onToggleScoreBreakdown={toggleScoreBreakdown}
          onToggleSourceAnnotations={toggleSourceAnnotations}
          onToggleTargetAnnotations={toggleTargetAnnotations}
          onQueueItemClick={handleQueueItemClick}
          onGlossaryItemClick={handleGlossaryItemClick}
        />
      </div>
    </div>
  );
}
