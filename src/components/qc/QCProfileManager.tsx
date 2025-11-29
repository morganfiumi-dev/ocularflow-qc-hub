import { useState } from 'react';
import useQCProfileStore, { QCCheck } from '@/state/useQCProfileStore';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Settings, Copy, X, Plus, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QCProfileManagerProps {
  onClose: () => void;
}

export function QCProfileManager({ onClose }: QCProfileManagerProps) {
  const [activeTab, setActiveTab] = useState<'clients' | 'products' | 'languages' | 'checks' | 'scoring'>('clients');
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

  const tabs = [
    { id: 'clients' as const, label: 'Clients', icon: '👤' },
    { id: 'products' as const, label: 'Products', icon: '📦' },
    { id: 'languages' as const, label: 'Languages', icon: '🌐' },
    { id: 'checks' as const, label: 'QC Checks', icon: '✓' },
    { id: 'scoring' as const, label: 'Scoring Engine', icon: '∑' },
  ];

  const handleCloneProfile = () => {
    if (cloneSource && newClientName) {
      const newId = newClientName.toLowerCase().replace(/\s+/g, '_');
      cloneProfile(cloneSource, newId, newClientName);
      setNewClientName('');
      setCloneSource('');
    }
  };

  const handleSaveAndClose = () => {
    onClose();
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

  const languageOptions =
    profile?.products?.[activeProduct]?.languages
      ? Object.keys(profile.products[activeProduct].languages)
      : [];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl h-[85vh] p-0 gap-0 border-cockpit-steel bg-cockpit-cool/95 backdrop-blur-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="h-16 px-8 flex flex-row items-center gap-4 bg-cockpit-deep border-b border-cockpit-steel shrink-0">
          <div className="w-10 h-10 rounded-lg bg-cockpit-electric/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-cockpit-electric" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">QC Profile Manager</h2>
            <p className="text-xs text-cockpit-slate-400">Enterprise-level quality control configuration</p>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-cockpit-deep border-r border-cockpit-steel shrink-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-cockpit-electric text-white shadow-lg shadow-cockpit-electric/20"
                        : "text-cockpit-slate-400 hover:text-white hover:bg-cockpit-slate-800"
                    )}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {activeTab === tab.id && <ChevronRight className="ml-auto w-4 h-4" />}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="p-8">
                {/* Clients Tab */}
                {activeTab === 'clients' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-wider text-cockpit-slate-400 font-semibold">
                        Active Client Profile
                      </label>
                      <Select value={activeClientId} onValueChange={setClient}>
                        <SelectTrigger className="h-12 bg-cockpit-slate-900 border-cockpit-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-cockpit-slate-900 border-cockpit-slate-700">
                          {profiles.map((profile) => (
                            <SelectItem key={profile.id} value={profile.id} className="text-white">
                              {profile.client}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-wider text-cockpit-slate-400 font-semibold">
                        Clone Profile
                      </label>
                      <div className="flex gap-2">
                        <Select value={cloneSource} onValueChange={setCloneSource}>
                          <SelectTrigger className="h-12 bg-cockpit-slate-900 border-cockpit-slate-700 text-white">
                            <SelectValue placeholder="Select source profile" />
                          </SelectTrigger>
                          <SelectContent className="bg-cockpit-slate-900 border-cockpit-slate-700">
                            {profiles.map((profile) => (
                              <SelectItem key={profile.id} value={profile.id} className="text-white">
                                {profile.client}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="New client name"
                          value={newClientName}
                          onChange={(e) => setNewClientName(e.target.value)}
                          className="h-12 bg-cockpit-slate-900 border-cockpit-slate-700 text-white focus-visible:ring-blue-500"
                        />
                        <Button
                          onClick={handleCloneProfile}
                          disabled={!cloneSource || !newClientName}
                          className="h-12 px-6 bg-cockpit-slate-800 border border-cockpit-slate-700 text-white hover:bg-cockpit-slate-700"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {profiles.map((profile) => (
                        <div
                          key={profile.id}
                          className={cn(
                            "p-4 rounded-lg bg-cockpit-slate-900 border transition-all cursor-pointer",
                            activeClientId === profile.id
                              ? "border-cockpit-electric shadow-lg shadow-cockpit-electric/10"
                              : "border-cockpit-slate-800 hover:border-cockpit-electric/50"
                          )}
                          onClick={() => setClient(profile.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-cockpit-slate-800 flex items-center justify-center text-cockpit-slate-400 font-bold text-sm">
                              {profile.client.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-white">{profile.client}</div>
                              <div className="text-xs text-cockpit-slate-500">{profile.id}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-cockpit-slate-400 font-semibold">
                        Product Types
                      </label>
                      <p className="text-sm text-cockpit-slate-500 mt-1 mb-4">
                        Select the product type to configure
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {productOptions.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => setProduct(product.id as 'dubbed_audio' | 'subtitles' | 'sdh' | 'cc')}
                          className={cn(
                            "p-6 rounded-lg border cursor-pointer transition-all",
                            activeProduct === product.id
                              ? "bg-blue-900/10 border-cockpit-electric"
                              : "bg-cockpit-slate-900 border-cockpit-slate-800 hover:border-cockpit-electric/50"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                                activeProduct === product.id
                                  ? "bg-cockpit-electric text-white"
                                  : "bg-cockpit-slate-800 text-cockpit-slate-400"
                              )}
                            >
                              {product.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white">{product.label}</h3>
                              <p className="text-sm text-cockpit-slate-500 mt-1">
                                Configure {product.label.toLowerCase()} quality checks
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages Tab */}
                {activeTab === 'languages' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-cockpit-slate-400 font-semibold">
                        Active Language
                      </label>
                      <Select value={activeLanguage} onValueChange={setLanguage}>
                        <SelectTrigger className="h-12 bg-cockpit-slate-900 border-cockpit-slate-700 text-white mt-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-cockpit-slate-900 border-cockpit-slate-700">
                          {languageOptions.map((lang) => (
                            <SelectItem key={lang} value={lang} className="text-white">
                              {lang.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-wider text-cockpit-slate-400 font-semibold">
                        Configured Languages
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {languageOptions.map((lang) => (
                          <div
                            key={lang}
                            className="px-4 py-2 rounded-full bg-cockpit-slate-800 border border-cockpit-slate-700 text-cockpit-slate-300 text-xs font-medium flex items-center gap-2"
                          >
                            {lang.toUpperCase()}
                            <X className="w-3 h-3 text-cockpit-slate-500 hover:text-red-400 cursor-pointer" />
                          </div>
                        ))}
                        <button className="px-4 py-2 rounded-full border-2 border-dashed border-cockpit-slate-600 text-cockpit-slate-500 text-xs font-medium flex items-center gap-2 hover:border-cockpit-electric hover:text-cockpit-electric transition-colors">
                          <Plus className="w-3 h-3" />
                          Add Language
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* QC Checks Tab */}
                {activeTab === 'checks' && langConfig && (
                  <div className="space-y-4">
                    <Accordion type="multiple" className="space-y-3">
                      {Object.entries(langConfig.checks).map(([categoryId, category]) => (
                        <AccordionItem
                          key={categoryId}
                          value={categoryId}
                          className="border border-cockpit-slate-800 rounded-lg overflow-hidden bg-cockpit-slate-900"
                        >
                          <AccordionTrigger className="px-6 py-4 bg-cockpit-slate-800/50 border-b border-cockpit-slate-800 hover:bg-cockpit-slate-800 transition-colors [&[data-state=open]]:bg-cockpit-slate-800">
                            <span className="font-bold text-white">
                              {categoryId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="p-0">
                            <div className="divide-y divide-cockpit-slate-800">
                              {Object.entries(category.checks).map(([checkId, check]) => {
                                const qcCheck = check as QCCheck;
                                return (
                                  <div
                                    key={checkId}
                                    className="px-6 py-4 bg-cockpit-slate-950/50 flex items-center gap-4"
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
                                      className="data-[state=checked]:bg-cockpit-electric"
                                    />
                                    <div className="flex-1">
                                      <div className="font-bold text-sm text-cockpit-slate-300">
                                        {checkId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                      </div>
                                      <div className="text-[10px] text-cockpit-slate-500">
                                        {qcCheck.severity} • Weight: {qcCheck.weight} • Penalty: {qcCheck.penalty}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Select
                                        value={qcCheck.severity}
                                        onValueChange={(value) =>
                                          setSeverity(categoryId, checkId, value as 'ERROR' | 'WARNING' | 'INFO')
                                        }
                                      >
                                        <SelectTrigger className="h-6 w-24 text-xs bg-cockpit-slate-900 border-cockpit-slate-700">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-cockpit-slate-900 border-cockpit-slate-700">
                                          <SelectItem value="ERROR" className="text-red-400">
                                            ERROR
                                          </SelectItem>
                                          <SelectItem value="WARNING" className="text-amber-400">
                                            WARNING
                                          </SelectItem>
                                          <SelectItem value="INFO" className="text-blue-400">
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
                                        className="w-16 h-6 text-xs text-right font-mono bg-cockpit-slate-900 border-cockpit-slate-700 text-white"
                                      />
                                      <Input
                                        type="number"
                                        value={qcCheck.penalty}
                                        onChange={(e) =>
                                          setPenalty(categoryId, checkId, parseFloat(e.target.value) || 0)
                                        }
                                        step="1"
                                        min="0"
                                        className="w-16 h-6 text-xs text-right font-mono bg-cockpit-slate-900 border-cockpit-slate-700 text-white"
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
                  </div>
                )}

                {/* Scoring Engine Tab */}
                {activeTab === 'scoring' && langConfig?.scoring && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-wider text-cockpit-slate-400 font-semibold">
                        Severity Multipliers
                      </label>
                      <div className="bg-cockpit-slate-900 border border-cockpit-slate-800 rounded-lg p-6 space-y-3">
                        {Object.entries(langConfig.scoring.severityMultipliers || {}).map(
                          ([severity, multiplier]) => (
                            <div key={severity} className="flex items-center justify-between">
                              <span className="text-cockpit-slate-400 text-sm">{severity}</span>
                              <Input
                                type="number"
                                value={multiplier as number}
                                step="0.1"
                                className="w-20 h-8 text-right font-mono bg-cockpit-slate-950 border-cockpit-slate-700 text-white"
                                readOnly
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {langConfig.scoring.categoryMultipliers && (
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-wider text-cockpit-slate-400 font-semibold">
                          Category Multipliers
                        </label>
                        <div className="bg-cockpit-slate-900 border border-cockpit-slate-800 rounded-lg p-6 space-y-3">
                          {Object.entries(langConfig.scoring.categoryMultipliers).map(
                            ([category, multiplier]) => (
                              <div key={category} className="flex items-center justify-between">
                                <span className="text-cockpit-slate-400 text-sm">
                                  {category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                </span>
                                <Input
                                  type="number"
                                  value={multiplier as number}
                                  step="0.1"
                                  className="w-20 h-8 text-right font-mono bg-cockpit-slate-950 border-cockpit-slate-700 text-white"
                                  readOnly
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-wider text-cockpit-slate-400 font-semibold">
                        Scoring Formula
                      </label>
                      <div className="bg-cockpit-slate-950 border border-cockpit-slate-800 rounded-lg p-8 shadow-inner">
                        <pre className="font-mono text-2xl text-center">
                          <span className="text-white">clipScore</span>{' '}
                          <span className="text-cockpit-slate-500">=</span>{' '}
                          <span className="text-white">100</span>{' '}
                          <span className="text-cockpit-slate-500">-</span>{' '}
                          <span className="text-white">Σ</span>
                          <span className="text-cockpit-slate-500">(</span>
                          <span className="text-white">weight × severity × penalty</span>
                          <span className="text-cockpit-slate-500">)</span>
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="h-16 px-8 flex items-center justify-end gap-3 bg-cockpit-deep border-t border-cockpit-slate-800 shrink-0">
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-cockpit-slate-400 hover:text-white hover:bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAndClose}
                className="bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700"
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
