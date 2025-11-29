/**
 * DubFlow v2 - Audio QC Cockpit
 * Three-panel cockpit matching OcularFlow design
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, PlayCircle } from 'lucide-react';
import { AudioPanel } from '../components/dubflow/AudioPanel';
import { Waveform } from '../components/dubflow/Waveform';
import { DialogueEditor } from '../components/dubflow/DialogueEditor';
import { AudioInspector } from '../components/dubflow/AudioInspector';
import { Button } from '../components/atoms/Button';
import { trpc } from '../lib/trpc';
import useQCProfileStore from '../state/useQCProfileStore';
import { calculateClipScore, calculateAssetScore, getScoreColor } from '../utils/qcScoring';

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
  
  // Map backend issues to component format with categories
  const issues = audioTrack?.issues.map(issue => {
    // Auto-assign category based on issue type
    let category = 'technical';
    const issueType = issue.type.toLowerCase().replace(/\s+/g, '_');
    
    if (['sync_drift', 'duration_mismatch', 'early_entry', 'late_cutoff', 'timing_offset'].includes(issueType)) {
      category = 'timing';
    } else if (['missing_words', 'added_words', 'repetition', 'tone_mismatch', 'prosody_issue', 'pitch_mismatch'].includes(issueType)) {
      category = 'dialogue';
    } else if (issueType.includes('speaker') || issueType.includes('mouth')) {
      category = 'speaker';
    } else if (issueType.includes('synthetic') || issueType.includes('ai') || issueType.includes('artifacts')) {
      category = 'synthetic';
    } else if (issueType.includes('translation')) {
      category = 'translation';
    }

    return {
      id: issue.id,
      timecode: issue.timecode,
      timeSeconds: issue.timeSeconds,
      type: issue.type,
      severity: issue.severity as 'error' | 'warning' | 'info',
      description: issue.description,
      category,
    };
  }) || [];

  // Mock dialogue lines (in production, these would come from backend)
  const dialogueLines = [
    {
      id: 1,
      timeIn: '00:00:05:12',
      timeInSeconds: 5.5,
      enText: 'The Continent is vast, full of monsters and magic.',
      dubText: 'El Continente es vasto, lleno de monstruos y magia.',
      issues: issues.filter(i => i.timeSeconds >= 5 && i.timeSeconds < 8)
    },
    {
      id: 2,
      timeIn: '00:00:09:00',
      timeInSeconds: 9.0,
      enText: 'Geralt of Rivia hunts creatures for coin.',
      dubText: 'Geralt de Rivia caza criaturas por monedas.',
      issues: issues.filter(i => i.timeSeconds >= 9 && i.timeSeconds < 12)
    },
    {
      id: 3,
      timeIn: '00:00:13:18',
      timeInSeconds: 13.75,
      enText: 'But destiny has other plans for the White Wolf.',
      dubText: 'Pero el destino tiene otros planes para el Lobo Blanco.',
      issues: issues.filter(i => i.timeSeconds >= 13 && i.timeSeconds < 17)
    },
    {
      id: 4,
      timeIn: '00:00:18:06',
      timeInSeconds: 18.25,
      enText: 'Princess Cirilla holds a power that could change everything.',
      dubText: 'La princesa Cirilla posee un poder que podría cambiarlo todo.',
      issues: issues.filter(i => i.timeSeconds >= 18 && i.timeSeconds < 22)
    },
    {
      id: 5,
      timeIn: '00:00:23:00',
      timeInSeconds: 23.0,
      enText: 'Yennefer seeks to harness ancient magic.',
      dubText: 'Yennefer busca aprovechar la magia antigua.',
      issues: []
    },
  ];

  // Calculate clip scores using QC profile
  const clipScores = langConfig ? dialogueLines.map(line => {
    const clipIssues = line.issues.map(issue => ({
      id: issue.id,
      categoryId: issue.category,
      checkId: issue.type.toLowerCase().replace(/\s+/g, '_'),
      time: issue.timeSeconds,
      severity: issue.severity.toUpperCase() as 'ERROR' | 'WARNING' | 'INFO',
      description: issue.description
    }));
    return calculateClipScore(clipIssues, langConfig);
  }) : [];

  // Calculate overall asset score
  const assetScore = calculateAssetScore(clipScores);

  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = audioTrack?.metadata.duration || 420;
  const [volume, setVolume] = useState(75);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Inspector state
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  // Playback simulation
  const playbackInterval = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      playbackInterval.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
        playbackInterval.current = null;
      }
    }

    return () => {
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
      }
    };
  }, [isPlaying, duration]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleJumpBackward = () => {
    setCurrentTime(prev => Math.max(0, prev - 2));
  };

  const handleJumpForward = () => {
    setCurrentTime(prev => Math.min(duration, prev + 2));
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(4, prev + 0.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.5, prev - 0.5));
  };

  const handleSelectIssue = (id: number) => {
    setSelectedIssueId(id);
    const issue = issues.find(i => i.id === id);
    if (issue) {
      handleSeek(issue.timeSeconds);
    }
  };

  const handleSelectLine = (id: number) => {
    setSelectedLineId(id);
    const line = dialogueLines.find(l => l.id === id);
    if (line) {
      handleSeek(line.timeInSeconds);
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
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Top Bar - Matching OcularFlow */}
      <div className="h-12 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between px-4 flex-shrink-0">
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
                <span className="text-[10px] text-slate-600">v2.0</span>
              </div>
              <p className="text-[10px] text-slate-500">
                NFLX_WITCHER_S3 • <span className="font-mono">{assetId}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profile && (
            <div className="px-3 py-1.5 text-xs font-semibold bg-slate-800/60 border border-slate-700 text-slate-300 rounded-lg">
              {profile.client}
            </div>
          )}
          
          {langConfig && (
            <div className={`px-3 py-1.5 text-xs font-bold rounded-lg ${getScoreColor(assetScore)} bg-slate-800/60 border border-slate-700`}>
              Score: {assetScore.toFixed(1)}
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

      {/* Three-panel cockpit layout */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* LEFT: Audio Tools Sidebar */}
        <div className="w-80 flex-shrink-0 overflow-hidden">
          <AudioPanel
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            language={audioTrack?.metadata.language || 'EN-US'}
            codec={audioTrack?.metadata.codec || 'AAC'}
            onTogglePlay={handleTogglePlay}
            onJumpBackward={handleJumpBackward}
            onJumpForward={handleJumpForward}
            onVolumeChange={setVolume}
            volume={volume}
          />
        </div>

        {/* CENTER: Dialogue Editor + Waveform Stack */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Dialogue Editor (Top) */}
          <div className="flex-1 overflow-hidden">
            <DialogueEditor
              lines={dialogueLines}
              selectedLineId={selectedLineId}
              currentTime={currentTime}
              onSelectLine={handleSelectLine}
            />
          </div>

          {/* Waveform (Bottom) */}
          <div className="h-64 flex-shrink-0 overflow-hidden">
            <Waveform
              currentTime={currentTime}
              duration={duration}
              zoomLevel={zoomLevel}
              onSeek={handleSeek}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              issues={issues}
            />
          </div>
        </div>

        {/* RIGHT: Inspector */}
        <div className="w-96 flex-shrink-0 overflow-hidden">
          <AudioInspector
            issues={issues}
            selectedIssueId={selectedIssueId}
            onSelectIssue={handleSelectIssue}
            notes={notes}
            onNotesChange={setNotes}
          />
        </div>
      </div>
    </div>
  );
}
