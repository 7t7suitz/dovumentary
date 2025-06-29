export interface StoryAnalysis {
  id: string;
  title: string;
  content: string;
  uploadDate: Date;
  structure: NarrativeStructure;
  plotPoints: PlotPoint[];
  characters: CharacterAnalysis[];
  pacing: PacingAnalysis;
  gaps: StoryGap[];
  suggestions: StructuralSuggestion[];
  synopsis: Synopsis;
  loglines: Logline[];
  genre: GenreAnalysis;
  visualData: StoryVisualization;
}

export interface NarrativeStructure {
  type: StructureType;
  acts: Act[];
  completeness: number;
  adherence: number;
  recommendations: string[];
}

export type StructureType = 
  | 'three-act'
  | 'hero-journey'
  | 'five-act'
  | 'seven-point'
  | 'save-the-cat'
  | 'freytag-pyramid'
  | 'dan-harmon-circle';

export interface Act {
  id: string;
  name: string;
  startPosition: number;
  endPosition: number;
  purpose: string;
  content: string;
  strength: number;
  issues: string[];
  suggestions: string[];
}

export interface PlotPoint {
  id: string;
  name: string;
  type: PlotPointType;
  position: number;
  description: string;
  strength: number;
  present: boolean;
  suggestions: string[];
  relatedCharacters: string[];
}

export type PlotPointType = 
  | 'inciting-incident'
  | 'plot-point-1'
  | 'midpoint'
  | 'plot-point-2'
  | 'climax'
  | 'resolution'
  | 'call-to-adventure'
  | 'refusal-of-call'
  | 'meeting-mentor'
  | 'crossing-threshold'
  | 'tests-allies-enemies'
  | 'approach-inmost-cave'
  | 'ordeal'
  | 'reward'
  | 'road-back'
  | 'resurrection'
  | 'return-elixir';

export interface CharacterAnalysis {
  id: string;
  name: string;
  role: CharacterRole;
  arcType: CharacterArc;
  development: CharacterDevelopment;
  relationships: CharacterRelationship[];
  screenTime: number;
  importance: number;
  suggestions: string[];
}

export type CharacterRole = 
  | 'protagonist'
  | 'antagonist'
  | 'mentor'
  | 'ally'
  | 'threshold-guardian'
  | 'herald'
  | 'shapeshifter'
  | 'trickster'
  | 'love-interest'
  | 'supporting';

export type CharacterArc = 
  | 'positive-change'
  | 'negative-change'
  | 'flat-arc'
  | 'corruption-arc'
  | 'redemption-arc'
  | 'growth-arc'
  | 'fall-arc'
  | 'disillusionment-arc';

export interface CharacterDevelopment {
  startState: string;
  endState: string;
  changeStrength: number;
  motivations: string[];
  conflicts: string[];
  growth: string[];
  weaknesses: string[];
}

export interface CharacterRelationship {
  character: string;
  type: RelationshipType;
  strength: number;
  development: string;
}

export type RelationshipType = 
  | 'romantic'
  | 'familial'
  | 'friendship'
  | 'mentorship'
  | 'rivalry'
  | 'antagonistic'
  | 'professional'
  | 'alliance';

export interface PacingAnalysis {
  overallPacing: PacingType;
  actPacing: ActPacing[];
  tensionCurve: TensionPoint[];
  recommendations: PacingRecommendation[];
  issues: PacingIssue[];
}

export type PacingType = 'too-fast' | 'fast' | 'optimal' | 'slow' | 'too-slow';

export interface ActPacing {
  act: number;
  pacing: PacingType;
  duration: number;
  idealDuration: number;
  issues: string[];
  suggestions: string[];
}

export interface TensionPoint {
  position: number;
  tension: number;
  event: string;
  type: 'rising' | 'falling' | 'plateau' | 'spike';
}

