import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Video, FileText, Music, X, CheckCircle, AlertCircle } from 'lucide-react';
import { MediaFile } from '../types/media';
import { MediaProcessor } from '../utils/mediaProcessor';

interface MediaUploadProps {
  onMediaUploaded: (media: MediaFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onMediaUploaded,
  maxFiles = 50,
  acceptedTypes = ['image/*', 'video/*', 'audio/*']
}) => {
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  interface UploadItem {
    id: string;
    file: File;
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress: number;
    result?: MediaFile;
    error?: string;
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newItems: UploadItem[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0
    }));

    setUploadQueue(prev => [...prev, ...newItems]);
    setIsProcessing(true);

    // Initialize Face API
    await MediaProcessor.initializeFaceAPI();

    // Process files
    const processedMedia: MediaFile[] = [];
    
    for (const item of newItems) {
      try {
        setUploadQueue(prev => prev.map(i => 
          i.id === item.id ? { ...i, status: 'processing', progress: 50 } : i
        ));

        const mediaData = await MediaProcessor.processMediaFile(item.file);
        const media = mediaData as MediaFile;
        
        setUploadQueue(prev => prev.map(i => 
          i.id === item.id ? { ...i, status: 'completed', progress: 100, result: media } : i
        ));

        processedMedia.push(media);
      } catch (error) {
        setUploadQueue(prev => prev.map(i => 
          i.id === item.id ? { 
            ...i, 
            status: 'error', 
            progress: 0, 
            error: error instanceof Error ? error.message : 'Processing failed' 
          } : i
        ));
      }
    }

    setIsProcessing(false);
    if (processedMedia.length > 0) {
      onMediaUploaded(processedMedia);
    }
  }, [onMediaUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    multiple: true
  });

  const removeFromQueue = (id: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setUploadQueue(prev => prev.filter(item => item.status !== 'completed'));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (file.type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getStatusIcon = (status: UploadItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full"></div>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? 'Drop files here' : 'Upload Media Files'}
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop your images, videos, and audio files, or click to browse
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Image className="w-4 h-4" />
            <span>Images</span>
          </div>
          <div className="flex items-center space-x-1">
            <Video className="w-4 h-4" />
            <span>Videos</span>
          </div>
          <div className="flex items-center space-x-1">
            <Music className="w-4 h-4" />
            <span>Audio</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Max {maxFiles} files • Supports JPG, PNG, MP4, MOV, MP3, WAV
        </p>
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Upload Queue ({uploadQueue.length} files)
            </h3>
            <div className="flex items-center space-x-2">
              {uploadQueue.some(item => item.status === 'completed') && (
                <button
                  onClick={clearCompleted}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear Completed
                </button>
              )}
              {isProcessing && (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span>Processing...</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {uploadQueue.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {getFileIcon(item.file)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.file.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(item.file.size)}
                    </span>
                  </div>
                  
                  {item.status === 'processing' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {item.error && (
                    <p className="text-xs text-red-600 mt-1">{item.error}</p>
                  )}
                  
                  {item.result && (
                    <div className="text-xs text-gray-600 mt-1">
                      <span>Processed • </span>
                      <span>{item.result.tags.length} tags • </span>
                      <span>{item.result.faces.length} faces detected</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <button
                    onClick={() => removeFromQueue(item.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">AI Processing Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Automatic tagging and categorization</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Face detection and recognition</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Quality and composition analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Documentary value assessment</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Metadata extraction and organization</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Automatic thumbnail generation</span>
          </div>
        </div>
      </div>
    </div>
  );
};