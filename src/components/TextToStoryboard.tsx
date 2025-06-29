import React, { useState } from 'react';
import { StoryboardAI } from '../utils/storyboardAI';
import { StoryboardFrame } from '../types/storyboard';
import { Wand2, FileText, Loader, AlertCircle } from 'lucide-react';

interface TextToStoryboardProps {
  onFramesGenerated: (frames: StoryboardFrame[]) => void;
}

export const TextToStoryboard: React.FC<TextToStoryboardProps> = ({ onFramesGenerated }) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter a description to generate storyboard frames');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Split text into scenes/sentences for multiple frames
      const scenes = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const frames: StoryboardFrame[] = [];

      for (let i = 0; i < Math.min(scenes.length, 8); i++) {
        const scene = scenes[i].trim();
        if (scene) {
          const frame = await StoryboardAI.generateFrameFromText(scene, i);
          frames.push(frame);
        }
      }

      // If we only got one scene, create a basic shot sequence
      if (frames.length === 1) {
        const baseFrame = frames[0];
        const shotSequence = StoryboardAI.generateShotSequence(text);
        
        for (let i = 1; i < Math.min(shotSequence.length, 4); i++) {
          const newFrame = {
            ...baseFrame,
            id: Math.random().toString(36).substr(2, 9),
            title: `${baseFrame.title} - Shot ${i + 1}`,
            shotType: shotSequence[i],
            cameraAngle: StoryboardAI.suggestCameraAngle(text, shotSequence[i]),
            cameraMovement: StoryboardAI.suggestCameraMovement(text, shotSequence[i]),
            timestamp: Date.now() + i
          };
          frames.push(newFrame);
        }
      }

      // Set transitions between frames
      for (let i = 0; i < frames.length - 1; i++) {
        frames[i].transition = StoryboardAI.suggestTransition(frames[i], frames[i + 1]);
      }

      onFramesGenerated(frames);
      setText('');
    } catch (err) {
      setError('Failed to generate storyboard. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const exampleTexts = [
    "A detective enters a dimly lit office. Rain patters against the window as he sits at his desk, examining evidence photos. Suddenly, his phone rings.",
    "Children play in a sunny park while their parents watch from benches. A dog runs freely across the grass, chasing a frisbee.",
    "In a bustling kitchen, a chef carefully plates an elegant dish. Steam rises from the hot food as servers rush past with orders.",
    "An elderly woman sits by her window, knitting while watching the street below. A young neighbor waves from across the way."
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Storyboard Generator</h2>
          <p className="text-sm text-gray-600">Transform your text descriptions into visual storyboards</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scene Description
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your scene in detail. Include characters, actions, setting, mood, and any specific visual elements you want to capture..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {text.length} characters • Tip: Use multiple sentences for multiple frames
            </span>
            <span className="text-xs text-gray-500">
              Max 8 frames per generation
            </span>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Storyboard</span>
              </>
            )}
          </button>

          <div className="text-sm text-gray-500">
            AI will analyze your text and create frames with camera angles, lighting, and audio suggestions
          </div>
        </div>
      </div>

      {/* Example Texts */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Try these examples:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exampleTexts.map((example, index) => (
            <button
              key={index}
              onClick={() => setText(example)}
              className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <p className="text-sm text-gray-700 line-clamp-3">{example}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};