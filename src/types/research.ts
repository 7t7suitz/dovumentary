export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  documents: ResearchDocument[];
  claims: Claim[];
  sources: Source[];
  experts: Expert[];
  citations: Citation[];
  timeline: TimelineEvent[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResearchDocument {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  fileUrl?: string;
  extractedClaims: Claim[];
  extractedEntities: Entity[];
  extractedSources: Source[];
  status: VerificationStatus;
  uploadDate: Date;
  lastAnalyzed: Date;
}

export type DocumentType = 'script' | 'article' | 'interview' | 'research' | 'notes' | 'other';

export interface Claim {
  id: string;
  text: string;
  documentId: string;
  documentPosition: number;
  category: ClaimCategory;
  verificationStatus: VerificationStatus;
  verificationSources: VerificationSource[];
  confidence: number;
  importance: 'critical' | 'high' | 'medium' | 'low';
  notes: string;
  suggestedExperts: Expert[];
  relatedClaims: string[]; // IDs of related claims
  createdAt: Date;
  updatedAt: Date;
}

export type ClaimCategory = 
  | 'factual' 
  | 'statistical' 
  | 'historical' 
  | 'scientific' 
  | 'personal' 
  | 'opinion' 
  | 'prediction';

export type VerificationStatus = 
  | 'unverified' 
  | 'verified' 
  | 'partially-verified' 
  | 'disputed' 
  | 'debunked' 
  | 'inconclusive' 
  | 'in-progress';

export interface VerificationSource {
  id: string;
  sourceId: string;
  relevance: number;
  supports: boolean;
  contradicts: boolean;
  notes: string;
  excerpts: string[];
  addedAt: Date;
}

export interface Source {
  id: string;
  title: string;
  url?: string;
  type: SourceType;
  authors: string[];
  publicationDate?: Date;
  publisher?: string;
  reliability: ReliabilityRating;
  accessDate: Date;
  content?: string;
  notes: string;
  tags: string[];
}

export type SourceType = 
  | 'academic-journal' 
  | 'book' 
  | 'news-article' 
  | 'website' 
  | 'interview' 
  | 'government-document' 
  | 'report' 
  | 'video' 
  | 'audio' 
  | 'social-media' 
  | 'other';

export type ReliabilityRating = 
  | 'academic-peer-reviewed' 
  | 'official-source' 
  | 'reputable-publication' 
  | 'news-source' 
  | 'opinion-source' 
  | 'unverified' 
  | 'questionable';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  description?: string;
  aliases: string[];
  sources: string[]; // Source IDs
  relatedEntities: string[]; // Entity IDs
  importance: 'primary' | 'secondary' | 'tertiary';
  mentions: number;
  confidence: number;
}

export type EntityType = 
  | 'person' 
  | 'organization' 
  | 'location' 
  | 'event' 
  | 'concept' 
  | 'product' 
  | 'other';

export interface Expert {
  id: string;
  name: string;
  title: string;
  organization?: string;
  expertise: string[];
  contactInfo?: ContactInfo;
  publications?: string[];
  relevance: number;
  notes: string;
  previousInterviews?: string[];
  availability?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  socialProfiles?: SocialProfile[];
  address?: string;
}

export interface SocialProfile {
  platform: string;
  url: string;
}

export interface Citation {
  id: string;
  sourceId: string;
  format: CitationFormat;
  text: string;
  inlineText: string;
  documentIds: string[]; // Documents where this citation is used
  claimIds: string[]; // Claims supported by this citation
  createdAt: Date;
  updatedAt: Date;
}

export type CitationFormat = 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee' | 'custom';

export interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
  sources: string[]; // Source IDs
  entities: string[]; // Entity IDs
  importance: 'major' | 'minor';
  category: string;
  verificationStatus: VerificationStatus;
}

export interface SearchQuery {
  text: string;
  filters: SearchFilters;
  sortBy: 'relevance' | 'date' | 'reliability';
  page: number;
  resultsPerPage: number;
}

export interface SearchFilters {
  sourceTypes?: SourceType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  reliability?: ReliabilityRating[];
  entities?: string[];
  tags?: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  source: string;
  snippet: string;
  date?: Date;
  authors?: string[];
  sourceType: SourceType;
  reliability: ReliabilityRating;
  relevanceScore: number;
}

export interface FactCheckReport {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  claims: ClaimAssessment[];
  overallAccuracy: number;
  recommendations: string[];
  createdAt: Date;
  updatedBy: string;
}

export interface ClaimAssessment {
  claim: Claim;
  assessment: 'true' | 'mostly-true' | 'partially-true' | 'inconclusive' | 'mostly-false' | 'false';
  explanation: string;
  supportingEvidence: VerificationSource[];
  contradictingEvidence: VerificationSource[];
  confidenceLevel: number;
  suggestedRevision?: string;
}

export interface PlagiarismCheckResult {
  id: string;
  documentId: string;
  overallSimilarity: number;
  matches: PlagiarismMatch[];
  createdAt: Date;
}

export interface PlagiarismMatch {
  id: string;
  text: string;
  startPosition: number;
  endPosition: number;
  matchedSource: Source;
  similarity: number;
  context: string;
}

export interface NewsMonitoringAlert {
  id: string;
  entityId: string;
  entityName: string;
  source: Source;
  headline: string;
  summary: string;
  url: string;
  publishDate: Date;
  detectedDate: Date;
  relevance: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  read: boolean;
}

export interface ResearchMap {
  id: string;
  title: string;
  nodes: ResearchNode[];
  edges: ResearchEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResearchNode {
  id: string;
  type: 'claim' | 'source' | 'entity' | 'expert';
  referenceId: string;
  label: string;
  description: string;
  position: { x: number; y: number };
  color: string;
  size: number;
}

export interface ResearchEdge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  label: string;
  type: 'supports' | 'contradicts' | 'relates' | 'cites' | 'mentions';
  strength: number;
}

export interface ApiSearchParams {
  query: string;
  limit?: number;
  offset?: number;
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    sourceType?: string[];
    language?: string;
    sortBy?: string;
  };
}

export interface ApiSearchResponse {
  results: SearchResult[];
  totalResults: number;
  nextPage?: string;
  executionTime: number;
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'json' | 'csv';
  includeVerifiedOnly: boolean;
  includeSources: boolean;
  includeTimeline: boolean;
  includeExperts: boolean;
  citationStyle: CitationFormat;
  customHeader?: string;
  customFooter?: string;
}