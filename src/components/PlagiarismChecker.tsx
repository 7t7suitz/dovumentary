import React, { useState } from 'react';
import { PlagiarismCheckResult, PlagiarismMatch, ResearchDocument } from '../types/research';
import { 
  Search, 
  AlertTriangle, 
  Check, 
  ExternalLink, 
  Copy, 
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Percent
} from 'lucide-react';

interface PlagiarismCheckerProps {
  document: ResearchDocument;
  onCheckPlagiarism: (documentId: string) => Promise<PlagiarismCheckResult>;
}

export const PlagiarismChecker: React.FC<PlagiarismCheckerProps> = ({
  document,
  onCheckPlagiarism
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<PlagiarismCheckResult | null>(null);
  const [expandedMatches, setExpandedMatches] = useState<Set<string>>(new Set());

  const handleCheckPlagiarism = async () => {
    setIsChecking(true);
    
    try {
      // In a real implementation, this would call an API
      // For demo purposes, we'll simulate a delay and generate mock results
      const result = await onCheckPlagiarism(document.id);
      setCheckResult(result);
    } catch (error) {
      console.error('Plagiarism check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const toggleMatchExpanded = (matchId: string) => {
    const newExpanded = new Set(expandedMatches);
    if (newExpanded.has(matchId)) {
      newExpanded.delete(matchId);
    } else {
      newExpanded.add(matchId);
    }
    setExpandedMatches(newExpanded);
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity > 0.8) return 'text-red-600';
    if (similarity > 0.5) return 'text-amber-600';
    return 'text-green-600';
  };

  const getSimilarityBgColor = (similarity: number) => {
    if (similarity > 0.8) return 'bg-red-100';
    if (similarity > 0.5) return 'bg-amber-100';
    return 'bg-green-100';
  };

  const getSimilarityLabel = (similarity: number) => {
    if (similarity > 0.8) return 'High similarity';
    if (similarity > 0.5) return 'Moderate similarity';
    return 'Low similarity';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Plagiarism Checker</h2>
          <p className="text-sm text-gray-600">Verify content originality and find similar sources</p>
        </div>
      </div>

      {/* Document Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3 mb-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
        </div>
        <p className="text-gray-600 mb-3">
          {document.content.substring(0, 200)}...
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{document.content.split(/\s+/).length} words</span>
          <span>Uploaded on {formatDate(document.uploadDate)}</span>
        </div>
      </div>

      {/* Check Controls */}
      <div className="mb-6">
        <button
          onClick={handleCheckPlagiarism}
          disabled={isChecking}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChecking ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Checking for Plagiarism...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Check for Plagiarism</span>
            </>
          )}
        </button>
        
        <p className="text-sm text-gray-600 mt-2 text-center">
          Our system will compare your document against millions of sources to detect potential plagiarism
        </p>
      </div>

      {/* Results */}
      {checkResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="p-4 rounded-lg border" style={{ borderColor: checkResult.overallSimilarity > 0.3 ? '#f59e0b' : '#10b981' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Similarity Report</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Generated on {formatDate(checkResult.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {checkResult.overallSimilarity > 0.3 ? (
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                ) : (
                  <Check className="w-6 h-6 text-green-500" />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">
                    {checkResult.overallSimilarity > 0.3 ? 'Potential similarity detected' : 'Low similarity detected'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {checkResult.overallSimilarity > 0.3 
                      ? 'Your document contains content that matches other sources'
                      : 'Your document appears to be mostly original'}
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: checkResult.overallSimilarity > 0.3 ? '#f59e0b' : '#10b981' }}>
                  {Math.round(checkResult.overallSimilarity * 100)}%
                </div>
                <div className="text-sm text-gray-600">Similarity</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${checkResult.overallSimilarity * 100}%`,
                  backgroundColor: checkResult.overallSimilarity > 0.3 ? '#f59e0b' : '#10b981'
                }}
              ></div>
            </div>
          </div>

          {/* Matches */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detected Matches ({checkResult.matches.length})
            </h3>
            
            {checkResult.matches.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h4>
                <p className="text-gray-600">Your document appears to be original</p>
              </div>
            ) : (
              <div className="space-y-4">
                {checkResult.matches.map((match) => (
                  <div 
                    key={match.id} 
                    className={`border rounded-lg ${getSimilarityBgColor(match.similarity)} border-gray-200`}
                  >
                    <div 
                      className="p-4 flex items-start justify-between cursor-pointer"
                      onClick={() => toggleMatchExpanded(match.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          <Percent className={`w-5 h-5 ${getSimilarityColor(match.similarity)}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">Match in {match.matchedSource.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSimilarityBgColor(match.similarity)} ${getSimilarityColor(match.similarity)}`}>
                              {Math.round(match.similarity * 100)}% match
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{getSimilarityLabel(match.similarity)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {expandedMatches.has(match.id) ? 
                          <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        }
                      </div>
                    </div>
                    
                    {expandedMatches.has(match.id) && (
                      <div className="px-4 pb-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Your Text</h5>
                            <div className="p-3 bg-white rounded border border-gray-300">
                              <p className="text-gray-800">{match.text}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Matched Source</h5>
                            <div className="p-3 bg-white rounded border border-gray-300">
                              <p className="text-gray-800">{match.text}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Source Information</h5>
                              <p className="text-sm text-gray-600">
                                {match.matchedSource.type.replace(/-/g, ' ')} • 
                                {match.matchedSource.authors.join(', ')} • 
                                {match.matchedSource.publicationDate && formatDate(match.matchedSource.publicationDate)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(match.text);
                                  // Show a toast or notification
                                }}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                title="Copy Text"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              
                              {match.matchedSource.url && (
                                <a
                                  href={match.matchedSource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                                  title="View Source"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          {checkResult.overallSimilarity > 0.3 && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                Recommendations
              </h3>
              
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-xs font-medium">1</span>
                  </div>
                  <p className="text-gray-700">Review highlighted sections and consider rewriting in your own words</p>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-xs font-medium">2</span>
                  </div>
                  <p className="text-gray-700">Add proper citations for any direct quotes or paraphrased content</p>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-xs font-medium">3</span>
                  </div>
                  <p className="text-gray-700">Use the citation manager to create proper references for all sources</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Features */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Content Comparison</h4>
              <p className="text-sm text-gray-600">Checks against millions of sources for matching content</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Percent className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Similarity Analysis</h4>
              <p className="text-sm text-gray-600">Provides detailed similarity scores and context</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Citation Assistance</h4>
              <p className="text-sm text-gray-600">Helps create proper citations for referenced sources</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};