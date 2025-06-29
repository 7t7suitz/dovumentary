import React, { useState } from 'react';
import { DocumentaryVersion, SceneReference } from '../types/preview';
import ReactPlayer from 'react-player';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Settings,
  Download,
  Share2,
  MessageSquare,
  Clock,
  Film,
  Scissors,
  Wand2,
  Plus
} from 'lucide-react';

interface PreviewGeneratorProps {
  versions: DocumentaryVersion[];
  onVersionCreate: (version: DocumentaryVersion) => void;
  onVersionUpdate: (version: DocumentaryVersion) => void;
}

export const PreviewGenerator: React.FC<PreviewGeneratorProps> = ({
  versions,
  onVersionCreate,
  onVersionUpdate
}) => {
  const [currentVersion, setCurrentVersion] = useState<DocumentaryVersion | null>(
    versions.length > 0 ? versions[0] : null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [showCreateVersion, setShowCreateVersion] = useState(false);
  const [newVersionData, setNewVersionData] = useState({
    name: '',
    description: '',
    videoUrl: ''
  });

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentVersion) {
      const seekTime = parseFloat(e.target.value) * currentVersion.duration;
      setCurrentTime(seekTime);
      return seekTime;
    }
    return 0;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateVersion = () => {
    if (!newVersionData.name || !newVersionData.videoUrl) return;

    const newVersion: DocumentaryVersion = {
      id: Math.random().toString(36).substring(2, 9),
      name: newVersionData.name,
      description: newVersionData.description,
      videoUrl: newVersionData.videoUrl,
      thumbnailUrl: '', // Would be generated from video
      duration: 0, // Would be extracted from video
      status: 'draft',
      scenes: [],
      feedback: [],
      metrics: {
        views: 0,
        completionRate: 0,
        averageWatchTime: 0,
        engagementScore: 0,
        dropOffPoints: [],
        emotionalResponseData: [],
        demographicBreakdown: []
      },
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onVersionCreate(newVersion);
    setCurrentVersion(newVersion);
    setShowCreateVersion(false);
    setNewVersionData({
      name: '',
      description: '',
      videoUrl: ''
    });
  };

  const handleGenerateAIVersion = async () => {
    if (!currentVersion) return;

    // Simulate AI processing
    setIsPlaying(false);
    
    try {
      // In a real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const aiVersion: DocumentaryVersion = {
        ...currentVersion,
        id: Math.random().toString(36).substring(2, 9),
        name: `${currentVersion.name} - AI Enhanced`,
        description: 'Automatically optimized version with improved pacing and engagement',
        status: 'draft',
        feedback: [],
        metrics: {
          ...currentVersion.metrics,
          views: 0,
          completionRate: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      onVersionCreate(aiVersion);
      setCurrentVersion(aiVersion);
    } catch (error) {
      console.error('Failed to generate AI version:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Film className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Preview Generator</h2>
          <p className="text-sm text-gray-600">Create and test interactive documentary previews</p>
        </div>
      </div>

      {/* Version Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Documentary Versions</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCreateVersion(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Version</span>
            </button>
            
            <button
              onClick={handleGenerateAIVersion}
              disabled={!currentVersion}
              className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className="w-4 h-4" />
              <span>AI Optimize</span>
            </button>
          </div>
        </div>
        
        {showCreateVersion ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-3">Create New Version</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version Name
                </label>
                <input
                  type="text"
                  value={newVersionData.name}
                  onChange={(e) => setNewVersionData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Director's Cut, Festival Version"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newVersionData.description}
                  onChange={(e) => setNewVersionData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of this version..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL
                </label>
                <input
                  type="text"
                  value={newVersionData.videoUrl}
                  onChange={(e) => setNewVersionData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/video.mp4 or YouTube URL"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowCreateVersion(false)}
                  className="px-3 py-1 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateVersion}
                  disabled={!newVersionData.name || !newVersionData.videoUrl}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Version
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {versions.length === 0 ? (
              <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                <Film className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Versions Yet</h4>
                <p className="text-gray-600 mb-4">Create your first documentary version to get started</p>
                <button
                  onClick={() => setShowCreateVersion(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Version
                </button>
              </div>
            ) : (
              versions.map(version => (
                <div 
                  key={version.id} 
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    currentVersion?.id === version.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentVersion(version)}
                >
                  <div className="relative aspect-video bg-gray-100">
                    {version.thumbnailUrl ? (
                      <img 
                        src={version.thumbnailUrl} 
                        alt={version.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                      {formatTime(version.duration)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900">{version.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        version.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        version.status === 'review' ? 'bg-blue-100 text-blue-800' :
                        version.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {version.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(version.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Video Preview */}
      {currentVersion && (
        <div className="mb-6">
          <div className="bg-black rounded-lg overflow-hidden">
            <ReactPlayer
              url={currentVersion.videoUrl}
              width="100%"
              height="auto"
              playing={isPlaying}
              volume={isMuted ? 0 : volume}
              playbackRate={playbackRate}
              onProgress={handleProgress}
              progressInterval={500}
              style={{ aspectRatio: '16/9' }}
              controls={false}
            />
          </div>
          
          {/* Custom Controls */}
          <div className="bg-gray-900 text-white p-4 rounded-b-lg">
            {/* Progress Bar */}
            <div className="mb-2 flex items-center space-x-2">
              <span className="text-xs">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={currentVersion.duration ? currentTime / currentVersion.duration : 0}
                onChange={handleSeek}
                className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
              />
              <span className="text-xs">{formatTime(currentVersion.duration)}</span>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handlePlayPause}
                  className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-200"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setCurrentTime(Math.min(currentVersion.duration, currentTime + 10))}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleMuteToggle}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="relative group">
                  <button className="p-1 text-gray-400 hover:text-white">
                    <Settings className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="p-2">
                      <div className="text-xs text-gray-400 mb-1">Playback Speed</div>
                      <div className="grid grid-cols-4 gap-1">
                        {[0.5, 1, 1.5, 2].map(rate => (
                          <button
                            key={rate}
                            onClick={() => handlePlaybackRateChange(rate)}
                            className={`px-2 py-1 text-xs rounded ${
                              playbackRate === rate ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="p-1 text-gray-400 hover:text-white">
                  <Download className="w-5 h-5" />
                </button>
                
                <button className="p-1 text-gray-400 hover:text-white">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Version Info */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentVersion.name}</h3>
            <p className="text-gray-600 mb-4">{currentVersion.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-1">Views</div>
                <div className="text-xl font-bold text-blue-700">{currentVersion.metrics.views}</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-green-900 mb-1">Completion Rate</div>
                <div className="text-xl font-bold text-green-700">{(currentVersion.metrics.completionRate * 100).toFixed(1)}%</div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-purple-900 mb-1">Avg. Watch Time</div>
                <div className="text-xl font-bold text-purple-700">{formatTime(currentVersion.metrics.averageWatchTime)}</div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-yellow-900 mb-1">Engagement</div>
                <div className="text-xl font-bold text-yellow-700">{(currentVersion.metrics.engagementScore * 100).toFixed(1)}%</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>Collect Feedback</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                <Scissors className="w-4 h-4" />
                <span>Edit Version</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                <Clock className="w-4 h-4" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Film className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Interactive Previews</h4>
              <p className="text-sm text-gray-600">Create and share interactive rough cuts</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Feedback Collection</h4>
              <p className="text-sm text-gray-600">Gather and analyze audience responses</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">AI Optimization</h4>
              <p className="text-sm text-gray-600">Automatically enhance engagement and pacing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};