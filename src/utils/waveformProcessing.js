/**
 * Waveform Processing for OcularFlow v10.5
 * Audio waveform calculations and rendering utilities
 */

/**
 * Deterministic pseudo-random number generator
 * Used for stable waveform visualization
 * @param {number} input 
 * @returns {number} Value between 0 and 1
 */
export function pseudoRandom(input) {
  let t = input + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Get simulated audio level at a given time
 * @param {number} time - Time in seconds
 * @param {boolean} isDialogueIsolated - Whether to isolate dialogue
 * @returns {number} Audio level (0-1)
 */
export function getAudioLevelAtTime(time, isDialogueIsolated = false) {
  // Base noise level
  let level = pseudoRandom(Math.floor(time * 10)) * 0.3;
  
  // Simulate speech bursts
  const speechBurst = Math.sin(time * 2);
  if (speechBurst > 0.5) {
    level += 0.5;
  }
  
  // If dialogue isolated, reduce non-speech portions
  if (isDialogueIsolated && speechBurst <= 0.5) {
    level *= 0.1;
  }
  
  // Add variation
  level += pseudoRandom(Math.floor(time * 7)) * 0.15;
  
  return Math.min(1, Math.max(0.05, level));
}

/**
 * Generate waveform bars for rendering
 * @param {number} windowStart - Start of visible window
 * @param {number} windowDuration - Duration of visible window
 * @param {number} barCount - Number of bars to generate
 * @param {boolean} isDialogueIsolated - Dialogue isolation mode
 * @returns {Array<number>} Array of bar heights (0-1)
 */
export function generateWaveformBars(windowStart, windowDuration, barCount = 150, isDialogueIsolated = false) {
  const bars = [];
  
  for (let i = 0; i < barCount; i++) {
    const time = windowStart + (i / barCount) * windowDuration;
    const height = getAudioLevelAtTime(time, isDialogueIsolated);
    bars.push(height);
  }
  
  return bars;
}

/**
 * Calculate visible window for CENTER scroll mode
 * @param {number} currentTime 
 * @param {number} zoomLevel 
 * @param {number} duration 
 * @returns {Object} { windowStart, windowEnd, playheadPct }
 */
export function calculateCenterWindow(currentTime, zoomLevel, duration) {
  const visibleWindow = 10 / zoomLevel;
  const windowStart = Math.max(0, currentTime - visibleWindow * 0.3);
  const windowEnd = Math.min(duration, windowStart + visibleWindow);
  const playheadPct = 30; // Fixed at 30%
  
  return { windowStart, windowEnd, playheadPct, visibleWindow };
}

/**
 * Calculate visible window for FREE scroll mode
 * @param {number} currentTime 
 * @param {number} zoomLevel 
 * @param {number} duration 
 * @returns {Object} { windowStart, windowEnd, playheadPct }
 */
export function calculateFreeWindow(currentTime, zoomLevel, duration) {
  const visibleWindow = 10 / zoomLevel;
  const windowStart = Math.floor(currentTime / visibleWindow) * visibleWindow;
  const windowEnd = Math.min(duration, windowStart + visibleWindow);
  const playheadPct = ((currentTime - windowStart) / visibleWindow) * 100;
  
  return { windowStart, windowEnd, playheadPct, visibleWindow };
}

/**
 * Convert click position to time
 * @param {number} clickX - Click X position relative to container
 * @param {number} containerWidth - Container width
 * @param {number} windowStart - Visible window start time
 * @param {number} windowDuration - Visible window duration
 * @returns {number} Time in seconds
 */
export function clickToTime(clickX, containerWidth, windowStart, windowDuration) {
  const pct = clickX / containerWidth;
  return windowStart + pct * windowDuration;
}

/**
 * Calculate subtitle pill position
 * @param {number} startTime 
 * @param {number} endTime 
 * @param {number} windowStart 
 * @param {number} windowDuration 
 * @returns {Object} { left, width } in percentages
 */
export function calculatePillPosition(startTime, endTime, windowStart, windowDuration) {
  const left = ((startTime - windowStart) / windowDuration) * 100;
  const width = ((endTime - startTime) / windowDuration) * 100;
  
  return {
    left: Math.max(0, left),
    width: Math.min(100 - Math.max(0, left), width)
  };
}

/**
 * Check if subtitle is visible in window
 * @param {Object} subtitle 
 * @param {number} windowStart 
 * @param {number} windowEnd 
 * @returns {boolean}
 */
export function isSubtitleVisible(subtitle, windowStart, windowEnd) {
  return subtitle.endTime > windowStart && subtitle.startTime < windowEnd;
}

/**
 * Get visible subtitles in window
 * @param {Array} subtitles 
 * @param {number} windowStart 
 * @param {number} windowEnd 
 * @returns {Array}
 */
export function getVisibleSubtitles(subtitles, windowStart, windowEnd) {
  return subtitles.filter(sub => isSubtitleVisible(sub, windowStart, windowEnd));
}

/**
 * Calculate zoom from wheel delta
 * @param {number} currentZoom 
 * @param {number} deltaY 
 * @param {number} minZoom 
 * @param {number} maxZoom 
 * @returns {number}
 */
export function calculateZoomFromWheel(currentZoom, deltaY, minZoom = 0.5, maxZoom = 4) {
  const zoomDelta = deltaY > 0 ? -0.1 : 0.1;
  return Math.max(minZoom, Math.min(maxZoom, currentZoom + zoomDelta));
}

/**
 * Generate spectrogram colors based on level
 * @param {number} level - Audio level (0-1)
 * @returns {string} CSS gradient color
 */
export function getSpectrogramColor(level) {
  if (level < 0.3) return 'rgb(30, 58, 138)'; // blue-900
  if (level < 0.6) return 'rgb(6, 182, 212)'; // cyan-500
  return 'rgb(250, 204, 21)'; // yellow-400
}

export default {
  pseudoRandom,
  getAudioLevelAtTime,
  generateWaveformBars,
  calculateCenterWindow,
  calculateFreeWindow,
  clickToTime,
  calculatePillPosition,
  isSubtitleVisible,
  getVisibleSubtitles,
  calculateZoomFromWheel,
  getSpectrogramColor
};
