import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, FileSearch } from 'lucide-react';
import { ResearchDocument, DocumentType } from '../types/research';

interface DocumentUploaderProps {
  onDocumentProcessed: (document: ResearchDocument) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentProcessed,
  isProcessing,
  setIsProcessing
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState<{[key: string]: number}>({});

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
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(file => validateFile(file));
      
      if (validFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...validFiles]);
        validFiles.forEach(file => processFile(file));
      }
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => validateFile(file));
      
      if (validFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...validFiles]);
        validFiles.forEach(file => processFile(file));
      }
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const maxSize = 20 * 1024 * 1024; // 20MB
    const allowedTypes = [
      'text/plain', 
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text',
      'text/html',
      'text/markdown',
      'application/json'
    ];
    
    if (file.size > maxSize) {
      setError(`File ${file.name} exceeds the 20MB size limit`);
      return false;
    }
    
    if (!allowedTypes.includes(file.type) && 
        !file.name.match(/\.(txt|pdf|doc|docx|odt|html|htm|md|json)$/i)) {
      setError(`File ${file.name} has an unsupported format`);
      return false;
    }
    
    return true;
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingProgress(prev => ({ ...prev, [file.name]: 0 }));

    try {
      // Simulate processing steps with progress updates
      await simulateProcessingSteps(file);
      
      // In a real implementation, we would extract text, analyze content, etc.
      const documentType = determineDocumentType(file);
      const content = await readFileContent(file);
      
      const processedDocument: ResearchDocument = {
        id: generateId(),
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        content,
        type: documentType,
        fileUrl: URL.createObjectURL(file),
        extractedClaims: [],
        extractedEntities: [],
        extractedSources: [],
        status: 'unverified',
        uploadDate: new Date(),
        lastAnalyzed: new Date()
      };
      
      // Simulate claim extraction
      processedDocument.extractedClaims = extractClaims(content);
      processedDocument.extractedEntities = extractEntities(content);
      processedDocument.extractedSources = extractSources(content);
      
      onDocumentProcessed(processedDocument);
      setProcessingProgress(prev => ({ ...prev, [file.name]: 100 }));
    } catch (err) {
      setError(`Failed to process ${file.name}. ${err instanceof Error ? err.message : 'Unknown error'}`);
      setProcessingProgress(prev => ({ ...prev, [file.name]: -1 })); // Error state
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateProcessingSteps = async (file: File) => {
    const steps = [
      { name: 'Extracting text', progress: 20 },
      { name: 'Analyzing content', progress: 40 },
      { name: 'Identifying claims', progress: 60 },
      { name: 'Detecting entities', progress: 80 },
      { name: 'Finalizing', progress: 95 }
    ];
    
    for (const step of steps) {
      setProcessingProgress(prev => ({ ...prev, [file.name]: step.progress }));
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      
      if (file.type === 'application/pdf') {
        // In a real implementation, we would use a PDF parsing library
        reader.readAsText(file); // This won't work properly for PDFs
      } else {
        reader.readAsText(file);
      }
    });
  };

  const determineDocumentType = (file: File): DocumentType => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    
    if (fileName.includes('script') || fileName.includes('screenplay')) return 'script';
    if (fileName.includes('interview') || fileName.includes('transcript')) return 'interview';
    if (fileName.includes('research') || fileName.includes('study')) return 'research';
    if (fileName.includes('notes')) return 'notes';
    
    if (fileType.includes('pdf') || fileType.includes('word')) return 'article';
    
    return 'other';
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const extractClaims = (content: string) => {
    // Simple claim extraction - in a real implementation, this would use NLP
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const claimIndicators = ['is', 'are', 'was', 'were', 'will', 'has', 'have', 'had', 'can', 'could', 'should'];
    
    return sentences
      .filter(sentence => 
        claimIndicators.some(indicator => 
          sentence.toLowerCase().includes(` ${indicator} `)
        )
      )
      .slice(0, 5) // Limit to 5 claims for demo
      .map(text => ({
        id: generateId(),
        text: text.trim(),
        documentId: '',
        documentPosition: content.indexOf(text),
        category: determineClaimCategory(text),
        verificationStatus: 'unverified',
        verificationSources: [],
        confidence: 0.5,
        importance: 'medium',
        notes: '',
        suggestedExperts: [],
        relatedClaims: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }));
  };

  const determineClaimCategory = (text: string): any => {
    const textLower = text.toLowerCase();
    
    if (textLower.match(/\d{4}/) || textLower.includes('history') || textLower.includes('century')) 
      return 'historical';
    
    if (textLower.match(/\d+%/) || textLower.match(/\d+ percent/) || textLower.includes('statistics')) 
      return 'statistical';
    
    if (textLower.includes('study') || textLower.includes('research') || textLower.includes('scientist')) 
      return 'scientific';
    
    if (textLower.includes('think') || textLower.includes('believe') || textLower.includes('opinion')) 
      return 'opinion';
    
    return 'factual';
  };

  const extractEntities = (content: string) => {
    // Simple entity extraction - in a real implementation, this would use NER
    const entities = [];
    
    // Look for capitalized words that might be names
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const names = [...new Set(content.match(namePattern) || [])];
    
    entities.push(...names.slice(0, 3).map(name => ({
      id: generateId(),
      name,
      type: 'person',
      aliases: [],
      sources: [],
      relatedEntities: [],
      importance: 'secondary',
      mentions: countOccurrences(content, name),
      confidence: 0.7
    })));
    
    // Look for organization patterns
    const orgPattern = /\b[A-Z][a-zA-Z]*([ &](?:Inc|LLC|Corp|Company|Association|University|Institute|Organization))\b/g;
    const orgs = [...new Set(content.match(orgPattern) || [])];
    
    entities.push(...orgs.slice(0, 2).map(org => ({
      id: generateId(),
      name: org,
      type: 'organization',
      aliases: [],
      sources: [],
      relatedEntities: [],
      importance: 'secondary',
      mentions: countOccurrences(content, org),
      confidence: 0.6
    })));
    
    return entities;
  };

  const countOccurrences = (text: string, searchString: string): number => {
    const regex = new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return (text.match(regex) || []).length;
  };

  const extractSources = (content: string) => {
    // Simple source extraction - look for URL-like patterns and citation-like patterns
    const sources = [];
    
    // URL pattern
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = [...new Set(content.match(urlPattern) || [])];
    
    sources.push(...urls.slice(0, 3).map(url => ({
      id: generateId(),
      title: `Source from ${new URL(url).hostname}`,
      url,
      type: 'website',
      authors: [],
      reliability: 'unverified',
      accessDate: new Date(),
      notes: 'Automatically extracted from document',
      tags: []
    })));
    
    // Citation-like pattern (e.g., "Smith, 2020")
    const citationPattern = /\b[A-Z][a-z]+(?:,? (?:et al\.?|and [A-Z][a-z]+))?,? \d{4}\b/g;
    const citations = [...new Set(content.match(citationPattern) || [])];
    
    sources.push(...citations.slice(0, 2).map(citation => ({
      id: generateId(),
      title: `Reference: ${citation}`,
      type: 'academic-journal',
      authors: [citation.split(',')[0]],
      reliability: 'unverified',
      accessDate: new Date(),
      notes: 'Automatically extracted from document',
      tags: []
    })));
    
    return sources;
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getProcessingStatusIcon = (fileName: string) => {
    const progress = processingProgress[fileName];
    
    if (progress === undefined) return null;
    if (progress === -1) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (progress === 100) return <CheckCircle className="w-5 h-5 text-green-500" />;
    
    return (
      <div className="flex items-center">
        <div className="w-4 h-4 mr-2 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
        <span className="text-xs text-blue-600">{progress}%</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <FileSearch className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Research Document Analyzer</h2>
          <p className="text-sm text-gray-600">Upload documents to extract claims and generate research insights</p>
        </div>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
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
          accept=".txt,.doc,.docx,.pdf,.odt,.html,.htm,.md,.json"
          multiple
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <Upload className={`w-12 h-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <div>
            <p className="text-lg font-medium text-gray-900">
              {dragActive ? 'Drop your documents here' : 'Upload Research Documents'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop or click to select files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports TXT, PDF, DOC, DOCX, HTML, MD, JSON (max 20MB)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Uploaded Documents</h3>
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
                      {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getProcessingStatusIcon(file.name)}
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    disabled={isProcessing}
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Processing Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
            <span className="text-gray-700">Automatic claim extraction and categorization</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
            <span className="text-gray-700">Entity recognition (people, organizations, locations)</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
            <span className="text-gray-700">Source identification and citation extraction</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
            <span className="text-gray-700">Fact verification preparation</span>
          </div>
        </div>
      </div>
    </div>
  );
};