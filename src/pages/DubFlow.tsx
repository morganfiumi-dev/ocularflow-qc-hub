/**
 * DubFlow v3 - Audio QC Cockpit (OcularFlow-style)
 * Three-column layout with OcularFlow's waveform component
 * UI-only refactor, no logic changes
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, PlayCircle } from 'lucide-react';
import { WaveformPanel } from '../components/waveform/WaveformPanel';
import { VideoPanel } from '../components/video/VideoPanel';
import { DialogueTable } from '../components/dubflow/DialogueTable';
import { AudioToolbar } from '../components/dubflow/AudioToolbar';
import { RightInspector } from '../components/dubflow/tabs/RightInspector';
import { TimelineAnnotations } from '../components/dubflow/TimelineAnnotations';
import { InlineRecommendations } from '../components/dubflow/InlineRecommendations';
import { Button } from '../components/atoms/Button';
import { trpc } from '../lib/trpc';
import useQCProfileStore from '../state/useQCProfileStore';
import { calculateClipScore, calculateAssetScore } from '../utils/qcScoring';
import { useWaveform } from '../hooks/useWaveform';
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
  // Redistributed across the timeline with issues throughout
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
      issues: []
    },
    {
      id: 3,
      timeIn: '00:00:13:18',
      timeInSeconds: 13.75,
      timeOutSeconds: 16.8,
      enText: 'But destiny has other plans for the White Wolf.',
      dubText: 'Pero el destino tiene otros planes para el Lobo Blanco.',
      issues: []
    },
    {
      id: 4,
      timeIn: '00:00:18:06',
      timeInSeconds: 18.25,
      timeOutSeconds: 21.9,
      enText: 'Princess Cirilla holds a power that could change everything.',
      dubText: 'La princesa Cirilla posee un poder que podría cambiarlo todo.',
      issues: []
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
    {
      id: 6,
      timeIn: '00:03:45:00',
      timeInSeconds: 225.0,
      timeOutSeconds: 228.5,
      enText: 'The witcher must hunt the beast before nightfall.',
      dubText: 'El brujo debe cazar a la bestia antes del anochecer.',
      issues: issues.filter(i => i.timeSeconds >= 225 && i.timeSeconds < 229)
    },
    {
      id: 7,
      timeIn: '00:04:12:18',
      timeInSeconds: 252.75,
      timeOutSeconds: 256.2,
      enText: 'Her power grows stronger with each passing day.',
      dubText: 'Su poder se vuelve más fuerte con cada día que pasa.',
      issues: issues.filter(i => i.timeSeconds >= 252 && i.timeSeconds < 257)
    },
    {
      id: 8,
      timeIn: '00:05:30:00',
      timeInSeconds: 330.0,
      timeOutSeconds: 333.8,
      enText: 'The mages gather in secret to plot their revenge.',
      dubText: 'Los magos se reúnen en secreto para planear su venganza.',
      issues: []
    },
    {
      id: 9,
      timeIn: '00:06:15:12',
      timeInSeconds: 375.5,
      timeOutSeconds: 379.0,
      enText: 'Blood and steel will decide the fate of kingdoms.',
      dubText: 'Sangre y acero decidirán el destino de los reinos.',
      issues: issues.filter(i => i.timeSeconds >= 375 && i.timeSeconds < 380)
    },
    {
      id: 10,
      timeIn: '00:06:50:00',
      timeInSeconds: 410.0,
      timeOutSeconds: 413.5,
      enText: 'The final battle approaches, destiny awaits.',
      dubText: 'La batalla final se acerca, el destino aguarda.',
      issues: issues.filter(i => i.timeSeconds >= 410 && i.timeSeconds < 415)
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
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = audioTrack?.metadata.duration || 420;
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.75);
  const [muted, setMuted] = useState(false);
  const [notes, setNotes] = useState('');
  const [loopMode, setLoopMode] = useState(false);

  // Waveform state - using OcularFlow's hook for smooth syncing
  const waveform = useWaveform(currentTime, duration);

  // Timeline annotations (mock data) - distributed across full timeline
  const [showAnnotations, setShowAnnotations] = useState(true);
  const annotations = [
    { time: 3, type: 'scene' as const, label: 'INT. CASTLE' },
    { time: 8, type: 'forced_narrative' as const, label: 'NARRATOR' },
    { time: 15, type: 'song' as const, label: 'TOSS A COIN' },
    { time: 20, type: 'scene' as const, label: 'EXT. FOREST' },
    { time: 24, type: 'title' as const, label: 'MAIN TITLE' },
    { time: 180, type: 'scene' as const, label: 'INT. TAVERN' },
    { time: 240, type: 'song' as const, label: 'BATTLE THEME' },
    { time: 300, type: 'scene' as const, label: 'EXT. MOUNTAIN' },
    { time: 360, type: 'forced_narrative' as const, label: 'VOICEOVER' },
    { time: 405, type: 'scene' as const, label: 'FINAL SCENE' },
  ];

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

  // Auto-select dialogue line based on current time (like video sync)
  useEffect(() => {
    const activeLine = dialogueLinesWithScores.find(
      line => currentTime >= line.timeInSeconds && currentTime < line.timeOutSeconds
    );
    
    if (activeLine && activeLine.id !== selectedLineId) {
      setSelectedLineId(activeLine.id);
    }
  }, [currentTime, dialogueLinesWithScores, selectedLineId]);

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

      {/* Two-column layout: CENTER + RIGHT */}
      <div className="of-main">
        {/* CENTER COLUMN: Video + Waveform + Dialogue Table */}
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

          {/* Audio Toolbar */}
          <AudioToolbar
            spectrogramMode={waveform.spectrogramMode}
            loopMode={loopMode}
            onToggleSpectrogram={waveform.toggleSpectrogramMode}
            onToggleLoop={() => setLoopMode(!loopMode)}
          />

          {/* Waveform Panel - Using OcularFlow's component with DubFlow overlays */}
          <div className="relative">
            <WaveformPanel
              height={waveform.height}
              collapsed={waveform.collapsed}
              waveformBars={waveform.waveformBars}
              zoomLevel={waveform.zoomLevel}
              scrollMode={waveform.scrollMode}
              isolateDialogue={waveform.isolateDialogue}
              spectrogramMode={waveform.spectrogramMode}
              issueFilters={waveform.issueFilters}
              subtitles={dialogueLinesWithScores.map(line => ({
                index: line.id,
                startTime: line.timeInSeconds,
                endTime: line.timeOutSeconds,
                text: line.dubText,
                issues: line.issues.map(issue => ({
                  id: String(issue.id),
                  severity: issue.severity,
                  type: issue.type,
                  description: issue.description
                }))
              }))}
              currentIndex={selectedLineId || 1}
              currentTime={currentTime}
              duration={duration}
              windowStart={waveform.windowStart}
              visibleWindow={waveform.visibleWindow}
              playheadPct={waveform.playheadPct}
              onHeightChange={waveform.adjustHeight}
              onToggleCollapse={waveform.toggleCollapsed}
              onZoomIn={waveform.zoomIn}
              onZoomOut={waveform.zoomOut}
              onScrollModeChange={waveform.setScrollMode}
              onToggleDialogueIsolation={waveform.toggleDialogueIsolation}
              onToggleSpectrogramMode={waveform.toggleSpectrogramMode}
              onToggleIssueFilter={waveform.toggleIssueFilter}
              onSeek={seek}
              onSubtitleClick={handleSelectLine}
            />
            
            {/* Timeline Annotations Overlay */}
            <TimelineAnnotations
              annotations={annotations}
              windowStart={waveform.windowStart}
              visibleWindow={waveform.visibleWindow}
              show={showAnnotations}
            />
            
            {/* Inline Recommendations */}
            <InlineRecommendations
              lines={dialogueLinesWithScores}
              windowStart={waveform.windowStart}
              visibleWindow={waveform.visibleWindow}
              onApplyFix={(lineId, fixType) => {
                console.log(`Apply ${fixType} to line ${lineId}`);
              }}
            />
          </div>
          
          {/* Dialogue Table (Bottom) */}
          <DialogueTable
            lines={dialogueLinesWithScores}
            selectedLineId={selectedLineId}
            currentTime={currentTime}
            onSelectLine={handleSelectLine}
          />
        </div>

        {/* RIGHT COLUMN: 5-Tab Inspector */}
        <div className="of-right-panel">
          <RightInspector
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
