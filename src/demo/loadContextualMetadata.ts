/**
 * Contextual Metadata Loader
 * Loads rich contextual film metadata for demo projects (browser-only)
 */

export interface ContextMetadata {
  metadata: {
    title: string;
    year: number;
    genres: string[];
    runtime: string;
    rating: string;
    director: string;
    writers: string[];
    studio: string;
    summary: string;
  };
  plot: {
    synopsis: string;
    beats: string[];
  };
  characters: {
    characters: Array<{
      name: string;
      description: string;
    }>;
  };
  glossary: {
    terms: Array<{
      term: string;
      definition: string;
    }>;
  };
  idioms: {
    entries: Array<{
      source: string;
      explanation: string;
    }>;
  };
  annotations: {
    annotations: Array<{
      line: string;
      note: string;
    }>;
  };
  culturalNotes: {
    notes: Array<{
      topic: string;
      details: string;
    }>;
  };
}

/**
 * Load all contextual metadata for demo project
 */
export async function loadContext(): Promise<ContextMetadata> {
  const base = "/demo-project/context";

  async function load(path: string) {
    const response = await fetch(`${base}/${path}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.statusText}`);
    }
    return response.json();
  }

  try {
    const [metadata, plot, characters, glossary, idioms, annotations, culturalNotes] = 
      await Promise.all([
        load("metadata.json"),
        load("plot.json"),
        load("characters.json"),
        load("glossary.json"),
        load("idioms.json"),
        load("annotations.json"),
        load("cultural-notes.json")
      ]);

    return {
      metadata,
      plot,
      characters,
      glossary,
      idioms,
      annotations,
      culturalNotes
    };
  } catch (error) {
    console.error("Error loading contextual metadata:", error);
    throw error;
  }
}
