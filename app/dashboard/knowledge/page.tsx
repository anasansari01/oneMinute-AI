'use client'
import AddKnowledgeModal from '@/components/dashboard/knowledge/addknowledgemodal';
import KnowledgeTable from '@/components/dashboard/knowledge/knowledgeTable';
import QuickActions from '@/components/dashboard/knowledge/quickAction';
import SourceDetailsSheet from '@/components/dashboard/knowledge/sourceDetailsSheet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [defaultTab, setDefaultTab] = useState("website");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [knowledgeStoringLoader, setKnowledgeStoringLoader] = useState(false);
  const [knowledgeSourcesLoader, setKnowledgeSourcesLoader] = useState(true);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<KnowledgeSource | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openModal = (tab:string)=>{
    setDefaultTab(tab);
    setIsAddOpen(true);
  }

  useEffect(()=>{
    const fetchKnowledgeSources = async () =>{
      const res = await fetch("/api/knowledge/fetch");
      const data = await res.json();
      setKnowledgeSources(data.sources);
      setKnowledgeSourcesLoader(false);
    };
    fetchKnowledgeSources();
  },[])

  const handleImportSource = async (data:any) => {
    setKnowledgeStoringLoader(true);
    try {
      let response;
      if(data.type === "upload" && data.file){
        const formData = new FormData();
        formData.append("type", "upload");
        formData.append("file", data.file);

        response = await fetch("/api/knowledge/store", {
          method: "POST",
          body: formData,
        });
      }else{
        response = await fetch("/api/knowledge/store", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data),
        })
      }
      if(!response.ok) throw new Error("Failed to store source");

      const res = await fetch("/api/knowledge/fetch");
      const newData = await res.json();
      setKnowledgeSources(newData.source);
      setIsAddOpen(false);
    } catch (error) {
      console.error(error);
    }finally{
      setKnowledgeSourcesLoader(false);
    }
  }

  const handleSourceClick = (source: KnowledgeSource) => {
    setSelectedSource(source)
    setIsSheetOpen(true)
  }

  return (
    <div className='p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500'>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className='text-2xl font-semibold text-white tracking-tight'>
            Knowledge Base
          </h1>
          <p className='text-sm text-zinc-400 mt-1'>
            Manage your website sources, documents, and uploads here.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={()=>openModal("website")}
            className="bg-white text-black hover:bg-zinc-200"
          >
            <Plus className='w-4 h-4 mr-2'/>
            Add Knowledge
          </Button>
        </div>
      </div>
      {/* Quick Actions */}
      <QuickActions onOpenModal={openModal}/>

      <KnowledgeTable
        sources={knowledgeSources}
        onSourceClick={handleSourceClick}
        isLoading={knowledgeSourcesLoader}
      />

      <AddKnowledgeModal
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        defaultTab={defaultTab}
        setDefaultTab={setDefaultTab}
        onImport={handleImportSource}
        isLoading={knowledgeStoringLoader}
        existingSources={knowledgeSources}
    />

      <SourceDetailsSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        selectedSource={selectedSource}
      />
    </div>
  )
}

export default page