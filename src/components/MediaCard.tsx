import React, { useState } from 'react';
import { MediaFile } from '../types/media';
import { 
  Image, 
  Video, 
  Music, 
  FileText, 
  Eye, 
  Download, 
  Share2, 
  MoreVertical,
  Star,
  MapPin,
  Users,
  Calendar,
  Zap
} from 'lucide-react';

interface MediaCardProps {
  media: MediaFile;
  viewMode: 'grid' | 'list';
  selected: boolean;
  onSelect: (selected: boolean) => void;
  onView: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  viewMode,
  selected,
  onSelect,
  onView
}) => {
  const [showActions, setShowActions] = useState(false);

  const getMediaIcon = () => {
    switch (media.type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDocumentaryValueColor = (score: number) => {
    if (score >= 0.8) return 'text-purple-600 bg-purple-100';
    if (score >= 0.6) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (viewMode === 'list') {
    return (
      <div className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors ${
        selected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}>
        <div className="col-span-1 flex items-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        
        <div className="col-span-1 flex items-center">
          <div className="flex items-center space-x-2">
            {getMediaIcon()}
            <span className="text-xs text-gray-500 capitalize">{media.type}</span>
          </div>
        </div>
        
        <div className="col-span-3 flex items-center">
          <div className="flex items-center space-x-3">
            <img
              src={media.thumbnailUrl || media.url}
              alt={media.name}
              className="w-10 h-10 object-cover rounded"
            />
            <div>
              <p className="font-medium text-gray-900 truncate">{media.name}</p>
              <p className="text-xs text-gray-500 truncate">{media.analysis.aiDescription}</p>
            </div>
          </div>
        </div>
        
        <div className="col-span-2 flex items-center">
          <div className="flex flex-wrap gap-1">
            {media.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {tag.name}
              </span>
            ))}
            {media.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{media.tags.length - 3}</span>
            )}
          </div>
        </div>
        
        <div className="col-span-1 flex items-center">
          <span className="text-sm text-gray-600">{formatFileSize(media.size)}</span>
        </div>
        
        <div className="col-span-2 flex items-center">
          <span className="text-sm text-gray-600">{formatDate(media.uploadDate)}</span>
        </div>
        
        <div className="col-span-1 flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            getQualityColor(media.analysis.quality.overallScore)
          }`}>
            {Math.round(media.analysis.quality.overallScore * 100)}%
          </span>
        </div>
        
        <div className="col-span-1 flex items-center">
          <div className="flex items-center space-x-1">
            <button
              onClick={onView}
              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className={`bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
      selected ? 'border-blue-500 shadow-md' : 'border-gray-200'
    }`}>
      {/* Media Preview */}
      <div className="relative">
        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
          <img
            src={media.thumbnailUrl || media.url}
            alt={media.name}
            className="w-full h-full object-cover cursor-pointer"
            onClick={onView}
          />
          
          {/* Overlay Icons */}
          <div className="absolute top-2 left-2 flex items-center space-x-1">
            <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
              {getMediaIcon()}
              <span className="capitalize">{media.type}</span>
            </div>
          </div>
          
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          {/* Quality and Documentary Value Indicators */}
          <div className="absolute bottom-2 left-2 flex items-center space-x-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              getQualityColor(media.analysis.quality.overallScore)
            }`}>
              <Star className="w-3 h-3 inline mr-1" />
              {Math.round(media.analysis.quality.overallScore * 100)}%
            </span>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              getDocumentaryValueColor(media.analysis.documentaryValue.storytellingPotential)
            }`}>
              <Zap className="w-3 h-3 inline mr-1" />
              {Math.round(media.analysis.documentaryValue.storytellingPotential * 100)}%
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-1 opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={onView}
              className="p-1 bg-black bg-opacity-75 text-white rounded hover:bg-opacity-100"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              className="p-1 bg-black bg-opacity-75 text-white rounded hover:bg-opacity-100"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 truncate flex-1" title={media.name}>
            {media.name}
          </h3>
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {media.analysis.aiDescription}
        </p>
        
        {/* Metadata */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(media.uploadDate)}</span>
            </div>
            <span>{formatFileSize(media.size)}</span>
          </div>
          
          {media.metadata.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{media.metadata.location.city || 'Location available'}</span>
            </div>
          )}
          
          {media.faces.length > 0 && (
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{media.faces.length} face{media.faces.length !== 1 ? 's' : ''} detected</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {media.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined }}
              >
                {tag.name}
              </span>
            ))}
            {media.tags.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                +{media.tags.length - 4}
              </span>
            )}
          </div>
        </div>
        
        {/* Documentary Placement Suggestions */}
        {media.analysis.documentaryValue.suggestedPlacement.length > 0 && (
          <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded">
            <p className="text-xs font-medium text-purple-800 mb-1">Suggested for:</p>
            <p className="text-xs text-purple-700">
              {media.analysis.documentaryValue.suggestedPlacement[0].section.replace('-', ' ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};