import React, { useState } from 'react';
import { StoryboardFrame } from '../types/storyboard';
import { StoryboardCanvas } from './StoryboardCanvas';
import { 
  Edit, 
  Copy, 
  Trash2, 
  Play, 
  Clock, 
  Camera,
  Volume2,
  ArrowRight
} from 'lucide-react';

interface StoryboardGridProps {
  frames: StoryboardFrame[];
  onFrameEdit: (frame: StoryboardFrame) => void;
  onFrameDelete: (frameId: string) => void;
  onFrameDuplicate: (frame: StoryboardFrame) => void;
  onFrameReorder: (fromIndex: number, toIndex: number) => void;
}

export const StoryboardGrid: React.FC<StoryboardGridProps> = ({
  frames,
  onFrameEdit,
  onFrameDelete,
  onFrameDuplicate,
  onFrameReorder
}) => {
  const [draggedFrame, setDraggedFrame] = useState<number | null>(null);
  const [dragOverFrame, setDragOverFrame] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedFrame(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverFrame(index);
  };

  const handleDragEnd = () => {
    if (draggedFrame !== null && dragOverFrame !== null && draggedFrame !== dragOverFrame) {
      onFrameReorder(draggedFrame, dragOverFrame);
    }
    setDraggedFrame(null);
    setDragOverFrame(null);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toFixed(1).padStart(4, '0')}`;
  };

  const getTotalDuration = (): string => {
    const total = frames.reduce((sum, frame) => sum + frame.duration, 0);
    return formatDuration(total);
  };

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">{frames.length} Frames</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Total: {getTotalDuration()}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Drag frames to reorder • Click to edit
          </div>
        </div>
      </div>

      {/* Frames Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {frames.map((frame, index) => (
          <div
            key={frame.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`bg-white rounded-lg border-2 transition-all duration-200 cursor-move ${
              dragOverFrame === index ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
            } ${draggedFrame === index ? 'opacity-50' : ''}`}
          >
            {/* Frame Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 truncate">{frame.title}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  #{index + 1}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{frame.description}</p>
            </div>

            {/* Canvas Preview */}
            <div className="p-4">
              <div className="relative mb-4">
                <div className="transform scale-50 origin-top-left" style={{ width: '200%', height: '200%' }}>
                  <StoryboardCanvas
                    frame={frame}
                    onFrameUpdate={() => {}}
                    isEditing={false}
                  />
                </div>
              </div>

              {/* Frame Details */}
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Camera className="w-3 h-3" />
                    <span>{frame.shotType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(frame.duration)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>{frame.cameraAngle.replace('-', ' ')}</span>
                  {frame.cameraMovement !== 'static' && (
                    <span className="text-green-600">{frame.cameraMovement.replace('-', ' ')}</span>
                  )}
                </div>

                {frame.voiceover.text && (
                  <div className="flex items-center space-x-1">
                    <Volume2 className="w-3 h-3" />
                    <span className="truncate">{frame.voiceover.text.substring(0, 30)}...</span>
                  </div>
                )}

                {frame.transition !== 'cut' && (
                  <div className="flex items-center space-x-1">
                    <ArrowRight className="w-3 h-3" />
                    <span>{frame.transition.replace('-', ' ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Frame Actions */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onFrameEdit(frame)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit Frame"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onFrameDuplicate(frame)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    title="Duplicate Frame"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onFrameDelete(frame.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Frame"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-xs text-gray-500">
                  {frame.characters.length} chars • {frame.audioCues.length} audio
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {frames.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No frames yet</h3>
          <p className="text-gray-600">Create your first storyboard frame to get started</p>
        </div>
      )}
    </div>
  );
};