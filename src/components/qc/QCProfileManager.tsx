import { useState } from 'react';
import useQCProfileStore, { QCCheck } from '@/state/useQCProfileStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Settings, Copy, X, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      {/* Main Container */}
      <div className="w-full max-w-5xl h-[82vh] flex flex-col bg-[#0f172a] border border-[#334155] rounded-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden animate-scale-in">
        
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

        {/* Content Area */}
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
                        <AccordionTrigger className="h-10 px-4 bg-[#1e293b]/30 hover:bg-[#1e293b]/50 border-b border-[#334155]/30 transition-all [&[data-state=open]]:bg-[#1e293b]/70">
                          <span className="text-xs font-bold text-[#f1f5f9] uppercase tracking-wide">
                            {categoryId.replace(/_/g, ' ')}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                          <div className="divide-y divide-[#334155]/20">
                            {Object.entries(category.checks).map(([checkId, check]) => {
                              const qcCheck = check as QCCheck;
                              return (
                                <div
                                  key={checkId}
                                  className="px-4 py-3 flex items-center gap-3 bg-[#020617]/50 hover:bg-[#020617] transition-colors"
                                >
                                  <Switch
                                    checked={qcCheck.enabled}
                                    onCheckedChange={(enabled) => {
                                      if (enabled) {
                                        enableCheck(categoryId, checkId);
                                      } else {
                                        disableCheck(categoryId, checkId);
                                      }
                                    }}
                                    className="data-[state=checked]:bg-[#06b6d4]"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[11px] font-semibold text-[#f1f5f9]">
                                      {checkId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </div>
                                    <div className="text-[9px] text-[#64748b] font-mono mt-0.5">
                                      {qcCheck.severity} • W:{qcCheck.weight} • P:{qcCheck.penalty}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={qcCheck.severity}
                                      onValueChange={(value) =>
                                        setSeverity(categoryId, checkId, value as 'ERROR' | 'WARNING' | 'INFO')
                                      }
                                    >
                                      <SelectTrigger className="h-7 w-20 text-[10px] bg-[#1e293b] border-[#334155]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#0f172a] border-[#334155]">
                                        <SelectItem value="ERROR" className="text-[#ef4444] text-[10px]">
                                          ERROR
                                        </SelectItem>
                                        <SelectItem value="WARNING" className="text-[#f59e0b] text-[10px]">
                                          WARNING
                                        </SelectItem>
                                        <SelectItem value="INFO" className="text-[#06b6d4] text-[10px]">
                                          INFO
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      type="number"
                                      value={qcCheck.weight}
                                      onChange={(e) =>
                                        setWeight(categoryId, checkId, parseFloat(e.target.value) || 0)
                                      }
                                      step="0.1"
                                      min="0"
                                      max="1"
                                      className="w-14 h-7 text-[10px] text-right font-mono bg-[#1e293b] border-[#334155] text-[#f1f5f9]"
                                    />
                                    <Input
                                      type="number"
                                      value={qcCheck.penalty}
                                      onChange={(e) =>
                                        setPenalty(categoryId, checkId, parseFloat(e.target.value) || 0)
                                      }
                                      step="1"
                                      min="0"
                                      className="w-14 h-7 text-[10px] text-right font-mono bg-[#1e293b] border-[#334155] text-[#f1f5f9]"
                                    />
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
                      <div className="bg-[#020617] border border-[#334155]/50 rounded p-4">
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
