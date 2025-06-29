import React, { useState } from 'react';
import { StoryboardFrame, Script } from '../types/script';
import { ScriptProcessor } from '../utils/scriptProcessor';
import { 
  Film, 
  FileText, 
  ArrowRight, 
  Settings, 
  Download,
  Eye,
  Wand2,
  Clock,
  Camera
} from 'lucide-react';

interface StoryboardConverterProps {
  onScriptGenerated: (script: Script) => void;
}

export const StoryboardConverter: React.FC<StoryboardConverterProps> = ({
  onScriptGenerated
}) => {
  const [storyboardFrames, setStoryboardFrames] = useState<StoryboardFrame[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionSettings, setConversionSettings] = useState({
    includeVoiceover: true,
    includeDialogue: true,
    includeSoundEffects: true,
    includeMusic: true,
    includeCameraDirections: true,
    includeTransitions: true,
    generateNarration: true,
    narrativeStyle: 'documentary' as 'documentary' | 'commercial' | 'narrative'
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, this would parse the storyboard file
      // For demo purposes, we'll create sample frames
      const sampleFrames: StoryboardFrame[] = [
        {
          id: '1',
          title: 'Opening Shot',
          description: 'Wide establishing shot of the city skyline at dawn. The camera slowly pans across the horizon as the sun rises, casting golden light on the buildings.',
          shotType: 'wide',
          cameraAngle: 'eye-level',
          cameraMovement: 'pan-right',
          duration: 8,
          voiceover: {
            text: 'Every morning, millions of people wake up in this city, each with their own dreams and aspirations.',
            speaker: 'Narrator',
            tone: 'contemplative',
            pacing: 'slow',
            emphasis: ['millions', 'dreams', 'aspirations']
          },
          soundEffects: [
            {
              type: 'ambient',
              description: 'City morning ambience',
              volume: 0.3,
              timing: 'sync'
            }
          ],
          music: {
            type: 'score',
            description: 'Gentle orchestral theme',
            mood: 'hopeful',
            volume: 0.4,
            fadeIn: true,
            fadeOut: false
          },
          notes: 'Golden hour lighting essential for this shot',
          order: 1
        },
        {
          id: '2',
          title: 'Character Introduction',
          description: 'Medium shot of Sarah walking through the busy street, checking her phone. She looks determined but slightly anxious.',
          shotType: 'medium',
          cameraAngle: 'eye-level',
          cameraMovement: 'tracking',
          duration: 6,
          dialogue: [
            {
              character: 'Sarah',
              text: 'I can\'t be late for this interview. This could change everything.',
              emotion: 'anxious',
              delivery: 'to herself, quietly'
            }
          ],
          soundEffects: [
            {
              type: 'ambient',
              description: 'Street traffic and pedestrians',
              volume: 0.5,
              timing: 'sync'
            },
            {
              type: 'sfx',
              description: 'Phone notification sound',
              volume: 0.7,
              timing: 'sync'
            }
          ],
          notes: 'Focus on Sarah\'s facial expressions',
          order: 2
        },
        {
          id: '3',
          title: 'Office Building',
          description: 'Low angle shot of a modern glass office building. The camera tilts up to emphasize its imposing height.',
          shotType: 'wide',
          cameraAngle: 'low-angle',
          cameraMovement: 'tilt-up',
          duration: 4,
          voiceover: {
            text: 'The corporate world can seem intimidating, but for Sarah, it represents opportunity.',
            speaker: 'Narrator',
            tone: 'dramatic',
            pacing: 'normal',
            emphasis: ['intimidating', 'opportunity']
          },
          music: {
            type: 'score',
            description: 'Building tension in the music',
            mood: 'anticipatory',
            volume: 0.6,
            fadeIn: false,
            fadeOut: false
          },
          notes: 'Emphasize the building\'s scale and grandeur',
          order: 3
        }
      ];
      
      setStoryboardFrames(sampleFrames);
    }
  };

  const handleConvert = async () => {
    if (storyboardFrames.length === 0) return;

    setIsConverting(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const script = ScriptProcessor.convertStoryboardToScript(storyboardFrames);
      
      // Apply conversion settings
      if (conversionSettings.generateNarration) {
        // Enhance voiceover content
        script.content = script.content.map(element => {
          if (element.type === 'voiceover') {
            const enhancedContent = ScriptProcessor.generateVoiceoverNarration(
              element.content,
              conversionSettings.narrativeStyle
            );
            return { ...element, content: enhancedContent };
          }
          return element;
        });
      }

      // Filter elements based on settings
      if (!conversionSettings.includeSoundEffects) {
        script.content = script.content.filter(el => el.type !== 'sound-effect');
      }
      if (!conversionSettings.includeMusic) {
        script.content = script.content.filter(el => el.type !== 'music');
      }
      if (!conversionSettings.includeCameraDirections) {
        script.content = script.content.filter(el => el.type !== 'shot');
      }
      if (!conversionSettings.includeTransitions) {
        script.content = script.content.filter(el => el.type !== 'transition');
      }

      onScriptGenerated(script);
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const getTotalDuration = () => {
    return storyboardFrames.reduce((sum, frame) => sum + frame.duration, 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Film className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Storyboard to Script Converter</h2>
          <p className="text-sm text-gray-600">Transform visual storyboards into formatted scripts</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Storyboard File
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".json,.xml,.csv,.pdf"
            className="hidden"
            id="storyboard-upload"
          />
          <label htmlFor="storyboard-upload" className="cursor-pointer">
            <Film className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Upload Storyboard</p>
            <p className="text-sm text-gray-600">
              Supports JSON, XML, CSV, or PDF storyboard files
            </p>
          </label>
        </div>
      </div>

      {/* Storyboard Preview */}
      {storyboardFrames.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Storyboard Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{storyboardFrames.length} frames</span>
              <span>Total duration: {formatTime(getTotalDuration())}</span>
            </div>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {storyboardFrames.map((frame, index) => (
              <div key={frame.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    Frame {index + 1}: {frame.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Camera className="w-4 h-4" />
                    <span>{frame.shotType}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{frame.duration}s</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{frame.description}</p>
                
                {frame.voiceover && (
                  <div className="bg-blue-50 p-2 rounded text-sm">
                    <strong>VO:</strong> {frame.voiceover.text}
                  </div>
                )}
                
                {frame.dialogue && frame.dialogue.length > 0 && (
                  <div className="bg-green-50 p-2 rounded text-sm mt-2">
                    <strong>Dialogue:</strong> {frame.dialogue[0].character}: "{frame.dialogue[0].text}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversion Settings */}
      {storyboardFrames.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Conversion Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionSettings.includeVoiceover}
                  onChange={(e) => setConversionSettings(prev => ({
                    ...prev,
                    includeVoiceover: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Voiceover</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionSettings.includeDialogue}
                  onChange={(e) => setConversionSettings(prev => ({
                    ...prev,
                    includeDialogue: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Dialogue</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionSettings.includeSoundEffects}
                  onChange={(e) => setConversionSettings(prev => ({
                    ...prev,
                    includeSoundEffects: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Sound Effects</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionSettings.includeMusic}
                  onChange={(e) => setConversionSettings(prev => ({
                    ...prev,
                    includeMusic: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Music Cues</span>
              </label>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionSettings.includeCameraDirections}
                  onChange={(e) => setConversionSettings(prev => ({
                    ...prev,
                    includeCameraDirections: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Camera Directions</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionSettings.includeTransitions}
                  onChange={(e) => setConversionSettings(prev => ({
                    ...prev,
                    includeTransitions: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Transitions</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionSettings.generateNarration}
                  onChange={(e) => setConversionSettings(prev => ({
                    ...prev,
                    generateNarration: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enhance Narration</span>
              </label>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Narrative Style
                </label>
                <select
                  value={conversionSettings.narrativeStyle}
                  onChange={(e) => setConversionSettings(prev => ({
                    ...prev,
                    narrativeStyle: e.target.value as any
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="documentary">Documentary</option>
                  <option value="commercial">Commercial</option>
                  <option value="narrative">Narrative</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Convert Button */}
      {storyboardFrames.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Ready to convert {storyboardFrames.length} frames into a formatted script
          </div>
          
          <button
            onClick={handleConvert}
            disabled={isConverting}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isConverting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Converting...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Convert to Script</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Features List */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Format Conversion</h4>
              <p className="text-sm text-gray-600">Converts visual storyboards into industry-standard script formats</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">AI Narration</h4>
              <p className="text-sm text-gray-600">Generates professional voiceover narration from visual descriptions</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Scene Transitions</h4>
              <p className="text-sm text-gray-600">Creates smooth narrative bridges between scenes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};