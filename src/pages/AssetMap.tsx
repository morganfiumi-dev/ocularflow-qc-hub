/**
 * AssetMap - Title Asset Overview
 * Displays all assets, versions, and languages for a specific title
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Upload,
  Play,
  MoreVertical,
  Calendar,
  User,
  GitBranch
} from 'lucide-react';

/**
 * Mock title data
 */
const MOCK_TITLES: Record<string, any> = {
  'WT-2024-001': {
    id: 'WT-2024-001',
    name: 'The Witcher S03E08',
    originalLanguage: 'EN',
    releaseDate: '2024-12-15',
    duration: '00:58:42',
    type: 'Episode',
    series: 'The Witcher',
    season: 3,
    episode: 8
  },
  'ST-2024-042': {
    id: 'ST-2024-042',
    name: 'Stranger Things S05E01',
    originalLanguage: 'EN',
    releaseDate: '2024-12-10',
    duration: '01:12:15',
    type: 'Episode',
    series: 'Stranger Things',
    season: 5,
    episode: 1
  }
};

/**
 * Mock asset data
 */
const LANGUAGE_ASSETS = [
  {
    language: 'Spanish (ES)',
    code: 'es-ES',
    status: 'in-progress',
    progress: 65,
    assignee: 'Maria Garcia',
    segments: 486,
    issues: 12,
    lastModified: '2024-11-27T14:30:00Z',
    version: 'v2.3',
    locked: false
  },
  {
    language: 'French (FR)',
    code: 'fr-FR',
    status: 'review',
    progress: 95,
    assignee: 'Jean Dupont',
    segments: 489,
    issues: 3,
    lastModified: '2024-11-27T09:15:00Z',
    version: 'v3.1',
    locked: false
  },
  {
    language: 'German (DE)',
    code: 'de-DE',
    status: 'pending',
    progress: 0,
    assignee: 'Klaus Weber',
    segments: 0,
    issues: 0,
    lastModified: null,
    version: 'v1.0',
    locked: false
  },
  {
    language: 'Portuguese (BR)',
    code: 'pt-BR',
    status: 'completed',
    progress: 100,
    assignee: 'Ana Silva',
    segments: 492,
    issues: 0,
    lastModified: '2024-11-26T16:45:00Z',
    version: 'v4.0',
    locked: true
  },
  {
    language: 'Italian (IT)',
    code: 'it-IT',
    status: 'in-progress',
    progress: 42,
    assignee: 'Marco Rossi',
    segments: 486,
    issues: 8,
    lastModified: '2024-11-27T11:20:00Z',
    version: 'v1.8',
    locked: false
  },
  {
    language: 'Japanese (JP)',
    code: 'ja-JP',
    status: 'review',
    progress: 88,
    assignee: 'Yuki Tanaka',
    segments: 490,
    issues: 5,
    lastModified: '2024-11-27T08:00:00Z',
    version: 'v2.5',
    locked: false
  }
];

export default function AssetMap() {
  const { titleId } = useParams<{ titleId: string }>();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const title = titleId ? MOCK_TITLES[titleId] : null;

  if (!title && titleId !== 'new') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-300 mb-2">Title Not Found</h1>
          <p className="text-slate-500 mb-4">Title ID: {titleId}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors"
          >
            Back to Command Center
          </button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      'completed': {
        icon: CheckCircle2,
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        label: 'Completed'
      },
      'in-progress': {
        icon: Clock,
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        label: 'In Progress'
      },
      'review': {
        icon: AlertCircle,
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        label: 'In Review'
      },
      'pending': {
        icon: Clock,
        bg: 'bg-slate-700/50',
        text: 'text-slate-400',
        border: 'border-slate-600',
        label: 'Pending'
      }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not started';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const statsData = {
    total: LANGUAGE_ASSETS.length,
    completed: LANGUAGE_ASSETS.filter(a => a.status === 'completed').length,
    inProgress: LANGUAGE_ASSETS.filter(a => a.status === 'in-progress').length,
    issues: LANGUAGE_ASSETS.reduce((sum, a) => sum + a.issues, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-slate-100">{title?.name || 'New Title'}</h1>
                <p className="text-xs text-slate-500">
                  {title ? `${title.id} • ${title.duration} • ${title.originalLanguage}` : 'Asset Map'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-semibold">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button
                onClick={() => navigate('/ocularflow')}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors text-sm font-semibold"
              >
                <Zap className="w-4 h-4" />
                Launch QC
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <Globe className="w-5 h-5 text-slate-500" />
              <span className="text-2xl font-bold text-slate-100">{statsData.total}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Total Languages</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-bold text-slate-100">{statsData.completed}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Completed</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <Clock className="w-5 h-5 text-cyan-500" />
              <span className="text-2xl font-bold text-slate-100">{statsData.inProgress}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">In Progress</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-slate-100">{statsData.issues}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Total Issues</p>
          </div>
        </div>

        {/* Language Assets */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
              Language Assets
            </h2>
            <button className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
              Add Language +
            </button>
          </div>
          
          <div className="divide-y divide-slate-800">
            {LANGUAGE_ASSETS.map((asset) => {
              const statusConfig = getStatusConfig(asset.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={asset.code}
                  className="p-6 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700">
                        <Globe className="w-6 h-6 text-slate-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-semibold text-slate-100">
                            {asset.language}
                          </h3>
                          <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                          {asset.locked && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-700 text-slate-400 border border-slate-600">
                              Locked
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {asset.assignee}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {asset.version}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(asset.lastModified)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-slate-400" />
                      </button>
                      
                      <button
                        onClick={() => navigate('/ocularflow')}
                        disabled={asset.status === 'pending'}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-slate-300 disabled:text-slate-600 rounded-lg transition-colors text-sm font-semibold disabled:cursor-not-allowed"
                      >
                        <Play className="w-3 h-3" />
                        Open
                      </button>
                      
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress and Stats */}
                  {asset.status !== 'pending' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          {asset.segments} segments
                          {asset.issues > 0 && (
                            <span className="text-amber-400 ml-2">
                              • {asset.issues} {asset.issues === 1 ? 'issue' : 'issues'}
                            </span>
                          )}
                        </span>
                        <span className="text-slate-400 font-semibold">
                          {asset.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            asset.status === 'completed'
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                              : asset.status === 'review'
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                          }`}
                          style={{ width: `${asset.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Metadata Section */}
        {title && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">
                Title Info
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="text-slate-300 font-semibold">{title.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Series</dt>
                  <dd className="text-slate-300 font-semibold">{title.series}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Season/Episode</dt>
                  <dd className="text-slate-300 font-semibold">S{title.season}E{title.episode}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Duration</dt>
                  <dd className="text-slate-300 font-semibold">{title.duration}</dd>
                </div>
              </dl>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">
                Release Info
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Release Date</dt>
                  <dd className="text-slate-300 font-semibold">
                    {new Date(title.releaseDate).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Original Language</dt>
                  <dd className="text-slate-300 font-semibold">{title.originalLanguage}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Title ID</dt>
                  <dd className="text-slate-300 font-semibold font-mono text-xs">{title.id}</dd>
                </div>
              </dl>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4">
                QC Summary
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Total Segments</dt>
                  <dd className="text-slate-300 font-semibold">
                    {LANGUAGE_ASSETS.reduce((sum, a) => Math.max(sum, a.segments), 0)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Completion Rate</dt>
                  <dd className="text-slate-300 font-semibold">
                    {Math.round((statsData.completed / statsData.total) * 100)}%
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Active Issues</dt>
                  <dd className="text-amber-400 font-semibold">{statsData.issues}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
