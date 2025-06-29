export interface Scene {
  id: string;
  title: string;
  description: string;
  location: LocationDetails;
  visualComposition: VisualComposition;
  lighting: LightingSetup;
  audio: AudioDesign;
  shotList: Shot[];
  equipment: EquipmentList;
  schedule: ProductionSchedule;
  weather: WeatherConsiderations;
  budget: BudgetEstimate;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationDetails {
  type: LocationType;
  name: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  accessibility: AccessibilityInfo;
  permits: PermitRequirements;
  alternatives: AlternativeLocation[];
  scouting: ScoutingNotes;
}

export type LocationType = 
  | 'indoor-studio' 
  | 'indoor-practical' 
  | 'outdoor-urban' 
  | 'outdoor-nature' 
  | 'outdoor-controlled'
  | 'vehicle'
  | 'water'
  | 'aerial';

export interface AccessibilityInfo {
  vehicleAccess: boolean;
  loadingAccess: boolean;
  powerAvailable: boolean;
  restrooms: boolean;
  parking: boolean;
  publicTransport: boolean;
  wheelchairAccessible: boolean;
}

export interface PermitRequirements {
  required: boolean;
  type?: string[];
  cost?: number;
  processingTime?: number;
  contacts?: string[];
}

export interface AlternativeLocation {
  name: string;
  reason: string;
  pros: string[];
  cons: string[];
}

export interface ScoutingNotes {
  bestTimeOfDay: string[];
  challenges: string[];
  opportunities: string[];
  photos?: string[];
  measurements?: string;
}

export interface VisualComposition {
  mood: VisualMood;
  colorPalette: ColorPalette;
  style: VisualStyle;
  framing: FramingGuide;
  movement: CameraMovement;
  depth: DepthStrategy;
}

export type VisualMood = 
  | 'dramatic' 
  | 'intimate' 
  | 'energetic' 
  | 'peaceful' 
  | 'mysterious' 
  | 'romantic'
  | 'tense'
  | 'nostalgic'
  | 'hopeful'
  | 'melancholic';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  temperature: 'warm' | 'cool' | 'neutral';
  saturation: 'high' | 'medium' | 'low' | 'desaturated';
  contrast: 'high' | 'medium' | 'low';
}

export interface VisualStyle {
  cinematography: CinematographyStyle;
  influences: string[];
  references: string[];
  techniques: string[];
}

export type CinematographyStyle = 
  | 'documentary' 
  | 'cinematic' 
  | 'handheld' 
  | 'static' 
  | 'dynamic'
  | 'intimate'
  | 'epic'
  | 'minimalist';

export interface FramingGuide {
  composition: CompositionRule[];
  subjectPlacement: string;
  backgroundTreatment: string;
  foregroundElements: string[];
}

export type CompositionRule = 
  | 'rule-of-thirds' 
  | 'center-composition' 
  | 'leading-lines' 
  | 'symmetry'
  | 'golden-ratio'
  | 'frame-within-frame';

export interface CameraMovement {
  type: MovementType;
  motivation: string;
  speed: 'slow' | 'medium' | 'fast';
  smoothness: 'smooth' | 'organic' | 'handheld';
}

export type MovementType = 
  | 'static' 
  | 'pan' 
  | 'tilt' 
  | 'dolly' 
  | 'track' 
  | 'crane'
  | 'handheld'
  | 'gimbal'
  | 'drone';

export interface DepthStrategy {
  layers: DepthLayer[];
  focusStrategy: FocusStrategy;
  bokehQuality: 'sharp' | 'medium' | 'soft' | 'dreamy';
}

export interface DepthLayer {
  name: string;
  distance: 'foreground' | 'midground' | 'background';
  elements: string[];
  treatment: string;
}

export type FocusStrategy = 
  | 'deep-focus' 
  | 'shallow-focus' 
  | 'rack-focus' 
  | 'split-focus'
  | 'selective-focus';

export interface LightingSetup {
  style: LightingStyle;
  mood: LightingMood;
  timeOfDay: TimeOfDay;
  sources: LightSource[];
  modifiers: LightModifier[];
  colorTemperature: ColorTemperature;
  contrast: ContrastLevel;
}

export type LightingStyle = 
  | 'natural' 
  | 'dramatic' 
  | 'soft' 
  | 'hard' 
  | 'mixed'
  | 'practical'
  | 'motivated'
  | 'stylized';

