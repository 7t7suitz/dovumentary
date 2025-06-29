import React, { useState } from 'react';
import { DocumentaryVersion, Trailer, SocialContent, PitchMaterial } from '../types/preview';
import { 
  Film, 
  Image, 
  FileText, 
  Share2, 
  Download, 
  Wand2,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Copy,
  Clock,
  Calendar,
  Target,
  Users
} from 'lucide-react';

interface MarketingMaterialGeneratorProps {
  version: DocumentaryVersion;
  trailers: Trailer[];
  socialContent: SocialContent[];
  pitchMaterials: PitchMaterial[];
  onTrailerCreate: (trailer: Trailer) => void;
  onSocialContentCreate: (content: SocialContent) => void;
  onPitchMaterialCreate: (material: PitchMaterial) => void;
  onTrailerDelete: (id: string) => void;
  onSocialContentDelete: (id: string) => void;
  onPitchMaterialDelete: (id: string) => void;
}

export const MarketingMaterialGenerator: React.FC<MarketingMaterialGeneratorProps> = ({
  version,
  trailers,
  socialContent,
  pitchMaterials,
  onTrailerCreate,
  onSocialContentCreate,
  onPitchMaterialCreate,
  onTrailerDelete,
  onSocialContentDelete,
  onPitchMaterialDelete
}) => {
  const [activeTab, setActiveTab] = useState<'trailers' | 'social' | 'pitch'>('trailers');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateTrailer, setShowCreateTrailer] = useState(false);
  const [showCreateSocial, setShowCreateSocial] = useState(false);
  const [showCreatePitch, setShowCreatePitch] = useState(false);
  const [newTrailer, setNewTrailer] = useState<Partial<Trailer>>({
    title: '',
    description: '',
    videoUrl: '',
    type: 'trailer',
    targetAudience: [],
    platforms: []
  });
  const [newSocial, setNewSocial] = useState<Partial<SocialContent>>({
    title: '',
    description: '',
    mediaUrl: '',
    type: 'video',
    platform: 'instagram',
    targetAudience: []
  });
  const [newPitch, setNewPitch] = useState<Partial<PitchMaterial>>({
    title: '',
    type: 'deck',
    fileUrl: '',
    description: '',
    targetAudience: [],
    status: 'draft'
  });

  const handleGenerateTrailer = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newTrailer: Trailer = {
        id: Math.random().toString(36).substring(2, 9),
        title: `${version.name} - Trailer`,
        description: 'AI-generated trailer highlighting key moments',
        videoUrl: version.videoUrl, // In a real app, this would be a new video
        thumbnailUrl: version.thumbnailUrl || '',
        duration: Math.round(version.duration * 0.1), // 10% of original
        type: 'trailer',
        targetAudience: ['general'],
        platforms: ['youtube', 'instagram', 'facebook'],
        scenes: version.scenes.slice(0, 5),
        metrics: {
          views: 0,
          clickThroughRate: 0,
          conversionRate: 0,
          shareRate: 0,
          comments: 0,
          likes: 0
        },
        createdAt: new Date()
      };
      
      onTrailerCreate(newTrailer);
    } catch (error) {
      console.error('Failed to generate trailer:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSocialContent = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const platforms = ['instagram', 'twitter', 'facebook', 'tiktok'];
      const types = ['image', 'video', 'quote'];
      
      // Generate 3 pieces of content
      for (let i = 0; i < 3; i++) {
        const platform = platforms[Math.floor(Math.random() * platforms.length)] as any;
        const type = types[Math.floor(Math.random() * types.length)] as any;
        
        const content: SocialContent = {
          id: Math.random().toString(36).substring(2, 9),
          title: `${version.name} - ${platform} ${type}`,
          description: `AI-generated ${type} for ${platform}`,
          mediaUrl: version.videoUrl, // In a real app, this would be a new media file
          thumbnailUrl: version.thumbnailUrl || '',
          type,
          platform,
          targetAudience: ['general'],
          metrics: {
            impressions: 0,
            engagement: 0,
            shares: 0,
            clicks: 0,
            comments: 0,
            likes: 0
          },
          createdAt: new Date()
        };
        
        onSocialContentCreate(content);
      }
    } catch (error) {
      console.error('Failed to generate social content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePitchMaterial = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const types = ['deck', 'one-sheet', 'treatment'];
      
      // Generate pitch deck
      const material: PitchMaterial = {
        id: Math.random().toString(36).substring(2, 9),
        title: `${version.name} - Pitch Deck`,
        type: 'deck',
        fileUrl: '#', // In a real app, this would be a file URL
        thumbnailUrl: version.thumbnailUrl || '',
        description: 'AI-generated pitch deck for festival submissions',
        targetAudience: ['festivals', 'distributors'],
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      onPitchMaterialCreate(material);
    } catch (error) {
      console.error('Failed to generate pitch material:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateTrailer = () => {
    if (!newTrailer.title || !newTrailer.videoUrl) return;
    
    const trailer: Trailer = {
      id: Math.random().toString(36).substring(2, 9),
      title: newTrailer.title || '',
      description: newTrailer.description || '',
      videoUrl: newTrailer.videoUrl || '',
      thumbnailUrl: '', // Would be generated from video
      duration: 60, // Default 60 seconds
      type: newTrailer.type as any || 'trailer',
      targetAudience: newTrailer.targetAudience || [],
      platforms: newTrailer.platforms || [],
      scenes: [],
      metrics: {
        views: 0,
        clickThroughRate: 0,
        conversionRate: 0,
        shareRate: 0,
        comments: 0,
        likes: 0
      },
      createdAt: new Date()
    };
    
    onTrailerCreate(trailer);
    setShowCreateTrailer(false);
    setNewTrailer({
      title: '',
      description: '',
      videoUrl: '',
      type: 'trailer',
      targetAudience: [],
      platforms: []
    });
  };

  const handleCreateSocialContent = () => {
    if (!newSocial.title || !newSocial.mediaUrl) return;
    
    const content: SocialContent = {
      id: Math.random().toString(36).substring(2, 9),
      title: newSocial.title || '',
      description: newSocial.description || '',
      mediaUrl: newSocial.mediaUrl || '',
      thumbnailUrl: '', // Would be generated from media
      type: newSocial.type as any || 'video',
      platform: newSocial.platform as any || 'instagram',
      targetAudience: newSocial.targetAudience || [],
      metrics: {
        impressions: 0,
        engagement: 0,
        shares: 0,
        clicks: 0,
        comments: 0,
        likes: 0
      },
      createdAt: new Date()
    };
    
    onSocialContentCreate(content);
    setShowCreateSocial(false);
    setNewSocial({
      title: '',
      description: '',
      mediaUrl: '',
      type: 'video',
      platform: 'instagram',
      targetAudience: []
    });
  };

  const handleCreatePitchMaterial = () => {
    if (!newPitch.title || !newPitch.fileUrl) return;
    
    const material: PitchMaterial = {
      id: Math.random().toString(36).substring(2, 9),
      title: newPitch.title || '',
      type: newPitch.type as any || 'deck',
      fileUrl: newPitch.fileUrl || '',
      thumbnailUrl: '', // Would be generated from file
      description: newPitch.description || '',
      targetAudience: newPitch.targetAudience || [],
      status: newPitch.status as any || 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onPitchMaterialCreate(material);
    setShowCreatePitch(false);
    setNewPitch({
      title: '',
      type: 'deck',
      fileUrl: '',
      description: '',
      targetAudience: [],
      status: 'draft'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTrailersTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Trailers & Teasers</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateTrailer(true)}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Manual</span>
          </button>
          
          <button
            onClick={handleGenerateTrailer}
            disabled={isGenerating}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>AI Generate</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {showCreateTrailer ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-3">Create New Trailer</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newTrailer.title}
                onChange={(e) => setNewTrailer(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Official Trailer, Teaser #1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTrailer.description}
                onChange={(e) => setNewTrailer(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of this trailer..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL
              </label>
              <input
                type="text"
                value={newTrailer.videoUrl}
                onChange={(e) => setNewTrailer(prev => ({ ...prev, videoUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/trailer.mp4"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newTrailer.type}
                  onChange={(e) => setNewTrailer(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="teaser">Teaser</option>
                  <option value="trailer">Trailer</option>
                  <option value="promo">Promotional Video</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <select
                  multiple
                  value={newTrailer.targetAudience}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setNewTrailer(prev => ({ ...prev, targetAudience: values }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  size={3}
                >
                  <option value="general">General Audience</option>
                  <option value="festivals">Film Festivals</option>
                  <option value="distributors">Distributors</option>
                  <option value="fans">Existing Fans</option>
                  <option value="educational">Educational Market</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowCreateTrailer(false)}
                className="px-3 py-1 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTrailer}
                disabled={!newTrailer.title || !newTrailer.videoUrl}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Trailer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {trailers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <Film className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Trailers Yet</h4>
              <p className="text-gray-600 mb-4">Create or generate trailers to promote your documentary</p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setShowCreateTrailer(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Create Manually
                </button>
                <button
                  onClick={handleGenerateTrailer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate with AI
                </button>
              </div>
            </div>
          ) : (
            trailers.map(trailer => (
              <div key={trailer.id} className="border rounded-lg overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  {trailer.thumbnailUrl ? (
                    <img 
                      src={trailer.thumbnailUrl} 
                      alt={trailer.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="p-3 bg-black bg-opacity-70 text-white rounded-full hover:bg-opacity-80">
                      <Play className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                    {formatTime(trailer.duration)}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900">{trailer.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{trailer.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                      {trailer.type}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onTrailerDelete(trailer.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {trailers.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3">Trailer Performance</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trailer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Click-Through
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shares
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trailers.map(trailer => (
                  <tr key={trailer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded">
                          {trailer.thumbnailUrl ? (
                            <img 
                              src={trailer.thumbnailUrl} 
                              alt={trailer.title} 
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center">
                              <Film className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{trailer.title}</div>
                          <div className="text-xs text-gray-500">{trailer.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{trailer.metrics.views.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{(trailer.metrics.clickThroughRate * 100).toFixed(1)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{trailer.metrics.shareRate.toFixed(2)}x</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{trailer.metrics.likes} likes, {trailer.metrics.comments} comments</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderSocialTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Social Media Content</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateSocial(true)}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Manual</span>
          </button>
          
          <button
            onClick={handleGenerateSocialContent}
            disabled={isGenerating}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>AI Generate</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {showCreateSocial ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-3">Create Social Media Content</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newSocial.title}
                onChange={(e) => setNewSocial(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Behind the Scenes, Key Moment"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newSocial.description}
                onChange={(e) => setNewSocial(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Caption or description for social media..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media URL
              </label>
              <input
                type="text"
                value={newSocial.mediaUrl}
                onChange={(e) => setNewSocial(prev => ({ ...prev, mediaUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/media.jpg"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Type
                </label>
                <select
                  value={newSocial.type}
                  onChange={(e) => setNewSocial(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="quote">Quote</option>
                  <option value="article">Article</option>
                  <option value="infographic">Infographic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  value={newSocial.platform}
                  onChange={(e) => setNewSocial(prev => ({ ...prev, platform: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowCreateSocial(false)}
                className="px-3 py-1 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSocialContent}
                disabled={!newSocial.title || !newSocial.mediaUrl}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Content
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {socialContent.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <Share2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Social Content Yet</h4>
              <p className="text-gray-600 mb-4">Create or generate social media content to promote your documentary</p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setShowCreateSocial(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Create Manually
                </button>
                <button
                  onClick={handleGenerateSocialContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate with AI
                </button>
              </div>
            </div>
          ) : (
            socialContent.map(content => (
              <div key={content.id} className="border rounded-lg overflow-hidden">
                <div className="relative aspect-square bg-gray-100">
                  {content.thumbnailUrl ? (
                    <img 
                      src={content.thumbnailUrl} 
                      alt={content.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {content.type === 'image' ? (
                        <Image className="w-12 h-12 text-gray-300" />
                      ) : content.type === 'video' ? (
                        <Film className="w-12 h-12 text-gray-300" />
                      ) : (
                        <FileText className="w-12 h-12 text-gray-300" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded capitalize">
                    {content.platform}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900">{content.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{content.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                      {content.type}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSocialContentDelete(content.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {socialContent.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3">Content Calendar</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publish Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {socialContent.map((content, index) => {
                  // Generate a fake publish date for demo purposes
                  const publishDate = new Date();
                  publishDate.setDate(publishDate.getDate() + index * 2);
                  
                  return (
                    <tr key={content.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded">
                            {content.thumbnailUrl ? (
                              <img 
                                src={content.thumbnailUrl} 
                                alt={content.title} 
                                className="h-10 w-10 rounded object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 flex items-center justify-center">
                                {content.type === 'image' ? (
                                  <Image className="w-5 h-5 text-gray-400" />
                                ) : content.type === 'video' ? (
                                  <Film className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <FileText className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{content.title}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{content.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {content.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{content.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{publishDate.toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{index === 0 ? 'Published' : index === 1 ? 'Scheduled' : 'Draft'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {content.metrics.impressions.toLocaleString()} impressions
                        </div>
                        <div className="text-xs text-gray-500">
                          {(content.metrics.engagement * 100).toFixed(1)}% engagement
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderPitchTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Pitch Materials</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreatePitch(true)}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Manual</span>
          </button>
          
          <button
            onClick={handleGeneratePitchMaterial}
            disabled={isGenerating}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>AI Generate</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {showCreatePitch ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-3">Create Pitch Material</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newPitch.title}
                onChange={(e) => setNewPitch(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Festival Pitch Deck, One-Sheet"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newPitch.description}
                onChange={(e) => setNewPitch(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of this material..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File URL
              </label>
              <input
                type="text"
                value={newPitch.fileUrl}
                onChange={(e) => setNewPitch(prev => ({ ...prev, fileUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/pitch-deck.pdf"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material Type
                </label>
                <select
                  value={newPitch.type}
                  onChange={(e) => setNewPitch(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="deck">Pitch Deck</option>
                  <option value="one-sheet">One-Sheet</option>
                  <option value="treatment">Treatment</option>
                  <option value="budget">Budget</option>
                  <option value="lookbook">Lookbook</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newPitch.status}
                  onChange={(e) => setNewPitch(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="review">In Review</option>
                  <option value="final">Final</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowCreatePitch(false)}
                className="px-3 py-1 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePitchMaterial}
                disabled={!newPitch.title || !newPitch.fileUrl}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Material
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {pitchMaterials.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Pitch Materials Yet</h4>
              <p className="text-gray-600 mb-4">Create or generate pitch materials for festivals and distributors</p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setShowCreatePitch(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Create Manually
                </button>
                <button
                  onClick={handleGeneratePitchMaterial}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate with AI
                </button>
              </div>
            </div>
          ) : (
            pitchMaterials.map(material => (
              <div key={material.id} className="border rounded-lg overflow-hidden">
                <div className="relative aspect-[4/3] bg-gray-100">
                  {material.thumbnailUrl ? (
                    <img 
                      src={material.thumbnailUrl} 
                      alt={material.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {material.type === 'deck' ? (
                        <Presentation className="w-12 h-12 text-gray-300" />
                      ) : material.type === 'one-sheet' ? (
                        <FileText className="w-12 h-12 text-gray-300" />
                      ) : (
                        <FileText className="w-12 h-12 text-gray-300" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded capitalize">
                    {material.type.replace('-', ' ')}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900">{material.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{material.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      material.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      material.status === 'review' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {material.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onPitchMaterialDelete(material.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {pitchMaterials.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3">Pitch Strategy</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <h5 className="font-medium text-blue-900">Festival Deadlines</h5>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-blue-800">Sundance Film Festival</span>
                    <span className="text-blue-600 font-medium">Sep 15, 2023</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-blue-800">SXSW Film Festival</span>
                    <span className="text-blue-600 font-medium">Nov 10, 2023</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-blue-800">Hot Docs</span>
                    <span className="text-blue-600 font-medium">Jan 5, 2024</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <h5 className="font-medium text-green-900">Target Distributors</h5>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-green-800">PBS</span>
                    <span className="text-green-600 font-medium">High Match</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-green-800">Netflix</span>
                    <span className="text-green-600 font-medium">Medium Match</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-green-800">HBO</span>
                    <span className="text-green-600 font-medium">Medium Match</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <h5 className="font-medium text-purple-900">Audience Segments</h5>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-purple-800">Documentary Enthusiasts</span>
                    <span className="text-purple-600 font-medium">Primary</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-purple-800">Subject Matter Fans</span>
                    <span className="text-purple-600 font-medium">Primary</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-purple-800">Educational Market</span>
                    <span className="text-purple-600 font-medium">Secondary</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Recommended Next Steps</h5>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li className="text-gray-700">Finalize pitch deck with latest festival selections</li>
                <li className="text-gray-700">Prepare submission packages for upcoming festival deadlines</li>
                <li className="text-gray-700">Schedule meetings with top 3 distributors</li>
                <li className="text-gray-700">Create targeted social media campaign for primary audience segments</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Marketing Material Generator</h2>
          <p className="text-sm text-gray-600">Create trailers, social content, and pitch materials</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {[
            { id: 'trailers', label: 'Trailers & Teasers', icon: Film },
            { id: 'social', label: 'Social Media', icon: Share2 },
            { id: 'pitch', label: 'Pitch Materials', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'trailers' && renderTrailersTab()}
        {activeTab === 'social' && renderSocialTab()}
        {activeTab === 'pitch' && renderPitchTab()}
      </div>

      {/* Features */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Film className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Trailer Generation</h4>
              <p className="text-sm text-gray-600">Create compelling trailers from your documentary</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <Share2 className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Social Content</h4>
              <p className="text-sm text-gray-600">Generate platform-specific promotional materials</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Pitch Materials</h4>
              <p className="text-sm text-gray-600">Create professional pitch decks and one-sheets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock components
const Play = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Presentation = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);