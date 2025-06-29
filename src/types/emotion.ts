export interface EmotionalAnalysis {
  id: string;
  documentId: string;
  title: string;
  overallTone: EmotionalTone;
  emotionalArcs: EmotionalArc[];
  emotionalBeats: EmotionalBeat[];
  audienceEngagement: AudienceEngagementMetrics;
  musicSuggestions: MusicSuggestion[];
  soundDesignSuggestions: SoundDesignSuggestion[];
  interviewSuggestions: InterviewPlacementSuggestion[];
  empathyMaps: EmpathyMap[];
  accessibilityConsiderations: AccessibilityConsideration[];
  createdAt: Date;
  updatedAt: Date;
}

export type EmotionalTone = 
  | 'joyful'
  | 'somber'
  | 'tense'
  | 'inspirational'
  | 'contemplative'
  | 'nostalgic'
  | 'dramatic'
  | 'neutral'
  | 'mixed';

export interface EmotionalArc {
  id: string;
  name: string;
  description: string;
  startPosition: number; // 0-1 position in content
  endPosition: number; // 0-1 position in content
  startIntensity: number; // 0-1 intensity
  peakIntensity: number; // 0-1 intensity
  endIntensity: number; // 0-1 intensity
  dominantEmotion: string;
  secondaryEmotions: string[];
  resolution: 'resolved' | 'unresolved' | 'partial';
  audienceImpact: number; // 0-1 impact score
}

export interface EmotionalBeat {
  id: string;
  position: number; // 0-1 position in content
  timestamp?: number; // in seconds, if applicable
  emotion: string;
  intensity: number; // 0-1 intensity
  duration: number; // in seconds
  trigger: string;
  context: string;
  characterIds?: string[]; // if associated with specific characters
  visualCues?: string[];
  audioCues?: string[];
}

export interface AudienceEngagementMetrics {
  peakEngagementPoints: EngagementPoint[];
  lowEngagementPoints: EngagementPoint[];
  overallEngagementScore: number; // 0-1 score
  attentionRetentionScore: number; // 0-1 score
  emotionalImpactScore: number; // 0-1 score
  memorabilityScore: number; // 0-1 score
  recommendedPacingAdjustments: PacingAdjustment[];
}

export interface EngagementPoint {
  position: number; // 0-1 position in content
  score: number; // 0-1 engagement score
  reason: string;
  suggestion: string;
}

export interface PacingAdjustment {
  startPosition: number;
  endPosition: number;
  currentPacing: 'too-slow' | 'too-fast' | 'uneven';
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface MusicSuggestion {
  id: string;
  position: number; // 0-1 position in content
  duration: number; // in seconds
  emotionalGoal: string;
  genre: string[];
  mood: string;
  tempo: string;
  intensity: number; // 0-1 intensity
  instrumentation: string[];
  transitionType: 'fade-in' | 'fade-out' | 'cross-fade' | 'hard-cut' | 'gradual';
  notes: string;
}

export interface SoundDesignSuggestion {
  id: string;
  position: number; // 0-1 position in content
  duration: number; // in seconds
  type: 'ambient' | 'effect' | 'transition' | 'accent';
  description: string;
  emotionalPurpose: string;
  intensity: number; // 0-1 intensity
  layering: string[];
  notes: string;
}

export interface InterviewPlacementSuggestion {
  id: string;
  position: number; // 0-1 position in content
  emotionalContext: string;
  subjectMood: string;
  questionType: 'reflective' | 'emotional' | 'factual' | 'challenging';
  suggestedQuestions: string[];
  visualDirection: string;
  notes: string;
}

export interface EmpathyMap {
  id: string;
  audienceSegment: string;
  demographics: string[];
  emotionalNeeds: string[];
  painPoints: string[];
  goals: string[];
  thoughtsAndFeelings: string[];
  resonantMoments: {
    position: number;
    reason: string;
  }[];
  dissonantMoments: {
    position: number;
    reason: string;
  }[];
  engagementStrategies: string[];
}

export interface AccessibilityConsideration {
  id: string;
  type: 'visual' | 'auditory' | 'cognitive' | 'emotional';
  description: string;
  affectedAudience: string;
  positions: number[]; // 0-1 positions in content
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface EmotionAnalysisRequest {
  documentId: string;
  content: string;
  contentType: 'script' | 'transcript' | 'storyboard' | 'raw-text';
  targetAudience?: string[];
  focusEmotions?: string[];
  accessibilityRequirements?: boolean;
}

export interface EmotionVisualizationOptions {
  showIntensity: boolean;
  showBeats: boolean;
  showArcs: boolean;
  showEngagementPoints: boolean;
  colorScheme: 'standard' | 'monochrome' | 'accessible';
  resolution: 'high' | 'medium' | 'low';
  includeAnnotations: boolean;
}

export interface EmotionExportOptions {
  format: 'pdf' | 'json' | 'csv' | 'image';
  includeVisualization: boolean;
  includeSuggestions: boolean;
  includeEmpathyMaps: boolean;
  includeAccessibility: boolean;
}