export interface PacingRecommendation {
  type: 'cut' | 'expand' | 'restructure' | 'add-tension' | 'add-relief';
  position: number;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface PacingIssue {
  type: 'sagging-middle' | 'rushed-ending' | 'slow-start' | 'uneven-acts' | 'tension-drop';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestions: string[];
}

export interface StoryGap {
  id: string;
  type: GapType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  position: number;
  suggestions: string[];
  impact: string;
}

export type GapType = 
  | 'missing-motivation'
  | 'plot-hole'
  | 'character-inconsistency'
  | 'missing-setup'
  | 'unresolved-thread'
  | 'weak-transition'
  | 'missing-stakes'
  | 'unclear-goal'
  | 'missing-conflict'
  | 'weak-resolution';

export interface StructuralSuggestion {
  id: string;
  type: SuggestionType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  position?: number;
  implementation: string;
  expectedImpact: string;
  examples: string[];
}

export type SuggestionType = 
  | 'add-plot-point'
  | 'strengthen-character'
  | 'improve-pacing'
  | 'enhance-conflict'
  | 'clarify-stakes'
  | 'develop-theme'
  | 'improve-dialogue'
  | 'add-subtext'
  | 'strengthen-ending'
  | 'improve-opening';

export interface Synopsis {
  short: string;
  medium: string;
  long: string;
  oneSheet: string;
  treatment: string;
  strengths: string[];
  weaknesses: string[];
}

export interface Logline {
  text: string;
  type: 'traditional' | 'ironic' | 'question' | 'statement';
  strength: number;
  elements: LoglineElement[];
  suggestions: string[];
}

export interface LoglineElement {
  type: 'protagonist' | 'goal' | 'obstacle' | 'stakes';
  present: boolean;
  strength: number;
  content?: string;
}

export interface GenreAnalysis {
  primary: Genre;
  secondary: Genre[];
  conventions: GenreConvention[];
  adherence: number;
  recommendations: string[];
}

export interface Genre {
  name: string;
  confidence: number;
  indicators: string[];
}

export interface GenreConvention {
  name: string;
  present: boolean;
  strength: number;
  importance: 'low' | 'medium' | 'high';
  description: string;
}

export interface StoryVisualization {
  structureChart: StructureChartData;
  tensionCurve: TensionCurveData;
  characterArcs: CharacterArcData[];
  pacingChart: PacingChartData;
  plotPointMap: PlotPointMapData;
}

export interface StructureChartData {
  acts: ActVisualization[];
  plotPoints: PlotPointVisualization[];
  timeline: TimelinePoint[];
}

export interface ActVisualization {
  name: string;
  start: number;
  end: number;
  color: string;
  strength: number;
}

export interface PlotPointVisualization {
  name: string;
  position: number;
  strength: number;
  present: boolean;
  color: string;
}

export interface TimelinePoint {
  position: number;
  event: string;
  importance: number;
  type: string;
}

export interface TensionCurveData {
  points: { x: number; y: number; event: string }[];
  ideal: { x: number; y: number }[];
  gaps: { start: number; end: number; severity: string }[];
}

export interface CharacterArcData {
  character: string;
  points: { x: number; y: number; state: string }[];
  color: string;
  development: number;
}

export interface PacingChartData {
  acts: { name: string; duration: number; ideal: number; color: string }[];
  issues: { position: number; type: string; severity: string }[];
}

export interface PlotPointMapData {
  structure: string;
  points: {
    name: string;
    position: number;
    present: boolean;
    strength: number;
    connections: string[];
  }[];
}

export interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  structure: StructureType;
  plotPoints: PlotPointTemplate[];
  characterRoles: CharacterRole[];
  acts: ActTemplate[];
  genre: string[];
}

export interface PlotPointTemplate {
  name: string;
  type: PlotPointType;
  idealPosition: number;
  description: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export interface ActTemplate {
  name: string;
  purpose: string;
  idealLength: number;
  keyElements: string[];
}

export interface ExportOptions {
  format: 'pdf' | 'json' | 'csv' | 'docx';
  sections: ExportSection[];
  includeVisualizations: boolean;
  includeRecommendations: boolean;
}

export interface ExportSection {
  name: string;
  included: boolean;
  customization?: any;
}