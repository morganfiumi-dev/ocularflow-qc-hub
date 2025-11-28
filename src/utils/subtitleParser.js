/**
 * Subtitle Parser for OcularFlow v10.5
 * Parsing and processing subtitle data
 */

/**
 * Calculate Characters Per Second (CPS)
 * @param {string} text - Subtitle text
 * @param {number} duration - Duration in seconds
 * @returns {number} CPS value
 */
export function calculateCPS(text, duration) {
  if (!text || duration <= 0) return 0;
  const charCount = text.replace(/\n/g, '').length;
  return Math.round((charCount / duration) * 10) / 10;
}

/**
 * Calculate Characters Per Line (CPL)
 * @param {string} text - Subtitle text
 * @returns {number} Maximum CPL value
 */
export function calculateCPL(text) {
  if (!text) return 0;
  const lines = text.split('\n');
  return Math.max(...lines.map(line => line.length));
}

/**
 * Check if CPS exceeds Netflix threshold
 * @param {number} cps 
 * @returns {boolean}
 */
export function isCPSExceeded(cps) {
  return cps > 20; // Netflix standard: 20 CPS max
}

/**
 * Check if CPL exceeds Netflix threshold
 * @param {number} cpl 
 * @returns {boolean}
 */
export function isCPLExceeded(cpl) {
  return cpl > 42; // Netflix standard: 42 CPL max
}

/**
 * Count lines in subtitle
 * @param {string} text 
 * @returns {number}
 */
export function countLines(text) {
  if (!text) return 0;
  return text.split('\n').length;
}

/**
 * Check line count compliance
 * @param {string} text 
 * @returns {boolean}
 */
export function isLineCountExceeded(text) {
  return countLines(text) > 2; // Netflix standard: 2 lines max
}

/**
 * Parse SRT format
 * @param {string} srtContent 
 * @returns {Array} Parsed subtitles
 */
export function parseSRT(srtContent) {
  const blocks = srtContent.trim().split(/\n\n+/);
  const subtitles = [];
  
  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length < 3) continue;
    
    const index = parseInt(lines[0], 10);
    const timeParts = lines[1].split(' --> ');
    if (timeParts.length !== 2) continue;
    
    const startTime = parseSRTTime(timeParts[0]);
    const endTime = parseSRTTime(timeParts[1]);
    const text = lines.slice(2).join('\n');
    
    subtitles.push({
      index,
      startTime,
      endTime,
      duration: endTime - startTime,
      text
    });
  }
  
  return subtitles;
}

/**
 * Parse SRT time format (HH:MM:SS,mmm)
 * @param {string} timeStr 
 * @returns {number} Time in seconds
 */
function parseSRTTime(timeStr) {
  const [time, ms] = timeStr.trim().split(',');
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds + parseInt(ms, 10) / 1000;
}

/**
 * Validate subtitle timing
 * @param {Object} subtitle 
 * @param {Object} prevSubtitle 
 * @returns {Array} Timing issues
 */
export function validateTiming(subtitle, prevSubtitle = null) {
  const issues = [];
  
  // Minimum duration check (Netflix: 5/6 second minimum)
  if (subtitle.duration < 0.833) {
    issues.push({
      type: 'timing',
      severity: 'warning',
      message: 'Duration below minimum (0.833s)'
    });
  }
  
  // Maximum duration check (Netflix: 7 seconds max)
  if (subtitle.duration > 7) {
    issues.push({
      type: 'timing',
      severity: 'warning',
      message: 'Duration exceeds maximum (7s)'
    });
  }
  
  // Gap check with previous subtitle
  if (prevSubtitle) {
    const gap = subtitle.startTime - prevSubtitle.endTime;
    if (gap < 0.083) { // 2 frames at 24fps
      issues.push({
        type: 'timing',
        severity: 'error',
        message: 'Insufficient gap from previous subtitle'
      });
    }
  }
  
  return issues;
}

/**
 * Generate mock subtitle data for demo
 * @param {number} count 
 * @returns {Array}
 */
export function generateMockSubtitles(count = 50) {
  const sourceTexts = [
    "Standard dialogue line.",
    "She's banking right!",
    "The White Wolf awaits.",
    "We must leave at once.",
    "This path leads nowhere.",
    "The ancient prophecy speaks of...",
    "Remember what I taught you.",
    "We don't have much time left!",
    "Follow me closely.",
    "The portal is unstable."
  ];
  
  const targetTexts = [
    "Línea de diálogo estándar.",
    "¡Ella está haciendo banca bien!",
    "El lobo blanco espera.",
    "Debemos irnos de inmediato.",
    "Este camino no lleva a ninguna parte.",
    "La antigua profecía habla de...",
    "Recuerda lo que te enseñé.",
    "¡No tenemos mucho tiempo!",
    "Sígueme de cerca.",
    "El portal es inestable."
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const startTime = 60 + (i * 4);
    const duration = 2.5;
    const textIndex = i % sourceTexts.length;
    const sourceText = sourceTexts[textIndex];
    const text = targetTexts[textIndex];
    
    return {
      index: i + 1,
      startTime,
      endTime: startTime + duration,
      duration,
      sourceText,
      text,
      cps: calculateCPS(text, duration),
      cpl: calculateCPL(text)
    };
  });
}

export default {
  calculateCPS,
  calculateCPL,
  isCPSExceeded,
  isCPLExceeded,
  countLines,
  isLineCountExceeded,
  parseSRT,
  validateTiming,
  generateMockSubtitles
};
