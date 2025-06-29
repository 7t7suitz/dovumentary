import React, { useState } from 'react';
import { FeedbackForm, FeedbackQuestion, DocumentaryVersion } from '../types/preview';
import { 
  MessageSquare, 
  Users, 
  Star, 
  Clock, 
  Send, 
  Plus,
  Trash2,
  Copy,
  Edit3,
  Save,
  X,
  Mail,
  Link,
  Share2
} from 'lucide-react';

interface FeedbackCollectorProps {
  version: DocumentaryVersion;
  onFeedbackFormCreate: (form: FeedbackForm) => void;
  onFeedbackFormUpdate: (form: FeedbackForm) => void;
}

export const FeedbackCollector: React.FC<FeedbackCollectorProps> = ({
  version,
  onFeedbackFormCreate,
  onFeedbackFormUpdate
}) => {
  const [activeForm, setActiveForm] = useState<FeedbackForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<Partial<FeedbackForm>>({
    title: '',
    description: '',
    questions: [],
    settings: {
      allowAnonymous: true,
      collectDemographics: true,
      enableTimestampFeedback: true,
      requireCompletion: false,
      thankYouMessage: 'Thank you for your feedback!'
    }
  });
  const [newQuestion, setNewQuestion] = useState<Partial<FeedbackQuestion>>({
    text: '',
    type: 'multiple-choice',
    options: [''],
    required: true,
    category: 'general'
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [participantEmails, setParticipantEmails] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleCreateForm = () => {
    if (!formData.title) return;

    const newForm: FeedbackForm = {
      id: Math.random().toString(36).substring(2, 9),
      title: formData.title || `Feedback for ${version.name}`,
      description: formData.description || '',
      questions: formData.questions || [],
      settings: formData.settings || {
        allowAnonymous: true,
        collectDemographics: true,
        enableTimestampFeedback: true,
        requireCompletion: false,
        thankYouMessage: 'Thank you for your feedback!'
      }
    };

    onFeedbackFormCreate(newForm);
    setActiveForm(newForm);
    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      questions: [],
      settings: {
        allowAnonymous: true,
        collectDemographics: true,
        enableTimestampFeedback: true,
        requireCompletion: false,
        thankYouMessage: 'Thank you for your feedback!'
      }
    });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.text) return;

    const question: FeedbackQuestion = {
      id: Math.random().toString(36).substring(2, 9),
      text: newQuestion.text || '',
      type: newQuestion.type as any || 'multiple-choice',
      options: newQuestion.type === 'multiple-choice' ? newQuestion.options : undefined,
      required: newQuestion.required || false,
      category: newQuestion.category as any || 'general',
      sceneReference: newQuestion.sceneReference
    };

    setFormData(prev => ({
      ...prev,
      questions: [...(prev.questions || []), question]
    }));

    setNewQuestion({
      text: '',
      type: 'multiple-choice',
      options: [''],
      required: true,
      category: 'general'
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.filter((_, i) => i !== index)
    }));
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => {
      const updatedQuestions = [...(prev.questions || [])];
      const question = updatedQuestions[questionIndex];
      
      if (question && question.options) {
        const updatedOptions = [...question.options];
        updatedOptions[optionIndex] = value;
        question.options = updatedOptions;
      }
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  const handleAddOption = (questionIndex: number) => {
    setFormData(prev => {
      const updatedQuestions = [...(prev.questions || [])];
      const question = updatedQuestions[questionIndex];
      
      if (question && question.options) {
        question.options = [...question.options, ''];
      }
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    setFormData(prev => {
      const updatedQuestions = [...(prev.questions || [])];
      const question = updatedQuestions[questionIndex];
      
      if (question && question.options && question.options.length > 1) {
        question.options = question.options.filter((_, i) => i !== optionIndex);
      }
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  const handleSendInvitations = () => {
    const emails = participantEmails.split(',').map(email => email.trim()).filter(Boolean);
    
    if (emails.length === 0 || !activeForm) return;
    
    // In a real implementation, this would send emails
    alert(`Invitations would be sent to: ${emails.join(', ')}`);
    setParticipantEmails('');
    setShowShareOptions(false);
  };

  const generateFeedbackLink = () => {
    if (!activeForm) return '';
    
    // In a real implementation, this would generate a unique link
    return `https://example.com/feedback/${activeForm.id}`;
  };

  const copyFeedbackLink = () => {
    const link = generateFeedbackLink();
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Feedback Collector</h2>
          <p className="text-sm text-gray-600">Create forms and gather audience feedback</p>
        </div>
      </div>

      {/* Form Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Feedback Forms</h3>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Form</span>
          </button>
        </div>
        
        {activeForm ? (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{activeForm.title}</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                >
                  {previewMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowShareOptions(true)}
                  className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{activeForm.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{activeForm.questions.length} questions</span>
              <span>{activeForm.settings.collectDemographics ? 'Collects demographics' : 'No demographics'}</span>
              <span>{activeForm.settings.enableTimestampFeedback ? 'Timestamp feedback enabled' : 'No timestamp feedback'}</span>
            </div>
          </div>
        ) : showCreateForm ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-3">Create Feedback Form</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Audience Feedback for First Cut"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Instructions for your feedback participants..."
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-3 py-1 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateForm}
                  disabled={!formData.title}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Form
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Feedback Forms</h4>
            <p className="text-gray-600 mb-4">Create a form to start collecting audience feedback</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Feedback Form
            </button>
          </div>
        )}
      </div>

      {/* Form Editor */}
      {activeForm && isEditing && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Edit Form</h3>
            <button
              onClick={() => {
                // Save form changes
                if (activeForm) {
                  onFeedbackFormUpdate({
                    ...activeForm,
                    ...formData
                  });
                  setIsEditing(false);
                }
              }}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
          
          {/* Questions */}
          <div className="space-y-4 mb-6">
            <h4 className="font-medium text-gray-900">Questions</h4>
            
            {formData.questions && formData.questions.length > 0 ? (
              <div className="space-y-4">
                {formData.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <h5 className="font-medium text-gray-900">{question.text}</h5>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRemoveQuestion(index)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            // Duplicate question logic
                            const duplicatedQuestion = {
                              ...question,
                              id: Math.random().toString(36).substring(2, 9)
                            };
                            setFormData(prev => ({
                              ...prev,
                              questions: [...(prev.questions || []), duplicatedQuestion]
                            }));
                          }}
                          className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Question Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => {
                            const updatedQuestions = [...(formData.questions || [])];
                            updatedQuestions[index] = {
                              ...question,
                              type: e.target.value as any
                            };
                            setFormData(prev => ({
                              ...prev,
                              questions: updatedQuestions
                            }));
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="rating">Rating</option>
                          <option value="text">Text Response</option>
                          <option value="timestamp">Timestamp Feedback</option>
                          <option value="ranking">Ranking</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={question.category}
                          onChange={(e) => {
                            const updatedQuestions = [...(formData.questions || [])];
                            updatedQuestions[index] = {
                              ...question,
                              category: e.target.value as any
                            };
                            setFormData(prev => ({
                              ...prev,
                              questions: updatedQuestions
                            }));
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="general">General</option>
                          <option value="technical">Technical</option>
                          <option value="content">Content</option>
                          <option value="emotional">Emotional</option>
                          <option value="engagement">Engagement</option>
                        </select>
                      </div>
                    </div>
                    
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Options
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              <button
                                onClick={() => handleRemoveOption(index, optionIndex)}
                                disabled={question.options?.length === 1}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => handleAddOption(index)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) => {
                            const updatedQuestions = [...(formData.questions || [])];
                            updatedQuestions[index] = {
                              ...question,
                              required: e.target.checked
                            };
                            setFormData(prev => ({
                              ...prev,
                              questions: updatedQuestions
                            }));
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Required</span>
                      </label>
                      
                      {question.type === 'timestamp' && (
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={!!question.sceneReference}
                            onChange={(e) => {
                              const updatedQuestions = [...(formData.questions || [])];
                              updatedQuestions[index] = {
                                ...question,
                                sceneReference: e.target.checked ? 'scene-1' : undefined
                              };
                              setFormData(prev => ({
                                ...prev,
                                questions: updatedQuestions
                              }));
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Link to scene</span>
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No questions added yet</p>
              </div>
            )}
            
            {/* Add Question Form */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Add New Question</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., How would you rate the pacing of this scene?"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Type
                    </label>
                    <select
                      value={newQuestion.type}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="rating">Rating</option>
                      <option value="text">Text Response</option>
                      <option value="timestamp">Timestamp Feedback</option>
                      <option value="ranking">Ranking</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                      <option value="content">Content</option>
                      <option value="emotional">Emotional</option>
                      <option value="engagement">Engagement</option>
                    </select>
                  </div>
                </div>
                
                {newQuestion.type === 'multiple-choice' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Options
                    </label>
                    <div className="space-y-2">
                      {newQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const updatedOptions = [...(newQuestion.options || [])];
                              updatedOptions[index] = e.target.value;
                              setNewQuestion(prev => ({
                                ...prev,
                                options: updatedOptions
                              }));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Option ${index + 1}`}
                          />
                          <button
                            onClick={() => {
                              const updatedOptions = [...(newQuestion.options || [])].filter((_, i) => i !== index);
                              setNewQuestion(prev => ({
                                ...prev,
                                options: updatedOptions.length ? updatedOptions : ['']
                              }));
                            }}
                            disabled={(newQuestion.options?.length || 0) <= 1}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setNewQuestion(prev => ({
                            ...prev,
                            options: [...(prev.options || []), '']
                          }));
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newQuestion.required}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, required: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Required</span>
                  </label>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleAddQuestion}
                    disabled={!newQuestion.text}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Form Settings</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Allow anonymous responses</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={formData.settings?.allowAnonymous}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...(prev.settings || {}),
                          allowAnonymous: e.target.checked
                        }
                      }))}
                      className="sr-only"
                      id="toggle-anonymous"
                    />
                    <label
                      htmlFor="toggle-anonymous"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        formData.settings?.allowAnonymous ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        formData.settings?.allowAnonymous ? 'translate-x-4' : 'translate-x-0'
                      }`}></span>
                    </label>
                  </div>
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Collect demographic information</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={formData.settings?.collectDemographics}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...(prev.settings || {}),
                          collectDemographics: e.target.checked
                        }
                      }))}
                      className="sr-only"
                      id="toggle-demographics"
                    />
                    <label
                      htmlFor="toggle-demographics"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        formData.settings?.collectDemographics ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        formData.settings?.collectDemographics ? 'translate-x-4' : 'translate-x-0'
                      }`}></span>
                    </label>
                  </div>
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Enable timestamp feedback</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={formData.settings?.enableTimestampFeedback}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...(prev.settings || {}),
                          enableTimestampFeedback: e.target.checked
                        }
                      }))}
                      className="sr-only"
                      id="toggle-timestamp"
                    />
                    <label
                      htmlFor="toggle-timestamp"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        formData.settings?.enableTimestampFeedback ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        formData.settings?.enableTimestampFeedback ? 'translate-x-4' : 'translate-x-0'
                      }`}></span>
                    </label>
                  </div>
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Require completion of all questions</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={formData.settings?.requireCompletion}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...(prev.settings || {}),
                          requireCompletion: e.target.checked
                        }
                      }))}
                      className="sr-only"
                      id="toggle-completion"
                    />
                    <label
                      htmlFor="toggle-completion"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        formData.settings?.requireCompletion ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        formData.settings?.requireCompletion ? 'translate-x-4' : 'translate-x-0'
                      }`}></span>
                    </label>
                  </div>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thank You Message
                  </label>
                  <textarea
                    value={formData.settings?.thankYouMessage}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: {
                        ...(prev.settings || {}),
                        thankYouMessage: e.target.value
                      }
                    }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Message to show after form submission"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Preview */}
      {activeForm && previewMode && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Form Preview</h3>
            <button
              onClick={() => setPreviewMode(false)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Exit Preview
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{activeForm.title}</h2>
            <p className="text-gray-600 mb-6">{activeForm.description}</p>
            
            {activeForm.settings.collectDemographics && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">About You (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age Range
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select age range</option>
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-44">35-44</option>
                      <option value="45-54">45-54</option>
                      <option value="55-64">55-64</option>
                      <option value="65+">65+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {activeForm.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2 mb-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900">{question.text}</h4>
                      {question.required && (
                        <span className="text-xs text-red-600">* Required</span>
                      )}
                    </div>
                  </div>
                  
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-2 ml-8">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'rating' && (
                    <div className="ml-8">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button key={rating} className="p-1">
                            <Star className="w-6 h-6 text-gray-300 hover:text-yellow-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {question.type === 'text' && (
                    <div className="ml-8">
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your answer..."
                      />
                    </div>
                  )}
                  
                  {question.type === 'timestamp' && (
                    <div className="ml-8">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">00:00</span>
                        <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                          Set Current Time
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your feedback about this moment..."
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Options */}
      {activeForm && showShareOptions && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Share Feedback Form</h3>
            <button
              onClick={() => setShowShareOptions(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Email Invitations</h4>
                <div className="space-y-3">
                  <textarea
                    value={participantEmails}
                    onChange={(e) => setParticipantEmails(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email addresses separated by commas..."
                  />
                  <button
                    onClick={handleSendInvitations}
                    disabled={!participantEmails.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Invitations</span>
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Share Link</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generateFeedbackLink()}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500"
                  />
                  <button
                    onClick={copyFeedbackLink}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <Link className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Social Sharing</h4>
                <div className="flex items-center space-x-4">
                  <button className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-[#166FE5]">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1A91DA]">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-[#0A66C2] text-white rounded-full hover:bg-[#0958A7]">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-[#25D366] text-white rounded-full hover:bg-[#22BD5B]">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Custom Forms</h4>
              <p className="text-sm text-gray-600">Create tailored feedback forms for your audience</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Timestamp Feedback</h4>
              <p className="text-sm text-gray-600">Get feedback on specific moments in your documentary</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Audience Insights</h4>
              <p className="text-sm text-gray-600">Collect demographic data and detailed responses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock components for social icons
const Facebook = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const Twitter = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const Linkedin = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Eye = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);