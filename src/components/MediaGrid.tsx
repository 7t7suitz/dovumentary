import React, { useState } from 'react';
import { MediaFile } from '../types/media';
import { MediaCard } from './MediaCard';
import { MediaViewer } from './MediaViewer';
import { FixedSizeGrid as Grid } from 'react-window';

interface MediaGridProps {
  media: MediaFile[];
  viewMode: 'grid' | 'list';
  selectedMedia: string[];
  onMediaSelect: (mediaId: string, selected: boolean) => void;
  onMediaUpdate: (media: MediaFile[]) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  viewMode,
  selectedMedia,
  onMediaSelect,
  onMediaUpdate
}) => {
  const [viewerMedia, setViewerMedia] = useState<MediaFile | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (mediaItem: MediaFile) => {
    const index = media.findIndex(item => item.id === mediaItem.id);
    setViewerIndex(index);
    setViewerMedia(mediaItem);
  };

  const closeViewer = () => {
    setViewerMedia(null);
  };

  const navigateViewer = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, viewerIndex - 1)
      : Math.min(media.length - 1, viewerIndex + 1);
    
    setViewerIndex(newIndex);
    setViewerMedia(media[newIndex]);
  };

  if (viewMode === 'list') {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
            <div className="col-span-1">Select</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-1">Size</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Quality</div>
            <div className="col-span-1">Actions</div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {media.map((item) => (
              <MediaCard
                key={item.id}
                media={item}
                viewMode="list"
                selected={selectedMedia.includes(item.id)}
                onSelect={(selected) => onMediaSelect(item.id, selected)}
                onView={() => openViewer(item)}
              />
            ))}
          </div>
        </div>

        {viewerMedia && (
          <MediaViewer
            media={viewerMedia}
            isOpen={true}
            onClose={closeViewer}
            onPrevious={() => navigateViewer('prev')}
            onNext={() => navigateViewer('next')}
            canNavigate={{
              prev: viewerIndex > 0,
              next: viewerIndex < media.length - 1
            }}
          />
        )}
      </div>
    );
  }

  // Grid view with virtualization for performance
  const CARD_WIDTH = 280;
  const CARD_HEIGHT = 320;
  const PADDING = 16;

  const getColumnCount = (containerWidth: number) => {
    return Math.floor((containerWidth - PADDING) / (CARD_WIDTH + PADDING));
  };

  const GridCell = ({ columnIndex, rowIndex, style, data }: any) => {
    const { media, columnCount } = data;
    const index = rowIndex * columnCount + columnIndex;
    const item = media[index];

    if (!item) return null;

    return (
      <div style={style}>
        <div style={{ padding: PADDING / 2 }}>
          <MediaCard
            media={item}
            viewMode="grid"
            selected={selectedMedia.includes(item.id)}
            onSelect={(selected) => onMediaSelect(item.id, selected)}
            onView={() => openViewer(item)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {media.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <div className="h-full p-4">
          <Grid
            height={window.innerHeight - 200}
            width={window.innerWidth - (showFilters || showCollections ? 320 : 0) - 32}
            columnCount={(containerWidth: number) => getColumnCount(containerWidth)}
            columnWidth={CARD_WIDTH + PADDING}
            rowCount={Math.ceil(media.length / getColumnCount(window.innerWidth - 320))}
            rowHeight={CARD_HEIGHT + PADDING}
            itemData={{
              media,
              columnCount: getColumnCount(window.innerWidth - 320)
            }}
          >
            {GridCell}
          </Grid>
        </div>
      )}

      {viewerMedia && (
        <MediaViewer
          media={viewerMedia}
          isOpen={true}
          onClose={closeViewer}
          onPrevious={() => navigateViewer('prev')}
          onNext={() => navigateViewer('next')}
          canNavigate={{
            prev: viewerIndex > 0,
            next: viewerIndex < media.length - 1
          }}
        />
      )}
    </div>
  );
};