export type LightingMood = 
  | 'bright' 
  | 'moody' 
  | 'romantic' 
  | 'mysterious' 
  | 'energetic'
  | 'calm'
  | 'tense'
  | 'nostalgic';

export type TimeOfDay = 
  | 'golden-hour' 
  | 'blue-hour' 
  | 'midday' 
  | 'overcast' 
  | 'night'
  | 'dawn'
  | 'dusk'
  | 'artificial';

export interface LightSource {
  id: string;
  type: LightType;
  position: string;
  intensity: number;
  color: string;
  purpose: LightPurpose;
  equipment: string;
}

export type LightType = 
  | 'key' 
  | 'fill' 
  | 'back' 
  | 'practical' 
  | 'ambient'
  | 'accent'
  | 'hair'
  | 'background';

export type LightPurpose = 
  | 'subject-illumination' 
  | 'mood-creation' 
  | 'background-separation'
  | 'texture-enhancement'
  | 'color-accent';

export interface LightModifier {
  type: ModifierType;
  size: string;
  effect: string;
}

export type ModifierType = 
  | 'softbox' 
  | 'umbrella' 
  | 'diffusion' 
  | 'reflector'
  | 'flag'
  | 'gel'
  | 'grid'
  | 'barn-doors';

export interface ColorTemperature {
  kelvin: number;
  description: string;
  mixing: boolean;
}

export type ContrastLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface AudioDesign {
  music: MusicSelection;
  soundEffects: SoundEffect[];
  ambience: AmbienceTrack[];
  dialogue: DialogueConsiderations;
  recording: RecordingSetup;
}

export interface MusicSelection {
  genre: string[];
  mood: string[];
  tempo: TempoRange;
  instrumentation: string[];
  references: string[];
  licensing: LicensingInfo;
}

export interface TempoRange {
  min: number;
  max: number;
  description: string;
}

export interface LicensingInfo {
  type: 'royalty-free' | 'licensed' | 'original' | 'public-domain';
  cost?: number;
  restrictions?: string[];
}

export interface SoundEffect {
  id: string;
  name: string;
  description: string;
  timing: string;
  volume: number;
  source: string;
}

export interface AmbienceTrack {
  id: string;
  environment: string;
  description: string;
  volume: number;
  duration: string;
}

export interface DialogueConsiderations {
  recordingQuality: 'sync' | 'wild' | 'adr';
  microphoneSetup: MicrophoneSetup[];
  acousticTreatment: string[];
  backupPlans: string[];
}

export interface MicrophoneSetup {
  type: MicType;
  placement: string;
  purpose: string;
  equipment: string;
}

export type MicType = 
  | 'boom' 
  | 'lavalier' 
  | 'handheld' 
  | 'shotgun'
  | 'wireless'
  | 'boundary'
  | 'contact';

export interface RecordingSetup {
  format: AudioFormat;
  sampleRate: number;
  bitDepth: number;
  channels: number;
  equipment: string[];
}

export interface AudioFormat {
  container: string;
  codec: string;
  quality: string;
}

export interface Shot {
  id: string;
  number: string;
  description: string;
  shotSize: ShotSize;
  angle: CameraAngle;
  movement: ShotMovement;
  duration: number;
  equipment: ShotEquipment;
  lighting: ShotLighting;
  audio: ShotAudio;
  notes: string[];
  alternatives: string[];
}

export type ShotSize = 
  | 'extreme-wide' 
  | 'wide' 
  | 'medium-wide' 
  | 'medium'
  | 'medium-close'
  | 'close-up'
  | 'extreme-close-up'
  | 'insert';

export type CameraAngle = 
  | 'eye-level' 
  | 'high-angle' 
  | 'low-angle' 
  | 'birds-eye'
  | 'worms-eye'
  | 'dutch-angle'
  | 'over-shoulder';

export interface ShotMovement {
  type: MovementType;
  start: string;
  end: string;
  speed: string;
  equipment: string;
}

export interface ShotEquipment {
  camera: string;
  lens: string;
  support: string;
  accessories: string[];
}

export interface ShotLighting {
  setup: string;
  keyChanges: string[];
  specialRequirements: string[];
}

export interface ShotAudio {
  primary: string;
  backup: string;
  monitoring: string;
  notes: string[];
}

export interface EquipmentList {
  camera: CameraEquipment;
  lenses: LensEquipment[];
  lighting: LightingEquipment[];
  audio: AudioEquipment[];
  support: SupportEquipment[];
  accessories: AccessoryEquipment[];
  power: PowerEquipment[];
  storage: StorageEquipment[];
}

export interface CameraEquipment {
  body: string;
  specifications: CameraSpecs;
  alternatives: string[];
  cost: number;
  availability: string;
}

export interface CameraSpecs {
  sensor: string;
  resolution: string;
  frameRates: number[];
  codecs: string[];
  lowLight: string;
}

export interface LensEquipment {
  model: string;
  focalLength: string;
  aperture: string;
  purpose: string;
  cost: number;
}

export interface LightingEquipment {
  type: string;
  model: string;
  power: string;
  accessories: string[];
  cost: number;
}

export interface AudioEquipment {
  type: string;
  model: string;
  specifications: string;
  purpose: string;
  cost: number;
}

export interface SupportEquipment {
  type: string;
  model: string;
  capacity: string;
  purpose: string;
  cost: number;
}

export interface AccessoryEquipment {
  name: string;
  purpose: string;
  quantity: number;
  cost: number;
}

export interface PowerEquipment {
  type: string;
  capacity: string;
  duration: string;
  cost: number;
}

export interface StorageEquipment {
  type: string;
  capacity: string;
  speed: string;
  cost: number;
}

export interface ProductionSchedule {
  shootDate: Date;
  callTime: string;
  wrapTime: string;
  timeline: ScheduleBlock[];
  crew: CrewMember[];
  logistics: LogisticsInfo;
}

export interface ScheduleBlock {
  id: string;
  startTime: string;
  endTime: string;
  activity: string;
  location: string;
  crew: string[];
  equipment: string[];
  notes: string[];
}

export interface CrewMember {
  role: string;
  name?: string;
  callTime: string;
  wrapTime: string;
  rate?: number;
  contact?: string;
}

export interface LogisticsInfo {
  transportation: TransportationPlan;
  catering: CateringPlan;
  accommodation?: AccommodationPlan;
  permits: PermitStatus[];
  insurance: InsuranceInfo;
}

export interface TransportationPlan {
  crew: string;
  equipment: string;
  parking: string;
  costs: number;
}

export interface CateringPlan {
  meals: string[];
  dietary: string[];
  cost: number;
  vendor?: string;
}

export interface AccommodationPlan {
  location: string;
  rooms: number;
  cost: number;
  checkIn: string;
  checkOut: string;
}

export interface PermitStatus {
  type: string;
  status: 'pending' | 'approved' | 'denied' | 'not-required';
  cost: number;
  validDates: string;
}

export interface InsuranceInfo {
  coverage: string[];
  cost: number;
  provider: string;
  validDates: string;
}

export interface WeatherConsiderations {
  forecast: WeatherForecast;
  contingencies: WeatherContingency[];
  equipment: WeatherEquipment[];
  alternatives: WeatherAlternative[];
}

export interface WeatherForecast {
  date: Date;
  temperature: TemperatureRange;
  conditions: string;
  precipitation: number;
  wind: WindInfo;
  visibility: string;
  sunrise: string;
  sunset: string;
}

export interface TemperatureRange {
  high: number;
  low: number;
  unit: 'celsius' | 'fahrenheit';
}

export interface WindInfo {
  speed: number;
  direction: string;
  gusts: number;
}

export interface WeatherContingency {
  condition: string;
  plan: string;
  equipment: string[];
  timeline: string;
}

export interface WeatherEquipment {
  item: string;
  purpose: string;
  quantity: number;
}

export interface WeatherAlternative {
  scenario: string;
  location?: string;
  schedule?: string;
  impact: string;
}

export interface BudgetEstimate {
  total: number;
  breakdown: BudgetCategory[];
  contingency: number;
  currency: string;
}

export interface BudgetCategory {
  category: string;
  items: BudgetItem[];
  subtotal: number;
}

export interface BudgetItem {
  name: string;
  quantity: number;
  rate: number;
  total: number;
  notes?: string;
}

export interface SceneTemplate {
  id: string;
  name: string;
  description: string;
  category: SceneCategory;
  defaultSettings: Partial<Scene>;
  thumbnail?: string;
}

export type SceneCategory = 
  | 'interview' 
  | 'action' 
  | 'dialogue' 
  | 'montage'
  | 'establishing'
  | 'intimate'
  | 'documentary'
  | 'commercial';