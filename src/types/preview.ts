export interface DocumentaryPreview {
  id: string;
  title: string;
  description: string;
  versions: DocumentaryVersion[];
  feedbackSessions: FeedbackSession[];
  trailers: Trailer[];
  socialContent: SocialContent[];
  pitchMaterials: PitchMaterial[];
  marketAnalysis: MarketAnalysis;
  distributionPlan: DistributionPlan;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentaryVersion {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  status: 'draft' | 'review' | 'approved' | 'published';
  scenes: SceneReference[];
  feedback: FeedbackItem[];
  metrics: VersionMetrics;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SceneReference {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description: string;
  tags: string[];
}

export interface FeedbackSession {
  id: string;
  title: string;
  description: string;
  versionId: string;
  status: 'active' | 'completed' | 'archived';
  participants: Participant[];
  questions: FeedbackQuestion[];
  responses: FeedbackResponse[];
  summary: FeedbackSummary;
  createdAt: Date;
  endDate?: Date;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  demographics?: {
    age?: string;
    gender?: string;
    location?: string;
    occupation?: string;
    interests?: string[];
  };
  status: 'invited' | 'responded' | 'completed';
  responseDate?: Date;
}

export interface FeedbackQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'rating' | 'text' | 'timestamp' | 'ranking';
  options?: string[];
  required: boolean;
  category: 'general' | 'technical' | 'content' | 'emotional' | 'engagement';
  sceneReference?: string;
}

export interface FeedbackResponse {
  id: string;
  participantId: string;
  questionId: string;
  value: string | number | string[];
  timestamp?: number;
  notes?: string;
  createdAt: Date;
}

export interface FeedbackSummary {
  overallRating: number;
  engagementScore: number;
  emotionalImpactScore: number;
  clarityScore: number;
  technicalQualityScore: number;
  keyInsights: string[];
  wordCloud: { [key: string]: number };
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  improvementAreas: string[];
  strengthAreas: string[];
}

export interface FeedbackItem {
  id: string;
  participantId: string;
  timestamp: number;
  text: string;
  rating?: number;
  category: 'praise' | 'criticism' | 'suggestion' | 'question';
  resolved: boolean;
  responses: FeedbackItemResponse[];
  createdAt: Date;
}

export interface FeedbackItemResponse {
  id: string;
  authorId: string;
  text: string;
  createdAt: Date;
}

export interface VersionMetrics {
  views: number;
  completionRate: number;
  averageWatchTime: number;
  engagementScore: number;
  dropOffPoints: {
    timestamp: number;
    rate: number;
  }[];
  emotionalResponseData: {
    timestamp: number;
    emotion: string;
    intensity: number;
  }[];
  demographicBreakdown: {
    category: string;
    values: { [key: string]: number };
  }[];
}

export interface Trailer {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  type: 'teaser' | 'trailer' | 'promo';
  targetAudience: string[];
  platforms: string[];
  scenes: SceneReference[];
  metrics: TrailerMetrics;
  createdAt: Date;
}

export interface TrailerMetrics {
  views: number;
  clickThroughRate: number;
  conversionRate: number;
  shareRate: number;
  comments: number;
  likes: number;
}

export interface SocialContent {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl: string;
  type: 'image' | 'video' | 'quote' | 'article' | 'infographic';
  platform: 'instagram' | 'twitter' | 'facebook' | 'tiktok' | 'linkedin' | 'youtube';
  targetAudience: string[];
  publishDate?: Date;
  metrics: SocialMetrics;
  createdAt: Date;
}

export interface SocialMetrics {
  impressions: number;
  engagement: number;
  shares: number;
  clicks: number;
  comments: number;
  likes: number;
}

export interface PitchMaterial {
  id: string;
  title: string;
  type: 'deck' | 'one-sheet' | 'treatment' | 'budget' | 'trailer' | 'lookbook';
  fileUrl: string;
  thumbnailUrl: string;
  description: string;
  targetAudience: string[];
  status: 'draft' | 'review' | 'final';
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketAnalysis {
  targetAudiences: AudienceSegment[];
  competitiveAnalysis: CompetitiveAnalysis[];
  marketTrends: MarketTrend[];
  distributionChannels: DistributionChannel[];
  revenueProjections: RevenueProjection[];
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface AudienceSegment {
  id: string;
  name: string;
  demographics: {
    ageRange: string;
    gender: string[];
    location: string[];
    income: string;
    education: string[];
  };
  psychographics: {
    interests: string[];
    values: string[];
    behaviors: string[];
    mediaConsumption: string[];
  };
  size: number;
  reachability: number;
  priority: 'primary' | 'secondary' | 'tertiary';
}

export interface CompetitiveAnalysis {
  id: string;
  title: string;
  creator: string;
  releaseDate: Date;
  platform: string[];
  audienceOverlap: number;
  strengths: string[];
  weaknesses: string[];
  performance: {
    views: number;
    revenue: number;
    awards: string[];
    criticScore: number;
    audienceScore: number;
  };
}

export interface MarketTrend {
  id: string;
  name: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  relevance: number;
  sources: string[];
  projectedDuration: string;
}

export interface DistributionChannel {
  id: string;
  name: string;
  type: 'streaming' | 'theatrical' | 'broadcast' | 'festival' | 'educational' | 'community';
  audienceReach: number;
  revenueModel: string;
  requirements: string[];
  competitiveness: number;
  relevance: number;
  costStructure: {
    entryFee: number;
    revenueSplit: string;
    marketingRequirements: string;
  };
}

export interface RevenueProjection {
  channel: string;
  scenario: 'conservative' | 'moderate' | 'optimistic';
  timeline: {
    period: string;
    revenue: number;
    costs: number;
    profit: number;
  }[];
  totalRevenue: number;
  roi: number;
  breakEvenPoint: string;
}

export interface DistributionPlan {
  strategy: string;
  timeline: DistributionMilestone[];
  channels: PlannedChannel[];
  marketingPlan: MarketingActivity[];
  budget: {
    total: number;
    breakdown: {
      category: string;
      amount: number;
      description: string;
    }[];
  };
  kpis: {
    name: string;
    target: string;
    timeline: string;
    measurement: string;
  }[];
}

export interface DistributionMilestone {
  id: string;
  name: string;
  date: Date;
  description: string;
  deliverables: string[];
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
}

export interface PlannedChannel {
  id: string;
  name: string;
  type: string;
  launchDate: Date;
  strategy: string;
  audience: string;
  projectedReach: number;
  status: 'planned' | 'submitted' | 'accepted' | 'rejected' | 'live';
}

export interface MarketingActivity {
  id: string;
  name: string;
  type: 'social' | 'pr' | 'advertising' | 'event' | 'partnership';
  startDate: Date;
  endDate: Date;
  budget: number;
  targetAudience: string[];
  description: string;
  kpis: string[];
  status: 'planned' | 'in-progress' | 'completed';
}

export interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  variants: ABTestVariant[];
  metrics: string[];
  audience: {
    size: number;
    segments: string[];
    splitMethod: 'equal' | 'weighted';
    weights?: number[];
  };
  startDate: Date;
  endDate?: Date;
  status: 'draft' | 'active' | 'completed' | 'analyzing';
  results?: ABTestResults;
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  versionId: string;
  controlGroup: boolean;
  audience: {
    percentage: number;
    count: number;
  };
}

export interface ABTestResults {
  sampleSize: number;
  variantPerformance: {
    variantId: string;
    metrics: {
      [key: string]: {
        value: number;
        improvement: number;
        significanceLevel: number;
        confidenceInterval: [number, number];
      };
    };
  }[];
  winner: string;
  insights: string[];
  recommendations: string[];
}

export interface PreviewSettings {
  defaultPlaybackQuality: 'auto' | '240p' | '360p' | '480p' | '720p' | '1080p';
  autoplay: boolean;
  showTimestampComments: boolean;
  enableAnnotations: boolean;
  showWatermark: boolean;
  allowDownloads: boolean;
  accessControl: {
    requireLogin: boolean;
    allowedEmails: string[];
    expirationDays: number;
    passwordProtected: boolean;
    password?: string;
  };
  analyticsTracking: {
    viewership: boolean;
    engagement: boolean;
    demographics: boolean;
    deviceInfo: boolean;
  };
}

export interface FeedbackForm {
  id: string;
  title: string;
  description: string;
  questions: FeedbackQuestion[];
  settings: {
    allowAnonymous: boolean;
    collectDemographics: boolean;
    enableTimestampFeedback: boolean;
    requireCompletion: boolean;
    thankYouMessage: string;
    redirectUrl?: string;
  };
}

export interface AnalyticsData {
  viewership: {
    totalViews: number;
    uniqueViewers: number;
    averageWatchTime: number;
    completionRate: number;
    viewsByDate: {
      date: string;
      views: number;
    }[];
  };
  engagement: {
    commentCount: number;
    feedbackCount: number;
    shareCount: number;
    likeCount: number;
    engagementRate: number;
    engagementBySegment: {
      segment: string;
      rate: number;
    }[];
  };
  audience: {
    demographics: {
      category: string;
      distribution: {
        label: string;
        percentage: number;
      }[];
    }[];
    geographics: {
      country: string;
      count: number;
    }[];
    devices: {
      type: string;
      percentage: number;
    }[];
  };
  performance: {
    loadTime: number;
    bufferingInstances: number;
    errorRate: number;
    qualitySwitches: number;
  };
}