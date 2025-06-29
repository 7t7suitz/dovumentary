import React, { useState } from 'react';
import { DocumentAnalysis } from '../types/document';
import { 
  FileText, 
  Users, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Tag, 
  MessageSquare, 
  AlertTriangle,
  Film,
  ChevronDown,
  ChevronRight,
  Search,
  Download
} from 'lucide-react';

interface AnalysisResultsProps {
  analysis: DocumentAnalysis;
  onExport?: (format: 'json' | 'pdf' | 'csv') => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, onExport }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['themes']));
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'narrative', label: 'Narrative', icon: TrendingUp },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'questions', label: 'Interview Questions', icon: MessageSquare },
    { id: 'legal', label: 'Legal Review', icon: AlertTriangle },
    { id: 'cinematic', label: 'Cinematic Analysis', icon: Film }
  ];

  const filteredContent = (items: any[], searchField: string) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item[searchField]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Document Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Summary</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Brief Summary</h4>
            <p className="text-gray-600">{analysis.summary.brief}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Detailed Analysis</h4>
            <p className="text-gray-600">{analysis.summary.detailed}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900">Cinematic Potential</h5>
              <div className="flex items-center mt-2">
                <div className="flex-1 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${analysis.summary.cinematicPotential * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium text-blue-900">
                  {Math.round(analysis.summary.cinematicPotential * 100)}%
                </span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900">Genre</h5>
              <p className="text-sm text-green-700 mt-1">
                {analysis.summary.genre.join(', ')}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-medium text-purple-900">Tone</h5>
              <p className="text-sm text-purple-700 mt-1">{analysis.summary.tone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Themes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('themes')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Key Themes ({analysis.themes.length})
          </h3>
          {expandedSections.has('themes') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.has('themes') && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.themes.map((theme) => (
              <div key={theme.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{theme.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    theme.relevance === 'high' ? 'bg-red-100 text-red-800' :
                    theme.relevance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {theme.relevance}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {theme.occurrences} mentions • {Math.round(theme.confidence * 100)}% confidence
                </p>
                {theme.context.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">Context:</p>
                    <p className="text-xs text-gray-600 italic">
                      "{theme.context[0].substring(0, 100)}..."
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Characters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('characters')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Characters ({analysis.characters.length})
          </h3>
          {expandedSections.has('characters') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.has('characters') && (
          <div className="mt-4 space-y-3">
            {analysis.characters.map((character) => (
              <div key={character.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{character.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    character.significance === 'primary' ? 'bg-blue-100 text-blue-800' :
                    character.significance === 'secondary' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {character.significance}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Role:</span>
                    <p className="text-gray-600">{character.role}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Mentions:</span>
                    <p className="text-gray-600">{character.mentions}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Emotional Arc:</span>
                    <p className="text-gray-600">{character.emotionalArc}</p>
                  </div>
                </div>
                {character.relationships.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-gray-700">Relationships:</span>
                    <p className="text-xs text-gray-600">{character.relationships.join(', ')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderNarrative = () => (
    <div className="space-y-6">
      {/* Narrative Arcs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Narrative Structure
        </h3>
        <div className="space-y-4">
          {analysis.narrativeArcs.map((arc) => (
            <div key={arc.id} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 capitalize">
                  {arc.type.replace('_', ' ')}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Intensity: {Math.round(arc.intensity * 100)}%
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${arc.intensity * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{arc.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Position: {arc.startPosition} - {arc.endPosition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Emotional Beats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2" />
          Emotional Journey ({analysis.emotionalBeats.length} beats)
        </h3>
        <div className="space-y-3">
          {analysis.emotionalBeats.slice(0, 10).map((beat) => (
            <div key={beat.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  beat.emotion === 'joy' ? 'bg-yellow-100 text-yellow-800' :
                  beat.emotion === 'sadness' ? 'bg-blue-100 text-blue-800' :
                  beat.emotion === 'anger' ? 'bg-red-100 text-red-800' :
                  beat.emotion === 'fear' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {beat.emotion}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{beat.context}</p>
                <div className="flex items-center mt-1 space-x-4">
                  <span className="text-xs text-gray-500">
                    Intensity: {Math.round(beat.intensity * 100)}%
                  </span>
                  <span className="text-xs text-gray-500">
                    Position: {Math.round(beat.position * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2" />
        Timeline Events ({analysis.dates.length})
      </h3>
      <div className="space-y-4">
        {analysis.dates.map((date) => (
          <div key={date.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
            <div className="flex-shrink-0 w-24 text-right">
              <span className="text-sm font-medium text-gray-900">
                {date.date.toLocaleDateString()}
              </span>
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                date.type === 'birth' ? 'bg-green-100 text-green-800' :
                date.type === 'death' ? 'bg-red-100 text-red-800' :
                date.type === 'milestone' ? 'bg-blue-100 text-blue-800' :
                date.type === 'event' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {date.type}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{date.context}</p>
              <div className="flex items-center mt-1 space-x-4">
                <span className={`text-xs font-medium ${
                  date.significance === 'high' ? 'text-red-600' :
                  date.significance === 'medium' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {date.significance} significance
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(date.confidence * 100)}% confidence
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2" />
        Suggested Interview Questions ({analysis.interviewQuestions.length})
      </h3>
      <div className="space-y-4">
        {analysis.interviewQuestions.map((question) => (
          <div key={question.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 flex-1">{question.question}</h4>
              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  question.priority === 'high' ? 'bg-red-100 text-red-800' :
                  question.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {question.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  question.sensitivity === 'high' ? 'bg-red-100 text-red-800' :
                  question.sensitivity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {question.sensitivity} sensitivity
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <p className="text-gray-600 capitalize">{question.category}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Based on:</span>
                <p className="text-gray-600">{question.basedOnContent}</p>
              </div>
            </div>
            {question.followUpSuggestions.length > 0 && (
              <div className="mt-3">
                <span className="text-xs font-medium text-gray-700">Follow-up suggestions:</span>
                <ul className="mt-1 space-y-1">
                  {question.followUpSuggestions.map((followUp, index) => (
                    <li key={index} className="text-xs text-gray-600">• {followUp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderLegal = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        Legal & Privacy Review ({analysis.legalConcerns.length} concerns)
      </h3>
      {analysis.legalConcerns.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Major Concerns Detected</h4>
          <p className="text-gray-600">The document appears to be clear of obvious legal and privacy issues.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {analysis.legalConcerns.map((concern) => (
            <div key={concern.id} className={`border-l-4 p-4 rounded-r-lg ${
              concern.severity === 'critical' ? 'border-red-500 bg-red-50' :
              concern.severity === 'high' ? 'border-orange-500 bg-orange-50' :
              concern.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 capitalize">
                  {concern.type.replace('_', ' ')} Issue
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  concern.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  concern.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  concern.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {concern.severity}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{concern.description}</p>
              <div className="bg-white p-3 rounded border">
                <span className="text-xs font-medium text-gray-700">Recommendation:</span>
                <p className="text-xs text-gray-600 mt-1">{concern.recommendation}</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Affected content: {concern.affectedContent}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCinematic = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Film className="w-5 h-5 mr-2" />
          Cinematic Analysis
        </h3>
        
        {/* Overall Score */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Overall Cinematic Potential</h4>
            <span className="text-2xl font-bold text-purple-600">
              {Math.round(analysis.cinematicPotential.overallScore * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full" 
              style={{ width: `${analysis.cinematicPotential.overallScore * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { key: 'visualPotential', label: 'Visual Potential', color: 'blue' },
            { key: 'dramaticTension', label: 'Dramatic Tension', color: 'red' },
            { key: 'characterDevelopment', label: 'Character Development', color: 'green' },
            { key: 'narrativeStructure', label: 'Narrative Structure', color: 'purple' },
            { key: 'emotionalImpact', label: 'Emotional Impact', color: 'yellow' }
          ].map(({ key, label, color }) => (
            <div key={key} className={`p-4 bg-${color}-50 rounded-lg`}>
              <h5 className={`font-medium text-${color}-900 mb-2`}>{label}</h5>
              <div className="flex items-center">
                <div className={`flex-1 bg-${color}-200 rounded-full h-2`}>
                  <div 
                    className={`bg-${color}-600 h-2 rounded-full`} 
                    style={{ width: `${analysis.cinematicPotential[key as keyof typeof analysis.cinematicPotential] * 100}%` }}
                  ></div>
                </div>
                <span className={`ml-2 text-sm font-medium text-${color}-900`}>
                  {Math.round((analysis.cinematicPotential[key as keyof typeof analysis.cinematicPotential] as number) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
          <div className="space-y-2">
            {analysis.cinematicPotential.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{analysis.filename}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Analyzed on {analysis.uploadDate.toLocaleDateString()} • 
              {analysis.content.split(/\s+/).length} words
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {onExport && (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => onExport('json')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as JSON
                    </button>
                    <button
                      onClick={() => onExport('csv')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => onExport('pdf')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'narrative' && renderNarrative()}
        {activeTab === 'characters' && renderTimeline()}
        {activeTab === 'timeline' && renderTimeline()}
        {activeTab === 'questions' && renderQuestions()}
        {activeTab === 'legal' && renderLegal()}
        {activeTab === 'cinematic' && renderCinematic()}
      </div>
    </div>
  );
};