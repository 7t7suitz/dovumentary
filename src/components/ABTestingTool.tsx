import React, { useState } from 'react';
import { Script, ABTestVersion } from '../types/script';
import { ScriptProcessor } from '../utils/scriptProcessor';
import { 
  Split, 
  BarChart2, 
  Users, 
  MessageSquare, 
  Star, 
  Check,
  Play,
  Shuffle,
  Copy,
  Edit3,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface ABTestingToolProps {
  script: Script;
  onVersionSelect: (version: Script) => void;
}

export const ABTestingTool: React.FC<ABTestingToolProps> = ({
  script,
  onVersionSelect
}) => {
  const [testVersions, setTestVersions] = useState<ABTestVersion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [testSettings, setTestSettings] = useState({
    variations: 3,
    focusAreas: ['dialogue', 'voiceover', 'pacing'],
    variationTypes: ['formal', 'casual', 'concise']
  });

  const toggleVersionExpanded = (versionId: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId);
    } else {
      newExpanded.add(versionId);
    }
    setExpandedVersions(newExpanded);
  };

  const handleGenerateVariations = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const versions = ScriptProcessor.generateABTestVersions(script, testSettings.variations);
      setTestVersions(versions);
      
      // Auto-expand the first version
      if (versions.length > 0) {
        setExpandedVersions(new Set([versions[0].id]));
      }
    } catch (error) {
      console.error('Failed to generate variations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectVersion = (version: ABTestVersion) => {
    setSelectedVersion(version.id);
    onVersionSelect(version.script);
  };

  const handleAddFeedback = (versionId: string, rating: number, comment: string) => {
    setTestVersions(prev => prev.map(version => 
      version.id === versionId ? 
        {
          ...version,
          feedback: [
            ...version.feedback,
            {
              id: Math.random().toString(36).substr(2, 9),
              participant: 'Test User',
              rating,
              comments: comment,
              categories: [],
              timestamp: new Date()
            }
          ],
          metrics: {
            ...version.metrics,
            participantCount: version.metrics.participantCount + 1,
            overallScore: (version.metrics.overallScore * version.metrics.participantCount + rating) / (version.metrics.participantCount + 1)
          }
        } : 
        version
    ));
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Split className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">A/B Testing Tool</h2>
          <p className="text-sm text-gray-600">Generate and test multiple script variations</p>
        </div>
      </div>

      {/* Test Settings */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Test Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Variations
            </label>
            <select
              value={testSettings.variations}
              onChange={(e) => setTestSettings(prev => ({ ...prev, variations: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={2}>2 Variations</option>
              <option value={3}>3 Variations</option>
              <option value={4}>4 Variations</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Focus Areas
            </label>
            <div className="space-y-2">
              {['dialogue', 'voiceover', 'pacing', 'structure'].map(area => (
                <label key={area} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={testSettings.focusAreas.includes(area)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTestSettings(prev => ({
                          ...prev,
                          focusAreas: [...prev.focusAreas, area]
                        }));
                      } else {
                        setTestSettings(prev => ({
                          ...prev,
                          focusAreas: prev.focusAreas.filter(a => a !== area)
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{area}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variation Types
            </label>
            <div className="space-y-2">
              {[
                { id: 'formal', label: 'More Formal' },
                { id: 'casual', label: 'More Casual' },
                { id: 'concise', label: 'More Concise' },
                { id: 'detailed', label: 'More Detailed' }
              ].map(type => (
                <label key={type.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={testSettings.variationTypes.includes(type.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTestSettings(prev => ({
                          ...prev,
                          variationTypes: [...prev.variationTypes, type.id]
                        }));
                      } else {
                        setTestSettings(prev => ({
                          ...prev,
                          variationTypes: prev.variationTypes.filter(t => t !== type.id)
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleGenerateVariations}
          disabled={isGenerating}
          className="mt-4 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:from-indigo-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Variations...</span>
            </>
          ) : (
            <>
              <Shuffle className="w-5 h-5" />
              <span>Generate Script Variations</span>
            </>
          )}
        </button>
      </div>

      {/* Test Versions */}
      {testVersions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Versions</h3>
          
          <div className="space-y-4">
            {testVersions.map((version) => (
              <div 
                key={version.id} 
                className={`border rounded-lg transition-all duration-200 ${
                  selectedVersion === version.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleVersionExpanded(version.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedVersion === version.id ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {version.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{version.name}</h4>
                      <p className="text-sm text-gray-500">{version.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{version.metrics.participantCount}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className={`text-sm font-medium ${getScoreColor(version.metrics.overallScore)}`}>
                        {version.metrics.overallScore.toFixed(1)}
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectVersion(version);
                      }}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedVersion === version.id ? 
                          'bg-indigo-600 text-white' : 
                          'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedVersion === version.id ? 'Selected' : 'Select'}
                    </button>
                    
                    {expandedVersions.has(version.id) ? 
                      <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    }
                  </div>
                </div>
                
                {expandedVersions.has(version.id) && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Version Preview */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Preview</h5>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                          {version.script.content.slice(0, 5).map((element, idx) => (
                            <div key={idx} className="mb-3">
                              <div className="text-xs text-gray-500 uppercase mb-1">{element.type}</div>
                              <div className="text-sm text-gray-700">{element.content}</div>
                            </div>
                          ))}
                          {version.script.content.length > 5 && (
                            <div className="text-center text-sm text-gray-500 mt-2">
                              ... and {version.script.content.length - 5} more elements
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3">
                          <button
                            onClick={() => handleSelectVersion(version)}
                            className="flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => {/* Copy logic */}}
                            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Duplicate</span>
                          </button>
                          
                          <button
                            onClick={() => {/* Preview logic */}}
                            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                          >
                            <Play className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Feedback */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Feedback</h5>
                        {version.feedback.length === 0 ? (
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">No feedback yet</p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {version.feedback.map((feedback, idx) => (
                              <div key={idx} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-900">{feedback.participant}</span>
                                  <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <Star 
                                        key={star} 
                                        className={`w-4 h-4 ${star <= feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">{feedback.comments}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Add Feedback Form */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h6 className="text-sm font-medium text-gray-900 mb-2">Add Feedback</h6>
                          <div className="space-y-3">
                            <div className="flex items-center justify-center">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  className="p-1"
                                  onClick={() => {
                                    // Rating logic
                                  }}
                                >
                                  <Star className="w-6 h-6 text-gray-300 hover:text-yellow-400" />
                                </button>
                              ))}
                            </div>
                            <textarea
                              placeholder="Add your feedback comments..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              rows={2}
                            />
                            <button
                              onClick={() => {
                                const textarea = document.querySelector('textarea');
                                if (textarea) {
                                  handleAddFeedback(version.id, 4, textarea.value);
                                  textarea.value = '';
                                }
                              }}
                              className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                            >
                              Submit Feedback
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Chart */}
      {testVersions.length > 0 && testVersions.some(v => v.metrics.participantCount > 0) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="h-64">
              {/* Chart would be rendered here */}
              <div className="h-full flex items-center justify-center">
                <BarChart2 className="w-12 h-12 text-gray-300" />
                <span className="ml-3 text-gray-500">Comparison chart would render here</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              {testVersions.map((version) => (
                <div key={version.id} className="text-center">
                  <div className="font-medium text-gray-900">{version.name}</div>
                  <div className={`text-2xl font-bold ${getScoreColor(version.metrics.overallScore)}`}>
                    {version.metrics.overallScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {version.metrics.participantCount} {version.metrics.participantCount === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Split className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Multiple Versions</h4>
              <p className="text-sm text-gray-600">Generate and test different script variations</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Audience Feedback</h4>
              <p className="text-sm text-gray-600">Collect and analyze viewer responses</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Performance Metrics</h4>
              <p className="text-sm text-gray-600">Compare version effectiveness with data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};