/**
 * ContextPanel Component
 * Displays rich contextual metadata for a title (plot, characters, glossary, idioms, etc.)
 */

import React, { useEffect, useState } from 'react';
import { BookOpen, Users, FileText, MessageSquare, Globe, Info, ChevronDown } from 'lucide-react';
import { loadContext, ContextMetadata } from '../../demo/loadContextualMetadata';
import { cn } from '@/lib/utils';

interface ContextPanelProps {
  titleId: string;
}

export function ContextPanel({ titleId }: ContextPanelProps) {
  const [context, setContext] = useState<ContextMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('metadata');

  useEffect(() => {
    async function loadContextData() {
      try {
        setLoading(true);
        const data = await loadContext();
        setContext(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load context:', err);
        setError('Failed to load contextual metadata');
      } finally {
        setLoading(false);
      }
    }

    // Load context data for all projects (demo data for now)
    loadContextData();
  }, [titleId]);

  if (loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6 animate-pulse mb-8">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="h-3 bg-slate-800 rounded w-full mb-2"></div>
        <div className="h-3 bg-slate-800 rounded w-2/3"></div>
      </div>
    );
  }

  if (error || !context) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6 mb-8">
        <p className="text-slate-500 text-sm text-center">No contextual metadata available for this title.</p>
      </div>
    );
  }

  const sections = [
    { id: 'metadata', label: 'Overview', icon: Info },
    { id: 'plot', label: 'Plot', icon: FileText },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'glossary', label: 'Glossary', icon: BookOpen },
    { id: 'idioms', label: 'Idioms', icon: MessageSquare },
    { id: 'cultural', label: 'Cultural Notes', icon: Globe },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-lg overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Title Context
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Rich contextual metadata for localization and QC
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 px-6 py-3 bg-slate-950/50 border-b border-slate-800 overflow-x-auto">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {activeSection === 'metadata' && (
          <MetadataSection metadata={context.metadata} />
        )}
        {activeSection === 'plot' && <PlotSection plot={context.plot} />}
        {activeSection === 'characters' && (
          <CharactersSection characters={context.characters.characters} />
        )}
        {activeSection === 'glossary' && (
          <GlossarySection terms={context.glossary.terms} />
        )}
        {activeSection === 'idioms' && (
          <IdiomsSection entries={context.idioms.entries} />
        )}
        {activeSection === 'cultural' && (
          <CulturalSection notes={context.culturalNotes.notes} />
        )}
      </div>
    </div>
  );
}

