/**
 * VideoPlayer Component for OcularFlow v10.5
 * Video stage with subtitle overlay
 */

import React, { useRef, useEffect } from 'react';
import { getDemoVideoUrl } from '../../utils/demoProjectLoader';

/**
 * VideoPlayer component
 * @param {Object} props
 */
export function VideoPlayer({
  currentSubtitle = null,
  contextType = 'DIALOGUE',
  isPlaying = false,
  currentTime = 0,
  playbackRate = 1,
  volume = 0.75,
  muted = false,
  onTimeUpdate,
  onDurationChange,
  className = ''
}) {
  const videoRef = useRef(null);
  const isSeeking = useRef(false);
  
  // Get demo video URL
  const videoUrl = getDemoVideoUrl();
  
  // Sync play/pause
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.play().catch(err => {
        console.warn('Video play failed:', err);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);
  
  // Sync playback rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);
  
  // Sync volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);
  
  // Sync mute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);
  
  // Sync seek
  useEffect(() => {
    if (!videoRef.current || isSeeking.current) return;
    
    const timeDiff = Math.abs(videoRef.current.currentTime - currentTime);
    // Only seek if difference is significant (> 0.5s)
    if (timeDiff > 0.5) {
      isSeeking.current = true;
      videoRef.current.currentTime = currentTime;
      setTimeout(() => {
        isSeeking.current = false;
      }, 100);
    }
  }, [currentTime]);
  
  // Handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current && onTimeUpdate && !isSeeking.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };
  
  // Handle duration loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current && onDurationChange) {
      onDurationChange(videoRef.current.duration);
    }
  };
  
  return (
    <div className={`of-video-stage ${className}`}>
      {/* Video element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        crossOrigin="anonymous"
      >
        Your browser does not support video playback.
      </video>
      
      {/* Context type badge */}
      {contextType && contextType !== 'DIALOGUE' && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`
            px-2 py-0.5 rounded text-[9px] font-bold uppercase
            ${contextType === 'FN' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : ''}
            ${contextType === 'SONG' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : ''}
            ${contextType === 'CAPTION' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''}
          `}>
            {contextType}
          </span>
        </div>
      )}
      
      {/* Subtitle overlay */}
      {currentSubtitle && (
        <div className="of-subtitle-overlay">
          <span className="of-subtitle-text">
            {currentSubtitle.text}
          </span>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
