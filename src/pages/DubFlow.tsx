/**
 * DubFlow v1 - Audio QC Cockpit
 * Standalone audio quality control interface
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import { AudioPanel } from '../components/dubflow/AudioPanel';
import { Waveform } from '../components/dubflow/Waveform';
import { Inspector } from '../components/dubflow/Inspector';
import { trpc } from '../lib/trpc';

export default function DubFlow() {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  
  // Fetch audio track from tRPC backend
  const { data: audioTrack, isLoading } = trpc.media.getAudioTrack.useQuery(
    { assetId: assetId || '' },
    { enabled: !!assetId }
  );
  
  // Map backend issues to component format
  const issues = audioTrack?.issues.map(issue => ({
    id: issue.id,
    time: issue.timecode,
    timeSeconds: issue.timeSeconds,
    type: issue.type,
    severity: issue.severity,
    description: issue.description,
    suggestedFix: issue.suggestedFix || '',
  })) || [];

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
      {/* Top Bar */}
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
              <h1 className="text-sm font-bold">DubFlow Audio QC</h1>
              <p className="text-xs text-slate-500">
                Asset: <span className="font-mono">{assetId}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
            Export Report
          </button>
          <button className="px-3 py-1.5 text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors">
            Save & Close
          </button>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
        {/* LEFT: Audio Panel */}
        <div className="col-span-3 overflow-hidden">
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

        {/* CENTER: Waveform */}
        <div className="col-span-6 overflow-hidden">
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

        {/* RIGHT: Inspector */}
        <div className="col-span-3 overflow-hidden">
          <Inspector
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
