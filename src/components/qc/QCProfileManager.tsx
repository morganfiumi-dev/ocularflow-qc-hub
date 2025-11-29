import React, { useState } from 'react';
import { X, Plus, Copy, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import useQCProfileStore from '@/state/useQCProfileStore';

interface QCProfileManagerProps {
  onClose: () => void;
}

export function QCProfileManager({ onClose }: QCProfileManagerProps) {
  const {
    profiles,
    activeClientId,
    activeProduct,
    activeLanguage,
    setClient,
    setProduct,
    setLanguage,
    enableCheck,
    disableCheck,
    setThreshold,
    setSeverity,
    setWeight,
    setPenalty,
    cloneProfile,
    currentProfile,
    currentLanguageConfig,
  } = useQCProfileStore();

  const [newClientName, setNewClientName] = useState('');
  const [cloneSource, setCloneSource] = useState('');

  const profile = currentProfile();
  const langConfig = currentLanguageConfig();

  const handleCloneProfile = () => {
    if (!cloneSource || !newClientName) return;
    const newId = newClientName.toLowerCase().replace(/\s+/g, '_');
    cloneProfile(cloneSource, newId, newClientName);
    setNewClientName('');
    setCloneSource('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-200 uppercase tracking-wider">QC Profile Manager</h2>
            <p className="text-sm text-slate-400 mt-1">Enterprise-level quality control configuration</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="clients" className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="checks">QC Checks</TabsTrigger>
              <TabsTrigger value="scoring">Scoring Engine</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden px-6 pb-6">
              {/* TAB 1: Clients */}
              <TabsContent value="clients" className="h-full mt-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    <div className="bg-slate-800/50 p-4 rounded-md border border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Active Client</h3>
                      <Select value={activeClientId} onValueChange={setClient}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {profiles.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.client}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-md border border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Clone Profile</h3>
                      <div className="space-y-3">
                        <div>
                          <Label>Source Profile</Label>
                          <Select value={cloneSource} onValueChange={setCloneSource}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select profile to clone" />
                            </SelectTrigger>
                            <SelectContent>
                              {profiles.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.client}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>New Client Name</Label>
                          <Input
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            placeholder="e.g., Apple+ FR"
                          />
                        </div>
                        <Button onClick={handleCloneProfile} disabled={!cloneSource || !newClientName}>
                          <Copy className="mr-2 h-4 w-4" />
                          Clone Profile
                        </Button>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-md border border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Available Clients</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {profiles.map((p) => (
                          <div
                            key={p.id}
                            className={`p-3 rounded border cursor-pointer transition-colors ${
                              p.id === activeClientId
                                ? 'bg-primary/20 border-primary'
                                : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                            }`}
                            onClick={() => setClient(p.id)}
                          >
                            <div className="font-medium text-slate-200">{p.client}</div>
                            <div className="text-xs text-slate-400 mt-1">
                              {Object.keys(p.products).length} product(s)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* TAB 2: Products */}
              <TabsContent value="products" className="h-full mt-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    <div className="bg-slate-800/50 p-4 rounded-md border border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
                        Products for {profile?.client}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {['dubbed_audio', 'subtitles', 'sdh', 'cc'].map((prod) => (
                          <div
                            key={prod}
                            className={`p-4 rounded border cursor-pointer transition-colors ${
                              prod === activeProduct
                                ? 'bg-primary/20 border-primary'
                                : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                            }`}
                            onClick={() => setProduct(prod as any)}
                          >
                            <div className="font-medium text-slate-200 capitalize">
                              {prod.replace('_', ' ')}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {profile?.products[prod as keyof typeof profile.products]
                                ? `${Object.keys(profile.products[prod as keyof typeof profile.products]!.languages).length} language(s)`
                                : 'Not configured'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* TAB 3: Languages */}
              <TabsContent value="languages" className="h-full mt-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    <div className="bg-slate-800/50 p-4 rounded-md border border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
                        Languages for {activeProduct.replace('_', ' ')}
                      </h3>
                      <Select value={activeLanguage} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {profile?.products[activeProduct] &&
                            Object.keys(profile.products[activeProduct]!.languages).map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang.toUpperCase()}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* TAB 4: QC Checks */}
              <TabsContent value="checks" className="h-full mt-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    {langConfig &&
                      Object.entries(langConfig.checks).map(([categoryId, category]) => (
                        <div key={categoryId} className="bg-slate-800/50 p-4 rounded-md border border-slate-700">
                          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
                            {categoryId.replace(/_/g, ' ')}
                          </h3>
                          <div className="space-y-3">
                            {Object.entries(category.checks || {}).map(([checkId, check]) => (
                              <div key={checkId} className="flex items-start gap-4 p-3 bg-slate-900/60 rounded border border-slate-700">
                                <Switch
                                  checked={(check as any).enabled}
                                  onCheckedChange={(checked) =>
                                    checked ? enableCheck(categoryId, checkId) : disableCheck(categoryId, checkId)
                                  }
                                />
                                <div className="flex-1 grid grid-cols-5 gap-3 items-center">
                                  <div className="col-span-2">
                                    <Label className="text-slate-300">{checkId.replace(/_/g, ' ')}</Label>
                                  </div>
                                  <div>
                                    <Select
                                      value={(check as any).severity}
                                      onValueChange={(val) => setSeverity(categoryId, checkId, val as any)}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="ERROR">ERROR</SelectItem>
                                        <SelectItem value="WARNING">WARNING</SelectItem>
                                        <SelectItem value="INFO">INFO</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Input
                                      type="number"
                                      value={(check as any).weight}
                                      onChange={(e) => setWeight(categoryId, checkId, parseFloat(e.target.value))}
                                      step="0.1"
                                      min="0"
                                      max="1"
                                      className="h-8"
                                      placeholder="Weight"
                                    />
                                  </div>
                                  <div>
                                    <Input
                                      type="number"
                                      value={(check as any).penalty}
                                      onChange={(e) => setPenalty(categoryId, checkId, parseInt(e.target.value))}
                                      className="h-8"
                                      placeholder="Penalty"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* TAB 5: Scoring Engine */}
              <TabsContent value="scoring" className="h-full mt-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    <div className="bg-slate-800/50 p-4 rounded-md border border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Severity Multipliers</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label>ERROR</Label>
                          <Input type="number" value={langConfig?.scoring?.severityMultipliers?.ERROR || 1.0} step="0.1" />
                        </div>
                        <div>
                          <Label>WARNING</Label>
                          <Input type="number" value={langConfig?.scoring?.severityMultipliers?.WARNING || 0.5} step="0.1" />
                        </div>
                        <div>
                          <Label>INFO</Label>
                          <Input type="number" value={langConfig?.scoring?.severityMultipliers?.INFO || 0.2} step="0.1" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-md border border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Category Multipliers</h3>
                      <div className="space-y-2">
                        {langConfig?.scoring?.categoryMultipliers &&
                          Object.entries(langConfig.scoring.categoryMultipliers).map(([cat, mult]) => (
                            <div key={cat} className="flex items-center gap-3">
                              <Label className="flex-1 text-slate-300">{cat.replace(/_/g, ' ')}</Label>
                              <Input type="number" value={mult as number} step="0.1" className="w-24" readOnly />
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-md border border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-2">Scoring Formula</h3>
                      <div className="text-xs text-slate-400 font-mono bg-slate-950/50 p-3 rounded border border-slate-700">
                        clipScore = 100 - Σ(weight × severityMultiplier × categoryMultiplier × penalty)
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}