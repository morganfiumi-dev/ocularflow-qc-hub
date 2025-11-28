/**
 * Timecode Utilities for OcularFlow v10.5
 * SMPTE timecode formatting and parsing
 */

/**
 * Format seconds to SMPTE timecode (HH:MM:SS:FF)
 * @param {number} totalSeconds - Time in seconds
 * @param {number} frameRate - Frame rate (default 24fps)
 * @returns {string} SMPTE formatted string
 */
export function formatSMPTE(totalSeconds, frameRate = 24) {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00:00:00";
  
  const frames = Math.floor((totalSeconds % 1) * frameRate);
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);
  
  const pad = (n, d = 2) => n.toString().padStart(d, '0');
  
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

/**
 * Format seconds to simple timecode (MM:SS)
 * @param {number} totalSeconds 
 * @returns {string}
 */
export function formatSimple(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00";
  
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60);
  
  const pad = (n) => n.toString().padStart(2, '0');
  
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Parse SMPTE timecode to seconds
 * @param {string} smpte - SMPTE string (HH:MM:SS:FF)
 * @param {number} frameRate - Frame rate (default 24fps)
 * @returns {number} Time in seconds
 */
export function parseSMPTE(smpte, frameRate = 24) {
  const parts = smpte.split(':').map(Number);
  
  if (parts.length === 4) {
    const [hours, minutes, seconds, frames] = parts;
    return hours * 3600 + minutes * 60 + seconds + (frames / frameRate);
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  return 0;
}

/**
 * Calculate duration between two times
 * @param {number} startTime 
 * @param {number} endTime 
 * @returns {number}
 */
export function calculateDuration(startTime, endTime) {
  return Math.max(0, endTime - startTime);
}

/**
 * Format duration in human readable format
 * @param {number} seconds 
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (seconds < 1) {
    return `${Math.round(seconds * 1000)}ms`;
  } else if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  } else {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  }
}

/**
 * Snap time to nearest frame boundary
 * @param {number} seconds 
 * @param {number} frameRate 
 * @returns {number}
 */
export function snapToFrame(seconds, frameRate = 24) {
  const frame = Math.round(seconds * frameRate);
  return frame / frameRate;
}

/**
 * Get frame number from seconds
 * @param {number} seconds 
 * @param {number} frameRate 
 * @returns {number}
 */
export function getFrameNumber(seconds, frameRate = 24) {
  return Math.floor(seconds * frameRate);
}

export default {
  formatSMPTE,
  formatSimple,
  parseSMPTE,
  calculateDuration,
  formatDuration,
  snapToFrame,
  getFrameNumber
};
