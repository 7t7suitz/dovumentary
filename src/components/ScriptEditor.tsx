import React, { useState, useRef, useEffect } from 'react';
import { Script, ScriptElement, AutoSuggestion } from '../types/script';
import { ScriptProcessor } from '../utils/scriptProcessor';
import { 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Save,
  Download,
  Share2,
  MessageSquare,
  Users,
  Clock,
  Lightbulb,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Edit3
} from 'lucide-react';

interface ScriptEditorProps {
  script: Script;
  onScriptUpdate: (script: Script) => void;
  collaborators: any[];
  isCollaborative?: boolean;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  onScriptUpdate,
  collaborators,
  isCollaborative = false
}) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<AutoSuggestion[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayPosition, setCurrentPlayPosition] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedElement) {
      const element = script.content.find(el => el.id === selectedElement);
      if (element) {
        const newSuggestions = ScriptProcessor.generateAutoSuggestions(element, script.content);
        setSuggestions(newSuggestions);
      }
    }
  }, [selectedElement, script.content]);

  const handleElementUpdate = (elementId: string, newContent: string) => {
    const updatedContent = script.content.map(element =>
      element.id === elementId ? { ...element, content: newContent } : element
    );

    onScriptUpdate({
      ...script,
      content: updatedContent,
      updatedAt: new Date()
    });
  };

  const handleElementFormatting = (elementId: string, formatting: any) => {
    const updatedContent = script.content.map(element =>
      element.id === elementId ? { ...element, formatting: { ...element.formatting, ...formatting } } : element
    );

    onScriptUpdate({
      ...script,
      content: updatedContent,
      updatedAt: new Date()
    });
  };

  const addNewElement = (type: any, afterElementId?: string) => {
    const newElement: ScriptElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: getDefaultContent(type),
      formatting: getDefaultFormatting(type),
      order: afterElementId ? 
        script.content.find(el => el.id === afterElementId)!.order + 1 : 
        script.content.length,
      locked: false
    };

    const updatedContent = [...script.content];
    if (afterElementId) {
      const insertIndex = updatedContent.findIndex(el => el.id === afterElementId) + 1;
      updatedContent.splice(insertIndex, 0, newElement);
      // Reorder subsequent elements
      updatedContent.slice(insertIndex + 1).forEach((el, idx) => {
        el.order = insertIndex + idx + 1;
      });
    } else {
      updatedContent.push(newElement);
    }

    onScriptUpdate({
      ...script,
      content: updatedContent,
      updatedAt: new Date()
    });

    setSelectedElement(newElement.id);
  };

  const deleteElement = (elementId: string) => {
    const updatedContent = script.content.filter(el => el.id !== elementId);
    onScriptUpdate({
      ...script,
      content: updatedContent,
      updatedAt: new Date()
    });
  };

  const applySuggestion = (suggestion: AutoSuggestion) => {
    if (selectedElement) {
      handleElementUpdate(selectedElement, suggestion.text);
      setSuggestions(prev => prev.filter(s => s !== suggestion));
    }
  };

  const getDefaultContent = (type: any): string => {
    const defaults: Record<string, string> = {
      'scene-heading': 'INT. LOCATION - DAY',
      'action': 'Description of what happens in the scene.',
      'character': 'CHARACTER NAME',
      'dialogue': 'What the character says.',
      'parenthetical': '(how they say it)',
      'transition': 'CUT TO:',
      'voiceover': 'NARRATOR (V.O.)\nVoiceover text.',
      'shot': 'MEDIUM SHOT - EYE LEVEL',
      'sound-effect': 'SFX: Description of sound effect',
      'music': 'MUSIC: Description of music cue'
    };
    return defaults[type] || 'New element';
  };

  const getDefaultFormatting = (type: any): any => {
    // Use the same formatting logic from ScriptProcessor
    return {
      fontSize: 12,
      fontFamily: 'Courier New',
      bold: type === 'scene-heading' || type === 'character' || type === 'transition',
      italic: type === 'parenthetical' || type === 'voiceover',
      underline: type === 'shot',
      color: getElementColor(type),
      alignment: type === 'character' || type === 'transition' ? 'center' : 'left',
      indent: getElementIndent(type),
      spacing: 1
    };
  };

  const getElementColor = (type: any): string => {
    const colors: Record<string, string> = {
      'voiceover': '#0066cc',
      'shot': '#cc6600',
      'sound-effect': '#009900',
      'music': '#9900cc',
      'parenthetical': '#666666'
    };
    return colors[type] || '#000000';
  };

  const getElementIndent = (type: any): number => {
    const indents: Record<string, number> = {
      'character': 20,
      'dialogue': 10,
      'parenthetical': 15,
      'voiceover': 10,
      'sound-effect': 5,
      'music': 5
    };
    return indents[type] || 0;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderElement = (element: ScriptElement, index: number) => {
    const isSelected = selectedElement === element.id;
    const isPlaying = currentPlayPosition === index;

    return (
      <div
        key={element.id}
        className={`relative group transition-all duration-200 ${
          isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
        } ${isPlaying ? 'bg-yellow-50 border-l-4 border-yellow-500' : ''}`}
        onClick={() => setSelectedElement(element.id)}
      >
        <div className="flex items-start space-x-2 p-3">
          {/* Element Type Indicator */}
          <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
            getElementTypeColor(element.type)
          }`}></div>

          {/* Element Content */}
          <div className="flex-1">
            {viewMode === 'edit' ? (
              <textarea
                value={element.content}
                onChange={(e) => handleElementUpdate(element.id, e.target.value)}
                className="w-full bg-transparent border-none outline-none resize-none"
                style={{
                  fontFamily: element.formatting.fontFamily,
                  fontSize: `${element.formatting.fontSize}px`,
                  fontWeight: element.formatting.bold ? 'bold' : 'normal',
                  fontStyle: element.formatting.italic ? 'italic' : 'normal',
                  textDecoration: element.formatting.underline ? 'underline' : 'none',
                  color: element.formatting.color,
                  textAlign: element.formatting.alignment as any,
                  paddingLeft: `${element.formatting.indent}px`,
                  lineHeight: element.formatting.spacing
                }}
                rows={element.content.split('\n').length}
                disabled={element.locked}
              />
            ) : (
              <div
                className="whitespace-pre-wrap"
                style={{
                  fontFamily: element.formatting.fontFamily,
                  fontSize: `${element.formatting.fontSize}px`,
                  fontWeight: element.formatting.bold ? 'bold' : 'normal',
                  fontStyle: element.formatting.italic ? 'italic' : 'normal',
                  textDecoration: element.formatting.underline ? 'underline' : 'none',
                  color: element.formatting.color,
                  textAlign: element.formatting.alignment as any,
                  paddingLeft: `${element.formatting.indent}px`,
                  lineHeight: element.formatting.spacing
                }}
              >
                {element.content}
              </div>
            )}

            {/* Element Metadata */}
            {element.timing && (
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>Duration: {formatTime(element.timing.duration)}</span>
                <span>Reading: {formatTime(element.timing.estimatedReadingTime)}</span>
                {element.timing.voiceoverPacing && (
                  <span>Pacing: {element.timing.voiceoverPacing}</span>
                )}
              </div>
            )}

            {/* Element Notes */}
            {element.notes && element.notes.length > 0 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <strong>Notes:</strong> {element.notes.join(', ')}
              </div>
            )}
          </div>

          {/* Element Actions */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add element menu
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="Element options"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments(true);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="Add comment"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Element Type Label */}
        <div className="absolute left-0 top-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-br opacity-0 group-hover:opacity-100 transition-opacity">
          {element.type.replace('-', ' ').toUpperCase()}
        </div>
      </div>
    );
  };

  const getElementTypeColor = (type: any): string => {
    const colors: Record<string, string> = {
      'scene-heading': 'bg-blue-500',
      'action': 'bg-gray-500',
      'character': 'bg-green-500',
      'dialogue': 'bg-green-300',
      'parenthetical': 'bg-gray-400',
      'transition': 'bg-purple-500',
      'voiceover': 'bg-blue-400',
      'shot': 'bg-orange-500',
      'sound-effect': 'bg-green-600',
      'music': 'bg-purple-600'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">{script.title}</h2>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm ${
                  viewMode === 'edit' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {viewMode === 'edit' ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{viewMode === 'edit' ? 'Edit' : 'Preview'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Playback Controls */}
            <div className="flex items-center space-x-2 border-r border-gray-300 pr-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setCurrentPlayPosition(0)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <span className="text-sm text-gray-600">
                {formatTime(currentPlayPosition * 5)} / {formatTime(script.content.length * 5)}
              </span>
            </div>

            {/* Collaboration */}
            {isCollaborative && (
              <div className="flex items-center space-x-2 border-r border-gray-300 pr-4">
                <button
                  onClick={() => setShowComments(!showComments)}
                  className={`p-2 rounded ${
                    showComments ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  title="Comments"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{collaborators.length}</span>
                </div>
              </div>
            )}

            {/* Suggestions */}
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm ${
                showSuggestions ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Suggestions ({suggestions.length})</span>
            </button>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {/* Save logic */}}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                title="Save"
              >
                <Save className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => {/* Export logic */}}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Export"
              >
                <Download className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => {/* Share logic */}}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Formatting Toolbar */}
        {selectedElement && showFormatting && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const element = script.content.find(el => el.id === selectedElement);
                    if (element) {
                      handleElementFormatting(selectedElement, { bold: !element.formatting.bold });
                    }
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                >
                  <Bold className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => {
                    const element = script.content.find(el => el.id === selectedElement);
                    if (element) {
                      handleElementFormatting(selectedElement, { italic: !element.formatting.italic });
                    }
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                >
                  <Italic className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => {
                    const element = script.content.find(el => el.id === selectedElement);
                    if (element) {
                      handleElementFormatting(selectedElement, { underline: !element.formatting.underline });
                    }
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleElementFormatting(selectedElement, { alignment: 'left' })}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleElementFormatting(selectedElement, { alignment: 'center' })}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleElementFormatting(selectedElement, { alignment: 'right' })}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              <select
                value={script.content.find(el => el.id === selectedElement)?.formatting.fontSize || 12}
                onChange={(e) => handleElementFormatting(selectedElement, { fontSize: parseInt(e.target.value) })}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={10}>10pt</option>
                <option value={12}>12pt</option>
                <option value={14}>14pt</option>
                <option value={16}>16pt</option>
                <option value={18}>18pt</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Script Content */}
        <div className="flex-1 overflow-y-auto">
          <div ref={editorRef} className="max-w-4xl mx-auto p-6">
            {script.content
              .sort((a, b) => a.order - b.order)
              .map((element, index) => renderElement(element, index))}
            
            {/* Add Element Button */}
            {viewMode === 'edit' && (
              <div className="mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Type className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Add New Element</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    'scene-heading',
                    'action',
                    'character',
                    'dialogue',
                    'voiceover',
                    'shot',
                    'sound-effect',
                    'music',
                    'transition'
                  ].map(type => (
                    <button
                      key={type}
                      onClick={() => addNewElement(type)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions Sidebar */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Suggestions</h3>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        suggestion.type === 'enhancement' ? 'bg-blue-100 text-blue-800' :
                        suggestion.type === 'correction' ? 'bg-red-100 text-red-800' :
                        suggestion.type === 'formatting' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {suggestion.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(suggestion.confidence * 100)}% confidence
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{suggestion.context}</p>
                    <p className="text-xs text-gray-500 mb-3">{suggestion.reasoning}</p>
                    
                    <div className="bg-gray-50 p-2 rounded text-sm mb-3">
                      <strong>Suggested:</strong> {suggestion.text}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => applySuggestion(suggestion)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => setSuggestions(prev => prev.filter(s => s !== suggestion))}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comments Sidebar */}
        {showComments && isCollaborative && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
              <div className="space-y-4">
                {/* Comments would be rendered here */}
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No comments yet</p>
                  <p className="text-sm">Select an element to add a comment</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Elements: {script.content.length}</span>
            <span>Words: {script.content.reduce((sum, el) => sum + el.content.split(/\s+/).length, 0)}</span>
            <span>Est. Runtime: {formatTime(script.metadata.estimatedRuntime)}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {script.settings.autoSave && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Auto-saved</span>
              </div>
            )}
            
            <span>Last updated: {script.updatedAt.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};