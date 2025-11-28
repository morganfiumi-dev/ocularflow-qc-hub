/**
 * SubtitleRow Component for OcularFlow v10.5
 * Single row in subtitle editor grid
 */

import React, { useRef, useEffect } from 'react';
import { formatSMPTE } from '../../utils/timecode';
import { QCStatusIcon, ScoreBadge } from '../atoms/Badge';

/**
 * SubtitleRow component
 * @param {Object} props
 */
export function SubtitleRow({
  subtitle,
  isActive = false,
  onSelect,
  onTextChange,
  inputRef
}) {
  const localRef = useRef(null);
  const ref = inputRef || localRef;
  
  // Focus input when row becomes active
  useEffect(() => {
    if (isActive && ref.current) {
      // Don't auto-focus to prevent scrolling issues
      // ref.current.focus();
    }
  }, [isActive, ref]);
  
  const handleClick = () => {
    onSelect?.(subtitle.index);
  };
  
  const handleTextChange = (e) => {
    onTextChange?.(subtitle.index, e.target.value);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.target.blur();
    }
  };
  
  return (
    <tr
      className={`of-subtitle-row ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      {/* Index */}
      <td className="index">
        {subtitle.index}
      </td>
      
      {/* Source TC In */}
      <td className="timecode tc-in">
        {formatSMPTE(subtitle.startTime)}
      </td>
      
      {/* Source text */}
      <td className="source">
        {subtitle.sourceText}
      </td>
      
      {/* Target TC In (slightly offset) */}
      <td className="timecode tc-out">
        {formatSMPTE(subtitle.startTime + 0.1)}
      </td>
      
      {/* Target text (editable) */}
      <td className="target">
        <input
          ref={ref}
          type="text"
          value={subtitle.text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter translation..."
        />
      </td>
      
      {/* QC Status */}
      <td className="qc-status">
        <QCStatusIcon issues={subtitle.issues} />
      </td>
      
      {/* Quality Score */}
      <td className="score">
        <ScoreBadge score={subtitle.qualityScore} />
      </td>
    </tr>
  );
}

export default SubtitleRow;
