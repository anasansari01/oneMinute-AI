import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, Code, Copy } from 'lucide-react';
import { useState } from 'react';

const EmbedCodeConfig = ({ chatbotId }: { chatbotId: string | undefined }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!chatbotId) return;

    const code = `<script src="http://localhost:3000/widget.js" data-id="${chatbotId}" defer></script>`;

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className='border-white/5 bg-[#0A0A0E]'>
      <CardHeader className='pb-3'>
        <div className="flex items-center gap-2">
          <Code className='w-4 h-4 text-zinc-500'/>
          <CardTitle className='text-sm font-medium text-white uppercase tracking-wider'>
            Embed Code
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className="relative group">
          <div className="bg-[#050509] border border-white/10 rounded-lg p-3 overflow-hidden">
            <code className='text-[10px] text-zinc-400 font-mono block whitespace-pre overflow-hidden'>
            {`<script src="http://localhost:3000/widget.js"\n data-id="${chatbotId || "..."}"\n defer>\n</script>`}
            </code>
          </div>
          <Button
            size="icon"
            variant="secondary"
            className='absolute top-2 right-2 h-6 w-6 bg-white/10 hover:bg-white/20 text-white border-none'
            onClick={handleCopyCode}
          >
            {copied ? (
              <Check className='w-3 h-3'/>
            ) : (
              <Copy className='w-3 h-3'/>
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-500/80 bg-amber-500/5 p-2 rounded-md border border-amber-500/10">
          <AlertCircle className='w-4 h-4 shrink-0 mt-0.5'/>
          <span>
            Paste this code before the closing &lt;/head&gt; tag on your website.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmbedCodeConfig;