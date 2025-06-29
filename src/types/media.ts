export interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadDate: Date;
  lastModified: Date;
  metadata: MediaMetadata;
  tags: Tag[];
  faces: DetectedFace[];
  analysis: MediaAnalysis;
  versions: MediaVersion[];
  collections: string[];
  status: ProcessingStatus;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export interface MediaMetadata {
  dimensions?: { width: number; height: number };
  duration?: number;
  format: string;
  colorSpace?: string;
  bitRate?: number;
  frameRate?: number;
  location?: GeoLocation;
  camera?: CameraInfo;
  exif?: ExifData;
  fileHash: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface CameraInfo {
  make?: string;
  model?: string;
  lens?: string;
  settings?: CameraSettings;
}

export interface CameraSettings {
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  focalLength?: string;
  flash?: boolean;
}

export interface ExifData {
  [key: string]: any;
}

export interface Tag {
  id: string;
  name: string;
  category: TagCategory;
  confidence: number;
  source: TagSource;
  color?: string;
}

export type TagCategory = 
  | 'object'
  | 'person'
  | 'location'
  | 'emotion'
  | 'activity'
  | 'theme'
  | 'technical'
  | 'custom';

export type TagSource = 'ai' | 'manual' | 'metadata' | 'facial-recognition';

export interface DetectedFace {
  id: string;
  boundingBox: BoundingBox;
  confidence: number;
  landmarks?: FaceLandmarks;
  expressions?: FaceExpressions;
  age?: number;
  gender?: string;
  personId?: string;
  personName?: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceLandmarks {
  leftEye: Point;
  rightEye: Point;
  nose: Point;
  mouth: Point;
}

export interface Point {
  x: number;
  y: number;
}

export interface FaceExpressions {
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  neutral: number;
}

export interface MediaAnalysis {
  aiDescription: string;
  dominantColors: string[];
  composition: CompositionAnalysis;
  quality: QualityMetrics;
  content: ContentAnalysis;
  documentaryValue: DocumentaryAnalysis;
}

export interface CompositionAnalysis {
  ruleOfThirds: number;
  symmetry: number;
  leadingLines: boolean;
  framing: string;
  perspective: string;
}

export interface QualityMetrics {
  sharpness: number;
  exposure: number;
  contrast: number;
  saturation: number;
  noise: number;
  overallScore: number;
}

export interface ContentAnalysis {
  objects: DetectedObject[];
  scenes: string[];
  activities: string[];
  emotions: EmotionAnalysis[];
  text?: string;
}

export interface DetectedObject {
  name: string;
  confidence: number;
  boundingBox: BoundingBox;
  category: string;
}

export interface EmotionAnalysis {
  emotion: string;
  intensity: number;
  context: string;
}

export interface DocumentaryAnalysis {
  narrativeValue: number;
  emotionalImpact: number;
  visualInterest: number;
  historicalSignificance: number;
  storytellingPotential: number;
  suggestedPlacement: PlacementSuggestion[];
}

export interface PlacementSuggestion {
  section: DocumentarySection;
  confidence: number;
  reasoning: string;
  timing?: number;
}

export type DocumentarySection = 
  | 'opening'
  | 'introduction'
  | 'rising-action'
  | 'climax'
  | 'resolution'
  | 'conclusion'
  | 'b-roll'
  | 'transition'
  | 'interview-support';

export interface MediaVersion {
  id: string;
  name: string;
  url: string;
  size: number;
  format: string;
  quality: string;
  purpose: VersionPurpose;
  createdDate: Date;
  modifications: Modification[];
}

export type VersionPurpose = 
  | 'original'
  | 'web-optimized'
  | 'thumbnail'
  | 'preview'
  | 'archive'
  | 'edited'
  | 'compressed';

export interface Modification {
  type: ModificationType;
  parameters: any;
  timestamp: Date;
  user?: string;
}

export type ModificationType = 
  | 'resize'
  | 'crop'
  | 'color-correction'
  | 'filter'
  | 'compression'
  | 'format-conversion'
  | 'watermark'
  | 'metadata-edit';

export type ProcessingStatus = 
  | 'uploading'
  | 'processing'
  | 'analyzing'
  | 'completed'
  | 'error'
  | 'archived';

export interface MediaCollection {
  id: string;
  name: string;
  description: string;
  type: CollectionType;
  mediaIds: string[];
  createdDate: Date;
  updatedDate: Date;
  tags: Tag[];
  metadata: CollectionMetadata;
  sharing: SharingSettings;
}

export type CollectionType = 
  | 'album'
  | 'project'
  | 'timeline'
  | 'location'
  | 'theme'
  | 'person'
  | 'event'
  | 'archive';

export interface CollectionMetadata {
  coverImageId?: string;
  dateRange?: { start: Date; end: Date };
  location?: GeoLocation;
  totalSize: number;
  mediaCount: number;
  lastActivity: Date;
}

export interface SharingSettings {
  isPublic: boolean;
  allowDownload: boolean;
  password?: string;
  expiryDate?: Date;
  collaborators: Collaborator[];
}

export interface Collaborator {
  id: string;
  email: string;
  role: CollaboratorRole;
  permissions: Permission[];
}

export type CollaboratorRole = 'viewer' | 'editor' | 'admin';

export type Permission = 
  | 'view'
  | 'download'
  | 'edit'
  | 'delete'
  | 'share'
  | 'manage-collaborators';

export interface Person {
  id: string;
  name: string;
  faceEncodings: number[][];
  mediaCount: number;
  firstSeen: Date;
  lastSeen: Date;
  tags: Tag[];
  notes?: string;
  relationship?: string;
  verified: boolean;
}

export interface SearchFilters {
  mediaTypes: MediaType[];
  dateRange?: { start: Date; end: Date };
  tags: string[];
  people: string[];
  locations: string[];
  collections: string[];
  quality?: { min: number; max: number };
  size?: { min: number; max: number };
  hasLocation: boolean;
  hasFaces: boolean;
  processingStatus: ProcessingStatus[];
}

export interface SearchResult {
  media: MediaFile[];
  totalCount: number;
  facets: SearchFacets;
  suggestions: string[];
}

export interface SearchFacets {
  tags: FacetCount[];
  people: FacetCount[];
  locations: FacetCount[];
  mediaTypes: FacetCount[];
  collections: FacetCount[];
}

export interface FacetCount {
  name: string;
  count: number;
}

export interface BatchOperation {
  id: string;
  type: BatchOperationType;
  mediaIds: string[];
  parameters: any;
  status: BatchStatus;
  progress: number;
  startTime: Date;
  endTime?: Date;
  results: BatchResult[];
  errors: BatchError[];
}

export type BatchOperationType = 
  | 'tag-add'
  | 'tag-remove'
  | 'move-collection'
  | 'delete'
  | 'export'
  | 'resize'
  | 'format-convert'
  | 'compress'
  | 'analyze'
  | 'backup';

export type BatchStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface BatchResult {
  mediaId: string;
  success: boolean;
  message?: string;
  outputUrl?: string;
}

export interface BatchError {
  mediaId: string;
  error: string;
  timestamp: Date;
}

export interface MediaLibrary {
  id: string;
  name: string;
  description: string;
  media: MediaFile[];
  collections: MediaCollection[];
  people: Person[];
  settings: LibrarySettings;
  statistics: LibraryStatistics;
}

export interface LibrarySettings {
  autoTagging: boolean;
  faceDetection: boolean;
  geoTagging: boolean;
  qualityAnalysis: boolean;
  duplicateDetection: boolean;
  autoBackup: boolean;
  storageQuota: number;
  retentionPolicy: RetentionPolicy;
}

export interface RetentionPolicy {
  enabled: boolean;
  archiveAfterDays: number;
  deleteAfterDays: number;
  exceptions: string[];
}

export interface LibraryStatistics {
  totalMedia: number;
  totalSize: number;
  mediaByType: { [key in MediaType]: number };
  mediaByMonth: { month: string; count: number }[];
  topTags: FacetCount[];
  topPeople: FacetCount[];
  topLocations: FacetCount[];
  qualityDistribution: { [key: string]: number };
  storageUsed: number;
  lastUpdated: Date;
}

export interface ExportOptions {
  format: ExportFormat;
  quality: ExportQuality;
  includeMetadata: boolean;
  includeOriginals: boolean;
  organizationMethod: OrganizationMethod;
  filenamePattern: string;
  destination: ExportDestination;
}

export type ExportFormat = 'zip' | 'folder' | 'cloud-sync';
export type ExportQuality = 'original' | 'high' | 'medium' | 'low' | 'custom';
export type OrganizationMethod = 'date' | 'collection' | 'person' | 'location' | 'tag' | 'flat';
export type ExportDestination = 'download' | 'cloud-storage' | 'external-drive';

export interface CloudStorage {
  provider: CloudProvider;
  connected: boolean;
  quota: number;
  used: number;
  syncEnabled: boolean;
  lastSync: Date;
  syncFolders: string[];
}

export type CloudProvider = 'google-drive' | 'dropbox' | 'onedrive' | 'aws-s3' | 'azure-blob';

export interface AIProcessingQueue {
  id: string;
  mediaId: string;
  tasks: AITask[];
  priority: number;
  status: ProcessingStatus;
  progress: number;
  estimatedTime: number;
  startTime?: Date;
  endTime?: Date;
}

export interface AITask {
  type: AITaskType;
  status: ProcessingStatus;
  progress: number;
  result?: any;
  error?: string;
}

export type AITaskType = 
  | 'face-detection'
  | 'object-detection'
  | 'scene-classification'
  | 'text-extraction'
  | 'quality-analysis'
  | 'composition-analysis'
  | 'emotion-detection'
  | 'duplicate-detection'
  | 'content-moderation';