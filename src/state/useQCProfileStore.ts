import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MeasurementType = 'binary' | 'threshold' | 'range' | 'percentage';

export interface QCCheck {
  enabled: boolean;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  weight: number;
  penalty: number;
  measurementType: MeasurementType;
  threshold?: number;
  range?: {
    min?: number;
    max?: number;
    unit?: string;
  };
  acceptableLevels?: {
    pass: string;
    warn: string;
    fail: string;
  };
}

export interface QCCheckCategory {
  enabled: boolean;
  checks: Record<string, QCCheck>;
}

export interface QCLanguageConfig {
  checks: Record<string, QCCheckCategory>;
  scoring?: {
    severityMultipliers?: {
      ERROR: number;
      WARNING: number;
      INFO: number;
    };
    categoryMultipliers?: Record<string, number>;
  };
}

export interface QCProduct {
  languages: Record<string, QCLanguageConfig>;
}

export interface QCProfile {
  id: string;
  client: string;
  products: {
    dubbed_audio?: QCProduct;
    subtitles?: QCProduct;
    sdh?: QCProduct;
    cc?: QCProduct;
  };
}

interface QCProfileStore {
  profiles: QCProfile[];
  activeClientId: string;
  activeProduct: 'dubbed_audio' | 'subtitles' | 'sdh' | 'cc';
  activeLanguage: string;
  
  // Actions
  loadProfiles: (profiles: QCProfile[]) => void;
  setClient: (clientId: string) => void;
  setProduct: (productId: 'dubbed_audio' | 'subtitles' | 'sdh' | 'cc') => void;
  setLanguage: (langCode: string) => void;
  enableCheck: (categoryId: string, checkId: string) => void;
  disableCheck: (categoryId: string, checkId: string) => void;
  setThreshold: (categoryId: string, checkId: string, value: number) => void;
  setSeverity: (categoryId: string, checkId: string, severity: 'ERROR' | 'WARNING' | 'INFO') => void;
  setWeight: (categoryId: string, checkId: string, weight: number) => void;
  setPenalty: (categoryId: string, checkId: string, penalty: number) => void;
  setMeasurementType: (categoryId: string, checkId: string, type: MeasurementType) => void;
  cloneProfile: (profileId: string, newId: string, newClient: string) => void;
  saveProfile: (profile: QCProfile) => void;
  
  // Getters
  currentProfile: () => QCProfile | undefined;
  currentLanguageConfig: () => QCLanguageConfig | undefined;
}

