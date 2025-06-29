import React, { useState } from 'react';
import { StoryboardFrame, ShotType, CameraAngle, CameraMovement, TransitionType } from '../types/storyboard';
import { StoryboardCanvas } from './StoryboardCanvas';
import { ColorPicker } from './ColorPicker';
import { 
  Camera, 
  Palette, 
  Users, 
  Volume2, 
  Clock, 
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface FrameEditorProps {
  frame: StoryboardFrame;
  onFrameUpdate: (frame: StoryboardFrame) => void;
  onClose: () => void;
}

export const FrameEditor: React.FC<FrameEditorProps> = ({
  frame,
  onFrameUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'camera' | 'lighting' | 'audio' | 'timing'>('canvas');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFrame = (updates: Partial<StoryboardFrame>) => {
    onFrameUpdate({ ...frame, ...updates });
  };

  const shotTypes: ShotType[] = [
    'extreme-wide', 'wide', 'medium-wide', 'medium', 'medium-close', 
    'close-up', 'extreme-close-up', 'over-shoulder', 'two-shot', 'insert'
  ];

  const cameraAngles: CameraAngle[] = [
    'eye-level', 'high-angle', 'low-angle', 'birds-eye', 'worms-eye', 'dutch-angle', 'overhead'
  ];

  const cameraMovements: CameraMovement[] = [
    'static', 'pan-left', 'pan-right', 'tilt-up', 'tilt-down', 
    'zoom-in', 'zoom-out', 'dolly-in', 'dolly-out', 'tracking', 'handheld'
  ];

  const transitions: TransitionType[] = [
    'cut', 'fade-in', 'fade-out', 'dissolve', 'wipe', 'iris', 'match-cut', 'jump-cut'
  ];

  const tabs = [
    { id: 'canvas', label: 'Canvas', icon: Settings },
    { id: 'camera', label: 'Camera', icon: Camera },
    { id: 'lighting', label: 'Lighting', icon: Palette },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'timing', label: 'Timing', icon: Clock }
  ];

  const renderCanvasTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <StoryboardCanvas
          frame={frame}
          onFrameUpdate={onFrameUpdate}
          isEditing={true}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('basic')}
        >
          <h3 className="font-semibold text-gray-900">Basic Information</h3>
          {expandedSections.has('basic') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.has('basic') && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={frame.title}
                onChange={(e) => updateFrame({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={frame.description}
                onChange={(e) => updateFrame({ description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={frame.notes}
                onChange={(e) => updateFrame({ notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Production notes, special requirements, etc."
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('characters')}
        >
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Characters ({frame.characters.length})
          </h3>
          {expandedSections.has('characters') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.has('characters') && (
          <div className="mt-4 space-y-3">
            {frame.characters.map((character, index) => (
              <div key={character.id} className="border border-gray-200 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={character.name}
                      onChange={(e) => {
                        const updatedCharacters = [...frame.characters];
                        updatedCharacters[index] = { ...character, name: e.target.value };
                        updateFrame({ characters: updatedCharacters });
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Action</label>
                    <input
                      type="text"
                      value={character.action}
                      onChange={(e) => {
                        const updatedCharacters = [...frame.characters];
                        updatedCharacters[index] = { ...character, action: e.target.value };
                        updateFrame({ characters: updatedCharacters });
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Emotion</label>
                    <select
                      value={character.emotion}
                      onChange={(e) => {
                        const updatedCharacters = [...frame.characters];
                        updatedCharacters[index] = { ...character, emotion: e.target.value };
                        updateFrame({ characters: updatedCharacters });
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="neutral">Neutral</option>
                      <option value="happy">Happy</option>
                      <option value="sad">Sad</option>
                      <option value="angry">Angry</option>
                      <option value="surprised">Surprised</option>
                      <option value="scared">Scared</option>
                      <option value="confused">Confused</option>
                      <option value="excited">Excited</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Facing</label>
                    <select
                      value={character.facing}
                      onChange={(e) => {
                        const updatedCharacters = [...frame.characters];
                        updatedCharacters[index] = { ...character, facing: e.target.value as any };
                        updateFrame({ characters: updatedCharacters });
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="forward">Forward</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="back">Back</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderCameraTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Shot Composition</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shot Type</label>
            <select
              value={frame.shotType}
              onChange={(e) => updateFrame({ shotType: e.target.value as ShotType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {shotTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Camera Angle</label>
            <select
              value={frame.cameraAngle}
              onChange={(e) => updateFrame({ cameraAngle: e.target.value as CameraAngle })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {cameraAngles.map(angle => (
                <option key={angle} value={angle}>
                  {angle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Camera Movement</label>
            <select
              value={frame.cameraMovement}
              onChange={(e) => updateFrame({ cameraMovement: e.target.value as CameraMovement })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {cameraMovements.map(movement => (
                <option key={movement} value={movement}>
                  {movement.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Transition</h3>
        <select
          value={frame.transition}
          onChange={(e) => updateFrame({ transition: e.target.value as TransitionType })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {transitions.map(transition => (
            <option key={transition} value={transition}>
              {transition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderLightingTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Lighting Setup</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
            <select
              value={frame.lighting.mood}
              onChange={(e) => updateFrame({ 
                lighting: { 
                  ...frame.lighting, 
                  mood: e.target.value as any 
                } 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bright">Bright</option>
              <option value="dim">Dim</option>
              <option value="dramatic">Dramatic</option>
              <option value="natural">Natural</option>
              <option value="artificial">Artificial</option>
              <option value="golden-hour">Golden Hour</option>
              <option value="blue-hour">Blue Hour</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Color Palette</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker
            label="Primary"
            color={frame.colorPalette.primary}
            onChange={(color) => updateFrame({
              colorPalette: { ...frame.colorPalette, primary: color }
            })}
          />
          <ColorPicker
            label="Secondary"
            color={frame.colorPalette.secondary}
            onChange={(color) => updateFrame({
              colorPalette: { ...frame.colorPalette, secondary: color }
            })}
          />
          <ColorPicker
            label="Accent"
            color={frame.colorPalette.accent}
            onChange={(color) => updateFrame({
              colorPalette: { ...frame.colorPalette, accent: color }
            })}
          />
          <ColorPicker
            label="Background"
            color={frame.colorPalette.background}
            onChange={(color) => updateFrame({
              colorPalette: { ...frame.colorPalette, background: color }
            })}
          />
        </div>
      </div>
    </div>
  );

  const renderAudioTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Voiceover</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
            <textarea
              value={frame.voiceover.text}
              onChange={(e) => updateFrame({
                voiceover: { ...frame.voiceover, text: e.target.value }
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Voiceover script..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
              <input
                type="text"
                value={frame.voiceover.speaker}
                onChange={(e) => updateFrame({
                  voiceover: { ...frame.voiceover, speaker: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
              <select
                value={frame.voiceover.tone}
                onChange={(e) => updateFrame({
                  voiceover: { ...frame.voiceover, tone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="neutral">Neutral</option>
                <option value="dramatic">Dramatic</option>
                <option value="calm">Calm</option>
                <option value="energetic">Energetic</option>
                <option value="mysterious">Mysterious</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Audio Cues ({frame.audioCues.length})</h3>
        <div className="space-y-3">
          {frame.audioCues.map((cue, index) => (
            <div key={cue.id} className="border border-gray-200 rounded-lg p-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={cue.type}
                    onChange={(e) => {
                      const updatedCues = [...frame.audioCues];
                      updatedCues[index] = { ...cue, type: e.target.value as any };
                      updateFrame({ audioCues: updatedCues });
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="music">Music</option>
                    <option value="sfx">Sound Effect</option>
                    <option value="ambient">Ambient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={cue.description}
                    onChange={(e) => {
                      const updatedCues = [...frame.audioCues];
                      updatedCues[index] = { ...cue, description: e.target.value };
                      updateFrame({ audioCues: updatedCues });
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={cue.volume}
                    onChange={(e) => {
                      const updatedCues = [...frame.audioCues];
                      updatedCues[index] = { ...cue, volume: parseFloat(e.target.value) };
                      updateFrame({ audioCues: updatedCues });
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimingTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Frame Timing</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (seconds): {frame.duration}
            </label>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={frame.duration}
              onChange={(e) => updateFrame({ duration: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voiceover Duration: {frame.voiceover.duration}s
            </label>
            <input
              type="range"
              min="0"
              max={frame.duration}
              step="0.1"
              value={frame.voiceover.duration}
              onChange={(e) => updateFrame({
                voiceover: { ...frame.voiceover, duration: parseFloat(e.target.value) }
              })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Frame: {frame.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
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
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'canvas' && renderCanvasTab()}
          {activeTab === 'camera' && renderCameraTab()}
          {activeTab === 'lighting' && renderLightingTab()}
          {activeTab === 'audio' && renderAudioTab()}
          {activeTab === 'timing' && renderTimingTab()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};