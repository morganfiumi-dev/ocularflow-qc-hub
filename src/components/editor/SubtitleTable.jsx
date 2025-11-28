/**
 * SubtitleTable Component for OcularFlow v10.5
 * Tabular display of subtitles
 */

import React, { useRef, useEffect } from 'react';
import { SubtitleRow } from './SubtitleRow';

/**
 * SubtitleTable component
 * @param {Object} props
 */
export function SubtitleTable({
  subtitles = [],
  currentIndex = 1,
  onSelectSubtitle,
  onTextChange,
  autoScroll = true,
  className = ''
}) {
  const tableRef = useRef(null);
  const rowRefs = useRef({});
  
  // Auto-scroll to active row
  useEffect(() => {
    if (!autoScroll) return;
    
    const activeRow = rowRefs.current[currentIndex];
    if (activeRow && tableRef.current) {
      const container = tableRef.current;
      const rowTop = activeRow.offsetTop;
      const rowHeight = activeRow.offsetHeight;
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      
      // Check if row is out of view
      if (rowTop < scrollTop || rowTop + rowHeight > scrollTop + containerHeight) {
        container.scrollTo({
          top: rowTop - containerHeight / 2 + rowHeight / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex, autoScroll]);
  
  return (
    <div
      ref={tableRef}
      className={`of-subtitle-table of-scrollbar ${className}`}
    >
      <table>
        <thead>
          <tr>
            <th className="center" style={{ width: 40 }}>#</th>
            <th style={{ width: 80 }}>Src In</th>
            <th style={{ width: '20%' }}>Source</th>
            <th style={{ width: 80 }}>Tgt In</th>
            <th>Text</th>
            <th className="center" style={{ width: 40 }}>QC</th>
            <th className="center" style={{ width: 48 }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {subtitles.map(subtitle => (
            <SubtitleRow
              key={subtitle.index}
              ref={el => rowRefs.current[subtitle.index] = el?.closest('tr')}
              subtitle={subtitle}
              isActive={subtitle.index === currentIndex}
              onSelect={onSelectSubtitle}
              onTextChange={onTextChange}
            />
          ))}
        </tbody>
      </table>
      
      {subtitles.length === 0 && (
        <div className="text-center text-slate-500 text-sm py-8">
          No subtitles loaded
        </div>
      )}
    </div>
  );
}

export default SubtitleTable;
