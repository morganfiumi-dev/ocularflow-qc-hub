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

import React, { useEffect, useCallback, useState, useMemo } from 'react';
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
import useQCProfileStore from '../state/useQCProfileStore';

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
  
  // Subtitle store - get state and actions
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
  
  // Compute derived values using useMemo
  const currentSubtitle = useMemo(() => {
    return subtitles.find(s => s.index === currentIndex) || null;
  }, [subtitles, currentIndex]);
  
  const filteredSubtitles = useMemo(() => {
    switch (filter) {
      case 'ERRORS':
        return subtitles.filter(s => s.issues?.some(i => i.severity === 'error'));
      case 'WARNINGS':
        return subtitles.filter(s => 
          s.issues?.some(i => i.severity === 'warning') && 
          !s.issues?.some(i => i.severity === 'error')
        );
      case 'CLEAN':
        return subtitles.filter(s => !s.issues || s.issues.length === 0);
      default:
        return subtitles;
    }
  }, [subtitles, filter]);
  
  const reviewQueue = useMemo(() => {
    return subtitles
      .filter(s => s.issues && s.issues.length > 0)
      .sort((a, b) => {
        const aHasError = a.issues.some(i => i.severity === 'error');
        const bHasError = b.issues.some(i => i.severity === 'error');
        if (aHasError && !bHasError) return -1;
        if (!aHasError && bHasError) return 1;
        return 0;
      });
  }, [subtitles]);
  
  const stats = useMemo(() => {
    const total = subtitles.length;
    const withErrors = subtitles.filter(s => s.issues?.some(i => i.severity === 'error')).length;
    const withWarnings = subtitles.filter(s => 
      s.issues?.some(i => i.severity === 'warning') && 
      !s.issues?.some(i => i.severity === 'error')
    ).length;
    const clean = subtitles.filter(s => !s.issues || s.issues.length === 0).length;
    
    return { total, withErrors, withWarnings, clean };
  }, [subtitles]);
  
  // Video state
  const isPlaying = useVideoState((state) => state.isPlaying);
  const currentTime = useVideoState((state) => state.currentTime);
  const duration = useVideoState((state) => state.duration);
  const playbackRate = useVideoState((state) => state.playbackRate);
  const volume = useVideoState((state) => state.volume);
  const muted = useVideoState((state) => state.muted);
  const togglePlayback = useVideoState((state) => state.togglePlayback);
  const seek = useVideoState((state) => state.seek);
  const skipForward = useVideoState((state) => state.skipForward);
  const skipBackward = useVideoState((state) => state.skipBackward);
  const frameForward = useVideoState((state) => state.frameForward);
  const frameBackward = useVideoState((state) => state.frameBackward);
  const setPlaybackRate = useVideoState((state) => state.setPlaybackRate);
  const setVolume = useVideoState((state) => state.setVolume);
  const toggleMute = useVideoState((state) => state.toggleMute);
  const setDuration = useVideoState((state) => state.setDuration);
  
  // Issue/Inspector state
  const activeTab = useIssueStore((state) => state.activeTab);
  const expandedIssueId = useIssueStore((state) => state.expandedIssueId);
  const showScoreBreakdown = useIssueStore((state) => state.showScoreBreakdown);
  const showAnnotations = useIssueStore((state) => state.showAnnotations);
  const setActiveTab = useIssueStore((state) => state.setActiveTab);
  const toggleIssue = useIssueStore((state) => state.toggleIssue);
  const toggleScoreBreakdown = useIssueStore((state) => state.toggleScoreBreakdown);
  const toggleSourceAnnotations = useIssueStore((state) => state.toggleSourceAnnotations);
  const toggleTargetAnnotations = useIssueStore((state) => state.toggleTargetAnnotations);
  
  // QC Profile state
  const profiles = useQCProfileStore((state) => state.profiles);
  const activeClientId = useQCProfileStore((state) => state.activeClientId);
  const loadProfiles = useQCProfileStore((state) => state.loadProfiles);
  const setClient = useQCProfileStore((state) => state.setClient);
  const currentProfile = useQCProfileStore((state) => state.currentProfile());

  
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
  
  // Load QC profiles
  useEffect(() => {
    async function loadQCProfiles() {
      try {
        // Load all profile files from public directory
        const [applePlus, netflix, disney, amazon] = await Promise.all([
          import('../qc/profiles/apple_plus.json'),
          import('../qc/profiles/netflix.json'),
          import('../qc/profiles/disney_plus.json'),
          import('../qc/profiles/amazon.json')
        ]);
        
        loadProfiles([applePlus.default, netflix.default, disney.default, amazon.default]);
      } catch (error) {
        console.error('Failed to load QC profiles:', error);
      }
    }
    
    loadQCProfiles();
  }, [loadProfiles]);
  
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
  
  // Handle waveform height change
  const handleWaveformHeightChange = useCallback((delta) => {
    waveform.adjustHeight(delta);
  }, [waveform]);
  
  // Handle inspector width change
  const handleInspectorWidthChange = useCallback((delta) => {
    setInspectorWidth(w => Math.max(300, Math.min(600, w + delta)));
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
            <span className="text-slate-300">The Witcher: Season 3 Episode 1 - Shaerrawedd</span>
            <span className="text-cyan-600 flex items-center gap-1">
              EN <ArrowRight size={8} /> ES
            </span>
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="of-topbar-actions">
          <select 
            className="of-select"
            value={activeClientId}
            onChange={(e) => setClient(e.target.value)}
          >
            {profiles.map(profile => (
              <option key={profile.id} value={profile.id}>
                {profile.client}
              </option>
            ))}
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
            height={waveform.height}
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
          subtitles={subtitles}
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