const useQCProfileStore = create<QCProfileStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeClientId: 'apple_plus',
      activeProduct: 'dubbed_audio',
  activeLanguage: 'en',

      loadProfiles: (profiles) => {
        // Set default active client to professional_template if available
        const defaultClient = profiles.find(p => p.id === 'professional_template') 
          ? 'professional_template' 
          : (profiles[0]?.id || 'apple_plus');
        
        set({ 
          profiles,
          activeClientId: defaultClient
        });
      },

      setClient: (clientId) => set({ activeClientId: clientId }),

      setProduct: (productId) => set({ activeProduct: productId }),

      setLanguage: (langCode) => set({ activeLanguage: langCode }),

      enableCheck: (categoryId, checkId) =>
        set((state) => {
          const profiles = [...state.profiles];
          const profile = profiles.find((p) => p.id === state.activeClientId);
          if (!profile) return state;

          const product = profile.products[state.activeProduct];
          if (!product) return state;

          const langConfig = product.languages[state.activeLanguage];
          if (!langConfig) return state;

          const category = langConfig.checks[categoryId];
          if (!category) return state;

          if (category.checks[checkId]) {
            category.checks[checkId].enabled = true;
          }

          return { profiles };
        }),

      disableCheck: (categoryId, checkId) =>
        set((state) => {
          const profiles = [...state.profiles];
          const profile = profiles.find((p) => p.id === state.activeClientId);
          if (!profile) return state;

          const product = profile.products[state.activeProduct];
          if (!product) return state;

          const langConfig = product.languages[state.activeLanguage];
          if (!langConfig) return state;

          const category = langConfig.checks[categoryId];
          if (!category) return state;

          if (category.checks[checkId]) {
            category.checks[checkId].enabled = false;
          }

          return { profiles };
        }),

      setThreshold: (categoryId, checkId, value) =>
        set((state) => {
          const profiles = [...state.profiles];
          const profile = profiles.find((p) => p.id === state.activeClientId);
          if (!profile) return state;

          const product = profile.products[state.activeProduct];
          if (!product) return state;

          const langConfig = product.languages[state.activeLanguage];
          if (!langConfig) return state;

          const category = langConfig.checks[categoryId];
          if (!category) return state;

          if (category.checks[checkId]) {
            category.checks[checkId].threshold = value;
          }

          return { profiles };
        }),

      setSeverity: (categoryId, checkId, severity) =>
        set((state) => {
          const profiles = [...state.profiles];
          const profile = profiles.find((p) => p.id === state.activeClientId);
          if (!profile) return state;

          const product = profile.products[state.activeProduct];
          if (!product) return state;

          const langConfig = product.languages[state.activeLanguage];
          if (!langConfig) return state;

          const category = langConfig.checks[categoryId];
          if (!category) return state;

          if (category.checks[checkId]) {
            category.checks[checkId].severity = severity;
          }

          return { profiles };
        }),

      setWeight: (categoryId, checkId, weight) =>
        set((state) => {
          const profiles = [...state.profiles];
          const profile = profiles.find((p) => p.id === state.activeClientId);
          if (!profile) return state;

          const product = profile.products[state.activeProduct];
          if (!product) return state;

          const langConfig = product.languages[state.activeLanguage];
          if (!langConfig) return state;

          const category = langConfig.checks[categoryId];
          if (!category) return state;

          if (category.checks[checkId]) {
            category.checks[checkId].weight = weight;
          }

          return { profiles };
        }),

      setPenalty: (categoryId, checkId, penalty) =>
        set((state) => {
          const profiles = [...state.profiles];
          const profile = profiles.find((p) => p.id === state.activeClientId);
          if (!profile) return state;

          const product = profile.products[state.activeProduct];
          if (!product) return state;

          const langConfig = product.languages[state.activeLanguage];
          if (!langConfig) return state;

          const category = langConfig.checks[categoryId];
          if (!category) return state;

          if (category.checks[checkId]) {
            category.checks[checkId].penalty = penalty;
          }

          return { profiles };
        }),

      setMeasurementType: (categoryId, checkId, type) =>
        set((state) => {
          const profiles = [...state.profiles];
          const profile = profiles.find((p) => p.id === state.activeClientId);
          if (!profile) return state;

          const product = profile.products[state.activeProduct];
          if (!product) return state;

          const langConfig = product.languages[state.activeLanguage];
          if (!langConfig) return state;

          const category = langConfig.checks[categoryId];
          if (!category) return state;

          if (category.checks[checkId]) {
            category.checks[checkId].measurementType = type;
          }

          return { profiles };
        }),

      cloneProfile: (profileId, newId, newClient) =>
        set((state) => {
          const sourceProfile = state.profiles.find((p) => p.id === profileId);
          if (!sourceProfile) return state;

          const newProfile: QCProfile = {
            ...JSON.parse(JSON.stringify(sourceProfile)),
            id: newId,
            client: newClient,
          };

          return { profiles: [...state.profiles, newProfile] };
        }),

      saveProfile: (profile) =>
        set((state) => {
          const profiles = state.profiles.filter((p) => p.id !== profile.id);
          return { profiles: [...profiles, profile] };
        }),

      currentProfile: () => {
        const state = get();
        return state.profiles.find((p) => p.id === state.activeClientId);
      },

      currentLanguageConfig: () => {
        const state = get();
        const profile = state.currentProfile();
        if (!profile) return undefined;

        const product = profile.products[state.activeProduct];
        if (!product) return undefined;

        return product.languages[state.activeLanguage];
      },
    }),
    {
      name: 'qc-profile-storage',
    }
  )
);

export default useQCProfileStore;