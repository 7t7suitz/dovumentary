import React from 'react';
import { Brain, FileText, Users, Calendar, MessageSquare, Shield, Film } from 'lucide-react';

interface ProcessingIndicatorProps {
  currentStep: string;
  progress: number;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  currentStep,
  progress
}) => {
  const steps = [
    { id: 'upload', label: 'Processing Document', icon: FileText },
    { id: 'themes', label: 'Extracting Themes', icon: Brain },
    { id: 'characters', label: 'Identifying Characters', icon: Users },
    { id: 'timeline', label: 'Building Timeline', icon: Calendar },
    { id: 'questions', label: 'Generating Questions', icon: MessageSquare },
    { id: 'legal', label: 'Legal Review', icon: Shield },
    { id: 'cinematic', label: 'Cinematic Analysis', icon: Film }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Analysis in Progress</h3>
        <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isActive ? 'bg-blue-50 border border-blue-200' :
                isCompleted ? 'bg-green-50 border border-green-200' :
                'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isActive ? 'bg-blue-600 text-white' :
                isCompleted ? 'bg-green-600 text-white' :
                'bg-gray-400 text-white'
              }`}>
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`font-medium ${
                  isActive ? 'text-blue-900' :
                  isCompleted ? 'text-green-900' :
                  'text-gray-600'
                }`}>
                  {step.label}
                </p>
                {isActive && (
                  <div className="flex items-center mt-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-xs text-blue-600">Processing...</span>
                  </div>
                )}
              </div>
              
              {isActive && (
                <div className="flex-shrink-0">
                  <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Current Step:</strong> {steps[currentStepIndex]?.label || 'Initializing...'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Our AI is analyzing your document to extract meaningful insights for documentary production.
        </p>
      </div>
    </div>
  );
};