import React, { useState, useEffect } from 'react';
import { InterviewQuestion, ConversationFlow as FlowType, FollowUpSuggestion } from '../types/interview';
import { InterviewAI } from '../utils/interviewAI';
import { 
  MessageCircle, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Heart,
  Brain
} from 'lucide-react';

interface ConversationFlowProps {
  questions: InterviewQuestion[];
  onFlowUpdate: (flow: FlowType) => void;
}

export const ConversationFlow: React.FC<ConversationFlowProps> = ({
  questions,
  onFlowUpdate
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [followUpSuggestions, setFollowUpSuggestions] = useState<FollowUpSuggestion[]>([]);
  const [conversationState, setConversationState] = useState({
    rapport: 0.5,
    emotionalIntensity: 0.3,
    informationDensity: 0.4,
    timeElapsed: 0,
    questionsAsked: 0,
    sensitiveTopicsCovered: []
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setConversationState(prev => ({ ...prev, timeElapsed: timeElapsed }));
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [isActive, timeElapsed]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const estimatedTimeRemaining = questions.slice(currentQuestionIndex).reduce((sum, q) => sum + q.estimatedTime, 0);

  const handleResponseChange = (questionId: string, response: string) => {
    setResponses(prev => ({ ...prev, [questionId]: response }));
    
    if (response.length > 50) {
      // Generate follow-up suggestions based on response
      const suggestions = InterviewAI.generateFollowUpSuggestions(
        currentQuestion.question,
        response,
        conversationState
      );
      setFollowUpSuggestions(suggestions);
      
      // Update conversation state based on response
      updateConversationState(response);
    }
  };

  const updateConversationState = (response: string) => {
    const emotionalWords = ['sad', 'happy', 'angry', 'scared', 'proud', 'ashamed', 'hurt', 'joy'];
    const emotionalCount = emotionalWords.filter(word => 
      response.toLowerCase().includes(word)
    ).length;

    setConversationState(prev => ({
      ...prev,
      emotionalIntensity: Math.min(prev.emotionalIntensity + (emotionalCount * 0.1), 1),
      informationDensity: Math.min(prev.informationDensity + (response.length / 1000), 1),
      rapport: Math.min(prev.rapport + 0.05, 1),
      questionsAsked: currentQuestionIndex + 1
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFollowUpSuggestions([]);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setFollowUpSuggestions([]);
    }
  };

  const startInterview = () => {
    setIsActive(true);
    setTimeElapsed(0);
    setCurrentQuestionIndex(0);
  };

  const pauseInterview = () => {
    setIsActive(false);
  };

  const getEmotionalToneColor = (intensity: number) => {
    if (intensity > 0.7) return 'text-red-600 bg-red-50';
    if (intensity > 0.4) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getRapportColor = (rapport: number) => {
    if (rapport > 0.7) return 'text-green-600 bg-green-50';
    if (rapport > 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Interview Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Interview Flow Control</h3>
          <div className="flex items-center space-x-3">
            {!isActive ? (
              <button
                onClick={startInterview}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start Interview</span>
              </button>
            ) : (
              <button
                onClick={pauseInterview}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Time and Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Elapsed</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{formatTime(timeElapsed)}</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Remaining</span>
            </div>
            <p className="text-lg font-bold text-green-900">{formatTime(estimatedTimeRemaining)}</p>
          </div>
          
          <div className={`p-3 rounded-lg ${getRapportColor(conversationState.rapport)}`}>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Rapport</span>
            </div>
            <p className="text-lg font-bold">{Math.round(conversationState.rapport * 100)}%</p>
          </div>
          
          <div className={`p-3 rounded-lg ${getEmotionalToneColor(conversationState.emotionalIntensity)}`}>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">Emotional</span>
            </div>
            <p className="text-lg font-bold">{Math.round(conversationState.emotionalIntensity * 100)}%</p>
          </div>
        </div>
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Question</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentQuestion.sensitivity === 'high' || currentQuestion.sensitivity === 'extreme'
                  ? 'bg-red-100 text-red-800'
                  : currentQuestion.sensitivity === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {currentQuestion.sensitivity} sensitivity
              </span>
              <span className="text-sm text-gray-500">
                ~{currentQuestion.estimatedTime} min
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-lg text-gray-900 font-medium">{currentQuestion.question}</p>
          </div>

          {currentQuestion.context.warningFlags.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Interview Notes:</span>
              </div>
              <ul className="space-y-1">
                {currentQuestion.context.warningFlags.map((flag, idx) => (
                  <li key={idx} className="text-sm text-orange-700">• {flag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Response Area */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interviewee Response (for follow-up suggestions)
            </label>
            <textarea
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
              placeholder="Type the interviewee's response here to get AI-powered follow-up suggestions..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Previous</span>
            </button>
            
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Follow-up Suggestions */}
      {followUpSuggestions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Follow-up Suggestions</h3>
          </div>
          
          <div className="space-y-3">
            {followUpSuggestions.map((suggestion, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">{suggestion.question}</p>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      suggestion.sensitivity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : suggestion.sensitivity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {suggestion.sensitivity}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {suggestion.timing.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{suggestion.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interview Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Conversation Health</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Rapport Building</span>
                  <span>{Math.round(conversationState.rapport * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${conversationState.rapport * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Information Density</span>
                  <span>{Math.round(conversationState.informationDensity * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${conversationState.informationDensity * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Emotional Intensity</span>
                  <span>{Math.round(conversationState.emotionalIntensity * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${conversationState.emotionalIntensity * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
            <div className="space-y-2">
              {conversationState.rapport < 0.4 && (
                <div className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <span className="text-sm text-yellow-800">Consider spending more time on rapport building</span>
                </div>
              )}
              
              {conversationState.emotionalIntensity > 0.8 && (
                <div className="flex items-start space-x-2 p-2 bg-red-50 rounded">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <span className="text-sm text-red-800">High emotional intensity - consider a break or gentler questions</span>
                </div>
              )}
              
              {timeElapsed > 90 && currentQuestionIndex < questions.length * 0.7 && (
                <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-sm text-blue-800">Interview running long - consider prioritizing remaining questions</span>
                </div>
              )}
              
              {conversationState.rapport > 0.7 && conversationState.emotionalIntensity < 0.3 && (
                <div className="flex items-start space-x-2 p-2 bg-green-50 rounded">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="text-sm text-green-800">Good rapport established - ready for deeper questions</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};