function MetadataSection({ metadata }: { metadata: ContextMetadata['metadata'] }) {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    genres: true,
    credits: true,
    cast: true,
    themes: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-3">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border border-cyan-800/30 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('overview')}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-900/30 transition-colors"
        >
          <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Overview</h4>
          <ChevronDown className={cn(
            "w-4 h-4 text-slate-400 transition-transform",
            expandedSections.overview && "rotate-180"
          )} />
        </button>
        {expandedSections.overview && (
          <div className="px-6 pb-4">
            <h3 className="text-2xl font-bold text-cyan-400 mb-3 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              {metadata.title}
            </h3>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300 mb-4">
              <span className="px-3 py-1 bg-slate-800/50 rounded-full">{metadata.year}</span>
              <span className="px-3 py-1 bg-red-900/30 border border-red-700/50 rounded-full">{metadata.rating}</span>
              <span className="px-3 py-1 bg-slate-800/50 rounded-full">{metadata.runtime}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{metadata.summary}</p>
          </div>
        )}
      </div>

      {/* Genres */}
      <div className="bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('genres')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-900/30 transition-colors"
        >
          <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Genres</h4>
          <ChevronDown className={cn(
            "w-4 h-4 text-slate-400 transition-transform",
            expandedSections.genres && "rotate-180"
          )} />
        </button>
        {expandedSections.genres && (
          <div className="px-4 pb-3">
            <div className="flex flex-wrap gap-2">
              {metadata.genres.map((genre, idx) => (
                <span
                  key={genre}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/50 text-purple-300 rounded-lg text-xs font-semibold"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Credits Grid */}
      <div className="bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('credits')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-900/30 transition-colors"
        >
          <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Production Credits</h4>
          <ChevronDown className={cn(
            "w-4 h-4 text-slate-400 transition-transform",
            expandedSections.credits && "rotate-180"
          )} />
        </button>
        {expandedSections.credits && (
          <div className="px-4 pb-3 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <span className="text-xs uppercase tracking-wider text-cyan-500 font-bold">Director</span>
                <p className="text-slate-200 mt-1">{metadata.director}</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <span className="text-xs uppercase tracking-wider text-cyan-500 font-bold">Studio</span>
                <p className="text-slate-200 mt-1">{metadata.studio}</p>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <span className="text-xs uppercase tracking-wider text-cyan-500 font-bold block mb-2">Writers</span>
              <p className="text-slate-200 text-sm">{metadata.writers.join(', ')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Cast */}
      {(metadata as any).mainCast && (
        <div className="bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('cast')}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-900/30 transition-colors"
          >
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Main Cast</h4>
            <ChevronDown className={cn(
              "w-4 h-4 text-slate-400 transition-transform",
              expandedSections.cast && "rotate-180"
            )} />
          </button>
          {expandedSections.cast && (
            <div className="px-4 pb-3 space-y-2">
              {(metadata as any).mainCast.map((cast: string) => (
                <p key={cast} className="text-slate-300 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                  {cast}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Themes */}
      {(metadata as any).themes && (
        <div className="bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('themes')}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-900/30 transition-colors"
          >
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Themes</h4>
            <ChevronDown className={cn(
              "w-4 h-4 text-slate-400 transition-transform",
              expandedSections.themes && "rotate-180"
            )} />
          </button>
          {expandedSections.themes && (
            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-2">
                {(metadata as any).themes.map((theme: string) => (
                  <span
                    key={theme}
                    className="px-3 py-1 bg-amber-900/20 border border-amber-700/40 text-amber-400 rounded text-xs"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlotSection({ plot }: { plot: any }) {
  return (
    <div className="space-y-6">
      {/* Synopsis */}
      <div className="bg-gradient-to-br from-purple-950/30 to-slate-950 border border-purple-800/30 rounded-xl p-5">
        <h4 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          Episode Synopsis
        </h4>
        <p className="text-slate-300 text-sm leading-relaxed">{plot.synopsis}</p>
      </div>

      {/* Acts Structure */}
      {plot.acts && (
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Three-Act Structure</h4>
          {Object.entries(plot.acts).map(([act, description], idx) => (
            <div key={act} className="bg-slate-950/50 border-l-4 border-cyan-500 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-cyan-900/50 border border-cyan-700 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400">
                  {idx + 1}
                </span>
                <span className="text-xs uppercase tracking-wider text-cyan-500 font-bold">
                  {act.replace('act', 'Act ')}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{description as string}</p>
            </div>
          ))}
        </div>
      )}

      {/* Plot Beats Timeline */}
      <div>
        <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Key Plot Beats</h4>
        <div className="space-y-2 relative">
          <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-30"></div>
          {plot.beats.map((beat: string, idx: number) => (
            <div key={idx} className="flex gap-3 text-sm text-slate-300 relative">
              <div className="flex-shrink-0 w-4 h-4 mt-0.5 bg-cyan-500 rounded-full border-2 border-slate-950 z-10 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
              <span className="flex-1 py-1">{beat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subplots */}
      {plot.subplots && (
        <div>
          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Subplots</h4>
          <div className="space-y-2">
            {plot.subplots.map((subplot: string, idx: number) => (
              <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-sm text-slate-300">
                <span className="text-purple-400 font-semibold mr-2">•</span>
                {subplot}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CharactersSection({ characters }: { characters: Array<any> }) {
  return (
    <div className="space-y-4">
      {characters.map((character) => (
        <div
          key={character.name}
          className="bg-gradient-to-br from-slate-950 to-slate-900 border-l-4 border-cyan-500 rounded-lg p-5 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-xl text-cyan-400 mb-1">{character.name}</h4>
              {character.actor && (
                <p className="text-xs text-slate-500">Portrayed by <span className="text-purple-400">{character.actor}</span></p>
              )}
            </div>
            {character.role && (
              <span className="px-2 py-1 bg-purple-900/30 border border-purple-700/50 text-purple-300 rounded text-xs font-semibold">
                {character.role}
              </span>
            )}
          </div>
          
          <p className="text-sm text-slate-300 leading-relaxed mb-3">{character.description}</p>
          
          {character.background && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <p className="text-xs text-slate-400 leading-relaxed italic">{character.background}</p>
            </div>
          )}
          
          {character.abilities && (
            <div className="mt-3">
              <span className="text-xs uppercase tracking-wider text-cyan-500 font-bold">Abilities:</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {character.abilities.map((ability: string) => (
                  <span key={ability} className="px-2 py-0.5 bg-cyan-900/20 border border-cyan-800/40 text-cyan-400 rounded text-xs">
                    {ability}
                  </span>
                ))}
              </div>
            </div>
          )}

          {character.personality && (
            <div className="mt-3">
              <span className="text-xs uppercase tracking-wider text-purple-500 font-bold">Personality:</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {character.personality.map((trait: string) => (
                  <span key={trait} className="px-2 py-0.5 bg-purple-900/20 border border-purple-800/40 text-purple-400 rounded text-xs">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GlossarySection({ terms }: { terms: Array<{ term: string; definition: string }> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {terms.map((item, idx) => (
        <div
          key={item.term}
          className="bg-slate-950/50 border border-cyan-800/40 rounded-lg p-4 hover:border-cyan-600/60 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
          style={{ animationDelay: `${idx * 0.05}s` }}
        >
          <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
            {item.term}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>
        </div>
      ))}
    </div>
  );
}

function IdiomsSection({ entries }: { entries: Array<{ source: string; explanation: string }> }) {
  return (
    <div className="space-y-3">
      {entries.map((entry, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-purple-950/30 to-slate-950 border border-purple-800/40 rounded-xl p-5 hover:border-purple-600/60 transition-all duration-300"
        >
          <div className="mb-3 relative">
            <span className="absolute -left-2 -top-2 text-4xl text-purple-800/40 font-serif">"</span>
            <p className="font-mono text-base text-purple-300 italic pl-4">
              {entry.source}
            </p>
            <span className="absolute -right-2 -bottom-2 text-4xl text-purple-800/40 font-serif">"</span>
          </div>
          <div className="border-t border-purple-900/30 pt-3">
            <p className="text-sm text-slate-300 leading-relaxed">{entry.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CulturalSection({ notes }: { notes: Array<{ topic: string; details: string }> }) {
  return (
    <div className="space-y-4">
      {notes.map((note, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-amber-950/20 to-slate-950 border-l-4 border-amber-500 rounded-lg p-5 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-900/30 border border-amber-700/50 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-400 mb-2">{note.topic}</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{note.details}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
