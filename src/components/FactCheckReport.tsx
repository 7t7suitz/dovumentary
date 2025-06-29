import React, { useState } from 'react';
import { FactCheckReport, ClaimAssessment, Claim, VerificationSource } from '../types/research';
import { 
  FileText, 
  Check, 
  X, 
  AlertTriangle, 
  HelpCircle, 
  Download, 
  Printer,
  ChevronDown,
  ChevronRight,
  Edit3,
  ExternalLink,
  Copy,
  Share2
} from 'lucide-react';

interface FactCheckReportProps {
  report: FactCheckReport;
  onReportUpdate?: (report: FactCheckReport) => void;
  onExport?: (format: 'pdf' | 'docx' | 'html') => void;
}

export const FactCheckReportComponent: React.FC<FactCheckReportProps> = ({
  report,
  onReportUpdate,
  onExport
}) => {
  const [expandedClaims, setExpandedClaims] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const [editedSummary, setEditedSummary] = useState(report.summary);
  const [editedRecommendations, setEditedRecommendations] = useState(report.recommendations);

  const toggleClaimExpanded = (claimId: string) => {
    const newExpanded = new Set(expandedClaims);
    if (newExpanded.has(claimId)) {
      newExpanded.delete(claimId);
    } else {
      newExpanded.add(claimId);
    }
    setExpandedClaims(newExpanded);
  };

  const handleSaveEdits = () => {
    if (onReportUpdate) {
      onReportUpdate({
        ...report,
        summary: editedSummary,
        recommendations: editedRecommendations,
        updatedAt: new Date()
      });
    }
    setEditMode(false);
  };

  const getAssessmentColor = (assessment: string) => {
    switch (assessment) {
      case 'true':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'mostly-true':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'partially-true':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inconclusive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'mostly-false':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'false':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAssessmentIcon = (assessment: string) => {
    switch (assessment) {
      case 'true':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'mostly-true':
        return <Check className="w-5 h-5 text-green-400" />;
      case 'partially-true':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'inconclusive':
        return <HelpCircle className="w-5 h-5 text-gray-500" />;
      case 'mostly-false':
        return <X className="w-5 h-5 text-red-400" />;
      case 'false':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Report Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{report.title}</h2>
              <p className="text-sm text-gray-600">
                Created {formatDate(report.createdAt)} • Last updated {formatDate(report.updatedAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-3 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdits}
                  className="px-3 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                  title="Edit Report"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onExport && onExport('pdf')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onExport && onExport('docx')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                  title="Print Report"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {/* Share functionality */}}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                  title="Share Report"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="px-4 py-2 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Overall Accuracy</div>
            <div className="text-2xl font-bold text-blue-600">{Math.round(report.overallAccuracy * 100)}%</div>
          </div>
          
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Claims Assessed</div>
            <div className="text-2xl font-bold text-gray-900">{report.claims.length}</div>
          </div>
          
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Sources Referenced</div>
            <div className="text-2xl font-bold text-gray-900">
              {new Set(report.claims.flatMap(c => 
                [...c.supportingEvidence, ...c.contradictingEvidence].map(e => e.sourceId)
              )).size}
            </div>
          </div>
        </div>
        
        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Executive Summary</h3>
          {editMode ? (
            <textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          ) : (
            <p className="text-gray-700">{report.summary}</p>
          )}
        </div>
      </div>

      {/* Claims Assessment */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Assessment</h3>
        
        <div className="space-y-4">
          {report.claims.map((assessment) => (
            <div 
              key={assessment.claim.id} 
              className={`border rounded-lg ${getAssessmentColor(assessment.assessment)}`}
            >
              <div 
                className="p-4 flex items-start justify-between cursor-pointer"
                onClick={() => toggleClaimExpanded(assessment.claim.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getAssessmentIcon(assessment.assessment)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{assessment.claim.text}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAssessmentColor(assessment.assessment)}`}>
                        {assessment.assessment.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{assessment.explanation.substring(0, 120)}...</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-sm text-gray-500">
                    {assessment.supportingEvidence.length + assessment.contradictingEvidence.length} sources
                  </span>
                  {expandedClaims.has(assessment.claim.id) ? 
                    <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  }
                </div>
              </div>
              
              {expandedClaims.has(assessment.claim.id) && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Full Explanation</h5>
                    <p className="text-gray-700">{assessment.explanation}</p>
                  </div>
                  
                  {assessment.suggestedRevision && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-1">Suggested Revision</h5>
                      <p className="text-gray-700">{assessment.suggestedRevision}</p>
                      <div className="flex justify-end mt-2">
                        <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800">
                          <Copy className="w-4 h-4" />
                          <span>Copy Revision</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Supporting Evidence */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-1" />
                        Supporting Evidence ({assessment.supportingEvidence.length})
                      </h5>
                      
                      {assessment.supportingEvidence.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No supporting evidence found</p>
                      ) : (
                        <div className="space-y-2">
                          {assessment.supportingEvidence.map((evidence, index) => (
                            <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-100">
                              <div className="flex items-start justify-between mb-1">
                                <p className="text-sm font-medium text-gray-900">Source {index + 1}</p>
                                <span className="text-xs text-gray-500">
                                  Relevance: {Math.round(evidence.relevance * 100)}%
                                </span>
                              </div>
                              {evidence.excerpts.map((excerpt, i) => (
                                <p key={i} className="text-sm text-gray-600 italic">"{excerpt}"</p>
                              ))}
                              <div className="flex justify-end mt-2">
                                <a href="#" className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Source
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Contradicting Evidence */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <X className="w-4 h-4 text-red-500 mr-1" />
                        Contradicting Evidence ({assessment.contradictingEvidence.length})
                      </h5>
                      
                      {assessment.contradictingEvidence.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No contradicting evidence found</p>
                      ) : (
                        <div className="space-y-2">
                          {assessment.contradictingEvidence.map((evidence, index) => (
                            <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-100">
                              <div className="flex items-start justify-between mb-1">
                                <p className="text-sm font-medium text-gray-900">Source {index + 1}</p>
                                <span className="text-xs text-gray-500">
                                  Relevance: {Math.round(evidence.relevance * 100)}%
                                </span>
                              </div>
                              {evidence.excerpts.map((excerpt, i) => (
                                <p key={i} className="text-sm text-gray-600 italic">"{excerpt}"</p>
                              ))}
                              <div className="flex justify-end mt-2">
                                <a href="#" className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Source
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">Confidence Level</h5>
                      <span className="text-sm font-medium text-blue-600">
                        {Math.round(assessment.confidenceLevel * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${assessment.confidenceLevel * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        
        {editMode ? (
          <div className="space-y-2">
            {editedRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={recommendation}
                  onChange={(e) => {
                    const newRecommendations = [...editedRecommendations];
                    newRecommendations[index] = e.target.value;
                    setEditedRecommendations(newRecommendations);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    setEditedRecommendations(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              onClick={() => setEditedRecommendations(prev => [...prev, ''])}
              className="px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 w-full text-center"
            >
              + Add Recommendation
            </button>
          </div>
        ) : (
          <ul className="space-y-2">
            {report.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                </div>
                <p className="text-gray-700">{recommendation}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};