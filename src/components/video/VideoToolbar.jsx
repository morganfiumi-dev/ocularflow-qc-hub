/**
 * VideoToolbar Component for OcularFlow v10.5
 * Transport controls and timecode display
 */

import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  VolumeX
} from 'lucide-react';
import { IconButton } from '../atoms/Button';
import { formatSMPTE } from '../../utils/timecode';

/**
 * VideoToolbar component
 * @param {Object} props
 */
export function VideoToolbar({
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  playbackRate = 1,
  volume = 0.75,
  muted = false,
  onTogglePlayback,
  onSkipForward,
  onSkipBackward,
  onFrameForward,
  onFrameBackward,
  onPlaybackRateChange,
  onVolumeChange,
  onToggleMute,
  className = ''
}) {
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
  
  return (
    <div className={`of-video-toolbar ${className}`}>
      {/* Left: Transport controls */}
      <div className="of-transport-controls">
        {/* Frame backward */}
        <IconButton
          icon={Rewind}
          title="Frame backward (,)"
          onClick={onFrameBackward}
        />
        
        {/* Skip backward */}
        <IconButton
          icon={SkipBack}
          title="Skip backward 5s (←)"
          onClick={onSkipBackward}
        />
        
        {/* Play/Pause */}
        <IconButton
          icon={isPlaying ? Pause : Play}
          active={true}
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          onClick={onTogglePlayback}
        />
        
        {/* Skip forward */}
        <IconButton
          icon={SkipForward}
          title="Skip forward 5s (→)"
          onClick={onSkipForward}
        />
        
        {/* Frame forward */}
        <IconButton
          icon={FastForward}
          title="Frame forward (.)"
          onClick={onFrameForward}
        />
        
        {/* Timecode display */}
        <div className="of-timecode-display ml-2">
          {formatSMPTE(currentTime)}
        </div>
      </div>
      
      {/* Right: Rate and volume */}
      <div className="flex items-center gap-3">
        {/* Playback rate */}
        <select
          className="of-select"
          value={playbackRate}
          onChange={(e) => onPlaybackRateChange?.(parseFloat(e.target.value))}
        >
          {playbackRates.map(rate => (
            <option key={rate} value={rate}>
              {rate}x
            </option>
          ))}
        </select>
        
        {/* Volume */}
        <div className="flex items-center gap-1">
          <IconButton
            icon={muted ? VolumeX : Volume2}
            title={muted ? "Unmute" : "Mute"}
            onClick={onToggleMute}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={muted ? 0 : volume}
            onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
            className="w-16 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-2
                       [&::-webkit-slider-thumb]:h-2
                       [&::-webkit-slider-thumb]:bg-cyan-500
                       [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

export default VideoToolbar;
