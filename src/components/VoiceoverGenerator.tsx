import React, { useState, useRef } from 'react';
import { VoiceoverGeneration, VoiceProfile, VoiceSettings } from '../types/script';
import { 
  Mic, 
  Play, 
  Pause, 
  Download, 
  Settings, 
  Volume2, 
  Clock,
  Save,
  Wand2,
  Sliders,
  RefreshCw,
  Trash2
} from 'lucide-react';

interface VoiceoverGeneratorProps {
  onVoiceoverGenerated: (voiceover: VoiceoverGeneration) => void;
}

export const VoiceoverGenerator: React.FC<VoiceoverGeneratorProps> = ({
  onVoiceoverGenerated
}) => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile | null>(null);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    speed: 1,
    pitch: 1,
    volume: 1,
    emphasis: [],
    pauses: [],
    pronunciation: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [generatedVoiceover, setGeneratedVoiceover] = useState<VoiceoverGeneration | null>(null);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  
  // Use Web Speech API directly instead of react-speech-kit
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(
    typeof window !== 'undefined' ? window.speechSynthesis : null
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load available voices
  React.useEffect(() => {
    if (speechSynthesis) {
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [speechSynthesis]);

  const availableVoices: VoiceProfile[] = [
    {
      id: 'documentary-male',
      name: 'Documentary Narrator (Male)',
      gender: 'male',
      age: 'adult',
      accent: 'American',
      style: 'documentary'
    },
    {
      id: 'documentary-female',
      name: 'Documentary Narrator (Female)',
      gender: 'female',
      age: 'adult',
      accent: 'British',
      style: 'documentary'
    },
    {
      id: 'conversational-male',
      name: 'Conversational (Male)',
      gender: 'male',
      age: 'adult',
      accent: 'American',
      style: 'conversational'
    },
    {
      id: 'conversational-female',
      name: 'Conversational (Female)',
      gender: 'female',
      age: 'adult',
      accent: 'American',
      style: 'conversational'
    },
    {
      id: 'dramatic-male',
      name: 'Dramatic (Male)',
      gender: 'male',
      age: 'adult',
      accent: 'British',
      style: 'dramatic'
    }
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Estimate duration based on word count
    const wordCount = e.target.value.split(/\s+/).filter(Boolean).length;
    const wordsPerMinute = 150 / voiceSettings.speed;
    const durationInMinutes = wordCount / wordsPerMinute;
    setEstimatedDuration(durationInMinutes * 60);
  };

  const handleVoiceSelect = (voiceId: string) => {
    const voice = availableVoices.find(v => v.id === voiceId);
    setSelectedVoice(voice || null);
  };

  const handleSettingChange = (setting: keyof VoiceSettings, value: any) => {
    setVoiceSettings(prev => ({ ...prev, [setting]: value }));
    
    // Update duration estimate when speed changes
    if (setting === 'speed') {
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const wordsPerMinute = 150 / value;
      const durationInMinutes = wordCount / wordsPerMinute;
      setEstimatedDuration(durationInMinutes * 60);
    }
  };

  const handleEmphasisAdd = (word: string) => {
    if (!voiceSettings.emphasis.includes(word)) {
      setVoiceSettings(prev => ({
        ...prev,
        emphasis: [...prev.emphasis, word]
      }));
    }
  };

  const handleEmphasisRemove = (word: string) => {
    setVoiceSettings(prev => ({
      ...prev,
      emphasis: prev.emphasis.filter(w => w !== word)
    }));
  };

  const handlePauseAdd = (location: number, duration: number) => {
    setVoiceSettings(prev => ({
      ...prev,
      pauses: [...prev.pauses, { location, duration, type: 'natural' }]
    }));
  };

  const handlePauseRemove = (index: number) => {
    setVoiceSettings(prev => ({
      ...prev,
      pauses: prev.pauses.filter((_, i) => i !== index)
    }));
  };

  const handleGenerate = async () => {
    if (!text || !selectedVoice) return;

    setIsGenerating(true);
    
    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const voiceover: VoiceoverGeneration = {
        text,
        voice: selectedVoice,
        settings: voiceSettings,
        status: 'completed'
      };
      
      setGeneratedVoiceover(voiceover);
      onVoiceoverGenerated(voiceover);
    } catch (error) {
      console.error('Voiceover generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPreview = () => {
    if (!speechSynthesis || !text) return;

    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      setIsPlaying(false);
      return;
    }

    // Find a matching voice from the browser's speech synthesis
    const matchingVoice = voices.find(v => 
      v.name.toLowerCase().includes(selectedVoice?.gender || '') ||
      v.name.toLowerCase().includes(selectedVoice?.accent.toLowerCase() || '')
    );

    const utterance = new SpeechSynthesisUtterance(text);
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    utterance.rate = voiceSettings.speed;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;

    utterance.onstart = () => {
      setSpeaking(true);
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
      setIsPlaying(false);
    };

    speechSynthesis.speak(utterance);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const enhanceText = () => {
    // Simple enhancement logic
    const enhancedText = text
      .replace(/\b(very|really|quite)\b/g, 'remarkably')
      .replace(/\b(good|nice)\b/g, 'exceptional')
      .replace(/\b(bad|poor)\b/g, 'challenging')
      .replace(/\b(big|large)\b/g, 'substantial')
      .replace(/\b(small|little)\b/g, 'modest');
    
    setText(enhancedText);
  };

  const addSmartPauses = () => {
    // Add pauses at punctuation
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    let currentPosition = 0;
    const newPauses = [];
    
    for (const sentence of sentences) {
      currentPosition += sentence.length + 1; // +1 for the punctuation
      newPauses.push({
        location: currentPosition,
        duration: 0.5,
        type: 'natural' as const
      });
    }
    
    setVoiceSettings(prev => ({
      ...prev,
      pauses: [...prev.pauses, ...newPauses]
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Voiceover Generator</h2>
          <p className="text-sm text-gray-600">Create professional voiceover narration for your script</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voiceover Script
          </label>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your voiceover script here..."
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Est. Duration: {formatTime(estimatedDuration)}</span>
            </div>
            
            <button
              onClick={enhanceText}
              className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm"
            >
              <Wand2 className="w-4 h-4" />
              <span>Enhance Text</span>
            </button>
          </div>
        </div>

        {/* Voice Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voice Selection
          </label>
          <select
            value={selectedVoice?.id || ''}
            onChange={(e) => handleVoiceSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
          >
            <option value="">Select a voice</option>
            {availableVoices.map(voice => (
              <option key={voice.id} value={voice.id}>
                {voice.name} ({voice.accent})
              </option>
            ))}
          </select>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Speed</label>
                <span className="text-xs text-gray-500">{voiceSettings.speed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.speed}
                onChange={(e) => handleSettingChange('speed', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Pitch</label>
                <span className="text-xs text-gray-500">{voiceSettings.pitch}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={voiceSettings.pitch}
                onChange={(e) => handleSettingChange('pitch', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Volume</label>
                <span className="text-xs text-gray-500">{Math.round(voiceSettings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceSettings.volume}
                onChange={(e) => handleSettingChange('volume', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Settings className="w-4 h-4" />
              <span>{showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings</span>
            </button>
          </div>
          
          {showAdvancedSettings && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Word Emphasis
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add word to emphasize"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          handleEmphasisAdd(input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={addSmartPauses}
                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                      title="Add Smart Pauses"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {voiceSettings.emphasis.map((word, index) => (
                      <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        <span>{word}</span>
                        <button
                          onClick={() => handleEmphasisRemove(word)}
                          className="text-purple-500 hover:text-purple-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    {voiceSettings.emphasis.length === 0 && (
                      <span className="text-xs text-gray-500">No emphasized words</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pauses
                  </label>
                  <div className="space-y-2">
                    {voiceSettings.pauses.map((pause, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                        <span className="text-sm">
                          At position {pause.location}: {pause.duration}s pause
                        </span>
                        <button
                          onClick={() => handlePauseRemove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {voiceSettings.pauses.length === 0 && (
                      <span className="text-xs text-gray-500">No custom pauses</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview and Generate */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPreview}
              disabled={!text || !selectedVoice}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>Preview</span>
            </button>
            
            {generatedVoiceover && (
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={!text || !selectedVoice || isGenerating}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Generate Voiceover</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Features List */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Professional Voices</h4>
              <p className="text-sm text-gray-600">Multiple voice profiles with adjustable characteristics</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sliders className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Fine-Tuned Control</h4>
              <p className="text-sm text-gray-600">Adjust speed, pitch, emphasis, and pauses for perfect delivery</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Text Enhancement</h4>
              <p className="text-sm text-gray-600">AI-powered text improvements for professional narration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};