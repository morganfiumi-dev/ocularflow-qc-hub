/**
 * Hotkeys Hook for OcularFlow v10.5
 * Keyboard shortcut management
 */

import React, { useEffect, useCallback } from 'react';

/**
 * Default hotkey mappings
 */
const DEFAULT_HOTKEYS = {
  // Playback
  'Space': 'togglePlayback',
  'KeyK': 'togglePlayback',
  'ArrowLeft': 'skipBackward',
  'ArrowRight': 'skipForward',
  'Comma': 'frameBackward',
  'Period': 'frameForward',
  
  // Navigation
  'ArrowUp': 'previousSubtitle',
  'ArrowDown': 'nextSubtitle',
  'KeyJ': 'nextSubtitle',
  'KeyL': 'previousSubtitle',
  
  // Editor
  'Enter': 'editSubtitle',
  'Escape': 'cancelEdit',
  
  // Markers
  'KeyI': 'markIn',
  'KeyO': 'markOut',
  'KeyM': 'addMarker',
  
  // Misc
  'KeyS': 'save',
  'KeyZ': 'undo',
  'KeyY': 'redo'
};

/**
 * Hotkeys hook
 * @param {Object} handlers - Map of action names to handler functions
 * @param {Object} options - Configuration options
 * @returns {Object} Hotkey utilities
 */
export function useHotkeys(handlers = {}, options = {}) {
  const {
    enabled = true,
    preventDefault = true,
    ignoreInputs = true,
    customMappings = {}
  } = options;
  
  // Merge hotkey mappings
  const hotkeys = { ...DEFAULT_HOTKEYS, ...customMappings };
  
  // Handle keydown
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;
    
    // Ignore if typing in an input
    if (ignoreInputs) {
      const target = event.target;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape to work in inputs
        if (event.code !== 'Escape') return;
      }
    }
    
    // Build key code with modifiers
    let keyCode = event.code;
    if (event.ctrlKey || event.metaKey) keyCode = `Ctrl+${keyCode}`;
    if (event.altKey) keyCode = `Alt+${keyCode}`;
    if (event.shiftKey) keyCode = `Shift+${keyCode}`;
    
    // Check for matching action
    const action = hotkeys[keyCode] || hotkeys[event.code];
    
    if (action && handlers[action]) {
      if (preventDefault) {
        event.preventDefault();
      }
      handlers[action](event);
    }
  }, [enabled, ignoreInputs, preventDefault, hotkeys, handlers]);
  
  // Attach event listener
  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);
  
  // Get hotkey for action
  const getHotkeyForAction = useCallback((action) => {
    for (const [key, value] of Object.entries(hotkeys)) {
      if (value === action) return key;
    }
    return null;
  }, [hotkeys]);
  
  // Format hotkey for display
  const formatHotkey = useCallback((keyCode) => {
    if (!keyCode) return '';
    
    return keyCode
      .replace('Key', '')
      .replace('Digit', '')
      .replace('Arrow', '→←↑↓'.includes(keyCode.slice(-1)) ? '' : 'Arrow ')
      .replace('Space', '␣')
      .replace('Ctrl+', '⌘')
      .replace('Alt+', '⌥')
      .replace('Shift+', '⇧');
  }, []);
  
  return {
    getHotkeyForAction,
    formatHotkey,
    hotkeys
  };
}

/**
 * Common keyboard navigation patterns
 */
export const keyboardPatterns = {
  // Vim-style
  vim: {
    'KeyH': 'skipBackward',
    'KeyL': 'skipForward',
    'KeyJ': 'nextSubtitle',
    'KeyK': 'previousSubtitle'
  },
  
  // Pro editing
  proEdit: {
    'F1': 'markIn',
    'F2': 'markOut',
    'F3': 'splitSubtitle',
    'F4': 'mergeSubtitle',
    'F5': 'runQC'
  }
};

export default useHotkeys;
