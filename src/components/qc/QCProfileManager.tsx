import { useState } from 'react';
import useQCProfileStore, { QCCheck, MeasurementType } from '@/state/useQCProfileStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Settings, Copy, X, ChevronRight, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScoreSimulator } from './ScoreSimulator';

// Check descriptions from ScoreBreakdown
const CHECK_DESCRIPTIONS: Record<string, string> = {
  // Audio Deficiency
  audio_dropout: 'Complete loss of audio signal',
  clipping: 'Audio peaks exceed 0dB causing distortion',
  distortion: 'Audio signal degradation or artifacts',
  duration_mismatch: 'Audio length differs from expected duration',
  levels_shift: 'Inconsistent volume levels between segments',
  levels_too_low: 'Audio volume below recommended standards',
  phase_cancellation: 'Stereo channels canceling each other out',
  pop: 'Sharp clicking sound in audio',
  hit: 'Sudden impact or thud in audio',
  tick: 'Small clicking artifacts',
  static: 'Background noise or interference',
  production_error: 'Technical error during production',
  invalid_audio_mix: 'Incorrect channel configuration',
  truncated_audio: 'Audio cut off prematurely',
  missing_component: 'Required audio element missing',
  misc_audio_issue: 'Other audio quality issues',
  
  // Channel Integrity
  channel_missing_l: 'Left channel has no audio',
  channel_missing_r: 'Right channel has no audio',
  channel_missing_c: 'Center channel has no audio',
  channel_missing_lfe: 'Low frequency effects channel missing',
  channel_sound_absent: 'Expected audio missing from channel',
  channel_label_incorrect: 'Channel metadata incorrectly labeled',
  audio_video_mismatch_stereo: 'Stereo audio doesn\'t match video',
  audio_video_mismatch_surround: 'Surround audio doesn\'t match video',
  
  // Timing & Sync
  sync_drift: 'Audio gradually goes out of sync with video',
  early_entry: 'Dialogue starts before character speaks',
  late_entry: 'Dialogue starts after character speaks',
  late_cutoff: 'Dialogue ends after character stops speaking',
  pacing_cps: 'Speaking pace too fast (characters per second)',
  
  // Dialogue Integrity
  missing_words: 'Expected words not present in dialogue',
  added_words: 'Extra words not in original script',
  repetition_stutter: 'Unintentional word repetition',
  tone_mismatch: 'Voice tone doesn\'t match scene emotion',
  prosody_issues: 'Unnatural speech rhythm or intonation',
  pitch_gender_mismatch: 'Voice pitch doesn\'t match character',
  pronunciation_incorrect: 'Words pronounced incorrectly',
  
  // Synthetic Voice
  ai_voice_detection: 'Voice identified as AI-generated',
  over_smoothing: 'Overly processed, unnatural smoothness',
  accent_anomalies: 'Inconsistent or unnatural accent',
  synthetic_artifacts: 'Digital artifacts from voice synthesis',
  
  // Translation
  literal_translation: 'Word-for-word translation lacking context',
  wrong_domain_term: 'Incorrect technical or specialized term',
  formality_issues: 'Incorrect level of formality for context',
  incorrect_region_subtag: 'Wrong regional language variant',
  incorrect_language_tag: 'Wrong language code metadata',
  incorrect_translation: 'Translation doesn\'t convey original meaning'
};

interface QCProfileManagerProps {
  onClose: () => void;
}

