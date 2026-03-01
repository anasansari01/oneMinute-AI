import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Palette, Save } from 'lucide-react';

interface AppearanceConfigProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (msg: string) => void;
  handleSave: ()=>void;
  isSaving: boolean;
  hasChanges: boolean;
}

const PRESET_COLORS = [
  {name: 'Indigo', value: '#4f46e5'},
  {name: 'Blue', value: '#2563eb'},
  {name: 'Emerald', value: '#059669'},
  {name: 'Rose', value: '#e11d48'},
  {name: 'Orange', value: '#ea580c'},
]

const AppearanceConfig = ({primaryColor,
setPrimaryColor,
welcomeMessage,
setWelcomeMessage,
handleSave,
isSaving,
hasChanges,}:AppearanceConfigProps) => {
  return (
    <Card
    className='border-white/5 bg-[#0a0a0e]'
    >
      <CardHeader className='pb-3'>
        <div className="flex items-center gap-2">
          <Palette className='w-4 h-4 text-zinc-500'/>
          <CardTitle className='text-sm font-medium text-white uppercase tracking-wider'>
            Appearance
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className="space-y-3">
          <Label className='text-zinc-300'>Primary Color</Label>
          <div className="flex gap-3">
            {PRESET_COLORS.map((color)=> (
              <button
                type="button"
                key={color.name}
                aria-label={`Select ${color.name} color`}
                onClick={() => setPrimaryColor(color.value)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
                  primaryColor === color.value
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0e]"
                    : "opacity-60 hover:opacity-100"
                )}
                style={{ backgroundColor: color.value, borderColor: color.value }}
                title={color.name}
              />
            ))}
            <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white/70 ml-2">
              <input 
              type='color' 
              value={primaryColor} 
              onChange={(e)=> setPrimaryColor(e.target.value)} className='absolute -top-2 -left-2 w-10 h-10 p-0 border-0 cursor-pointer' />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className='text-zinc-300'>Welcome Message</Label>
          <Textarea
            value={welcomeMessage}
            onChange={(e)=>setWelcomeMessage(e.target.value)}
            placeholder='Hi! How can I help you?'
            className='bg-white/2 border-white/10 text-white resize-none text-sm min-h-20'
          />
        </div>

        {hasChanges && (
          <Button
          onClick={handleSave}
          disabled={isSaving}
          className='w-full bg-white text-black hover:bg-zinc-200 animate-in'
          >
            {isSaving ? (
              "Saving..."
            ): (
              <>
              {" "}
                <Save className='w-4 h-4 mr-2'/> Save Changes{" "}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default AppearanceConfig