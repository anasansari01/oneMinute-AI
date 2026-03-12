import { ArrowRight, Check, Copy, FileText, Globe, Loader2, MoreHorizontal, Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';

const DashboardOverView = () => {
  const [data, setData] = useState<any>(null); 
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  const router = useRouter();

  useEffect(()=>{
    setOrigin(window.location.origin);

    fetch("/api/overview").then((res)=>res.json()).then((d)=>{
      setData(d);
      setIsLoading(false);
    }).catch((error)=>{
      console.error(error);
      setIsLoading(false);
    });
  },[]);

  const handleCopy = () => {
    const code = `<script src="${origin}/widget.js" data-id="${data?.botId}" defer></script>`;

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if(isLoading) {
    return (
      <div className="flex-1 flex w-full items-center justify-center p-8 text-zinc-500">
        <Loader2 className='w-8 h-8 animate-spin'/>
      </div>
    );
  }

  if(!data) return null;

  const { knowledge, sections, chats, counts } = data || {};

  const setupSteps = [
    {label: "Website Scanned", complete: true, href: "#"},
    {
      label: "Knowledge Added",
      complete: (counts?.knowledge || 0) > 0,
      href: "/dashboard/knowledge",
    },
    {
      label: "Sections Configured",
      complete: (counts?.sections || 0) > 0,
      href: "/dashboard/sections",
    },
    {
      label: "Widget Installed",
      complete: (counts?.conversations || 0) > 0,
      href: "#widget",
    },
  ];

  return (
    <div className='p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500'>
      <section className='space-y-4'>
        <h3 className='text-lg font-medium text-white'>Setup Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {setupSteps.map((step,i)=>(
            <Link
            href={step.href}
            className='block group'
            key={i}
            >
              <Card
              className={cn("border-white/5 bg-white/2 hover:bg-white/4 transition-colors",
                step.complete ? "opacity-60"
                : "border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10"
              )}
              >
                <CardContent className='p-4 flex items-center justify-between'>
                  <span
                  className={cn("text-sm font-medium", 
                    step.complete ? "text-zinc-500"
                    : "text-white"
                  )}
                  >
                    {step.label}
                  </span>
                  {step.complete?(
                    <Check className='w-4 h-4 text-emerald-500'/>
                  ):(
                    <ArrowRight className='w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform'/>
                  ) }
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          <Card className='border-white/5 bg-[#0A0A0E]'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-base font-medium text-white'>
                Knowledge Base
              </CardTitle>
              <Button
                variant={"outline"}
                size={"sm"}
                className='h-8 text-xs border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/12'
                asChild
              >
                <Link href={"/dashboard/knowledge"}>Manage sources</Link>
              </Button>
            </CardHeader>

            <CardContent className='grid grid-cols-3 gap-4'>
              <div className="p-3 rounded-lg bg-white/2 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className='w-4 h-4 text-blue-400'/>
                  <span className='text-xs text-zinc-500 font-medium'>Pages</span>
                </div>
                <span className='text-2xl font-semibold text-white'>
                  {knowledge?.website || 0}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/2 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className='w-4 h-4 text-purple-400'/>
                  <span className='text-xs text-zinc-500 font-medium'>Manual Texts</span>
                </div>
                <span className='text-2xl font-semibold text-white'>
                  {knowledge?.text || 0}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/2 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Upload className='w-4 h-4 text-emerald-400'/>
                  <span className='text-xs text-zinc-500 font-medium'>Uploads</span>
                </div>
                <span className='text-2xl font-semibold text-white'>
                  {knowledge?.uploads || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className='border-white/5 bg-[#0A0A0E] min-h-90'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <div className="space-y-1">
                <CardTitle className='text-base font-medium text-white'>
                  Sections
                </CardTitle>
                <CardDescription>
                  config behavior for different topics
                </CardDescription>
              </div>

              <Button
                size={"sm"}
                className='h-8 gap-2 bg-white text-black hover:bg-zinc-200'
                asChild
              >
                <Link href={"/dashboard/sections"}>
                  <Plus className='w-3 h-3'/>
                  Create sections
                </Link>
              </Button>
            </CardHeader>

            <CardContent className='p-0'>
              <div className="divide-y divide-white/5">

                {sections?.list.length === 0 ? (
                  <div className="p-6 text-center text-sm text-zinc-500">
                    No sections configured yet.
                  </div>
                ):(
                  <>
                    <div className="grid grid-cols-12 gap-4 px-6 py-2 bg-white/2 text-[10px] text-zinc-500 uppercase tracking-wider font-medium ">
                        <div className="col-span-5">Name</div>
                        <div className="col-span-3">Sources</div>
                        <div className="col-span-3">Tone</div>
                        <div className="col-span-1"></div>
                    </div>

                    {sections?.list.map((section:any, i:number)=>(
                      <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 items-center hover:bg-white/2 transition-colors last:border-0 group">

                        <div className="col-span-5 text-sm font-medium text-zinc-200">
                          {section.name}
                        </div>

                        <div className="col-span-3 text-sm text-zinc-500">
                          {section.sourceCount} sources
                        </div>

                        <div className="col-span-3">
                          <Badge
                            variant="secondary"
                            className='bg-white/5 text-zinc-400 hover:bg-white/10 border-white/5 rounded-lg font-normal'
                          >
                            {section.tone}
                          </Badge>
                        </div>

                        <div className="col-span-1 flex justify-end">
                          <Button
                          variant={"ghost"}
                          size={'icon'}
                          onClick={()=>router.push("/dashboard/sections")}
                          className='h-6 w-6 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            <MoreHorizontal className='w-4 h-4'/>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">

          <Card className='border-white/5 bg-[#0A0A0E] min-h-80'>
            <CardHeader className='pb-4'>
              <div className="flex items-center justify-between">
                <CardTitle className='text-base font-medium text-white'>
                  Recent Chats
                </CardTitle>
                <Link
                href={"/dashboard/conversations"}
                className='text-xs flex gap-1 items-center justify-center text-zinc-500 hover:text-white transition'
                >
                  View all <ArrowRight className='w-3 h-3'/>
                </Link>
              </div>
            </CardHeader>

            <CardContent className='px-2 pb-2'>
              <div className="space-y-2">

                {chats?.length === 0 ? (
                  <div className="p-4 text-center text-xs text-zinc-500">
                    No chats yet.
                  </div>
                ): (
                  chats?.map((chat:any,i:number)=>(
                    <Link
                    key={i}
                    href={'/dashboard/conversations'}
                    className='block p-3 rounded-lg hover:bg-white/3 transition-colors group'
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className='text-sm font-medium text-zinc-200 group-hover:text-white transition-colors'>
                          {chat.title}
                        </span>
                        <span className="text-[10px] text-zinc-600 whitespace-nowrap ml-2">
                        {chat.time}
                        </span>
                      </div>

                      <p className='text-xs text-zinc-500 line-clamp-1'>
                        {chat.snippet}
                      </p>
                    </Link>
                  ))
                )}

              </div>
            </CardContent>
          </Card>

          <Card className='border-white/5 bg-[#0A0A0E]' id='widget'>
            <CardHeader>
              <CardTitle className='text-base font-medium text-white'>
                Install Widget
              </CardTitle>
              <CardDescription>
                Add this snippet to your website page.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="relative group">

                <div className="bg-[#050509] border border-white/10 rounded-lg p-3 overflow-hidden">
                  <code className='text-[10px] text-zinc-400 font-mono block whitespace-pre overflow-hidden'>
                  {`<script src="http://localhost:3000/widget.js"\n data-id="${data?.botId || "..."}"\n defer>\n</script>`}
                  </code>
                </div>

                <Button
                  size="icon"
                  variant="secondary"
                  className='absolute top-2 right-2 h-6 w-6 bg-white/10 hover:bg-white/20 text-white border-none'
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className='w-3 h-3'/>
                  ) : (
                    <Copy className='w-3 h-3'/>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverView