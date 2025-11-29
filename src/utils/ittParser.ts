/**
 * ITT (iTunes Timed Text) Parser
 * Parses ITT/TTML subtitle files into internal format
 */

export interface ParsedSubtitle {
  index: number;
  inTime: string;
  outTime: string;
  duration: number;
  sourceText: string;
  targetText: string;
  cps: number;
  chars: number;
  issues: string[];
}

/**
 * Convert time string (HH:MM:SS.mmm) to seconds
 */
function timeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseFloat(parts[2]);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Calculate CPS (characters per second)
 */
function calculateCPS(text: string, duration: number): number {
  const chars = text.replace(/\s+/g, '').length;
  return duration > 0 ? chars / duration : 0;
}

/**
 * Detect QC issues in subtitle
 */
function detectIssues(text: string, cps: number): string[] {
  const issues: string[] = [];
  
  // Check CPS
  if (cps > 20) {
    issues.push('HIGH_CPS');
  }
  
  // Check for common issues
  if (text.includes('  ')) {
    issues.push('DOUBLE_SPACE');
  }
  
  if (/[.!?]$/.test(text) === false && text.length > 10) {
    issues.push('MISSING_PUNCTUATION');
  }
  
  if (text.length > 42) {
    issues.push('LINE_TOO_LONG');
  }
  
  return issues;
}

/**
 * Parse ITT/TTML subtitle file
 */
export async function parseITT(content: string): Promise<ParsedSubtitle[]> {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, 'text/xml');
  
  const paragraphs = xmlDoc.getElementsByTagName('p');
  const subtitles: ParsedSubtitle[] = [];
  
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const begin = p.getAttribute('begin') || '';
    const end = p.getAttribute('end') || '';
    const text = p.textContent?.trim() || '';
    
    if (!begin || !end || !text) continue;
    
    const inSeconds = timeToSeconds(begin);
    const outSeconds = timeToSeconds(end);
    const duration = outSeconds - inSeconds;
    const cps = calculateCPS(text, duration);
    const issues = detectIssues(text, cps);
    
    subtitles.push({
      index: i + 1,
      inTime: begin,
      outTime: end,
      duration,
      sourceText: text,
      targetText: text,
      cps: parseFloat(cps.toFixed(1)),
      chars: text.length,
      issues,
    });
  }
  
  return subtitles;
}

/**
 * Load and parse ITT file from URL
 */
export async function loadITTFile(url: string): Promise<ParsedSubtitle[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ITT file: ${response.statusText}`);
    }
    const content = await response.text();
    return parseITT(content);
  } catch (error) {
    console.error('Error loading ITT file:', error);
    return [];
  }
}
