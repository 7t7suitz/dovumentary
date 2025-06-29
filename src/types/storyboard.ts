export interface StoryboardFrame {
  id: string;
  title: string;
  description: string;
  shotType: ShotType;
  cameraAngle: CameraAngle;
  cameraMovement: CameraMovement;
  lighting: LightingSetup;
  colorPalette: ColorPalette;
  characters: CharacterPosition[];
  props: PropItem[];
  transition: TransitionType;
  voiceover: VoiceoverCue;
  audioCues: AudioCue[];
  duration: number;
  notes: string;
  canvas: CanvasData;
  timestamp: number;
}

export interface CanvasData {
  objects: CanvasObject[];
  background: string;
  dimensions: { width: number; height: number };
}

export interface CanvasObject {
  id: string;
  type: 'character' | 'prop' | 'text' | 'shape' | 'arrow';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  text?: string;
  shape?: string;
  zIndex: number;
}

export interface CharacterPosition {
  id: string;
  name: string;
  x: number;
  y: number;
  facing: 'left' | 'right' | 'forward' | 'back';
  action: string;
  emotion: string;
}

export interface PropItem {
  id: string;
  name: string;
  x: number;
  y: number;
  importance: 'primary' | 'secondary' | 'background';
}

export interface VoiceoverCue {
  text: string;
  startTime: number;
  duration: number;
  speaker: string;
  tone: string;
}

export interface AudioCue {
  id: string;
  type: 'music' | 'sfx' | 'ambient';
  description: string;
  startTime: number;
  duration: number;
  volume: number;
}

export type ShotType = 
  | 'extreme-wide' 
  | 'wide' 
  | 'medium-wide' 
  | 'medium' 
  | 'medium-close' 
  | 'close-up' 
  | 'extreme-close-up'
  | 'over-shoulder'
  | 'two-shot'
  | 'insert';

export type CameraAngle = 
  | 'eye-level' 
  | 'high-angle' 
  | 'low-angle' 
  | 'birds-eye' 
  | 'worms-eye'
  | 'dutch-angle'
  | 'overhead';

export type CameraMovement = 
  | 'static' 
  | 'pan-left' 
  | 'pan-right' 
  | 'tilt-up' 
  | 'tilt-down'
  | 'zoom-in'
  | 'zoom-out'
  | 'dolly-in'
  | 'dolly-out'
  | 'tracking'
  | 'handheld';

export type TransitionType = 
  | 'cut' 
  | 'fade-in' 
  | 'fade-out' 
  | 'dissolve' 
  | 'wipe'
  | 'iris'
  | 'match-cut'
  | 'jump-cut';

export interface LightingSetup {
  mood: 'bright' | 'dim' | 'dramatic' | 'natural' | 'artificial' | 'golden-hour' | 'blue-hour';
  keyLight: LightSource;
  fillLight: LightSource;
  backLight: LightSource;
  practicalLights: LightSource[];
}

export interface LightSource {
  intensity: number;
  color: string;
  direction: string;
  softness: number;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  mood: 'warm' | 'cool' | 'neutral' | 'vibrant' | 'muted' | 'monochrome';
}

export interface StoryboardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'documentary' | 'narrative' | 'commercial' | 'music-video' | 'animation';
  frames: Partial<StoryboardFrame>[];
  thumbnail: string;
}

export interface StoryboardProject {
  id: string;
  title: string;
  description: string;
  frames: StoryboardFrame[];
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSettings {
  aspectRatio: '16:9' | '4:3' | '21:9' | '1:1' | '9:16';
  frameRate: 24 | 30 | 60;
  resolution: '1080p' | '4K' | '720p';
  duration: number;
}

export interface AIAnalysis {
  sceneComplexity: number;
  visualInterest: number;
  narrativePacing: number;
  technicalFeasibility: number;
  suggestions: string[];
  warnings: string[];
}