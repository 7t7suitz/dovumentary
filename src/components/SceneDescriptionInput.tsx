import React, { useState } from 'react';
import { Wand2, FileText, Loader, AlertCircle, Lightbulb } from 'lucide-react';

interface SceneDescriptionInputProps {
  onSceneGenerated: (scene: any) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export const SceneDescriptionInput: React.FC<SceneDescriptionInputProps> = ({
  onSceneGenerated,
  isGenerating,
  setIsGenerating
}) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please enter a scene description');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { SceneAI } = await import('../utils/sceneAI');
      const scene = await SceneAI.analyzeSceneDescription(description);
      onSceneGenerated(scene);
    } catch (err) {
      setError('Failed to generate scene. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const exampleDescriptions = [
    "A documentary interview with an elderly woman in her cozy living room, natural lighting from a large window, intimate and warm atmosphere",
    "Corporate executive giving a presentation in a modern glass office, dramatic lighting with city skyline in background, professional and dynamic",
    "Two friends having an emotional conversation in a quiet park during golden hour, handheld camera for intimacy, peaceful yet poignant",
    "Chef preparing signature dish in busy restaurant kitchen, energetic atmosphere with steam and movement, multiple camera angles"
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Scene Composition Generator</h2>
          <p className="text-sm text-gray-600">Describe your scene to generate complete production specifications</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scene Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your scene in detail. Include location, mood, lighting preferences, camera style, and any specific requirements..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {description.length} characters • Be specific about mood, lighting, and style
            </span>
            <span className="text-xs text-gray-500">
              AI will generate complete production package
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
            disabled={isGenerating || !description.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating Scene...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Scene Composition</span>
              </>
            )}
          </button>

          <div className="text-sm text-gray-500">
            AI will create lighting, audio, equipment, and schedule recommendations
          </div>
        </div>
      </div>

      {/* Example Descriptions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
          Example Scene Descriptions:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exampleDescriptions.map((example, index) => (
            <button
              key={index}
              onClick={() => setDescription(example)}
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