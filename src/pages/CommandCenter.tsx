/**
 * CommandCenter - MediaQC Hub Dashboard
 * Main entry point for QC operations
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Film, 
  Map, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  PlayCircle,
  Layers
} from 'lucide-react';

/**
 * Demo Projects - Loaded from browser
 */
const DEMO_PROJECTS = [
  {
    id: "demo-default",
    name: "The Witcher S3E01",
    source: "demo",
    status: "in-progress",
    metadata: {
      originalLanguage: "EN",
      client: "Netflix",
      product: "Subs & Dubs",
      languages: "EN / ES / DE"
    },
    stats: {
      totalAssets: 5,
      completedAssets: 3,
      totalIssues: 8
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: "demo-mock",
    name: "Sample QC Project",
    source: "mock",
    status: "review",
    metadata: {
      originalLanguage: "EN",
      client: "Internal",
      product: "Subs & Dubs",
      languages: "EN / ES / DE"
    },
    stats: {
      totalAssets: 12,
      completedAssets: 10,
      totalIssues: 3
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date()
  }
];

/**
 * Mock data for recent activity (static for now)
 */
const RECENT_ACTIVITY = [
  { action: 'QC Completed', title: 'The Crown S06E10', time: '2 hours ago', user: 'Sarah Chen' },
  { action: 'Issues Resolved', title: 'Ozark S04E14', time: '5 hours ago', user: 'Mike Ross' },
  { action: 'New Assignment', title: 'Wednesday S02E03', time: '1 day ago', user: 'Emma Wilson' }
];

export default function CommandCenter() {
  const navigate = useNavigate();
  
  // Use demo projects loaded from browser
  const projects = DEMO_PROJECTS;
  const isLoading = false;

  const getStatusConfig = (status: string) => {
    const configs = {
      'in-progress': {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        label: 'In Progress'
      },
      'review': {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        label: 'In Review'
      },
      'pending': {
        bg: 'bg-slate-700/50',
        text: 'text-slate-400',
        border: 'border-slate-600',
        label: 'Pending'
      }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">MediaQC Hub</h1>
                <p className="text-xs text-slate-500">Quality Control Command Center</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/ocularflow')}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors text-sm font-semibold"
              >
                <PlayCircle className="w-4 h-4" />
                Launch OcularFlow
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Film}
            label="Active Titles"
            value={projects.length.toString()}
            trend="+2 this week"
            color="cyan"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value="47"
            trend="This month"
            color="emerald"
          />
          <StatCard
            icon={AlertCircle}
            label="Issues Found"
            value="15"
            trend="Across all titles"
            color="amber"
          />
          <StatCard
            icon={Clock}
            label="Avg. TAT"
            value="4.2h"
            trend="Per title"
            color="indigo"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Titles - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
                  Active Titles
                </h2>
                <span className="text-xs text-slate-500">
                  {projects.length} titles
                </span>
              </div>
              
                <div className="divide-y divide-slate-800">
                {projects.map((project) => {
                  const statusConfig = getStatusConfig(project.status);
                  const stats = project.stats;
                  const progress = stats.totalAssets > 0 
                    ? Math.round((stats.completedAssets / stats.totalAssets) * 100) 
                    : 0;
                  
                  return (
                    <div
                      key={project.id}
                      className="p-6 hover:bg-slate-800/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/asset-map/${project.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-base font-semibold text-slate-100">
                              {project.name}
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Film className="w-3 h-3" />
                              {project.id.slice(0, 8)}
                            </span>
                            <span>{project.metadata.originalLanguage}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/ocularflow');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-xs font-semibold"
                        >
                          <Layers className="w-3 h-3" />
                          Open QC
                        </button>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            {stats.totalAssets} assets • {stats.totalIssues} issues
                          </span>
                          <span className="text-slate-400 font-semibold">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity - Takes up 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
                  Recent Activity
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {RECENT_ACTIVITY.map((activity, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-300 mb-0.5">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {activity.title}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        {activity.time} • {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/ocularflow')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Start New QC Session
                </button>
                <button
                  onClick={() => navigate('/asset-map/new')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <Map className="w-4 h-4 text-indigo-400" />
                  View Asset Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * StatCard Component
 */
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  const colorClasses = {
    cyan: 'from-cyan-500 to-blue-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    indigo: 'from-indigo-500 to-purple-600'
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-100 mb-1">{value}</p>
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-[10px] text-slate-600">{trend}</p>
    </div>
  );
}
