'use client'
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AlertCircle, ChevronDown, MessageCircle, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

interface ChatBotMetadata{
  id: string;
  color: string;
  welcome_message: string;
}

interface Sections{
  id: string;
  name: string;
  source_ids: string[];
}

const EmbedPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [metadata, setMetadata] = useState<ChatBotMetadata|null>(null);
  const [sections, setSections] = useState<Sections[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';

    if(typeof window !== undefined){
      window.parent.postMessage({
        type: "resize",
        width: "60px",
        height: "60px",
        borderRadius: "30px",
      },
      "*"
      );
    }
  }, []);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if(newState){
      window.parent.postMessage({
        type: "resize",
        width: "380px",
        height: "520px",
        borderRadius: "12px",
      },
      "*"
      );
    }else {
      window.parent.postMessage({
        type: "resize",
        width: "60px",
        height: "60px",
        borderRadius: "30px",
      },
      "*"
      );
    }
  };

  useEffect(()=>{
    if(!token){
      setError("Missing session token");
      setLoading(false);
      return;
    }

    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/widget/config?token=${encodeURIComponent(token)}`);
        if(!res.ok) throw new Error("Failed to load widget configuration");

        const data = await res.json();
        setMetadata(data.metadata);
        setSections(data.sections || []);        

        setMessages([
          {
            role: "assistant",
            content: data.metadata.welcome_message || "Hi! How can I help you?",
            isWelcome: true,
            section: null,
          },
        ])
      } catch (error) {
        console.error(error);
        setError("Unable to load chat. Please try again later.");
      }finally{
        setLoading(false);
      }
    }
    fetchConfig();
  },[]);

  useEffect(()=> {
      if(scrollViewportRef.current){
        scrollViewportRef.current.scrollIntoView({behavior: 'smooth'});
      }
    }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if(!input.trim()) return;

    const currentSection = sections.find((s)=> s.name === activeSection);
    const sourceIds = currentSection?.source_ids || [];

    const userMsg = {role: "user", content: input, section: activeSection};

    setMessages((prev)=> [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat/public", {
        method: "POST",
        headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
        body: JSON.stringify({
          messages: [...messages, userMsg],
          knowledge_source_ids: sourceIds,
        }),
      });

      if(res.ok){
        const data = await res.json();
        setMessages((prev)=>[...prev, {role: "assistant", content: data.response, section: null},]);
        setIsTyping(false);
      }else{
        setMessages((prev)=>[...prev, {role: "assistant", content: "I'm having trouble connecting right now. Please try again.", section: null},]);
      }
    } catch (error) {
      console.error(error);
    }finally{
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  } 

  const primaryColor = metadata?.color || "#4f46e5";

  if(loading) return null;

  if(error && isOpen){
    return(
      <div className="flex flex-col items-center justify-center h-full bg-white/10">
        <AlertCircle className='w-10 h-10 mb-2'/>
        <p>{error}</p>
      </div>
    )
  }

  if(!isOpen){
    return(
      <button
      onClick={toggleOpen}
      className='w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:brightness-110 transition-all text-white'
      style={{backgroundColor: primaryColor}}
      >
        <MessageCircle className='w-8 h-8'/>
      </button>
    )
  }

   const handleSectionClick = async (sectionName: string) => {
    setActiveSection(sectionName);
    const userMsg = {role: "user", content: sectionName, section: null};
    setMessages((prev)=>[...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(()=>{
      setIsTyping(false);
      const aiMsg = {
        role: "assistant",
        content: `You can ask me any question related to "${sectionName}"`,
        section: sectionName,
      };
      setMessages((prev)=>[...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className='flex flex-col h-screen bg-[#0A0A0E] overflow-hidden  rounded-xl border border-white/10 shadow-2xl'>
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#0E0E12] shadow-sm shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="relative self-start">
            <div className='w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/5 overflow-hidden'>
              <Image
                src="https://images.unsplash.com/photo-1606122017369-d782bbb78f32?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Support Agent"
                width={40}
                height={40}
                className='w-full h-full object-cover rounded-full'
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full"/>
          </div>
          <div>
            <h1 className='text-sm font-semibold text-white leading-none'>
              Support
            </h1>
            <span className='text-[11px] text-emerald-400 font-medium'>
              Online
            </span>
          </div>
        </div>
        <button
        onClick={toggleOpen}
        className='p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors'
        aria-label='Minimize Chat'
        >
          <ChevronDown className='w-5 h-5'/>
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto bg-zinc-950/30 p-4 
      [scrollbar-width:none] [-ms-overflow-style:none] 
      [&::-webkit-scrollbar]:hidden">
        <div className="space-y-6 pb-4">
          {messages.map((msg,i)=>(
            <div className={cn("flex w-full flex-col",
              msg.role === "user" ? "items-end" : "items-start"
            )}
            key={i}
            >
              <div className={cn("flex max-w-[85%] gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                {msg.role !== "user" && (
                  <div className="relative self-start">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1606122017369-d782bbb78f32?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Support Agent"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full" />
                  </div>
                )}

                <div className="space-y-2">
                  <div
                    className={cn(
                      "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-zinc-800 text-zinc-100 rounded-tr-sm"
                        : "bg-white text-zinc-900 rounded-tl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                  {msg.isWelcome && sections.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-300">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => handleSectionClick(section.name)}
                          className="px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white/80 hover:text-white hover:border-white/30
                          transition-colors whitespace-nowrap active:scale-95 cursor-pointer "
                        >
                          {section.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[80%] gap-3 flex-row">
                <div className="relative self-start">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1606122017369-d782bbb78f32?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Support Agent"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full" />
                  </div>
                <div className="p-4 rounded-2xl bg-white text-zinc-900 rounded-tl-sm shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animate-delay:-0.3s]"/>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animate-delay:-0.15s]"/>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"/>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollViewportRef}/>
        </div>

      {/* Input Area */}
      </div>
      <div className='p-4 bg-[#0A0A0E] border-t border-white/5 shrink-0 z-20'>
        <div className='relative'>
          <Textarea className='min-h-12.5 max-h-30 pr-12 outline-none text-white bg-zinc-900/50 border-white/10 resize-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed
          placeholder:text-zinc-600 focus:ring-1 focus:ring-white/20'
          value={input}
          onChange={(e)=> setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!activeSection}
          placeholder={activeSection
            ? "Type a message ..."
            : "Select a category above to start ..."
          }
          />
          <Button
            size='icon'
            onClick={handleSend}
            disabled={!activeSection || !input.trim()}
            className={cn("absolute right-2 bottom-2 h-8 w-8 transition-colors",
              !activeSection || !input.trim() ? "bg-zinc-800 text-zinc-500": ""
            )}
            style={activeSection && input.trim() 
              ? {backgroundColor: primaryColor, color: 'white'}
              : {}
            }
          >
            <Send className='w-4 h-4'/>
          </Button>
        </div>
        <div className="mt-2 text-center">
          <Link
          href={"/"}
          className='text-[10px] text-zinc-600 font-medium hover:text-zinc-500 transition-colors'
          >
            Powered by OneMinute Support
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EmbedPage