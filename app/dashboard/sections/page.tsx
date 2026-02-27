'use client'
import SectionsFormFields from '@/components/dashboard/sections/sectionsFormFields'
import SectionsTable from '@/components/dashboard/sections/sectionTable'
import SectionTable from '@/components/dashboard/sections/sectionTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface KnowledgeSources {
  id: string;
  name: string;
  type: string;
  status: string;
}

const INITIAL_FORM_DATA: SectionFormData = {
  name: "",
  description: "",
  tone: "neutral",
  allowedTopics: "",
  blockedTopics: "",
  fallbackBehavior: "escalate",
}

const Page = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(true);
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [formData, setFormData] = useState<SectionFormData>(INITIAL_FORM_DATA);

  useEffect(()=> {
    fetchSections();
  }, [])


  const handleCreateSections = async () => {
    setSelectedSection({
      id:"new",
      name:"",
      description: "",
      sourceCount: 0,
      tone: "neutral",
      scopeLabel: "",
      status: "draft",
    });
    setSelectedSources([]);
    setFormData(INITIAL_FORM_DATA);
    setIsSheetOpen(true);
  }

  const isPreviewMode = selectedSection?.id !== "new";

  useEffect(()=>{
      const fetchKnowledgeSources = async () =>{
       try {
          const res = await fetch("/api/knowledge/fetch");
          const data = await res.json();
          setKnowledgeSources(data.sources || []);
       } catch (error) {
        console.error("Failed to fetch knowledge sources: ", error);
       }finally{
        setIsLoadingSources(false);
       }
      };
      fetchKnowledgeSources();
    },[]);

  const fetchSections = async () => {
    try {
      setIsLoadingSections(true);
      const res = await fetch("/api/section/fetch");
      const data = await res.json();

      const transformedSections: Section[] = data.map((section: any) => ({
        id: section.id,
        name: section.name,
        description: section.description,
        sourceCount: section.source_ids?.length || 0,
        source_ids: section.source_ids || [],
        tone:  section.tone as Tone,
        scopeLabel: section.allowed_topics || "General",
        allowed_topics: section.allowed_topics,
        blocked_topics: section.blocked_topics,
        status: section.status as SectionsStatus,
      }));

      setSections(transformedSections);
    } catch (error) {
      console.error("Failed to fetch sections: ", error);
    }finally{
      setIsLoadingSections(false);
    }
  }

  const handleSaveSection = async () => {
    if(!formData.name.trim()){
      alert("Please enter a section name!");
      return;
    }
    if(!formData.description.trim()){
      alert("Please enter a description!");
      return;
    }
    if(selectedSources.length === 0){
      alert("Please select at least one knowledge source");
      return;
    }
    setIsSaving(true);

    try {
      const sectionData = {...formData, sourceIds: selectedSources, status: "active"};

      const res = await fetch("/api/section/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(sectionData)
      });

      if(!res.ok){
        throw new Error("Failed to create section");
      }

      await fetchSections();
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Failed to save section: ", error);
    }finally{
      setIsSaving(false);
    }
  }

  const handleDeleteSection = async () => {
    if(!selectedSection || selectedSection.id === "new") return;

    if(!confirm(`Are you sure you want to delete "${selectedSection.name}"? This action cannot be undone.`)){
      return;
    }

    try {
      setIsSaving(true);

      const res = await fetch("/api/section/delete", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: selectedSection.id}),
      });

      if(!res.ok) throw new Error("Failed to delete section");

      await fetchSections();
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Failed to delete section: ", error);
    }finally{
      setIsSaving(false);
    }
  }

  const handlePreviewSection = async (section: Section) => {
    setSelectedSection(section);
    setFormData({
      name: section.name,
      description: section.description,
      tone: section.tone,
      allowedTopics: section.allowed_topics || "",
      blockedTopics: section.blocked_topics || "",
      fallbackBehavior: "escalate",
    });
    setSelectedSources(section.source_ids || []);
    setIsSheetOpen(true);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className='text-2xl font-semibold text-white tracking-tight'>
            Sections
          </h1>
          <p className='text-sm text-zinc-400 mt-1'>
            Define behaviour and tone for differenct topics.
          </p>
        </div>
        <Button 
          onClick={handleCreateSections}
          className='bg-white text-black hover:bg-zinc-300'
        >
          <Plus className='w-4 h-4 mr-2'/>
          Create Section
        </Button>
      </div>

      <Card className='border-white/5 bg-[#0A0A0E]'>
        <CardContent className='p-0'>
          <SectionsTable
          sections={sections}
          isLoading={isLoadingSections}
          onPreview={handlePreviewSection}
          onCreateSection={handleCreateSections}
          />
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-lg border-l border-white/10 bg-[#0A0A0E] z-50">
          {selectedSection && (
            <>
            <SheetHeader className='p-6 border-b border-white/5'>
              <SheetTitle className='text-xl text-white'>
                {selectedSection.id === "new"
                ? "Create Section"
                : "View Section"}
              </SheetTitle>
              <SheetDescription className='text-zinc-500'>
                  {selectedSection.id == "new" 
                  ? "Confgure how the AI behaves for this specifc topic"
                  : "Review section configuration and data sources."}
              </SheetDescription>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto px-6 space-y-8">
              <SectionsFormFields
                formData={formData}
                setFormData={setFormData}
                selectedSources={selectedSources}
                setSelectedSources={setSelectedSources}
                knowledgeSources={knowledgeSources}
                isLoadingSources={isLoadingSources}
                isDisabled={isPreviewMode}
              />
            </div>

            {selectedSection.id === "new" && (
              <div className="p-6 border-t border-white/5">
                <Button
                  disabled={isSaving}
                  onClick={handleSaveSection}
                  className='w-full bg-white text-black hover:bg-zinc-300'
                >
                  {isSaving ? "Creating...": "Create Section"}
                </Button>
              </div>
            )}

            {selectedSection.id !== "new" && (
              <div className="p-6 border-t border-red-500/10 bg-red-500/5">
                <h5 className='text-sm font-medium text-red-400 mb-1'>Danger Zone</h5>
                <p className='text-xs text-red-500/70 mb-3'>
                  Deleting this section will remove all associated routing rules.
                </p>
                <Button
                  variant="destructive"
                  disabled={isSaving}
                  onClick={handleDeleteSection}
                  className='w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 shadow-none'
                >
                  {isSaving ? "Deleting...": "Delete Section"}
                </Button>
              </div>
            )}
          </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Page