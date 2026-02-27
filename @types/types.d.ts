
type SourceType = "website" | "docs" | "upload" | "text";
type SourceStatus = "active" | "training" | "error" | "excluded";

interface KnowledgeSource{
  id:string;
  user_email: string;
  type: string;
  name:string;
  status:string;
  source_url: string | null;
  content: string | null;
  meta_data: string | null;
  last_updated: string | null;
  created_at: string | null;
}

type SectionsStatus = "active" | "draft" | "disabled";
type Tone = "strict" | "neutral" | "friendly" | "empathetic";

interface Section{
  id:string;
  name:string;
  description: string;
  sourceCount:number;
  source_ids?: string[];
  tone: Tone;
  scopeLabel: string;
  allowed_topics?: string;
  blocked_topics?: string;
  status: SectionsStatus;
}

interface SectionFormFieldProps {
  formData: SectionFormData;
  setFormData: (data: SectionFormData) => void;
  selectedSources: string[],
  setSelectedSources: (sources: string[]) => void;
  knowledgeSources: KnowledgeSource[];
  isLoadingSources: boolean;  
  isDisabled: boolean;
}

interface SectionFormData{
  name:string;
  description: string;
  tone: Tone;
  allowedTopics: string;
  blockedTopics: string;
  fallbackBehavior: string;
}