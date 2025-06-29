import React, { useState, useEffect } from 'react';
import { Script, ScriptAnalysis, ScriptSuggestion } from '../types/script';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  Book
} from 'lucide-react';

interface ScriptAnalyzerProps {
  script: Script;
  onScriptUpdate: (script: Script) => void;
}

export const ScriptAnalyzer: React.FC<ScriptAnalyzerProps> = ({
  script,
  onScriptUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'readability' | 'pacing' | 'dialogue' | 'suggestions'>('readability');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['readability', 'suggestions']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleApplySuggestion = (suggestion: ScriptSuggestion) => {
    // In a real implementation, this would modify the script based on the suggestion
    const updatedSuggestions = script.analysis.suggestions.map(s => 
      s.id === suggestion.id ? { ...s, accepted: true } : s
    );
    
    onScriptUpdate({
      ...script,
      analysis: {
        ...script.analysis,
        suggestions: updatedSuggestions
      }
    });
  };

  const handleDismissSuggestion = (suggestion: ScriptSuggestion) => {
    const updatedSuggestions = script.analysis.suggestions.map(s => 
      s.id === suggestion.id ? { ...s, dismissed: true } : s
    );
    
    onScriptUpdate({
      ...script,
      analysis: {
        ...script.analysis,
        suggestions: updatedSuggestions
      }
    });
  };

  const getReadabilityColor = (score: number) => {
    if (score > 80) return 'text-green-600';
    if (score > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadabilityLabel = (grade: number) => {
    if (grade <= 6) return 'Easy to read';
    if (grade <= 10) return 'Average difficulty';
    if (grade <= 14) return 'Fairly difficult';
    return 'Difficult';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const tabs = [
    { id: 'readability', label: 'Readability', icon: Book },
    { id: 'pacing', label: 'Pacing', icon: TrendingUp },
    { id: 'dialogue', label: 'Dialogue', icon: MessageSquare },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb }
  ];

  const renderReadabilityTab = () => (
    <div className="space-y-6">
      {/* Readability Scores */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('readability')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Book className="w-5 h-5 mr-2 text-blue-600" />
            Readability Analysis
          </h3>
          {expandedSections.has('readability') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>

        {expandedSections.has('readability') && (
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Flesch Reading Ease</h4>
                <div className="text-3xl font-bold mb-1 flex items-center">
                  <span className={getReadabilityColor(script.analysis.readability.fleschReadingEase)}>
                    {Math.round(script.analysis.readability.fleschReadingEase)}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">/100</span>
                </div>
                <p className="text-sm text-blue-700">
                  {script.analysis.readability.fleschReadingEase > 80 ? 'Easy to read' : 
                   script.analysis.readability.fleschReadingEase > 60 ? 'Fairly easy to read' : 
                   script.analysis.readability.fleschReadingEase > 40 ? 'Somewhat difficult' : 
                   'Difficult to read'}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Grade Level</h4>
                <div className="text-3xl font-bold mb-1">
                  <span className={getReadabilityColor(100 - script.analysis.readability.fleschKincaidGrade * 10)}>
                    {Math.round(script.analysis.readability.fleschKincaidGrade)}
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  {getReadabilityLabel(script.analysis.readability.fleschKincaidGrade)}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Estimated Time</h4>
                <div className="text-3xl font-bold mb-1">
                  {formatTime(script.analysis.readability.readingTime)}
                </div>
                <p className="text-sm text-purple-700">
                  Reading time: {formatTime(script.analysis.readability.readingTime)}<br />
                  Speaking time: {formatTime(script.analysis.readability.speakingTime)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Detailed Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Words per Sentence</span>
                    <span className="text-sm font-medium text-gray-900">
                      {script.analysis.readability.averageWordsPerSentence.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        script.analysis.readability.averageWordsPerSentence < 15 ? 'bg-green-500' :
                        script.analysis.readability.averageWordsPerSentence < 20 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(script.analysis.readability.averageWordsPerSentence / 30 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {script.analysis.readability.averageWordsPerSentence < 15 ? 'Good - Easy to follow' :
                     script.analysis.readability.averageWordsPerSentence < 20 ? 'Average - Moderately complex' :
                     'Long - Consider simplifying'}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Syllables per Word</span>
                    <span className="text-sm font-medium text-gray-900">
                      {script.analysis.readability.averageSyllablesPerWord.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        script.analysis.readability.averageSyllablesPerWord < 1.5 ? 'bg-green-500' :
                        script.analysis.readability.averageSyllablesPerWord < 1.8 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(script.analysis.readability.averageSyllablesPerWord / 2.5 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {script.analysis.readability.averageSyllablesPerWord < 1.5 ? 'Good - Simple vocabulary' :
                     script.analysis.readability.averageSyllablesPerWord < 1.8 ? 'Average - Balanced vocabulary' :
                     'Complex - Consider simpler words'}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Complex Words</span>
                    <span className="text-sm font-medium text-gray-900">
                      {script.analysis.readability.complexWords}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        script.analysis.readability.complexWords < 50 ? 'bg-green-500' :
                        script.analysis.readability.complexWords < 100 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(script.analysis.readability.complexWords / 200 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {script.analysis.readability.complexWords < 50 ? 'Good - Few complex words' :
                     script.analysis.readability.complexWords < 100 ? 'Average - Some complex words' :
                     'Many - Consider simplifying vocabulary'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Readability Recommendations</h4>
              </div>
              <ul className="space-y-2">
                {script.analysis.readability.averageWordsPerSentence > 20 && (
                  <li className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs">1</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Consider breaking longer sentences into shorter ones to improve readability.
                    </p>
                  </li>
                )}
                {script.analysis.readability.averageSyllablesPerWord > 1.8 && (
                  <li className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs">2</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Use simpler words with fewer syllables to make your script more accessible.
                    </p>
                  </li>
                )}
                <li className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">3</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    For voiceover narration, aim for a Flesch Reading Ease score above 70 for better comprehension.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPacingTab = () => (
    <div className="space-y-6">
      {/* Pacing Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('pacing')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Pacing Analysis
          </h3>
          {expandedSections.has('pacing') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>

        {expandedSections.has('pacing') && (
          <div className="mt-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Overall Pacing</h4>
                <p className="text-sm text-gray-600">
                  {script.analysis.pacing.overallPacing === 'slow' ? 'Slow - Consider tightening scenes' :
                   script.analysis.pacing.overallPacing === 'moderate' ? 'Moderate - Well-balanced pacing' :
                   script.analysis.pacing.overallPacing === 'fast' ? 'Fast - High energy, quick progression' :
                   'Varied - Mix of fast and slow sections'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                script.analysis.pacing.overallPacing === 'moderate' ? 'bg-green-100 text-green-800' :
                script.analysis.pacing.overallPacing === 'varied' ? 'bg-blue-100 text-blue-800' :
                script.analysis.pacing.overallPacing === 'slow' ? 'bg-yellow-100 text-yellow-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {script.analysis.pacing.overallPacing}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Dialogue to Action Ratio</h4>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${Math.min(script.analysis.pacing.dialogueToActionRatio / (script.analysis.pacing.dialogueToActionRatio + 1) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Dialogue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-700">Action</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {script.analysis.pacing.dialogueToActionRatio.toFixed(1)}:1
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {script.analysis.pacing.dialogueToActionRatio > 3 ? 'Dialogue-heavy - Consider adding more action' :
                 script.analysis.pacing.dialogueToActionRatio < 0.5 ? 'Action-heavy - Consider adding more dialogue' :
                 'Well-balanced ratio of dialogue to action'}
              </p>
            </div>

            {/* Pacing Issues */}
            {script.analysis.pacing.pacingIssues.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Pacing Issues</h4>
                <div className="space-y-3">
                  {script.analysis.pacing.pacingIssues.map((issue, index) => (
                    <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                      issue.severity === 'high' ? 'border-red-500 bg-red-50' :
                      issue.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 capitalize">
                          {issue.type.replace(/-/g, ' ')}
                        </h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                          issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{issue.suggestion}</p>
                      <div className="text-xs text-gray-500">
                        Location: {issue.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scene Breakdown */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Scene Pacing</h4>
              <div className="space-y-2">
                {script.analysis.pacing.sceneBreakdown.map((scene, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      scene.pacing === 'slow' ? 'bg-yellow-500' :
                      scene.pacing === 'moderate' ? 'bg-green-500' :
                      'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">Scene {scene.sceneId}</span>
                        <span className="text-sm text-gray-500">{formatTime(scene.estimatedTime / 60)}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{scene.wordCount} words</span>
                        <span>{scene.dialoguePercentage}% dialogue</span>
                        <span>{scene.actionPercentage}% action</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      scene.pacing === 'moderate' ? 'bg-green-100 text-green-800' :
                      scene.pacing === 'slow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {scene.pacing}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDialogueTab = () => (
    <div className="space-y-6">
      {/* Dialogue Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('dialogue')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
            Dialogue Analysis
          </h3>
          {expandedSections.has('dialogue') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>

        {expandedSections.has('dialogue') && (
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Dialogue Lines</h4>
                <div className="text-3xl font-bold text-purple-900">
                  {script.analysis.dialogue.totalLines}
                </div>
                <p className="text-sm text-purple-700">
                  Average length: {Math.round(script.analysis.dialogue.averageLineLength)} chars
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Naturalness</h4>
                <div className="text-3xl font-bold text-blue-900">
                  {Math.round(script.analysis.dialogue.naturalness * 100)}%
                </div>
                <p className="text-sm text-blue-700">
                  {script.analysis.dialogue.naturalness > 0.7 ? 'Sounds natural and conversational' :
                   script.analysis.dialogue.naturalness > 0.5 ? 'Somewhat natural, could improve' :
                   'Needs work to sound more natural'}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Distinctiveness</h4>
                <div className="text-3xl font-bold text-green-900">
                  {Math.round(script.analysis.dialogue.distinctiveness * 100)}%
                </div>
                <p className="text-sm text-green-700">
                  {script.analysis.dialogue.distinctiveness > 0.7 ? 'Characters have unique voices' :
                   script.analysis.dialogue.distinctiveness > 0.5 ? 'Some character voice distinction' :
                   'Characters sound too similar'}
                </p>
              </div>
            </div>

            {/* Character Voices */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Character Voices</h4>
              <div className="space-y-3">
                {script.analysis.dialogue.characterVoices.map((character, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{character.character}</h5>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Distinctiveness:</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              character.distinctiveness > 0.7 ? 'bg-green-500' :
                              character.distinctiveness > 0.5 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${character.distinctiveness * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Vocabulary:</span>
                        <p className="text-gray-600">
                          {character.vocabulary.complexity > 0.7 ? 'Complex' :
                           character.vocabulary.complexity > 0.5 ? 'Moderate' :
                           'Simple'} ({character.vocabulary.uniqueWords} unique words)
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Formality:</span>
                        <p className="text-gray-600">
                          {character.vocabulary.formalityLevel > 0.7 ? 'Formal' :
                           character.vocabulary.formalityLevel > 0.5 ? 'Neutral' :
                           'Casual'}
                        </p>
                      </div>
                    </div>
                    
                    {character.speechPatterns.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs font-medium text-gray-700">Speech Patterns:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {character.speechPatterns.map((pattern, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {pattern}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dialogue Issues */}
            {script.analysis.dialogue.dialogueIssues.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Dialogue Issues</h4>
                <div className="space-y-3">
                  {script.analysis.dialogue.dialogueIssues.map((issue, index) => (
                    <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                      issue.severity === 'high' ? 'border-red-500 bg-red-50' :
                      issue.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 capitalize">
                          {issue.type.replace(/-/g, ' ')}
                          {issue.character && ` (${issue.character})`}
                        </h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                          issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                        <p className="text-sm text-gray-700 italic">"{issue.line}"</p>
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong>Suggestion:</strong> {issue.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSuggestionsTab = () => (
    <div className="space-y-6">
      {/* AI Suggestions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('suggestions')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
            AI Improvement Suggestions
          </h3>
          {expandedSections.has('suggestions') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>

        {expandedSections.has('suggestions') && (
          <div className="mt-4 space-y-4">
            {script.analysis.suggestions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Suggestions</h4>
                <p className="text-gray-600">Your script looks good! No improvement suggestions at this time.</p>
              </div>
            ) : (
              script.analysis.suggestions
                .filter(s => !s.accepted && !s.dismissed)
                .map((suggestion) => (
                  <div key={suggestion.id} className={`border-l-4 p-4 rounded-r-lg ${
                    suggestion.priority === 'critical' ? 'border-red-500 bg-red-50' :
                    suggestion.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                    suggestion.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <span className="capitalize">{suggestion.type}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                          suggestion.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          suggestion.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {suggestion.priority}
                        </span>
                      </h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApplySuggestion(suggestion)}
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Apply"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDismissSuggestion(suggestion)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Dismiss"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h5 className="font-medium text-gray-800 mb-2">{suggestion.title}</h5>
                    <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>
                    
                    <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                      <p className="text-sm text-gray-700">
                        <strong>Implementation:</strong> {suggestion.implementation}
                      </p>
                    </div>
                    
                    {suggestion.examples.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-700">Examples:</span>
                        <ul className="mt-1 space-y-1">
                          {suggestion.examples.map((example, idx) => (
                            <li key={idx} className="text-xs text-gray-600">• {example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
            )}
            
            {/* Accepted Suggestions */}
            {script.analysis.suggestions.filter(s => s.accepted).length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Applied Suggestions
                </h4>
                <div className="space-y-2">
                  {script.analysis.suggestions
                    .filter(s => s.accepted)
                    .map((suggestion) => (
                      <div key={suggestion.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                          <span className="text-xs text-green-600">Applied</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'suggestions' && script.analysis.suggestions.filter(s => !s.accepted && !s.dismissed).length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {script.analysis.suggestions.filter(s => !s.accepted && !s.dismissed).length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'readability' && renderReadabilityTab()}
        {activeTab === 'pacing' && renderPacingTab()}
        {activeTab === 'dialogue' && renderDialogueTab()}
        {activeTab === 'suggestions' && renderSuggestionsTab()}
      </div>
    </div>
  );
};