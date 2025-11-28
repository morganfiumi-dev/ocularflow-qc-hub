/**
 * Panel Component for OcularFlow v10.5
 */

import React from 'react';
import { GripVertical, GripHorizontal } from 'lucide-react';

/**
 * Panel component - base container
 */
export function Panel({
  children,
  className = '',
  ...rest
}) {
  return (
    <div
      className={`bg-slate-950 border border-slate-800 rounded ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Panel Header
 */
export function PanelHeader({
  children,
  title,
  actions,
  className = '',
  ...rest
}) {
  return (
    <div
      className={`h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 ${className}`}
      {...rest}
    >
      {title && (
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
          {title}
        </span>
      )}
      {children}
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

/**
 * Panel Content
 */
export function PanelContent({
  children,
  className = '',
  scrollable = false,
  ...rest
}) {
  return (
    <div
      className={`${scrollable ? 'overflow-auto of-scrollbar' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Resize Handle - for resizable panels
 */
export function ResizeHandle({
  direction = 'horizontal',
  onDrag,
  className = '',
  ...rest
}) {
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    
    const handleMouseMove = (ev) => {
      const deltaX = ev.clientX - startX;
      const deltaY = ev.clientY - startY;
      onDrag(direction === 'horizontal' ? deltaX : deltaY);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  };
  
  const Icon = direction === 'horizontal' ? GripVertical : GripHorizontal;
  
  return (
    <div
      className={`of-resize-handle ${direction} ${className}`}
      onMouseDown={handleMouseDown}
      {...rest}
    >
      <Icon size={10} className="of-resize-handle-icon" />
    </div>
  );
}

/**
 * Tabs for panel navigation
 */
export function PanelTabs({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  ...rest
}) {
  return (
    <div className={`of-inspector-tabs ${className}`} {...rest}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`of-inspector-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon && <tab.icon size={14} />}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Divider
 */
export function Divider({ className = '' }) {
  return (
    <div className={`border-t border-slate-800 my-4 ${className}`} />
  );
}

/**
 * Card - for context cards in inspector
 */
export function Card({
  children,
  variant = 'default',
  className = '',
  ...rest
}) {
  const variantClasses = {
    default: '',
    source: 'of-context-card source',
    target: 'of-context-card target'
  };
  
  return (
    <div
      className={`of-context-card ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Panel;
