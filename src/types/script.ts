export interface Script {
  id: string;
  title: string;
  type: ScriptType;
  format: ScriptFormat;
  content: ScriptElement[];
  metadata: ScriptMetadata;
  versions: ScriptVersion[];
  collaborators: Collaborator[];
  settings: ScriptSettings;
  analysis: ScriptAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

export type ScriptType = 
  | 'documentary'
  | 'narrative'
  | 'commercial'
  | 'interview'
  | 'voiceover'
  | 'treatment'
  | 'outline';

export type ScriptFormat = 
  | 'fountain'
  | 'final-draft'
  | 'celtx'
  | 'writersduet'
  | 'custom';

export interface ScriptElement {
  id: string;
  type: ElementType;
  content: string;
  formatting: ElementFormatting;
  timing?: TimingInfo;
  notes?: string[];
  locked: boolean;
  order: number;
  parentId?: string;
  children?: string[];
}

export type ElementType = 
  | 'scene-heading'
  | 'action'
  | 'character'
  | 'dialogue'
  | 'parenthetical'
  | 'transition'
  | 'shot'
  | 'voiceover'
  | 'interview-question'
  | 'interview-response'
  | 'b-roll'
  | 'music'
  | 'sound-effect'
  | 'title'
  | 'subtitle'
  | 'lower-third'
  | 'graphics'
  | 'montage'
  | 'time-cut';

export interface ElementFormatting {
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  backgroundColor?: string;
  alignment: 'left' | 'center' | 'right';
  indent: number;
  spacing: number;
}

export interface TimingInfo {
  startTime: number;
  endTime: number;
  duration: number;
  estimatedReadingTime: number;
  voiceoverPacing: 'slow' | 'normal' | 'fast';
}

export interface ScriptMetadata {
  author: string;
  genre: string[];
  logline: string;
  synopsis: string;
  targetLength: number;
  estimatedRuntime: number;
  budget?: BudgetInfo;
  locations: string[];
  characters: string[];
  keywords: string[];
  notes: string;
}

export interface BudgetInfo {
  total: number;
  breakdown: BudgetCategory[];
  currency: string;
}

export interface BudgetCategory {
  name: string;
  amount: number;
  description: string;
}

export interface ScriptVersion {
  id: string;
  name: string;
  description: string;
  content: ScriptElement[];
  createdAt: Date;
  createdBy: string;
  changes: VersionChange[];
  approved: boolean;
  locked: boolean;
}

export interface VersionChange {
  type: 'add' | 'delete' | 'modify';
  elementId: string;
  oldContent?: string;
  newContent?: string;
  timestamp: Date;
  author: string;
  reason?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: CollaboratorRole;
  permissions: Permission[];
  lastActive: Date;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
}

export type CollaboratorRole = 
  | 'owner'
  | 'editor'
  | 'writer'
  | 'reviewer'
  | 'viewer'
  | 'director'
  | 'producer';

export type Permission = 
  | 'read'
  | 'write'
  | 'comment'
  | 'suggest'
  | 'approve'
  | 'export'
  | 'share'
  | 'admin';

export interface ScriptSettings {
  autoSave: boolean;
  autoFormat: boolean;
  spellCheck: boolean;
  grammarCheck: boolean;
  readabilityAnalysis: boolean;
  collaborativeEditing: boolean;
  versionControl: boolean;
  exportFormats: ScriptFormat[];
  defaultFont: string;
  defaultFontSize: number;
  pageMargins: PageMargins;
  lineSpacing: number;
  characterSpacing: number;
}

export interface PageMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ScriptAnalysis {
  readability: ReadabilityMetrics;
  pacing: PacingAnalysis;
  structure: StructureAnalysis;
  dialogue: DialogueAnalysis;
  suggestions: ScriptSuggestion[];
  issues: ScriptIssue[];
}

export interface ReadabilityMetrics {
  fleschKincaidGrade: number;
  fleschReadingEase: number;
  averageWordsPerSentence: number;
  averageSyllablesPerWord: number;
  complexWords: number;
  readingTime: number;
  speakingTime: number;
}

export interface PacingAnalysis {
  overallPacing: 'slow' | 'moderate' | 'fast' | 'varied';
  sceneBreakdown: ScenePacing[];
  dialogueToActionRatio: number;
  averageSceneLength: number;
  pacingIssues: PacingIssue[];
}

export interface ScenePacing {
  sceneId: string;
  pacing: 'slow' | 'moderate' | 'fast';
  wordCount: number;
  estimatedTime: number;
  dialoguePercentage: number;
  actionPercentage: number;
}

export interface PacingIssue {
  type: 'too-fast' | 'too-slow' | 'inconsistent' | 'dialogue-heavy' | 'action-heavy';
  severity: 'low' | 'medium' | 'high';
  location: string;
  suggestion: string;
}

export interface StructureAnalysis {
  acts: ActStructure[];
  plotPoints: PlotPoint[];
  characterArcs: CharacterArc[];
  themes: Theme[];
  structuralIssues: StructuralIssue[];
}

export interface ActStructure {
  act: number;
  startPage: number;
  endPage: number;
  length: number;
  purpose: string;
  strength: number;
}

export interface PlotPoint {
  name: string;
  page: number;
  present: boolean;
  strength: number;
  description: string;
}

export interface CharacterArc {
  character: string;
  development: number;
  screenTime: number;
  dialogueCount: number;
  arcType: 'positive' | 'negative' | 'flat' | 'complex';
}

export interface Theme {
  name: string;
  prevalence: number;
  development: number;
  consistency: number;
}

export interface StructuralIssue {
  type: 'missing-plot-point' | 'weak-character-arc' | 'pacing-problem' | 'theme-inconsistency';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
  page: number;
}

export interface DialogueAnalysis {
  totalLines: number;
  averageLineLength: number;
  characterVoices: CharacterVoice[];
  dialogueIssues: DialogueIssue[];
  naturalness: number;
  distinctiveness: number;
}

export interface CharacterVoice {
  character: string;
  distinctiveness: number;
  consistency: number;
  vocabulary: VocabularyAnalysis;
  speechPatterns: string[];
}

export interface VocabularyAnalysis {
  complexity: number;
  uniqueWords: number;
  averageWordLength: number;
  formalityLevel: number;
}

export interface DialogueIssue {
  type: 'exposition-heavy' | 'unnatural' | 'repetitive' | 'unclear' | 'inconsistent-voice';
  character?: string;
  line: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ScriptSuggestion {
  id: string;
  type: SuggestionType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  elementId?: string;
  implementation: string;
  impact: string;
  examples: string[];
  accepted: boolean;
  dismissed: boolean;
}

export type SuggestionType = 
  | 'structure'
  | 'dialogue'
  | 'pacing'
  | 'character'
  | 'formatting'
  | 'grammar'
  | 'style'
  | 'continuity';

export interface ScriptIssue {
  id: string;
  type: IssueType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  elementId: string;
  line: number;
  column: number;
  suggestion: string;
  autoFixable: boolean;
  resolved: boolean;
}

export type IssueType = 
  | 'spelling'
  | 'grammar'
  | 'formatting'
  | 'continuity'
  | 'character-name'
  | 'scene-heading'
  | 'dialogue'
  | 'action'
  | 'transition';

export interface StoryboardFrame {
  id: string;
  title: string;
  description: string;
  shotType: string;
  cameraAngle: string;
  cameraMovement: string;
  duration: number;
  voiceover?: VoiceoverCue;
  dialogue?: DialogueCue[];
  soundEffects?: SoundCue[];
  music?: MusicCue;
  notes: string;
  order: number;
}

export interface VoiceoverCue {
  text: string;
  speaker: string;
  tone: string;
  pacing: 'slow' | 'normal' | 'fast';
  emphasis: string[];
}

export interface DialogueCue {
  character: string;
  text: string;
  emotion: string;
  delivery: string;
}

export interface SoundCue {
  type: 'sfx' | 'ambient' | 'foley';
  description: string;
  volume: number;
  timing: 'sync' | 'async';
}

export interface MusicCue {
  type: 'score' | 'source' | 'theme';
  description: string;
  mood: string;
  volume: number;
  fadeIn: boolean;
  fadeOut: boolean;
}

export interface TranscriptionProject {
  id: string;
  name: string;
  audioUrl: string;
  duration: number;
  status: TranscriptionStatus;
  transcript: TranscriptSegment[];
  speakers: Speaker[];
  settings: TranscriptionSettings;
  createdAt: Date;
  updatedAt: Date;
}

export type TranscriptionStatus = 
  | 'uploading'
  | 'processing'
  | 'transcribing'
  | 'reviewing'
  | 'completed'
  | 'error';

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
  confidence: number;
  edited: boolean;
  locked: boolean;
  notes?: string;
}

export interface Speaker {
  id: string;
  name: string;
  color: string;
  segments: number;
  totalDuration: number;
  averageConfidence: number;
}

export interface TranscriptionSettings {
  language: string;
  speakerDiarization: boolean;
  punctuation: boolean;
  timestamps: boolean;
  confidence: boolean;
  filterProfanity: boolean;
  enhanceAudio: boolean;
  customVocabulary: string[];
}

export interface Comment {
  id: string;
  elementId: string;
  author: string;
  content: string;
  type: 'comment' | 'suggestion' | 'approval' | 'question';
  status: 'open' | 'resolved' | 'dismissed';
  replies: Reply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Reply {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

export interface ExportOptions {
  format: ExportFormat;
  includeNotes: boolean;
  includeComments: boolean;
  includeTimestamps: boolean;
  pageNumbers: boolean;
  sceneNumbers: boolean;
  characterList: boolean;
  locationList: boolean;
  titlePage: boolean;
  watermark?: string;
  customFormatting?: CustomFormatting;
}

export type ExportFormat = 
  | 'pdf'
  | 'docx'
  | 'fountain'
  | 'final-draft'
  | 'html'
  | 'txt'
  | 'json';

export interface CustomFormatting {
  font: string;
  fontSize: number;
  lineSpacing: number;
  margins: PageMargins;
  headerFooter: boolean;
  colorCoding: boolean;
}

export interface ABTestVersion {
  id: string;
  name: string;
  description: string;
  script: Script;
  metrics: ABTestMetrics;
  feedback: Feedback[];
  status: 'draft' | 'testing' | 'completed';
  createdAt: Date;
}

export interface ABTestMetrics {
  readabilityScore: number;
  engagementScore: number;
  clarityScore: number;
  pacingScore: number;
  overallScore: number;
  testDuration: number;
  participantCount: number;
}

export interface Feedback {
  id: string;
  participant: string;
  rating: number;
  comments: string;
  categories: FeedbackCategory[];
  timestamp: Date;
}

export interface FeedbackCategory {
  name: string;
  rating: number;
  comments?: string;
}

export interface ScriptTemplate {
  id: string;
  name: string;
  description: string;
  type: ScriptType;
  format: ScriptFormat;
  elements: Partial<ScriptElement>[];
  settings: Partial<ScriptSettings>;
  thumbnail?: string;
  tags: string[];
  popularity: number;
}

export interface AutoSuggestion {
  type: 'completion' | 'correction' | 'enhancement' | 'formatting';
  text: string;
  confidence: number;
  context: string;
  reasoning: string;
}

export interface VoiceoverGeneration {
  text: string;
  voice: VoiceProfile;
  settings: VoiceSettings;
  output?: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'adult' | 'senior';
  accent: string;
  style: 'narrative' | 'conversational' | 'dramatic' | 'documentary';
  sample?: string;
}

export interface VoiceSettings {
  speed: number;
  pitch: number;
  volume: number;
  emphasis: string[];
  pauses: PauseSettings[];
  pronunciation: PronunciationGuide[];
}

export interface PauseSettings {
  location: number;
  duration: number;
  type: 'breath' | 'dramatic' | 'natural';
}

export interface PronunciationGuide {
  word: string;
  pronunciation: string;
  phonetic: string;
}