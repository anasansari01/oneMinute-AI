'use client';

import AppearanceConfig from '@/components/dashboard/chatbot/appearanceConfig';
import ChatSimulator from '@/components/dashboard/chatbot/chatSimulator'
import EmbedCodeConfig from '@/components/dashboard/chatbot/embedCodeConfig';
import { ScrollArea } from '@/components/ui/scroll-area';
import { knowledge_source } from '@/db/schema';
import React, { useEffect, useRef, useState } from 'react'

interface ChatBotMetadata{
  id: string;
  user_email: string;
  color: string;
  welcome_message: string;
  created_at: string;
  source_ids: string[];
}

const ChatbotPage = () => {
  const [metadata, setMetadata] = useState<ChatBotMetadata | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metaRes = await fetch("/api/chatbot/metadata/fetch");
        const metaData = await metaRes.json();
        setMetadata(metaData);

        if (metaData) {
          setPrimaryColor(metaData.color || "#4f46e5");
          setWelcomeMessage(
            metaData.welcome_message || "Hi! How can I help you?"
          );
          setMessages([
            {
              role: "assistant",
              content:
                metaData.welcome_message || "Hi! How can I help you?",
              isWelcome: true,
              section: null,
            },
          ]);
        }

        const sectionsRes = await fetch("/api/section/fetch");
        if (sectionsRes.ok) {
          const sectionData = await sectionsRes.json();
          setSections(sectionData || []);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(()=> {
    if(scrollViewportRef.current){
      scrollViewportRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if(!input.trim()) return;

    const currentSection = sections.find((s)=> s.name === activeSection);
    const sourceIds = currentSection?.source_ids || [];

    const userMsg = {role: "user", content: input, section: activeSection};

    setMessages((prev)=> [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const res = await fetch("/api/chat/test", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        messages: [...messages, userMsg],
        knowledge_source_ids: sourceIds,
      }),
    });

    if(res.ok){
      const data = await res.json();
      setMessages((prev)=>[...prev, {role: "assistant", content: data.response, section: null},]);
      setIsTyping(false);
    }

  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
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

  const handleReset = async () => {
    setActiveSection(null);
    setMessages([
      {
        role:"assistant",
        content: welcomeMessage,
        isWelcome: true,
        section: null,
      }
    ])
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res  = await fetch("/api/chatbot/metadata/update", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          color: primaryColor,
          welcome_message: welcomeMessage,
        }),
      });

      if(res.ok){
        const updated = await res.json();
        setMetadata(updated);
      }else{
        console.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Failed to save: ", error);
    }finally{
      setIsSaving(false);
    }
  }

  const normalize = (color: string) => color.toLowerCase();

  const hasChanges = metadata
    ? normalize(primaryColor) !== normalize(metadata.color || "#4f46e5") ||
      welcomeMessage !== (metadata.welcome_message || "Hi! How can I help you?")
    : false;

  if(loading) {
    return (
      <div className="p-8 text-zinc-500">Loading chatbot configuration...</div>
    )
  }


  return (
    <div className="p-6 md:p-8 space-y-8 max-w-400 mx-auto animate-in fade-in duration-500 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
       <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className='text-2xl font-semibold text-white tracking-tight'>
            Chatbot Playground
          </h1>
          <p className='text-sm text-zinc-400 mt-1'>
            Test your assistant, customize appearance, and deploy it.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0 ">
        <div className="lg:col-span-7 flex flex-col h-full min-h-0 space-y-4">
          <ChatSimulator
          messages={messages}
          primaryColor={primaryColor}
          sections={sections}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          handleKeyDown={handleKeyDown}
          handleSectionClick={handleSectionClick}
          activeSection={activeSection}
          isTyping={isTyping}
          handleReset={handleReset}
          scrollRef={scrollViewportRef}
          />
        </div>

        <div className="lg:col-span-5 h-full min-h-0 overflow-hidden flex flex-col">
          <ScrollArea className='h-full pr-4'>
            <div className="space-y-6 pb-8">
              <AppearanceConfig
                primaryColor={primaryColor}
                setPrimaryColor={setPrimaryColor}
                welcomeMessage={welcomeMessage}
                setWelcomeMessage={setWelcomeMessage}
                handleSave={handleSave}
                isSaving={isSaving}
                hasChanges={hasChanges}
              />

              <EmbedCodeConfig chatbotId={metadata?.id}/>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default ChatbotPage