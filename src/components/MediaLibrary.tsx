import React, { useState, useMemo } from 'react';
import { MediaFile, SearchFilters, MediaCollection } from '../types/media';
import { MediaGrid } from './MediaGrid';
import { MediaSearch } from './MediaSearch';
import { MediaFilters } from './MediaFilters';
import { CollectionManager } from './CollectionManager';
import { BatchOperations } from './BatchOperations';
import { 
  Grid, 
  List, 
  Filter, 
  Search, 
  FolderOpen, 
  Settings,
  Download,
  Upload,
  MoreVertical
} from 'lucide-react';

interface MediaLibraryProps {
  media: MediaFile[];
  collections: MediaCollection[];
  onMediaUpdate: (media: MediaFile[]) => void;
  onCollectionUpdate: (collections: MediaCollection[]) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  media,
  collections,
  onMediaUpdate,
  onCollectionUpdate
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    mediaTypes: [],
    tags: [],
    people: [],
    locations: [],
    collections: [],
    hasLocation: false,
    hasFaces: false,
    processingStatus: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [showBatchOps, setShowBatchOps] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'quality'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and search media
  const filteredMedia = useMemo(() => {
    let result = [...media];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.analysis.aiDescription.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.name.toLowerCase().includes(query)) ||
        item.faces.some(face => face.personName?.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.mediaTypes.length > 0) {
      result = result.filter(item => filters.mediaTypes.includes(item.type));
    }

    if (filters.tags.length > 0) {
      result = result.filter(item => 
        filters.tags.some(tag => item.tags.some(itemTag => itemTag.name === tag))
      );
    }

    if (filters.people.length > 0) {
      result = result.filter(item => 
        filters.people.some(person => 
          item.faces.some(face => face.personName === person)
        )
      );
    }

    if (filters.collections.length > 0) {
      result = result.filter(item => 
        filters.collections.some(collection => item.collections.includes(collection))
      );
    }

    if (filters.hasLocation) {
      result = result.filter(item => item.metadata.location);
    }

    if (filters.hasFaces) {
      result = result.filter(item => item.faces.length > 0);
    }

    if (filters.dateRange) {
      result = result.filter(item => 
        item.uploadDate >= filters.dateRange!.start &&
        item.uploadDate <= filters.dateRange!.end
      );
    }

    if (filters.quality) {
      result = result.filter(item => 
        item.analysis.quality.overallScore >= filters.quality!.min &&
        item.analysis.quality.overallScore <= filters.quality!.max
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'quality':
          comparison = a.analysis.quality.overallScore - b.analysis.quality.overallScore;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [media, searchQuery, filters, sortBy, sortOrder]);

  const handleMediaSelect = (mediaId: string, selected: boolean) => {
    setSelectedMedia(prev => 
      selected 
        ? [...prev, mediaId]
        : prev.filter(id => id !== mediaId)
    );
  };

  const handleSelectAll = () => {
    setSelectedMedia(filteredMedia.map(item => item.id));
  };

  const handleDeselectAll = () => {
    setSelectedMedia([]);
  };

  const getLibraryStats = () => {
    const totalSize = media.reduce((sum, item) => sum + item.size, 0);
    const mediaByType = media.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCount: media.length,
      totalSize,
      mediaByType,
      selectedCount: selectedMedia.length
    };
  };

  const stats = getLibraryStats();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Media Library</h2>
            <p className="text-sm text-gray-600">
              {stats.totalCount} files • {formatFileSize(stats.totalSize)} • 
              {selectedMedia.length > 0 && ` ${selectedMedia.length} selected`}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCollections(!showCollections)}
              className={`p-2 rounded-lg transition-colors ${
                showCollections ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Collections"
            >
              <FolderOpen className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <MediaSearch
              query={searchQuery}
              onQueryChange={setSearchQuery}
              suggestions={[]}
            />
          </div>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              setSortBy(sort as any);
              setSortOrder(order as any);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="size-desc">Largest First</option>
            <option value="size-asc">Smallest First</option>
            <option value="quality-desc">Best Quality</option>
            <option value="quality-asc">Lowest Quality</option>
          </select>
        </div>

        {/* Selection Actions */}
        {selectedMedia.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedMedia.length} items selected
                </span>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Select All ({filteredMedia.length})
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Deselect All
                </button>
              </div>
              
              <button
                onClick={() => setShowBatchOps(true)}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Batch Actions</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {(showFilters || showCollections) && (
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            {showFilters && (
              <MediaFilters
                filters={filters}
                onFiltersChange={setFilters}
                media={media}
                collections={collections}
              />
            )}
            
            {showCollections && (
              <CollectionManager
                collections={collections}
                media={media}
                selectedMedia={selectedMedia}
                onCollectionUpdate={onCollectionUpdate}
              />
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <MediaGrid
            media={filteredMedia}
            viewMode={viewMode}
            selectedMedia={selectedMedia}
            onMediaSelect={handleMediaSelect}
            onMediaUpdate={onMediaUpdate}
          />
        </div>
      </div>

      {/* Batch Operations Modal */}
      {showBatchOps && (
        <BatchOperations
          selectedMedia={selectedMedia.map(id => media.find(m => m.id === id)!).filter(Boolean)}
          onClose={() => setShowBatchOps(false)}
          onComplete={(results) => {
            setShowBatchOps(false);
            setSelectedMedia([]);
            // Handle batch operation results
          }}
        />
      )}
    </div>
  );
};