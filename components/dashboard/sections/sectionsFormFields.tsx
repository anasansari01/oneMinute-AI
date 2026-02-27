import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import React from 'react'

interface FormData{
  name:string;
  description: string;
  tone: Tone;
  allowedTopics: string;
  blockedTopics: string;
  fallbackBehavior: string;
}

const TONE_OPTIONS = [
  {
    value: "strict",
    label: "Strict",
    badge: "Fact-based",
    description: "Only answer if fully confident. No small talk.",
  },
  {
    value: "neutral",
    label: "Neutral",
    description: "Professional, concise, and direct.",
  },
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm and conversational. Good for general FAQ.",
  },
  {
    value: "empathetic",
    label: "Empathetic",
    description: "Support-first, apologetic, and calming.",
  }
]

const SectionsFormFields = ({formData, setFormData, selectedSources, setSelectedSources, knowledgeSources, isLoadingSources, isDisabled}: SectionFormFieldProps) => {
  return (
    <>
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Basics
        </h4>
        <div className="space-y-2">
          <Label className="text-zinc-300">Section Name</Label>
          <Input 
            placeholder='e.g. Billing Policy'
            className='bg-white/2 border-white/10 text-white placeholder:text-zinc-500'
            value={formData.name}
            onChange={(e)=>setFormData({...formData, name: e.target.value})}
            disabled={isDisabled}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300">Description</Label>
          <Input 
            placeholder='When should the AI use this?'
            className='bg-white/2 border-white/10 text-white placeholder:text-zinc-500'
            value={formData.description}
            onChange={(e)=>setFormData({...formData, description: e.target.value})}
            disabled={isDisabled}
          />
          <p className='text-[11px] text-zinc-500'>
            Used by the routing model to decide when to activate this section.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className='text-xs font-semibold text-zinc-500 uppercase tracking-wider'>Data Sources</h4>
            <span className='text-xs text-zinc-500'>
              {selectedSources.length} attached
            </span>
          </div>
          <Select 
          value={selectedSources[0] || ""}
          onValueChange={(value)=>{
            if(!selectedSources.includes(value)){
              setSelectedSources([...selectedSources, value]);
            }
          }}
          disabled={isDisabled}
          >
            <SelectTrigger className='bg-white/2 border-white/10 text-white'>
              <SelectValue
              placeholder={isLoadingSources ? "Loading sources...": "Select knowledge sources..."}
              />
            </SelectTrigger>
            <SelectContent className='bg-[#0A0A0E] border-white/10 text-zinc-300'>
              {knowledgeSources.length > 0 ? (
                knowledgeSources?.map((source)=> (
                  <SelectItem key={source.id} value={source.id}>
                    <div className="flex items-center gap-2">
                      <span className='text-xs text-zinc-500 capitalize'>[{source.type}]</span>
                      <span>{source.name}</span>
                    </div>
                  </SelectItem>
                ))
              ):(
                <SelectItem value='none' disabled>
                  No knowledge Sources available 
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {selectedSources.length > 0 && (
            <div className="space-y-2">
              {selectedSources?.map((sourceId) => {
                const source = knowledgeSources?.find((s) => s.id === sourceId)
                if(!source) return null;
                return (
                  <div className="flex items-center justify-between p-2 rounded-md bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800/70 transition-colors" key={sourceId}
                  >
                    <div className="flex items-center gap-2">
                      <span className='text-xs text-zinc-500 capitalize'>
                        [{source.type}]
                      </span>
                      <span className='text-sm text-zinc-300'>
                        {source.name}
                      </span>
                      <Button
                        variant="ghost"
                        className='h-6 w-6 p-0 text-zinc-500 hover:text-red-400'
                        onClick={()=>setSelectedSources(selectedSources.filter((id)=>id!==sourceId))}
                        disabled={isDisabled}
                      >
                        x
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Tone
          </h4>
          <RadioGroup
            value={formData.tone}
            onValueChange={(value)=>setFormData({...formData, tone: value as Tone})}
            className='grid grid-cols-1 gap-2'
            disabled={isDisabled}
          >
            {TONE_OPTIONS.map((option)=>(
              <div className="flex items-center space-x-2 rounded-md border border-white/5 bg-white/1 p-3 hover:bg-white/5 transition-colors" key={option.value}>
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className='border-white/20 text-indigo-500'
                />
                <Label className='flex-1 cursor-pointer' htmlFor={option.value}>
                  <div className="flex items-center gap-2">
                    <span className='text-zinc-200 font-medium'>
                      {option.label}
                    </span>
                    {option.badge && (
                      <span className='text-[10px] bg-red-500/10 text-red-500 px-1.5 rounded-sm border border-red-500/10'>{option.badge}</span>
                    )}
                  </div>
                  <span className='text-xs text-zinc-500 font-normal'>
                    {option.description}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Scope Rules
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className='text-zinc-300 text-xs'>Allowed Topics</Label>
              <Input
                className='bg-white/2 border-white/10 text-white placeholder:text-zinc-500'
                placeholder='e.g. pricing, refunds'
                value={formData.allowedTopics}
                onChange={(e)=>setFormData({...formData, allowedTopics: e.target.value})}
                disabled={isDisabled}
              />
            </div>
            <div className="space-y-2">
              <Label className='text-zinc-300 text-xs'>Blocked Topics</Label>
              <Input
                className='bg-white/2 border-white/10 text-white placeholder:text-zinc-500'
                placeholder='e.g. competitors'
                value={formData.blockedTopics}
                onChange={(e)=>setFormData({...formData, blockedTopics: e.target.value})}
                disabled={isDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SectionsFormFields