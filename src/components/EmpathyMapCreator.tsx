import React, { useState } from 'react';
import { EmpathyMap } from '../types/emotion';
import { 
  Users, 
  Brain, 
  Heart, 
  Target, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Plus,
  Trash2,
  Save,
  Edit3,
  X
} from 'lucide-react';

interface EmpathyMapCreatorProps {
  initialMap?: EmpathyMap;
  onSave: (map: EmpathyMap) => void;
  onCancel?: () => void;
}

export const EmpathyMapCreator: React.FC<EmpathyMapCreatorProps> = ({
  initialMap,
  onSave,
  onCancel
}) => {
  const [empathyMap, setEmpathyMap] = useState<Partial<EmpathyMap>>(initialMap || {
    audienceSegment: '',
    demographics: [],
    emotionalNeeds: [],
    painPoints: [],
    goals: [],
    thoughtsAndFeelings: [],
    resonantMoments: [],
    dissonantMoments: [],
    engagementStrategies: []
  });
  
  const [newDemographic, setNewDemographic] = useState('');
  const [newNeed, setNewNeed] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newThought, setNewThought] = useState('');
  const [newStrategy, setNewStrategy] = useState('');
  const [newResonantPosition, setNewResonantPosition] = useState<number | ''>('');
  const [newResonantReason, setNewResonantReason] = useState('');
  const [newDissonantPosition, setNewDissonantPosition] = useState<number | ''>('');
  const [newDissonantReason, setNewDissonantReason] = useState('');

  const handleAddDemographic = () => {
    if (!newDemographic.trim()) return;
    setEmpathyMap(prev => ({
      ...prev,
      demographics: [...(prev.demographics || []), newDemographic]
    }));
    setNewDemographic('');
  };

  const handleAddNeed = () => {
    if (!newNeed.trim()) return;
    setEmpathyMap(prev => ({
      ...prev,
      emotionalNeeds: [...(prev.emotionalNeeds || []), newNeed]
    }));
    setNewNeed('');
  };

  const handleAddPainPoint = () => {
    if (!newPainPoint.trim()) return;
    setEmpathyMap(prev => ({
      ...prev,
      painPoints: [...(prev.painPoints || []), newPainPoint]
    }));
    setNewPainPoint('');
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    setEmpathyMap(prev => ({
      ...prev,
      goals: [...(prev.goals || []), newGoal]
    }));
    setNewGoal('');
  };

  const handleAddThought = () => {
    if (!newThought.trim()) return;
    setEmpathyMap(prev => ({
      ...prev,
      thoughtsAndFeelings: [...(prev.thoughtsAndFeelings || []), newThought]
    }));
    setNewThought('');
  };

  const handleAddStrategy = () => {
    if (!newStrategy.trim()) return;
    setEmpathyMap(prev => ({
      ...prev,
      engagementStrategies: [...(prev.engagementStrategies || []), newStrategy]
    }));
    setNewStrategy('');
  };

  const handleAddResonantMoment = () => {
    if (newResonantPosition === '' || !newResonantReason.trim()) return;
    
    setEmpathyMap(prev => ({
      ...prev,
      resonantMoments: [...(prev.resonantMoments || []), {
        position: Number(newResonantPosition) / 100, // Convert from percentage to 0-1 scale
        reason: newResonantReason
      }]
    }));
    
    setNewResonantPosition('');
    setNewResonantReason('');
  };

  const handleAddDissonantMoment = () => {
    if (newDissonantPosition === '' || !newDissonantReason.trim()) return;
    
    setEmpathyMap(prev => ({
      ...prev,
      dissonantMoments: [...(prev.dissonantMoments || []), {
        position: Number(newDissonantPosition) / 100, // Convert from percentage to 0-1 scale
        reason: newDissonantReason
      }]
    }));
    
    setNewDissonantPosition('');
    setNewDissonantReason('');
  };

  const handleRemoveDemographic = (index: number) => {
    setEmpathyMap(prev => ({
      ...prev,
      demographics: prev.demographics?.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveNeed = (index: number) => {
    setEmpathyMap(prev => ({
      ...prev,
      emotionalNeeds: prev.emotionalNeeds?.filter((_, i) => i !== index)
    }));
  };

  const handleRemovePainPoint = (index: number) => {
    setEmpathyMap(prev => ({
      ...prev,
      painPoints: prev.painPoints?.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveGoal = (index: number) => {
    setEmpathyMap(prev => ({
      ...prev,
      goals: prev.goals?.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveThought = (index: number) => {
    setEmpathyMap(prev => ({
      ...prev,
      thoughtsAndFeelings: prev.thoughtsAndFeelings?.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveStrategy = (index: number) => {
    setEmpathyMap(prev => ({
      ...prev,
      engagementStrategies: prev.engagementStrategies?.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveResonantMoment = (index: number) => {
    setEmpathyMap(prev => ({
      ...prev,
      resonantMoments: prev.resonantMoments?.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveDissonantMoment = (index: number) => {
    setEmpathyMap(prev => ({
      ...prev,
      dissonantMoments: prev.dissonantMoments?.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!empathyMap.audienceSegment) return;
    
    onSave({
      id: initialMap?.id || generateId(),
      audienceSegment: empathyMap.audienceSegment || '',
      demographics: empathyMap.demographics || [],
      emotionalNeeds: empathyMap.emotionalNeeds || [],
      painPoints: empathyMap.painPoints || [],
      goals: empathyMap.goals || [],
      thoughtsAndFeelings: empathyMap.thoughtsAndFeelings || [],
      resonantMoments: empathyMap.resonantMoments || [],
      dissonantMoments: empathyMap.dissonantMoments || [],
      engagementStrategies: empathyMap.engagementStrategies || []
    });
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          {initialMap ? 'Edit' : 'Create'} Audience Empathy Map
        </h3>
        
        <div className="flex items-center space-x-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={!empathyMap.audienceSegment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Empathy Map
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Audience Segment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audience Segment Name
          </label>
          <input
            type="text"
            value={empathyMap.audienceSegment || ''}
            onChange={(e) => setEmpathyMap(prev => ({ ...prev, audienceSegment: e.target.value }))}
            placeholder="e.g., General Viewers, Subject Matter Experts, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Demographics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-1 text-blue-500" />
            Demographics
          </label>
          
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={newDemographic}
              onChange={(e) => setNewDemographic(e.target.value)}
              placeholder="e.g., 25-54, urban, college-educated"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleAddDemographic()}
            />
            <button
              onClick={handleAddDemographic}
              disabled={!newDemographic.trim()}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {empathyMap.demographics?.map((demo, index) => (
              <div key={index} className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                <span>{demo}</span>
                <button
                  onClick={() => handleRemoveDemographic(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Emotional Needs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Heart className="w-4 h-4 mr-1 text-pink-500" />
            Emotional Needs
          </label>
          
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={newNeed}
              onChange={(e) => setNewNeed(e.target.value)}
              placeholder="e.g., connection, understanding, validation"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleAddNeed()}
            />
            <button
              onClick={handleAddNeed}
              disabled={!newNeed.trim()}
              className="p-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {empathyMap.emotionalNeeds?.map((need, index) => (
              <div key={index} className="flex items-center space-x-1 px-3 py-1 bg-pink-100 text-pink-800 rounded-full">
                <span>{need}</span>
                <button
                  onClick={() => handleRemoveNeed(index)}
                  className="text-pink-600 hover:text-pink-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pain Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <ThumbsDown className="w-4 h-4 mr-1 text-red-500" />
            Pain Points
          </label>
          
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={newPainPoint}
              onChange={(e) => setNewPainPoint(e.target.value)}
              placeholder="e.g., complexity, emotional distance, lack of context"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleAddPainPoint()}
            />
            <button
              onClick={handleAddPainPoint}
              disabled={!newPainPoint.trim()}
              className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {empathyMap.painPoints?.map((point, index) => (
              <div key={index} className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                <span>{point}</span>
                <button
                  onClick={() => handleRemovePainPoint(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Target className="w-4 h-4 mr-1 text-green-500" />
            Goals
          </label>
          
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="e.g., learn new information, be emotionally moved"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
            />
            <button
              onClick={handleAddGoal}
              disabled={!newGoal.trim()}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {empathyMap.goals?.map((goal, index) => (
              <div key={index} className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                <span>{goal}</span>
                <button
                  onClick={() => handleRemoveGoal(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Thoughts and Feelings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Brain className="w-4 h-4 mr-1 text-purple-500" />
            Thoughts and Feelings
          </label>
          
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={newThought}
              onChange={(e) => setNewThought(e.target.value)}
              placeholder="e.g., curiosity, empathy, reflection"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleAddThought()}
            />
            <button
              onClick={handleAddThought}
              disabled={!newThought.trim()}
              className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {empathyMap.thoughtsAndFeelings?.map((thought, index) => (
              <div key={index} className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                <span>{thought}</span>
                <button
                  onClick={() => handleRemoveThought(index)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Resonant Moments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1 text-green-500" />
            Resonant Moments
          </label>
          
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="number"
              min="0"
              max="100"
              value={newResonantPosition === '' ? '' : newResonantPosition}
              onChange={(e) => setNewResonantPosition(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Position (%)"
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newResonantReason}
              onChange={(e) => setNewResonantReason(e.target.value)}
              placeholder="Reason (e.g., Strong emotional content)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleAddResonantMoment()}
            />
            <button
              onClick={handleAddResonantMoment}
              disabled={newResonantPosition === '' || !newResonantReason.trim()}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {empathyMap.resonantMoments?.map((moment, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {Math.round(moment.position * 100)}%
                  </span>
                  <span className="text-sm text-gray-700">{moment.reason}</span>
                </div>
                <button
                  onClick={() => handleRemoveResonantMoment(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dissonant Moments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <ThumbsDown className="w-4 h-4 mr-1 text-red-500" />
            Dissonant Moments
          </label>
          
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="number"
              min="0"
              max="100"
              value={newDissonantPosition === '' ? '' : newDissonantPosition}
              onChange={(e) => setNewDissonantPosition(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Position (%)"
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newDissonantReason}
              onChange={(e) => setNewDissonantReason(e.target.value)}
              placeholder="Reason (e.g., Pacing issues)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleAddDissonantMoment()}
            />
            <button
              onClick={handleAddDissonantMoment}
              disabled={newDissonantPosition === '' || !newDissonantReason.trim()}
              className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {empathyMap.dissonantMoments?.map((moment, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    {Math.round(moment.position * 100)}%
                  </span>
                  <span className="text-sm text-gray-700">{moment.reason}</span>
                </div>
                <button
                  onClick={() => handleRemoveDissonantMoment(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Engagement Strategies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MessageSquare className="w-4 h-4 mr-1 text-amber-500" />
            Engagement Strategies
          </label>
          
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={newStrategy}
              onChange={(e) => setNewStrategy(e.target.value)}
              placeholder="e.g., Use personal stories to create connection"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleAddStrategy()}
            />
            <button
              onClick={handleAddStrategy}
              disabled={!newStrategy.trim()}
              className="p-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {empathyMap.engagementStrategies?.map((strategy, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-sm text-gray-700">{strategy}</span>
                <button
                  onClick={() => handleRemoveStrategy(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};