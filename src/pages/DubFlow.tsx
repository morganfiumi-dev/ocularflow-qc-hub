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

/**
 * Mock issue data
 */
const MOCK_ISSUES = [
  {
    id: 1,
    time: '00:01:02:12',
    timeSeconds: 62.5,
    type: 'Clipping',
    severity: 'high' as const,
    description: 'Audio levels exceed 0dB, causing distortion in the dialogue.',
    suggestedFix: 'Apply limiter or reduce gain by 3-6dB in this section.'
  },
  {
    id: 2,
    time: '00:02:11:04',
    timeSeconds: 131.17,
    type: 'Silence Gap',
    severity: 'medium' as const,
    description: 'Unexpected silence detected for 1.2 seconds during dialogue.',
    suggestedFix: 'Check source material and fill gap with room tone if needed.'
  },
  {
    id: 3,
    time: '00:04:55:19',
    timeSeconds: 295.79,
    type: 'Timing Offset',
    severity: 'low' as const,
    description: 'Dialogue timing is 0.3s ahead of mouth movements.',
    suggestedFix: 'Shift audio track backward by 300ms to sync with video.'
  },
  {
    id: 4,
    time: '00:03:22:08',
    timeSeconds: 202.33,
    type: 'Background Noise',
    severity: 'medium' as const,
    description: 'Ambient noise spike during quiet dialogue moment.',
    suggestedFix: 'Apply noise reduction or re-record in controlled environment.'
  }
];

export default function DubFlow() {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(420); // 7 minutes mock
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
    const issue = MOCK_ISSUES.find(i => i.id === id);
    if (issue) {
      handleSeek(issue.timeSeconds);
    }
  };

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
            language="EN-US"
            codec="AAC 256kbps"
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
            issues={MOCK_ISSUES}
          />
        </div>

        {/* RIGHT: Inspector */}
        <div className="col-span-3 overflow-hidden">
          <Inspector
            issues={MOCK_ISSUES}
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
