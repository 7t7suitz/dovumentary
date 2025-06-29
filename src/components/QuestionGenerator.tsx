import React, { useState, useEffect } from 'react';
import { InterviewQuestion, InterviewTemplate, DocumentAnalysis } from '../types/interview';
import { InterviewAI } from '../utils/interviewAI';
import { 
  MessageSquare, 
  Settings, 
  Clock, 
  AlertTriangle, 
  Heart,
  Users,
  Calendar,
  FileText,
  Filter,
  SortAsc
} from 'lucide-react';

interface QuestionGeneratorProps {
  analysis: DocumentAnalysis | null;
  onQuestionsGenerated: (questions: InterviewQuestion[]) => void;
}

export const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({
  analysis,
  onQuestionsGenerated
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<InterviewTemplate | null>(null);
  const [templates] = useState<InterviewTemplate[]>(InterviewAI.getInterviewTemplates());
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    sensitivity: 'all',
    priority: 'all'
  });
  const [sortBy, setSortBy] = useState<'order' | 'priority' | 'sensitivity' | 'time'>('order');

  useEffect(() => {
    if (templates.length > 0) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates]);

  const generateQuestions = async () => {
    if (!analysis || !selectedTemplate) return;

    setIsGenerating(true);
    try {
      const generatedQuestions = InterviewAI.generateQuestions(analysis, selectedTemplate);
      setQuestions(generatedQuestions);
      onQuestionsGenerated(generatedQuestions);
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredAndSortedQuestions = questions
    .filter(q => {
      if (filters.category !== 'all' && q.category !== filters.category) return false;
      if (filters.sensitivity !== 'all' && q.sensitivity !== filters.sensitivity) return false;
      if (filters.priority !== 'all' && q.priority !== filters.priority) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'sensitivity':
          const sensitivityOrder = { 'extreme': 4, 'high': 3, 'medium': 2, 'low': 1 };
          return sensitivityOrder[b.sensitivity] - sensitivityOrder[a.sensitivity];
        case 'time':
          return b.estimatedTime - a.estimatedTime;
        default:
          return a.order - b.order;
      }
    });

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'extreme': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal': return <Users className="w-4 h-4" />;
      case 'emotional': return <Heart className="w-4 h-4" />;
      case 'timeline': return <Calendar className="w-4 h-4" />;
      case 'factual': return <FileText className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const totalEstimatedTime = filteredAndSortedQuestions.reduce((sum, q) => sum + q.estimatedTime, 0);
  const sensitiveQuestions = filteredAndSortedQuestions.filter(q => q.sensitivity === 'high' || q.sensitivity === 'extreme');

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Interview Template</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{template.duration} min</span>
                <span className="capitalize">{template.style.replace('-', ' ')}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={generateQuestions}
          disabled={!analysis || !selectedTemplate || isGenerating}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Questions...</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5" />
              <span>Generate Interview Questions</span>
            </>
          )}
        </button>
      </div>

      {/* Questions Overview */}
      {questions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Total Questions</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">{filteredAndSortedQuestions.length}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Est. Duration</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">{totalEstimatedTime}m</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-900">Sensitive Topics</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 mt-1">{sensitiveQuestions.length}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">Required</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {filteredAndSortedQuestions.filter(q => q.isRequired).length}
              </p>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Categories</option>
              <option value="personal">Personal</option>
              <option value="factual">Factual</option>
              <option value="emotional">Emotional</option>
              <option value="contextual">Contextual</option>
              <option value="timeline">Timeline</option>
            </select>
            
            <select
              value={filters.sensitivity}
              onChange={(e) => setFilters(prev => ({ ...prev, sensitivity: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Sensitivity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>
            
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <div className="flex items-center space-x-2 ml-auto">
              <SortAsc className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="order">Suggested Order</option>
                <option value="priority">Priority</option>
                <option value="sensitivity">Sensitivity</option>
                <option value="time">Duration</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      {filteredAndSortedQuestions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Questions</h3>
          
          <div className="space-y-4">
            {filteredAndSortedQuestions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(question.category)}
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {question.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(question.priority)}`}>
                      {question.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSensitivityColor(question.sensitivity)}`}>
                      {question.sensitivity}
                    </span>
                    {question.isRequired && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Required
                      </span>
                    )}
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">{question.question}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Estimated time:</span> {question.estimatedTime} minutes
                  </div>
                  <div>
                    <span className="font-medium">Difficulty:</span> {question.difficulty}
                  </div>
                  <div>
                    <span className="font-medium">Based on:</span> {question.basedOnContent}
                  </div>
                  <div>
                    <span className="font-medium">Timing:</span> {question.context.suggestedTiming}
                  </div>
                </div>
                
                {question.followUpSuggestions.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Follow-up suggestions:</span>
                    <ul className="mt-1 space-y-1">
                      {question.followUpSuggestions.map((followUp, idx) => (
                        <li key={idx} className="text-sm text-gray-600 ml-4">• {followUp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {question.culturalConsiderations.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Cultural considerations:</span>
                    <ul className="mt-1 space-y-1">
                      {question.culturalConsiderations.map((consideration, idx) => (
                        <li key={idx} className="text-sm text-gray-600 ml-4">• {consideration}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {question.context.warningFlags.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Warning Flags:</span>
                    </div>
                    <ul className="space-y-1">
                      {question.context.warningFlags.map((flag, idx) => (
                        <li key={idx} className="text-sm text-orange-700">• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {question.alternatives.length > 0 && (
                  <details className="mt-3">
                    <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                      Alternative phrasings ({question.alternatives.length})
                    </summary>
                    <ul className="mt-2 space-y-1">
                      {question.alternatives.map((alt, idx) => (
                        <li key={idx} className="text-sm text-gray-600 ml-4">• {alt}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};