export interface DocumentAnalysis {
  id: string;
  filename: string;
  content: string;
  uploadDate: Date;
  themes: Theme[];
  characters: Character[];
  dates: ExtractedDate[];
  narrativeArcs: NarrativeArc[];
  emotionalBeats: EmotionalBeat[];
  metadata: MetadataTag[];
  summary: DocumentSummary;
  relationships: DocumentRelationship[];
  interviewQuestions: InterviewQuestion[];
  legalConcerns: LegalConcern[];
  cinematicPotential: CinematicAnalysis;
}

export interface Theme {
  id: string;
  name: string;
  confidence: number;
  occurrences: number;
  context: string[];
  relevance: 'high' | 'medium' | 'low';
}

export interface Character {
  id: string;
  name: string;
  role: string;
  mentions: number;
  relationships: string[];
  significance: 'primary' | 'secondary' | 'minor';
  emotionalArc: string;
}

export interface ExtractedDate {
  id: string;
  date: Date;
  context: string;
  type: 'event' | 'birth' | 'death' | 'milestone' | 'reference';
  confidence: number;
  significance: 'high' | 'medium' | 'low';
}

export interface NarrativeArc {
  id: string;
  type: 'rising_action' | 'climax' | 'falling_action' | 'resolution' | 'exposition';
  startPosition: number;
  endPosition: number;
  intensity: number;
  description: string;
}

export interface EmotionalBeat {
  id: string;
  emotion: string;
  intensity: number;
  position: number;
  context: string;
  duration: number;
  triggers: string[];
}

export interface MetadataTag {
  id: string;
  category: string;
  value: string;
  confidence: number;
  searchable: boolean;
}

export interface DocumentSummary {
  brief: string;
  detailed: string;
  cinematicPotential: number;
  keyPoints: string[];
  genre: string[];
  tone: string;
  targetAudience: string[];
}

export interface DocumentRelationship {
  id: string;
  relatedDocumentId: string;
  relationshipType: 'chronological' | 'thematic' | 'character' | 'location' | 'causal';
  strength: number;
  description: string;
  sharedElements: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'personal' | 'factual' | 'emotional' | 'contextual';
  priority: 'high' | 'medium' | 'low';
  sensitivity: 'low' | 'medium' | 'high';
  followUpSuggestions: string[];
  basedOnContent: string;
}

export interface LegalConcern {
  id: string;
  type: 'privacy' | 'defamation' | 'copyright' | 'consent' | 'sensitive_info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  affectedContent: string;
}

export interface CinematicAnalysis {
  visualPotential: number;
  dramaticTension: number;
  characterDevelopment: number;
  narrativeStructure: number;
  emotionalImpact: number;
  overallScore: number;
  recommendations: string[];
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'event' | 'milestone' | 'character' | 'theme';
  importance: number;
  documentId: string;
  characters: string[];
  themes: string[];
}