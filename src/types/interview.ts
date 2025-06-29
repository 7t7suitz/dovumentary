export interface InterviewQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  priority: Priority;
  sensitivity: SensitivityLevel;
  difficulty: DifficultyLevel;
  estimatedTime: number; // in minutes
  followUpSuggestions: string[];
  basedOnContent: string;
  culturalConsiderations: string[];
  tags: string[];
  order: number;
  isRequired: boolean;
  alternatives: string[];
  context: QuestionContext;
}

export type QuestionCategory = 
  | 'personal' 
  | 'factual' 
  | 'emotional' 
  | 'contextual' 
  | 'background'
  | 'relationship'
  | 'timeline'
  | 'impact'
  | 'reflection';

export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type SensitivityLevel = 'low' | 'medium' | 'high' | 'extreme';
export type DifficultyLevel = 'easy' | 'moderate' | 'challenging' | 'difficult';

export interface QuestionContext {
  documentSource: string;
  relatedThemes: string[];
  suggestedTiming: 'opening' | 'early' | 'middle' | 'late' | 'closing';
  prerequisites: string[];
  warningFlags: string[];
}

export interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  style: InterviewStyle;
  duration: number; // in minutes
  questionCategories: QuestionCategory[];
  culturalAdaptations: CulturalAdaptation[];
  structure: TemplateStructure;
}

export type InterviewStyle = 
  | 'documentary'
  | 'journalistic'
  | 'therapeutic'
  | 'oral-history'
  | 'investigative'
  | 'conversational'
  | 'formal'
  | 'trauma-informed';

export interface CulturalAdaptation {
  culture: string;
  considerations: string[];
  avoidTopics: string[];
  preferredApproaches: string[];
  languageNuances: string[];
}

export interface TemplateStructure {
  opening: QuestionCategory[];
  body: QuestionCategory[];
  closing: QuestionCategory[];
  transitionSuggestions: string[];
}

export interface ConversationFlow {
  id: string;
  currentQuestion: string;
  suggestedFollowUps: FollowUpSuggestion[];
  conversationState: ConversationState;
  emotionalTone: EmotionalTone;
  nextRecommendations: NextStepRecommendation[];
}

export interface FollowUpSuggestion {
  question: string;
  reasoning: string;
  sensitivity: SensitivityLevel;
  category: QuestionCategory;
  timing: 'immediate' | 'after-pause' | 'later-in-interview';
}

export interface ConversationState {
  rapport: number; // 0-1 scale
  emotionalIntensity: number; // 0-1 scale
  informationDensity: number; // 0-1 scale
  timeElapsed: number; // in minutes
  questionsAsked: number;
  sensitiveTopicsCovered: string[];
}

export type EmotionalTone = 
  | 'neutral'
  | 'positive'
  | 'emotional'
  | 'tense'
  | 'reflective'
  | 'difficult'
  | 'breakthrough';

export interface NextStepRecommendation {
  action: string;
  reasoning: string;
  priority: Priority;
  timing: string;
}

export interface DocumentAnalysis {
  id: string;
  filename: string;
  content: string;
  themes: string[];
  characters: string[];
  sensitiveTopics: string[];
  culturalContext: string[];
  timelineEvents: TimelineEvent[];
  emotionalMarkers: EmotionalMarker[];
  factualClaims: FactualClaim[];
  relationships: RelationshipMap[];
}

export interface TimelineEvent {
  date: string;
  event: string;
  significance: Priority;
  emotionalWeight: number;
}

export interface EmotionalMarker {
  topic: string;
  intensity: number;
  type: 'trauma' | 'joy' | 'loss' | 'achievement' | 'conflict' | 'love';
  context: string;
}

export interface FactualClaim {
  claim: string;
  confidence: number;
  needsVerification: boolean;
  sources: string[];
}

export interface RelationshipMap {
  person1: string;
  person2: string;
  relationship: string;
  significance: Priority;
  emotionalDynamics: string[];
}

export interface InterviewScript {
  id: string;
  title: string;
  interviewee: string;
  interviewer: string;
  date: Date;
  estimatedDuration: number;
  questions: InterviewQuestion[];
  notes: string;
  culturalConsiderations: string[];
  safetyProtocols: string[];
  backupQuestions: InterviewQuestion[];
}

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  questions: InterviewQuestion[];
  tags: string[];
  lastUpdated: Date;
  isPublic: boolean;
}