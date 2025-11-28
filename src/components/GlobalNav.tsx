/**
 * GlobalNav - Universal Navigation Bar
 * Appears across all MediaQC pages
 */

import React from 'react';
import { NavLink } from './NavLink';
import { Zap } from 'lucide-react';

export default function GlobalNav() {
  return (
    <nav className="w-full h-12 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 text-sm shadow-lg shadow-black/40 z-50">
      {/* Left section: Brand + Navigation */}
      <div className="flex items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-100 text-base tracking-tight">
            MediaQC
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
            activeClassName="text-cyan-400 bg-slate-800/60 font-semibold"
          >
            Command Center
          </NavLink>
          
          <NavLink
            to="/asset-map/demo"
            className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
            activeClassName="text-cyan-400 bg-slate-800/60 font-semibold"
          >
            Asset Map
          </NavLink>
          
          <NavLink
            to="/ocularflow"
            className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
            activeClassName="text-cyan-400 bg-slate-800/60 font-semibold"
          >
            Subtitle QC
          </NavLink>
          
          <NavLink
            to="/qc/dub/demo"
            className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
            activeClassName="text-cyan-400 bg-slate-800/60 font-semibold"
          >
            DubFlow
          </NavLink>
        </div>
      </div>

      {/* Right section: Version badge */}
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700 text-xs text-slate-400 font-mono tracking-wide">
          OcularFlow v10.5
        </div>
      </div>
    </nav>
  );
}
