/**
 * Badge Component for OcularFlow v10.5
 */

import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Clock, Brain } from 'lucide-react';

/**
 * Badge variants
 */
const variants = {
  success: 'of-badge-success',
  warning: 'of-badge-warning',
  error: 'of-badge-error',
  info: 'of-badge-info',
  neutral: 'of-badge-neutral'
};

/**
 * Badge component
 */
export function Badge({
  children,
  variant = 'neutral',
  icon: Icon = null,
  className = '',
  ...rest
}) {
  return (
    <span
      className={`of-badge ${variants[variant] || variants.neutral} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={10} />}
      {children}
    </span>
  );
}

/**
 * Status Badge - for QC status display
 */
export function StatusBadge({ status, size = 'md' }) {
  const styles = {
    PASS: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', Icon: CheckCircle2 },
    FAIL: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30', Icon: XCircle },
    WARN: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', Icon: AlertTriangle },
    PENDING: { bg: 'bg-slate-700', text: 'text-slate-400', border: 'border-slate-600', Icon: Clock },
    PROCESSING: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30', Icon: Brain }
  };
  
  const style = styles[status] || styles.PENDING;
  const Icon = style.Icon;
  
  const sizeClasses = {
    sm: 'text-[8px] px-1.5 py-0.5',
    md: 'text-[9px] px-2 py-0.5',
    lg: 'text-[10px] px-2.5 py-1'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 rounded font-bold uppercase border ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]}`}>
      <Icon size={size === 'sm' ? 10 : 12} />
      {status}
    </span>
  );
}

/**
 * Score Badge - for quality scores
 */
export function ScoreBadge({ score, size = 'md' }) {
  const getScoreClass = (score) => {
    if (score >= 90) return 'pass';
    if (score >= 70) return 'warn';
    return 'fail';
  };
  
  const scoreClass = getScoreClass(score);
  
  const sizeClasses = {
    sm: 'w-6 h-4 text-[8px]',
    md: 'w-7 h-5 text-[9px]',
    lg: 'w-8 h-6 text-[10px]'
  };
  
  return (
    <div className={`of-score-badge ${scoreClass} ${sizeClasses[size]}`}>
      {score}
    </div>
  );
}

/**
 * Metric Badge - for CPS/CPL display
 */
export function MetricBadge({ label, value, isError = false }) {
  return (
    <div className={`of-metric-badge ${isError ? 'error' : ''}`}>
      {label}: {typeof value === 'number' ? value.toFixed(1) : value}
    </div>
  );
}

/**
 * QC Status Icon - for table display
 */
export function QCStatusIcon({ issues = [] }) {
  if (!issues || issues.length === 0) {
    return <CheckCircle2 size={14} className="text-emerald-500 mx-auto" />;
  }
  
  const hasError = issues.some(i => i.severity === 'error');
  
  if (hasError) {
    return <Brain size={14} className="text-rose-500 mx-auto" />;
  }
  
  return <AlertTriangle size={14} className="text-amber-500 mx-auto" />;
}

export default Badge;
