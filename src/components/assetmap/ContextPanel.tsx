/**
 * ContextPanel Component
 * Displays rich contextual metadata for a title (plot, characters, glossary, idioms, etc.)
 */

import React, { useEffect, useState } from 'react';
import { BookOpen, Users, FileText, MessageSquare, Globe, Info } from 'lucide-react';
import { loadContext, ContextMetadata } from '../../demo/loadContextualMetadata';

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
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-slate-100 mb-2">{metadata.title}</h3>
        <div className="flex gap-2 text-xs text-slate-400 mb-4">
          <span>{metadata.year}</span>
          <span>•</span>
          <span>{metadata.rating}</span>
          <span>•</span>
          <span>{metadata.runtime}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-500 font-semibold">Director:</span>
          <p className="text-slate-200">{metadata.director}</p>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Studio:</span>
          <p className="text-slate-200">{metadata.studio}</p>
        </div>
      </div>

      <div>
        <span className="text-slate-500 font-semibold text-sm">Genres:</span>
        <div className="flex gap-2 mt-2">
          {metadata.genres.map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      <div>
        <span className="text-slate-500 font-semibold text-sm">Writers:</span>
        <p className="text-slate-200 text-sm mt-1">{metadata.writers.join(', ')}</p>
      </div>

      <div>
        <span className="text-slate-500 font-semibold text-sm">Summary:</span>
        <p className="text-slate-300 text-sm mt-2 leading-relaxed">{metadata.summary}</p>
      </div>
    </div>
  );
}

function PlotSection({ plot }: { plot: ContextMetadata['plot'] }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-slate-400 mb-2">Synopsis</h4>
        <p className="text-slate-300 text-sm leading-relaxed">{plot.synopsis}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-400 mb-2">Plot Beats</h4>
        <ul className="space-y-2">
          {plot.beats.map((beat, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-slate-300">
              <span className="text-cyan-500 font-mono">{idx + 1}.</span>
              <span>{beat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CharactersSection({ characters }: { characters: Array<{ name: string; description: string }> }) {
  return (
    <div className="space-y-3">
      {characters.map((character) => (
        <div
          key={character.name}
          className="bg-slate-950/50 border border-slate-800 rounded-lg p-4"
        >
          <h4 className="font-bold text-slate-100 mb-1">{character.name}</h4>
          <p className="text-sm text-slate-400">{character.description}</p>
        </div>
      ))}
    </div>
  );
}

function GlossarySection({ terms }: { terms: Array<{ term: string; definition: string }> }) {
  return (
    <div className="space-y-3">
      {terms.map((item) => (
        <div
          key={item.term}
          className="bg-slate-950/50 border border-slate-800 rounded-lg p-4"
        >
          <h4 className="font-bold text-cyan-400 mb-1">{item.term}</h4>
          <p className="text-sm text-slate-300">{item.definition}</p>
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
          className="bg-slate-950/50 border border-slate-800 rounded-lg p-4"
        >
          <div className="mb-2 font-mono text-sm text-purple-400 italic">
            "{entry.source}"
          </div>
          <p className="text-sm text-slate-300">{entry.explanation}</p>
        </div>
      ))}
    </div>
  );
}

function CulturalSection({ notes }: { notes: Array<{ topic: string; details: string }> }) {
  return (
    <div className="space-y-3">
      {notes.map((note, idx) => (
        <div
          key={idx}
          className="bg-slate-950/50 border border-slate-800 rounded-lg p-4"
        >
          <h4 className="font-bold text-amber-400 mb-1">{note.topic}</h4>
          <p className="text-sm text-slate-300">{note.details}</p>
        </div>
      ))}
    </div>
  );
}
