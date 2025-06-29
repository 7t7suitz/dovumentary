import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle, BookOpen } from 'lucide-react';

interface StoryUploadProps {
  onStoryAnalyzed: (analysis: any) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const StoryUpload: React.FC<StoryUploadProps> = ({
  onStoryAnalyzed,
  isProcessing,
  setIsProcessing
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        processFile(file);
      }
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        processFile(file);
      }
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return false;
    }
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
      setError('Please upload a valid document file (TXT, PDF, DOC, DOCX)');
      return false;
    }
    
    return true;
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadedFiles(prev => [...prev, file]);

    try {
      const text = await readFileAsText(file);
      const { StoryAnalyzer } = await import('../utils/storyAnalyzer');
      const analysis = await StoryAnalyzer.analyzeStory(file.name, text);
      onStoryAnalyzed(analysis);
    } catch (err) {
      setError('Failed to process story. Please try again.');
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const processTextInput = async () => {
    if (!textInput.trim()) {
      setError('Please enter some story content');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { StoryAnalyzer } = await import('../utils/storyAnalyzer');
      const analysis = await StoryAnalyzer.analyzeStory('Text Input', textInput);
      onStoryAnalyzed(analysis);
      setTextInput('');
    } catch (err) {
      setError('Failed to analyze story. Please try again.');
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const exampleStories = [
    "Sarah had always dreamed of becoming a doctor, but when her father fell ill, she had to choose between medical school and saving the family farm. The decision would change everything.",
    "Detective Martinez thought he'd seen it all until the serial killer started leaving clues that pointed directly to his own past. Each victim brought him closer to a truth he wasn't ready to face.",
    "When the last library on Earth was scheduled for demolition, Maya discovered that the books contained more than just stories—they held the memories of humanity itself.",
    "After inheriting his grandmother's antique shop, Tom found a music box that played a melody he'd never heard before. But every time it played, someone from his past would appear at his door."
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Story Structure Analysis</h2>
          <p className="text-sm text-gray-600">Upload your story or paste text to analyze narrative structure</p>
        </div>
      </div>

      {/* Text Input Option */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste Your Story Text
        </label>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Paste your story content here for immediate analysis..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          disabled={isProcessing}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            {textInput.length} characters • Minimum 500 characters recommended
          </span>
          <button
            onClick={processTextInput}
            disabled={isProcessing || textInput.length < 100}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isProcessing ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or upload a file</span>
        </div>
      </div>

      {/* File Upload */}
      <div
        className={`mt-6 relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept=".txt,.doc,.docx,.pdf"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <Upload className={`w-12 h-12 ${dragActive ? 'text-indigo-500' : 'text-gray-400'}`} />
          <div>
            <p className="text-lg font-medium text-gray-900">
              {dragActive ? 'Drop your story here' : 'Upload Story Document'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop or click to select files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports TXT, PDF, DOC, DOCX (max 10MB)
            </p>
          </div>
        </div>
        
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
              <span className="text-sm font-medium text-gray-700">Analyzing story structure...</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Analyzed Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Analyzed
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Stories */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
          Try these example stories:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exampleStories.map((story, index) => (
            <button
              key={index}
              onClick={() => setTextInput(story)}
              className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              disabled={isProcessing}
            >
              <p className="text-sm text-gray-700 line-clamp-3">{story}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};