export function QCProfileManager({ onClose }: QCProfileManagerProps) {
  const [newClientName, setNewClientName] = useState('');
  const [cloneSource, setCloneSource] = useState('');

  const {
    profiles,
    activeClientId,
    activeProduct,
    activeLanguage,
    setClient,
    setProduct,
    setLanguage,
    currentProfile,
    currentLanguageConfig,
    enableCheck,
    disableCheck,
    setSeverity,
    setWeight,
    setPenalty,
    setMeasurementType,
    cloneProfile,
  } = useQCProfileStore();

  const handleCloneProfile = () => {
    if (cloneSource && newClientName) {
      const newId = newClientName.toLowerCase().replace(/\s+/g, '_');
      cloneProfile(cloneSource, newId, newClientName);
      setNewClientName('');
      setCloneSource('');
    }
  };

  const profile = currentProfile();
  const langConfig = currentLanguageConfig();

  const productOptions = profile?.products
    ? Object.keys(profile.products).map((key) => ({
        id: key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        icon: key === 'dubbed_audio' ? '🎙️' : key === 'subtitles' ? '💬' : '📝',
      }))
    : [];

  const languageOptions = profile?.products?.[activeProduct]?.languages
    ? Object.keys(profile.products[activeProduct].languages)
    : [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-[#020617]/90 backdrop-blur-sm animate-fade-in">
      {/* Main Container - Wider for 3 columns */}
      <div className="w-full max-w-7xl h-[82vh] flex flex-col bg-[#0f172a] border border-[#334155] rounded-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden animate-scale-in">
        
        {/* Header Bar */}
        <div className="h-12 bg-[#020617] border-b border-[#334155] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#06b6d4]/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#f1f5f9] uppercase tracking-wider">QC Profile Manager</h2>
              <p className="text-[9px] text-[#64748b] uppercase tracking-wide font-mono">
                Client → Product → Language → Checks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded hover:bg-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-[#f1f5f9] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area - 3 Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Hierarchy Sidebar */}
          <div className="w-72 bg-[#020617] border-r border-[#334155] flex flex-col shrink-0">
            
            {/* 1. CLIENT SELECTION */}
            <div className="border-b border-[#334155]/50">
              <div className="h-8 bg-[#0f172a] border-b border-[#334155]/30 flex items-center px-4">
                <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">1. Client Profile</span>
              </div>
              <div className="p-4 space-y-3">
                <Select value={activeClientId} onValueChange={setClient}>
                  <SelectTrigger className="h-9 bg-[#1e293b] border-[#334155] text-[#f1f5f9] text-xs font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f172a] border-[#334155]">
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id} className="text-[#f1f5f9] text-xs font-mono">
                        {profile.client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Clone Section */}
                <div className="pt-2 border-t border-[#334155]/30">
                  <p className="text-[8px] text-[#64748b] uppercase tracking-wide mb-2">Clone Profile</p>
                  <div className="flex gap-1.5">
                    <Select value={cloneSource} onValueChange={setCloneSource}>
                      <SelectTrigger className="h-7 bg-[#020617] border-[#334155]/50 text-[#94a3b8] text-[10px]">
                        <SelectValue placeholder="Source" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0f172a] border-[#334155]">
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id} className="text-[#f1f5f9] text-[10px]">
                            {profile.client}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="New name"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="h-7 bg-[#020617] border-[#334155]/50 text-[#f1f5f9] text-[10px] placeholder:text-[#64748b]"
                    />
                    <button
                      onClick={handleCloneProfile}
                      disabled={!cloneSource || !newClientName}
                      className="h-7 w-7 flex items-center justify-center bg-[#020617] border border-[#334155]/50 rounded hover:bg-[#1e293b] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <Copy className="w-3 h-3 text-[#06b6d4]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PRODUCT TYPE */}
            <div className="border-b border-[#334155]/50">
              <div className="h-8 bg-[#0f172a] border-b border-[#334155]/30 flex items-center px-4">
                <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">2. Product Type</span>
              </div>
              <div className="p-2 space-y-1">
                {productOptions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setProduct(product.id as 'dubbed_audio' | 'subtitles' | 'sdh' | 'cc')}
                    className={cn(
                      "w-full h-9 flex items-center gap-2.5 px-3 rounded text-xs transition-all",
                      activeProduct === product.id
                        ? "bg-[#06b6d4]/15 text-[#06b6d4] border border-[#06b6d4]/30"
                        : "bg-transparent text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#f1f5f9]"
                    )}
                  >
                    <span className="text-base">{product.icon}</span>
                    <span className="flex-1 text-left font-medium">{product.label}</span>
                    {activeProduct === product.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. LANGUAGE */}
            <div className="border-b border-[#334155]/50">
              <div className="h-8 bg-[#0f172a] border-b border-[#334155]/30 flex items-center px-4">
                <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">3. Language</span>
              </div>
              <div className="p-4">
                <Select value={activeLanguage} onValueChange={setLanguage}>
                  <SelectTrigger className="h-9 bg-[#1e293b] border-[#334155] text-[#f1f5f9] text-xs font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f172a] border-[#334155]">
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang} value={lang} className="text-[#f1f5f9] text-xs font-mono">
                        {lang.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Available Languages Display */}
            <div className="flex-1 overflow-hidden">
              <div className="h-8 bg-[#0f172a] border-b border-[#334155]/30 flex items-center px-4">
                <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">Languages</span>
              </div>
              <ScrollArea className="h-[calc(100%-2rem)]">
                <div className="p-2 space-y-1">
                  {languageOptions.map((lang) => (
                    <div
                      key={lang}
                      className={cn(
                        "h-7 px-3 rounded flex items-center justify-between text-[10px] font-mono transition-all",
                        activeLanguage === lang
                          ? "bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20"
                          : "bg-[#1e293b]/30 text-[#94a3b8]"
                      )}
                    >
                      <span>{lang.toUpperCase()}</span>
                      {activeLanguage === lang && <Check className="w-3 h-3" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main Content Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#020617]">
            
            {/* Tab Header */}
            <div className="h-10 bg-[#0f172a] border-b border-[#334155] flex items-center px-6">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">4. Quality Checks</span>
                <ChevronRight className="w-3 h-3 text-[#334155]" />
                <span className="text-xs text-[#06b6d4] font-mono">{activeLanguage.toUpperCase()}</span>
              </div>
            </div>

            {/* Checks Content */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {langConfig && (
                  <Accordion type="multiple" className="space-y-2">
                    {Object.entries(langConfig.checks).map(([categoryId, category]) => (
                      <AccordionItem
                        key={categoryId}
                        value={categoryId}
                        className="border border-[#334155]/50 rounded overflow-hidden bg-[#0f172a]"
                      >
                        <AccordionTrigger className="h-10 px-4 bg-[#1e293b]/30 hover:bg-[#1e293b]/50 border-b border-[#334155]/30 transition-colors [&[data-state=open]]:bg-[#1e293b]/70 data-[state=open]:border-b-0">
                          <span className="text-xs font-bold text-[#f1f5f9] uppercase tracking-wide">
                            {categoryId.replace(/_/g, ' ')}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                          <div className="divide-y divide-[#334155]/20">
                            {Object.entries(category.checks).map(([checkId, check]) => {
                              const qcCheck = check as QCCheck;
                              const description = CHECK_DESCRIPTIONS[checkId] || 'Quality check';
                              return (
                                <div
                                  key={checkId}
                                  className="px-4 py-3 bg-[#020617]/50 hover:bg-[#020617] transition-colors"
                                >
                                  <div className="flex items-start gap-3">
                                    <Switch
                                      checked={qcCheck.enabled}
                                      onCheckedChange={(enabled) => {
                                        if (enabled) {
                                          enableCheck(categoryId, checkId);
                                        } else {
                                          disableCheck(categoryId, checkId);
                                        }
                                      }}
                                      className="data-[state=checked]:bg-[#06b6d4] mt-0.5 shrink-0"
                                    />
                                     <div className="flex-1 min-w-0 space-y-3">
                                       {/* Check Name & Description */}
                                       <div>
                                         <div className="flex items-center gap-2 mb-1">
                                           <div className="text-[11px] font-semibold text-[#f1f5f9]">
                                             {checkId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                           </div>
                                           {qcCheck.measurementType && (
                                             <Badge 
                                               variant="outline" 
                                               className={cn(
                                                 "h-4 px-1.5 text-[7px] font-mono uppercase tracking-wider",
                                                 qcCheck.measurementType === 'binary' && "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30",
                                                 qcCheck.measurementType === 'threshold' && "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30",
                                                 qcCheck.measurementType === 'range' && "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/30",
                                                 qcCheck.measurementType === 'percentage' && "bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/30"
                                               )}
                                             >
                                               {qcCheck.measurementType}
                                             </Badge>
                                           )}
                                         </div>
                                         <div className="text-[9px] text-[#64748b] leading-relaxed">
                                           {description}
                                         </div>
                                       </div>

                                       {/* Measurement Type & Acceptable Levels */}
                                       {qcCheck.acceptableLevels && (
                                         <div className="bg-[#1e293b]/30 border border-[#334155]/30 rounded p-2 space-y-1.5">
                                           <div className="text-[7px] text-[#64748b] uppercase tracking-wider font-bold mb-1.5">
                                             Conformity Levels
                                           </div>
                                           <div className="space-y-1">
                                             <div className="flex items-start gap-2">
                                               <div className="w-1 h-1 rounded-full bg-[#10b981] mt-1 shrink-0" />
                                               <div className="flex-1">
                                                 <span className="text-[8px] font-bold text-[#10b981] uppercase tracking-wide">Pass:</span>
                                                 <span className="text-[8px] text-[#94a3b8] ml-1.5">{qcCheck.acceptableLevels.pass}</span>
                                               </div>
                                             </div>
                                             {qcCheck.acceptableLevels.warn !== 'N/A' && (
                                               <div className="flex items-start gap-2">
                                                 <div className="w-1 h-1 rounded-full bg-[#f59e0b] mt-1 shrink-0" />
                                                 <div className="flex-1">
                                                   <span className="text-[8px] font-bold text-[#f59e0b] uppercase tracking-wide">Review:</span>
                                                   <span className="text-[8px] text-[#94a3b8] ml-1.5">{qcCheck.acceptableLevels.warn}</span>
                                                 </div>
                                               </div>
                                             )}
                                             <div className="flex items-start gap-2">
                                               <div className="w-1 h-1 rounded-full bg-[#ef4444] mt-1 shrink-0" />
                                               <div className="flex-1">
                                                 <span className="text-[8px] font-bold text-[#ef4444] uppercase tracking-wide">Fail:</span>
                                                 <span className="text-[8px] text-[#94a3b8] ml-1.5">{qcCheck.acceptableLevels.fail}</span>
                                               </div>
                                             </div>
                                           </div>
                                         </div>
                                       )}

                                       {/* Controls Row */}
                                       <div className="flex items-center gap-2 flex-wrap">
                                         {/* Measurement Type */}
                                         <div className="flex items-center gap-1.5">
                                           <span className="text-[8px] text-[#64748b] uppercase tracking-wide">Type</span>
                                           <Select
                                             value={qcCheck.measurementType || 'binary'}
                                             onValueChange={(value) =>
                                               setMeasurementType(categoryId, checkId, value as MeasurementType)
                                             }
                                           >
                                             <SelectTrigger className="h-6 w-24 text-[9px] bg-[#1e293b] border-[#334155]">
                                               <SelectValue />
                                             </SelectTrigger>
                                             <SelectContent className="bg-[#0f172a] border-[#334155]">
                                               <SelectItem value="binary" className="text-[#f1f5f9] text-[9px]">
                                                 Binary (Y/N)
                                               </SelectItem>
                                               <SelectItem value="threshold" className="text-[#f1f5f9] text-[9px]">
                                                 Threshold
                                               </SelectItem>
                                               <SelectItem value="range" className="text-[#f1f5f9] text-[9px]">
                                                 Range
                                               </SelectItem>
                                               <SelectItem value="percentage" className="text-[#f1f5f9] text-[9px]">
                                                 Percentage
                                               </SelectItem>
                                             </SelectContent>
                                           </Select>
                                         </div>

                                         {/* Severity */}
                                         <div className="flex items-center gap-1.5">
                                           <span className="text-[8px] text-[#64748b] uppercase tracking-wide">Severity</span>
                                           <Select
                                             value={qcCheck.severity}
                                             onValueChange={(value) =>
                                               setSeverity(categoryId, checkId, value as 'ERROR' | 'WARNING' | 'INFO')
                                             }
                                           >
                                             <SelectTrigger className="h-6 w-20 text-[9px] bg-[#1e293b] border-[#334155]">
                                               <SelectValue />
                                             </SelectTrigger>
                                             <SelectContent className="bg-[#0f172a] border-[#334155]">
                                               <SelectItem value="ERROR" className="text-[#ef4444] text-[9px]">
                                                 ERROR
                                               </SelectItem>
                                               <SelectItem value="WARNING" className="text-[#f59e0b] text-[9px]">
                                                 WARNING
                                               </SelectItem>
                                               <SelectItem value="INFO" className="text-[#06b6d4] text-[9px]">
                                                 INFO
                                               </SelectItem>
                                             </SelectContent>
                                           </Select>
                                         </div>

                                         {/* Weight */}
                                         <div className="flex items-center gap-1.5">
                                           <span className="text-[8px] text-[#64748b] uppercase tracking-wide" title="Importance factor (0-1). Higher = more impactful on score">
                                             Weight
                                           </span>
                                           <Input
                                             type="number"
                                             value={qcCheck.weight}
                                             onChange={(e) =>
                                               setWeight(categoryId, checkId, parseFloat(e.target.value) || 0)
                                             }
                                             step="0.1"
                                             min="0"
                                             max="1"
                                             className="w-14 h-6 text-[9px] text-right font-mono bg-[#1e293b] border-[#334155] text-[#f1f5f9] px-2"
                                           />
                                         </div>

                                         {/* Penalty */}
                                         <div className="flex items-center gap-1.5">
                                           <span className="text-[8px] text-[#64748b] uppercase tracking-wide" title="Base points deducted from 100. Multiplied by weight × severity multiplier">
                                             Penalty
                                           </span>
                                           <Input
                                             type="number"
                                             value={qcCheck.penalty}
                                             onChange={(e) =>
                                               setPenalty(categoryId, checkId, parseFloat(e.target.value) || 0)
                                             }
                                             step="1"
                                             min="0"
                                             className="w-14 h-6 text-[9px] text-right font-mono bg-[#1e293b] border-[#334155] text-[#f1f5f9] px-2"
                                           />
                                         </div>
                                       </div>
                                     </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}

                {/* Scoring Formula */}
                {langConfig?.scoring && (
                  <div className="mt-6 space-y-3">
                    <div className="h-8 bg-[#0f172a] border-b border-[#334155] flex items-center px-4 rounded-t">
                      <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">Scoring Engine</span>
                    </div>
                    
                    <div className="bg-[#0f172a] border border-[#334155] rounded p-4 space-y-4">
                      {/* Formula Display */}
                      <div className="bg-[#020617] border border-[#334155]/50 rounded p-4 space-y-3">
                        <pre className="font-mono text-xs text-center">
                          <span className="text-[#f1f5f9]">clipScore</span>{' '}
                          <span className="text-[#64748b]">=</span>{' '}
                          <span className="text-[#06b6d4]">100</span>{' '}
                          <span className="text-[#64748b]">-</span>{' '}
                          <span className="text-[#f1f5f9]">Σ</span>
                          <span className="text-[#64748b]">(</span>
                          <span className="text-[#94a3b8]">weight × severity × penalty</span>
                          <span className="text-[#64748b]">)</span>
                        </pre>
                        <div className="flex items-start gap-2 text-[9px] text-[#64748b] leading-relaxed">
                          <Info className="w-3 h-3 mt-0.5 shrink-0" />
                          <div>
                            All clips start at 100 points. Each issue deducts points based on: <span className="text-[#06b6d4]">Weight</span> (importance 0-1) × <span className="text-[#f59e0b]">Severity multiplier</span> × <span className="text-[#ef4444]">Base penalty</span>. Categories can have priority multipliers.
                          </div>
                        </div>
                      </div>

                      {/* Multipliers */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[9px] text-[#64748b] uppercase tracking-wide mb-2">Severity Multipliers</p>
                          <div className="space-y-1.5">
                            {Object.entries(langConfig.scoring.severityMultipliers || {}).map(
                              ([severity, multiplier]) => (
                                <div key={severity} className="flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-[#94a3b8]">{severity}</span>
                                  <span className="text-[#06b6d4]">{multiplier as number}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        
                        {langConfig.scoring.categoryMultipliers && (
                          <div>
                            <p className="text-[9px] text-[#64748b] uppercase tracking-wide mb-2">Category Multipliers</p>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                              {Object.entries(langConfig.scoring.categoryMultipliers).map(
                                ([category, multiplier]) => (
                                  <div key={category} className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="text-[#94a3b8] truncate pr-2">
                                      {category.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-[#06b6d4]">{multiplier as number}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Third Column - Live Score Preview */}
          <div className="w-80 border-l border-[#334155] shrink-0">
            {langConfig ? (
              <ScoreSimulator languageConfig={langConfig} activeClient={profile?.client || activeClientId} />
            ) : (
              <div className="h-full flex items-center justify-center p-6 text-center">
                <div className="text-[10px] text-[#64748b]">
                  Select a profile to preview scoring
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 bg-[#020617] border-t border-[#334155] flex items-center justify-end gap-3 px-6 shrink-0">
          <Button
            onClick={onClose}
            variant="ghost"
            className="h-8 text-xs text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e293b]"
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="h-8 px-6 text-xs bg-[#06b6d4] text-[#020617] font-bold hover:bg-[#22d3ee] shadow-lg shadow-[#06b6d4]/20"
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
