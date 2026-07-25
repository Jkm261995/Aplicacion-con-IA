export interface TitleOption {
  title: string;
  score: number; // 1-10
  reasoning: string;
  category?: 'curiosity' | 'income_value' | 'challenge' | 'search_seo';
}

export interface ThumbnailIdea {
  id: string;
  concept: string;
  style: string;
  colors: string;
  visualElements: string;
  emotion: string;
  generatedImageUrl?: string;
  customOverlayText?: string;
  customPrompt?: string;
  archetype?: string;
}

export interface SocialPosts {
  twitterThread: string[];
  instagramReelHook: string;
  linkedInSummary: string;
}

export interface ScriptSection {
  title: string;
  text: string;
  visualCue: string;
}

export interface VideoScript {
  hook: string;
  intro: string;
  bodyPoints: ScriptSection[];
  cta: string;
}

export interface ProcessedVideo {
  id: string;
  title: string;
  createdAt: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate?: string;
  rawTranscript: string;
  youtubeUrl?: string;
  selectedTitleIndex: number;
  titles: TitleOption[];
  description: string;
  tags: string[];
  thumbnailIdeas: ThumbnailIdea[];
  selectedThumbnailIndex: number;
  socialPosts: SocialPosts;
  script?: VideoScript;
  metrics?: {
    estimatedImpressions: string;
    targetAudience: string;
    seoScore: number;
  };
}

export interface TrendTopic {
  id: string;
  niche: string;
  title: string;
  searchVolume: string;
  growth: string;
  competition: 'Baja' | 'Media' | 'Alta';
  suggestedAngle: string;
  tags: string[];
}

export interface VideoIdea {
  id: string;
  title: string;
  niche: string;
  estimatedCTR: string;
  targetAudience: string;
  contentOutline: string[];
  hookIdea: string;
}

export interface ChannelAnalytics {
  subscribers: number;
  subscriberGrowth: number;
  viewsLast28Days: number;
  viewsGrowth: number;
  avgCTR: number;
  avgRetention: string;
  estimatedRevenue: number;
  topPerformingVideos: Array<{
    id: string;
    title: string;
    views: number;
    ctr: number;
    retention: string;
  }>;
  recentActivity: Array<{
    date: string;
    views: number;
    subscribers: number;
  }>;
}
