/**
 * DubFlow v3 - Audio QC Cockpit (OcularFlow-style)
 * Three-column layout with OcularFlow's waveform component
 * UI-only refactor, no logic changes
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, PlayCircle } from 'lucide-react';
import { ToolsSidebar } from '../components/dubflow/ToolsSidebar';
import { WaveformPanel } from '../components/waveform/WaveformPanel';
import { VideoPanel } from '../components/video/VideoPanel';
import { DialogueHighlightStrip } from '../components/dubflow/DialogueHighlightStrip';
import { TabbedInspector } from '../components/dubflow/TabbedInspector';
import { Button } from '../components/atoms/Button';
import { trpc } from '../lib/trpc';
import useQCProfileStore from '../state/useQCProfileStore';
import { calculateClipScore, calculateAssetScore } from '../utils/qcScoring';
import { generateWaveformBars } from '../utils/waveformProcessing';
import '../styles/ocularflow.css';

export default function DubFlow() {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  
  // QC Profile integration
  const { currentProfile, currentLanguageConfig } = useQCProfileStore();
  const profile = currentProfile();
  const langConfig = currentLanguageConfig();
  
  // Fetch audio track from tRPC backend
  const { data: audioTrack, isLoading } = trpc.media.getAudioTrack.useQuery(
    { assetId: assetId || '' },
    { enabled: !!assetId }
  );
  
  // Map backend issues to component format with QC Profile categories
  const issues = audioTrack?.issues.map(issue => {
    const issueType = issue.type.toLowerCase().replace(/\s+/g, '_');
    
    // Determine category based on actual QC profile structure
    let categoryId = 'audio_deficiency'; // default
    let checkId = issueType;
    
    if (['sync_drift', 'early_entry', 'late_entry', 'late_cutoff', 'duration_mismatch', 'pacing_cps'].includes(issueType)) {
      categoryId = 'timing_sync';
    } else if (['missing_words', 'added_words', 'repetition_stutter', 'tone_mismatch', 'prosody_issues', 'pitch_gender_mismatch', 'pronunciation_incorrect'].includes(issueType)) {
      categoryId = 'dialogue_integrity';
    } else if (['channel_missing_l', 'channel_missing_r', 'channel_missing_c', 'channel_missing_lfe', 'channel_sound_absent', 'channel_label_incorrect', 'audio_video_mismatch_stereo', 'audio_video_mismatch_surround'].includes(issueType)) {
      categoryId = 'channel_integrity';
    } else if (['ai_voice_detection', 'over_smoothing', 'accent_anomalies', 'synthetic_artifacts'].includes(issueType)) {
      categoryId = 'synthetic_voice';
    } else if (['literal_translation', 'wrong_domain_term', 'formality_issues', 'incorrect_region_subtag', 'incorrect_language_tag', 'incorrect_translation'].includes(issueType)) {
      categoryId = 'translation';
    }

    return {
      id: issue.id,
      timecode: issue.timecode,
      timeSeconds: issue.timeSeconds,
      type: issue.type,
      severity: issue.severity as 'error' | 'warning' | 'info',
      description: issue.description,
      categoryId,
      checkId,
    };
  }) || [];

  // Mock dialogue lines (in production, these would come from backend)
  const dialogueLines = [
    {
      id: 1,
      timeIn: '00:00:05:12',
      timeInSeconds: 5.5,
      timeOutSeconds: 7.8,
      enText: 'The Continent is vast, full of monsters and magic.',
      dubText: 'El Continente es vasto, lleno de monstruos y magia.',
      issues: issues.filter(i => i.timeSeconds >= 5 && i.timeSeconds < 8)
    },
    {
      id: 2,
      timeIn: '00:00:09:00',
      timeInSeconds: 9.0,
      timeOutSeconds: 11.5,
      enText: 'Geralt of Rivia hunts creatures for coin.',
      dubText: 'Geralt de Rivia caza criaturas por monedas.',
      issues: issues.filter(i => i.timeSeconds >= 9 && i.timeSeconds < 12)
    },
    {
      id: 3,
      timeIn: '00:00:13:18',
      timeInSeconds: 13.75,
      timeOutSeconds: 16.8,
      enText: 'But destiny has other plans for the White Wolf.',
      dubText: 'Pero el destino tiene otros planes para el Lobo Blanco.',
      issues: issues.filter(i => i.timeSeconds >= 13 && i.timeSeconds < 17)
    },
    {
      id: 4,
      timeIn: '00:00:18:06',
      timeInSeconds: 18.25,
      timeOutSeconds: 21.9,
      enText: 'Princess Cirilla holds a power that could change everything.',
      dubText: 'La princesa Cirilla posee un poder que podría cambiarlo todo.',
      issues: issues.filter(i => i.timeSeconds >= 18 && i.timeSeconds < 22)
    },
    {
      id: 5,
      timeIn: '00:00:23:00',
      timeInSeconds: 23.0,
      timeOutSeconds: 25.5,
      enText: 'Yennefer seeks to harness ancient magic.',
      dubText: 'Yennefer busca aprovechar la magia antigua.',
      issues: []
    },
  ];

  // Calculate clip scores using QC profile
  const clipScores = langConfig ? dialogueLines.map(line => {
    const clipIssues = line.issues.map(issue => ({
      id: String(issue.id),
      categoryId: issue.categoryId,
      checkId: issue.checkId,
      time: issue.timeSeconds,
      severity: issue.severity.toUpperCase() as 'ERROR' | 'WARNING' | 'INFO',
      description: issue.description
    }));
    return calculateClipScore(clipIssues, langConfig);
  }) : [];

  // Calculate overall asset score
  const assetScore = calculateAssetScore(clipScores);

  // Add scores to dialogue lines
  const dialogueLinesWithScores = dialogueLines.map((line, idx) => ({
    ...line,
    score: clipScores[idx]
  }));

  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = audioTrack?.metadata.duration || 420;
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.75);
  const [muted, setMuted] = useState(false);
  
  // Waveform state (simple local state, matching OcularFlow structure)
  const [zoomLevel, setZoomLevel] = useState(2);
  const [waveformCollapsed, setWaveformCollapsed] = useState(false);
  
  // Inspector state
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  // Calculate waveform window and bars from actual audio data
  const windowStart = Math.max(0, currentTime - 5);
  const visibleWindow = 10 / zoomLevel;
  
  const waveformBars = useMemo(() => {
    // Use actual waveform data from backend if available
    if (audioTrack?.waveform?.visualData) {
      const visualData = audioTrack.waveform.visualData;
      const totalDuration = audioTrack.waveform.duration;
      
      // Calculate which portion of visualData to show based on current window
      const startIdx = Math.floor((windowStart / totalDuration) * visualData.length);
      const endIdx = Math.ceil(((windowStart + visibleWindow) / totalDuration) * visualData.length);
      const windowData = visualData.slice(startIdx, endIdx);
      
      // Resample to 150 bars for display
      const barCount = 150;
      const bars = [];
      for (let i = 0; i < barCount; i++) {
        const sourceIdx = Math.floor((i / barCount) * windowData.length);
        bars.push(windowData[sourceIdx] || 0.1);
      }
      return bars;
    }
    
    // Fallback to generated waveform if no data
    return generateWaveformBars(windowStart, visibleWindow, 150, false);
  }, [audioTrack, windowStart, visibleWindow]);

  // Audio playback - simulated with timer
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + (0.1 * playbackRate);
          if (next >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return next;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, playbackRate]);

  // Playback control handlers
  const togglePlayback = () => setIsPlaying(!isPlaying);
  const seek = (time: number) => setCurrentTime(time);
  const skipForward = () => setCurrentTime(prev => Math.min(duration, prev + 5));
  const skipBackward = () => setCurrentTime(prev => Math.max(0, prev - 5));
  const frameForward = () => setCurrentTime(prev => Math.min(duration, prev + 1/24));
  const frameBackward = () => setCurrentTime(prev => Math.max(0, prev - 1/24));
  const toggleMute = () => setMuted(!muted);

  const handleSelectIssue = (id: number) => {
    setSelectedIssueId(id);
    const issue = issues.find(i => i.id === id);
    if (issue) {
      seek(issue.timeSeconds);
    }
  };

  const handleSelectLine = (id: number) => {
    setSelectedLineId(id);
    const line = dialogueLinesWithScores.find(l => l.id === id);
    if (line) {
      seek(line.timeInSeconds);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-cyan-500 font-mono animate-pulse text-lg">
          LOADING AUDIO TRACK...
        </div>
      </div>
    );
  }

  return (
    <div className="of-cockpit">
      {/* Top Bar - Matching OcularFlow style */}
      <div className="of-topbar">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">DUB</span>
                <span className="text-cyan-500 text-xs font-bold">FLOW</span>
                <span className="text-[10px] text-slate-600">v3.0</span>
              </div>
              <p className="text-[10px] text-slate-500">
                NFLX_WITCHER_S3 • <span className="font-mono">{assetId}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {profile && (
            <div className="px-3 py-1.5 text-xs font-semibold bg-slate-800/60 border border-slate-700 text-slate-300 rounded-lg">
              {profile.client}
            </div>
          )}
          
          {langConfig && (
            <div className="flex items-center gap-2">
              {/* Live Score Display */}
              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all ${
                assetScore >= 90 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : assetScore >= 70 
                  ? 'bg-amber-500/10 border-amber-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex flex-col items-start">
                  <div className="text-[8px] text-slate-500 uppercase tracking-wider">Asset Score</div>
                  <div className={`text-xl font-bold font-mono ${
                    assetScore >= 90 ? 'text-green-400' : assetScore >= 70 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {assetScore.toFixed(1)}
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div className="flex flex-col gap-0.5">
                  <div className={`text-[8px] font-bold uppercase tracking-wider ${
                    assetScore >= 90 ? 'text-green-400' : assetScore >= 70 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {assetScore >= 90 ? 'PASS' : assetScore >= 70 ? 'REVIEW' : 'FAIL'}
                  </div>
                  <div className="text-[8px] text-slate-600 font-mono">
                    {clipScores.length} clips
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/60 border border-slate-700 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[9px] text-slate-500 uppercase tracking-wider">Live</span>
              </div>
            </div>
          )}
          
          <Button variant="primary" icon={PlayCircle} size="sm">
            RUN QC
          </Button>
          
          <button className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Three-column layout with Audio Toolbar */}
      <div className="of-main">
        {/* AUDIO TOOLBAR (leftmost column) */}
        <div className="flex-shrink-0 p-4">
          <ToolsSidebar />
        </div>

        {/* LEFT PANEL: Video + Waveform + Dialogue (OcularFlow structure) */}
        <div className="of-left-panel">
          {/* Video Panel */}
          <VideoPanel
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            currentSubtitle={null}
            contextType="DIALOGUE"
            onTogglePlayback={togglePlayback}
            onSkipForward={skipForward}
            onSkipBackward={skipBackward}
            onFrameForward={frameForward}
            onFrameBackward={frameBackward}
            onSeek={seek}
            onPlaybackRateChange={setPlaybackRate}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
            onDurationChange={() => {}}
          />

          {/* Waveform Panel - Using OcularFlow's component directly */}
          <WaveformPanel
            height={waveformCollapsed ? 32 : 240}
            collapsed={waveformCollapsed}
            waveformBars={waveformBars}
            zoomLevel={zoomLevel}
            scrollMode="CENTER"
            isolateDialogue={false}
            spectrogramMode={false}
            issueFilters={{ error: true, warning: true, info: true }}
            subtitles={dialogueLinesWithScores.map(line => ({
              index: line.id,
              inTime: line.timeInSeconds,
              outTime: line.timeOutSeconds,
              targetText: line.dubText,
              issues: line.issues
            }))}
            currentIndex={selectedLineId || 1}
            currentTime={currentTime}
            duration={duration}
            windowStart={windowStart}
            visibleWindow={visibleWindow}
            playheadPct={30}
            onHeightChange={(delta) => {}}
            onToggleCollapse={() => setWaveformCollapsed(!waveformCollapsed)}
            onZoomIn={() => setZoomLevel(z => Math.min(4, z + 0.5))}
            onZoomOut={() => setZoomLevel(z => Math.max(0.5, z - 0.5))}
            onScrollModeChange={() => {}}
            onToggleDialogueIsolation={() => {}}
            onToggleSpectrogramMode={() => {}}
            onToggleIssueFilter={() => {}}
            onSeek={seek}
            onSubtitleClick={handleSelectLine}
          />
          
          {/* Dialogue Highlight Strip */}
          <div className="of-editor-panel">
            <DialogueHighlightStrip
              lines={dialogueLinesWithScores}
              currentTime={currentTime}
              selectedLineId={selectedLineId}
              onSelectLine={handleSelectLine}
            />
          </div>
        </div>

        {/* RIGHT PANEL: Inspector (OcularFlow structure) */}
        <div className="of-right-panel p-4">
          <TabbedInspector
            issues={issues}
            dialogueLines={dialogueLinesWithScores}
            selectedIssueId={selectedIssueId}
            selectedLineId={selectedLineId}
            currentTime={currentTime}
            notes={notes}
            assetScore={assetScore}
            clipScores={clipScores}
            onSelectIssue={handleSelectIssue}
            onSelectLine={handleSelectLine}
            onNotesChange={setNotes}
          />
        </div>
      </div>
    </div>
  );
}
