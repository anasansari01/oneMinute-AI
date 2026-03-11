'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Loader2, MessageSquare, MoreHorizontal, Search, Send, User } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'

interface Conversation{
  id: string;
  user: string;
  lastMessage: string;
  time: string;
  email?: string;
  visitor_ip?: string;
}

interface Messages{
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const ConversationsPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Messages[]>([])
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations");
        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      }finally{
        setIsLoadingList(false);
      }
    }
    fetchConversations();
  },[]);

  useEffect(()=>{
    if(!selectedId) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await fetch(`/api/conversations/${selectedId}/messages`);
        const data = await res.json();
        setCurrentMessages(data.messages || []);
      } catch(error){
        console.error("Failed to fetch conversations", error);
      }finally{
        setIsLoadingMessages(false);
      }
    }
    fetchMessages();
  }, [selectedId]);

  useEffect(()=>{
    messageEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [currentMessages, isLoadingMessages]);

  const handleSendReply = async () => {
    if(!replyContent.trim() || !selectedId) return;
    setIsSending(true);
    try {
      const res = await fetch(`/api/conversations/${selectedId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
        },
        body: JSON.stringify({content: replyContent}),
      });

      if(res.ok){
        const newMsg: Messages = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: replyContent,
          created_at: new Date().toISOString(),
        };
        setCurrentMessages((prev) =>[...prev, newMsg]);
        setReplyContent("");

        setConversations((prev)=>prev.map((c)=>c.id === selectedId 
          ? {...c, lastMessage: replyContent, time: "Just now"}
          : c
        ));
      }
    } catch (error) {
      console.error("Failed to send reply ", error);
    }finally{
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent)=>{
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      handleSendReply();
    }
  };

  const filteredConversations = conversations.filter((c)=>
    c.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations?.find((c)=>c.id === selectedId);

  return (
    <div className='flex h-[calc(100vh-64px)] overflow-hidden bg-black animate-in fade-in duration-500'>
      <div className="w-87.5 md:w-100 flex flex-col border-r border-white/5 bg-[#050509]">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className='font-semibold text-white'>Inbox</h1>
            <div className="text-xs text-zinc-500">{filteredConversations.length} Conversations</div>
          </div>
          
          <div className="relative flex items-center">
            <Search className='absolute left-3 h-4 w-4 text-zinc-500 pointer-events-none' />
            <Input
              placeholder='Search...'
              className="w-full pl-10 pr-3 py-2 bg-[#0A0A0E] border border-white/10 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className='flex-1'>
          <div className="flex flex-col">
            {isLoadingList ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className='w-6 h-6 animate-spin text-zinc-500'/>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 text-sm">
                No Conversation found
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={()=>setSelectedId(conversation.id)}
                  className={cn(
                    "flex flex-col items-start gap-1 p-4 text-left transition-colors border-b border-white/5 hover:bg-white/2 w-full",
                    selectedId === conversation.id
                      ? "bg-white/4 border-l-2 border-l-indigo-500 border-b-transparent" 
                      : "border-l-2 border-l-transparent"
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={cn(
                        "font-medium text-sm truncate max-w-37.5",
                        selectedId === conversation.id
                          ? "text-white"
                          : "text-zinc-300"
                      )}
                    >
                      {conversation.user}
                    </span>
                    <span className='text-[10px] text-zinc-500 shrink-0 ml-2'>
                      {conversation.time}
                    </span>
                  </div>
                  <span className='text-xs text-zinc-500 truncate w-full text-left'>
                    {conversation.lastMessage}
                  </span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0e]">
        {selectedConv ? (
          <>
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E12]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                  <User className='w-4 h-4 text-zinc-400'/>
                </div>
              <div>
              <div className="flex items-center gap-2">
                <h2 className='font-medium text-white text-sm'>
                  {selectedConv.user}
                </h2>
                {selectedConv.visitor_ip && (
                  <span className='text-xs text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded'>
                    {selectedConv.visitor_ip}
                  </span>
                )}
              </div>
            </div>
            </div>
            <Button
              variant={"ghost"}
              size={'icon'}
              className='h-8 w-8 text-zinc-400'
            >
              <MoreHorizontal className='w-4 h-4'/>
            </Button>
          </div>

          <ScrollArea
            className='flex-1 p-6'
          >
            {isLoadingMessages? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className='w-6 h-6 animate-spin text-zinc-500'/>
              </div>
            ):(
              <div className="max-w-3xl mx-auto space-y-6">
                {currentMessages.map((msg)=>(
                  <div className={cn("flex w-full gap-3",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                  key={msg.id}
                  >
                    <div className={cn("w-8 h-8 rounded-full  flex items-center justify-center shrink-0 border border-white/5",
                      msg.role === "user" ? "bg-zinc-800" : "bg-indigo-600"
                    )}>
                      {msg.role === "user" ? (
                        <User className='w-4 h-4 rounded-full flex items-center justify-center'/>
                      ): (
                          <div className="relative">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                          <Image
                            src="https://images.unsplash.com/photo-1606122017369-d782bbb78f32?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Support Agent"
                            width={50}
                            height={50}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-[#0E0E12] bg-emerald-500 rounded-full"/>
                        </div>
                      )}
                    </div>
                    <div className={cn("flex flex-col gap-1 max-w-[70%]",
                      msg.role === "user" ? "items-end" : "items-start"
                    )}>
                      <div className={cn("p-3 rounded-lg text-sm leading-relaxed shadow-sm", msg.role === "user"
                      ? "bg-zinc-800 text-zinc-200 rounded-tr-sm"
                      : "bg-[#050509] border border-white/10 text-zinc-300 rounded-tl-sm"
                    )}>
                      {msg.content}
                    </div>
                    <span className='text-[10px] text-zinc-600 px-1'>
                      {msg.created_at 
                        ? new Date(msg.created_at).toLocaleDateString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : ""}
                    </span>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef}/>
              </div>
            )}
          </ScrollArea>
          <div className="p-4 border-t border-white/5 bg-[#0e0e12]">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Input
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your reply..."
                  className="flex-1 bg-zinc-900/50 border-white/10 text-zinc-200 placeholder:text-zinc-500 focus:ring-1 focus:ring-indigo-500 rounded-sm"
                  disabled={isSending}
                />
                <Button
                  type="submit"
                  disabled={!replyContent.trim() || isSending}
                  size={'icon'}
                  className='bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSending ? (
                    <Loader2 className='w-4 h-4 animate-spin'/>
                  ) : (
                    <Send className='w-4 h-4'/>
                  )}
                </Button>
              </div>
          </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-2">
            <MessageSquare className='w-8 h-8 text-zinc-700'/>
            <p>Select a conversation to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConversationsPage