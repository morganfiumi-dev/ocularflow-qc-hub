/**
 * IssueList Component for OcularFlow v10.5
 * List of QC issues for a subtitle
 */

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { IssueDetails } from './IssueDetails';

/**
 * IssueList component
 * @param {Object} props
 */
export function IssueList({
  issues = [],
  analysisDetails = null,
  expandedIssueId = null,
  onToggleIssue,
  className = ''
}) {
  if (!issues || issues.length === 0) {
    return (
      <div className={`text-center text-slate-600 text-xs py-4 ${className}`}>
        No issues detected
      </div>
    );
  }
  
  return (
    <div className={`of-issue-list ${className}`}>
      {issues.map(issue => (
        <IssueItem
          key={issue.id}
          issue={issue}
          analysisDetails={issue.id === expandedIssueId ? analysisDetails : null}
          isExpanded={issue.id === expandedIssueId}
          onToggle={() => onToggleIssue?.(issue.id)}
        />
      ))}
    </div>
  );
}

/**
 * IssueItem component
 */
function IssueItem({
  issue,
  analysisDetails,
  isExpanded,
  onToggle
}) {
  return (
    <div className={`of-issue-item ${issue.severity}`}>
      <button
        className="of-issue-header"
        onClick={onToggle}
      >
        <span className="of-issue-title">
          <div className="of-issue-dot" />
          {issue.ruleName}
        </span>
        {isExpanded ? (
          <ChevronUp size={10} className="text-slate-500" />
        ) : (
          <ChevronDown size={10} className="text-slate-500" />
        )}
      </button>
      
      {isExpanded && (
        <IssueDetails
          issue={issue}
          analysisDetails={analysisDetails}
        />
      )}
    </div>
  );
}

export default IssueList;
