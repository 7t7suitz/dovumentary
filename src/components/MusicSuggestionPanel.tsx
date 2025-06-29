import React, { useState } from 'react';
import { MusicSuggestion, SoundDesignSuggestion } from '../types/emotion';
import { Music, Volume2, Play, Pause, Download, Plus, Edit3, Trash2, ChevronDown, ChevronRight, Clock, Sliders, AudioWaveform as Waveform, Layers } from 'lucide-react';

interface MusicSuggestionPanelProps {
  musicSuggestions: MusicSuggestion[];
  soundSuggestions: SoundDesignSuggestion[];
  onMusicUpdate?: (updatedSuggestion: MusicSuggestion) => void;
  onSoundUpdate?: (updatedSuggestion: SoundDesignSuggestion) => void;
  onMusicAdd?: (newSuggestion: MusicSuggestion) => void;
  onSoundAdd?: (newSuggestion: SoundDesignSuggestion) => void;
  onMusicDelete?: (id: string) => void;
  onSoundDelete?: (id: string) => void;
}

export const MusicSuggestionPanel: React.FC<MusicSuggestionPanelProps> = ({
  musicSuggestions,
  soundSuggestions,
  onMusicUpdate,
  onSoundUpdate,
  onMusicAdd,
  onSoundAdd,
  onMusicDelete,
  onSoundDelete
}) => {
  const [expandedMusic, setExpandedMusic] = useState<Set<string>>(new Set());
  const [expandedSound, setExpandedSound] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [editingMusic, setEditingMusic] = useState<string | null>(null);
  const [editingSound, setEditingSound] = useState<string | null>(null);
  const [showAddMusic, setShowAddMusic] = useState(false);
  const [showAddSound, setShowAddSound] = useState(false);
  const [newMusic, setNewMusic] = useState<Partial<MusicSuggestion>>({
    position: 0,
    duration: 30,
    emotionalGoal: '',
    genre: [],
    mood: '',
    tempo: 'moderate',
    intensity: 0.5,
    instrumentation: [],
    transitionType: 'fade-in',
    notes: ''
  });
  const [newSound, setNewSound] = useState<Partial<SoundDesignSuggestion>>({
    position: 0,
    duration: 5,
    type: 'ambient',
    description: '',
    emotionalPurpose: '',
    intensity: 0.5,
    layering: [],
    notes: ''
  });

  const toggleMusicExpanded = (id: string) => {
    const newExpanded = new Set(expandedMusic);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMusic(newExpanded);
  };

  const toggleSoundExpanded = (id: string) => {
    const newExpanded = new Set(expandedSound);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSound(newExpanded);
  };

  const togglePlayback = (id: string) => {
    setIsPlaying(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddMusic = () => {
    if (!newMusic.emotionalGoal || !newMusic.mood) return;
    
    if (onMusicAdd) {
      onMusicAdd({
        id: generateId(),
        position: newMusic.position || 0,
        duration: newMusic.duration || 30,
        emotionalGoal: newMusic.emotionalGoal || '',
        genre: newMusic.genre || [],
        mood: newMusic.mood || '',
        tempo: newMusic.tempo || 'moderate',
        intensity: newMusic.intensity || 0.5,
        instrumentation: newMusic.instrumentation || [],
        transitionType: newMusic.transitionType || 'fade-in',
        notes: newMusic.notes || ''
      });
    }
    
    setNewMusic({
      position: 0,
      duration: 30,
      emotionalGoal: '',
      genre: [],
      mood: '',
      tempo: 'moderate',
      intensity: 0.5,
      instrumentation: [],
      transitionType: 'fade-in',
      notes: ''
    });
    setShowAddMusic(false);
  };

  const handleAddSound = () => {
    if (!newSound.description || !newSound.emotionalPurpose) return;
    
    if (onSoundAdd) {
      onSoundAdd({
        id: generateId(),
        position: newSound.position || 0,
        duration: newSound.duration || 5,
        type: newSound.type || 'ambient',
        description: newSound.description || '',
        emotionalPurpose: newSound.emotionalPurpose || '',
        intensity: newSound.intensity || 0.5,
        layering: newSound.layering || [],
        notes: newSound.notes || ''
      });
    }
    
    setNewSound({
      position: 0,
      duration: 5,
      type: 'ambient',
      description: '',
      emotionalPurpose: '',
      intensity: 0.5,
      layering: [],
      notes: ''
    });
    setShowAddSound(false);
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="space-y-8">
      {/* Music Suggestions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Music className="w-5 h-5 mr-2 text-indigo-500" />
            Music Suggestions
          </h3>
          <button
            onClick={() => setShowAddMusic(!showAddMusic)}
            className="flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Music</span>
          </button>
        </div>
        
        {/* Add Music Form */}
        {showAddMusic && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <h4 className="font-medium text-gray-900 mb-3">Add Music Suggestion</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emotional Goal
                </label>
                <input
                  type="text"
                  value={newMusic.emotionalGoal}
                  onChange={(e) => setNewMusic({ ...newMusic, emotionalGoal: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Enhance feeling of nostalgia"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mood
                </label>
                <input
                  type="text"
                  value={newMusic.mood}
                  onChange={(e) => setNewMusic({ ...newMusic, mood: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., melancholic, joyful"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newMusic.position ? newMusic.position * 100 : 0}
                  onChange={(e) => setNewMusic({ ...newMusic, position: Number(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  value={newMusic.duration || 30}
                  onChange={(e) => setNewMusic({ ...newMusic, duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo
                </label>
                <select
                  value={newMusic.tempo}
                  onChange={(e) => setNewMusic({ ...newMusic, tempo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="slow">Slow</option>
                  <option value="moderate">Moderate</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intensity
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={newMusic.intensity || 0.5}
                  onChange={(e) => setNewMusic({ ...newMusic, intensity: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtle</span>
                  <span>Moderate</span>
                  <span>Intense</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transition Type
                </label>
                <select
                  value={newMusic.transitionType}
                  onChange={(e) => setNewMusic({ ...newMusic, transitionType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="fade-in">Fade In</option>
                  <option value="fade-out">Fade Out</option>
                  <option value="cross-fade">Cross Fade</option>
                  <option value="hard-cut">Hard Cut</option>
                  <option value="gradual">Gradual</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newMusic.notes}
                  onChange={(e) => setNewMusic({ ...newMusic, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Additional notes about this music suggestion..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddMusic(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMusic}
                disabled={!newMusic.emotionalGoal || !newMusic.mood}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Music Suggestion
              </button>
            </div>
          </div>
        )}
        
        {/* Music Suggestions List */}
        <div className="space-y-4">
          {musicSuggestions.length === 0 ? (
            <div className="text-center py-8">
              <Music className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Music Suggestions</h4>
              <p className="text-gray-600 mb-4">Add music suggestions to enhance emotional impact</p>
              <button
                onClick={() => setShowAddMusic(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add First Suggestion
              </button>
            </div>
          ) : (
            musicSuggestions.map(suggestion => (
              <div 
                key={suggestion.id} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleMusicExpanded(suggestion.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Music className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{suggestion.emotionalGoal}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{Math.round(suggestion.position * 100)}%</span>
                        <span>•</span>
                        <span>{suggestion.duration}s</span>
                        <span>•</span>
                        <span className="capitalize">{suggestion.mood}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayback(suggestion.id);
                      }}
                      className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded-full"
                    >
                      {isPlaying[suggestion.id] ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    
                    {expandedMusic.has(suggestion.id) ? 
                      <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    }
                  </div>
                </div>
                
                {expandedMusic.has(suggestion.id) && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Genre & Style</h5>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {suggestion.genre.map((genre, index) => (
                            <span key={index} className="px-2 py-0.5 bg-indigo-100 rounded-full text-xs text-indigo-800">
                              {genre}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{suggestion.tempo} tempo</span>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Instrumentation</h5>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.instrumentation.map((instrument, index) => (
                            <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-800">
                              {instrument}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Intensity & Transition</h5>
                      <div className="flex items-center space-x-2 mb-2">
                        <Sliders className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Intensity:</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-indigo-500 rounded-full" 
                            style={{ width: `${suggestion.intensity * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round(suggestion.intensity * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Waveform className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Transition:</span>
                        <span className="text-sm text-gray-700 capitalize">
                          {suggestion.transitionType.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    {suggestion.notes && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Notes</h5>
                        <p className="text-sm text-gray-600">{suggestion.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onMusicDelete && onMusicDelete(suggestion.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingMusic(suggestion.id)}
                        className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* Download functionality */}}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sound Design Suggestions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Volume2 className="w-5 h-5 mr-2 text-green-500" />
            Sound Design Suggestions
          </h3>
          <button
            onClick={() => setShowAddSound(!showAddSound)}
            className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sound</span>
          </button>
        </div>
        
        {/* Add Sound Form */}
        {showAddSound && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
            <h4 className="font-medium text-gray-900 mb-3">Add Sound Design Suggestion</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newSound.description}
                  onChange={(e) => setNewSound({ ...newSound, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Gentle rain ambience"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emotional Purpose
                </label>
                <input
                  type="text"
                  value={newSound.emotionalPurpose}
                  onChange={(e) => setNewSound({ ...newSound, emotionalPurpose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Create calming atmosphere"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newSound.type}
                  onChange={(e) => setNewSound({ ...newSound, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="ambient">Ambient</option>
                  <option value="effect">Effect</option>
                  <option value="transition">Transition</option>
                  <option value="accent">Accent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newSound.position ? newSound.position * 100 : 0}
                  onChange={(e) => setNewSound({ ...newSound, position: Number(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  value={newSound.duration || 5}
                  onChange={(e) => setNewSound({ ...newSound, duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intensity
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={newSound.intensity || 0.5}
                  onChange={(e) => setNewSound({ ...newSound, intensity: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtle</span>
                  <span>Moderate</span>
                  <span>Intense</span>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newSound.notes}
                  onChange={(e) => setNewSound({ ...newSound, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Additional notes about this sound design suggestion..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddSound(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSound}
                disabled={!newSound.description || !newSound.emotionalPurpose}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Sound Suggestion
              </button>
            </div>
          </div>
        )}
        
        {/* Sound Suggestions List */}
        <div className="space-y-4">
          {soundSuggestions.length === 0 ? (
            <div className="text-center py-8">
              <Volume2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Sound Design Suggestions</h4>
              <p className="text-gray-600 mb-4">Add sound design suggestions to enhance emotional impact</p>
              <button
                onClick={() => setShowAddSound(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add First Suggestion
              </button>
            </div>
          ) : (
            soundSuggestions.map(suggestion => (
              <div 
                key={suggestion.id} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleSoundExpanded(suggestion.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Volume2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{suggestion.description}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{Math.round(suggestion.position * 100)}%</span>
                        <span>•</span>
                        <span>{suggestion.duration}s</span>
                        <span>•</span>
                        <span className="capitalize">{suggestion.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayback(suggestion.id);
                      }}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full"
                    >
                      {isPlaying[suggestion.id] ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    
                    {expandedSound.has(suggestion.id) ? 
                      <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    }
                  </div>
                </div>
                
                {expandedSound.has(suggestion.id) && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Emotional Purpose</h5>
                      <p className="text-sm text-gray-600">{suggestion.emotionalPurpose}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Intensity & Layering</h5>
                      <div className="flex items-center space-x-2 mb-2">
                        <Sliders className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Intensity:</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${suggestion.intensity * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round(suggestion.intensity * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Layering:</span>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.layering.map((layer, index) => (
                            <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-800">
                              {layer}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {suggestion.notes && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Notes</h5>
                        <p className="text-sm text-gray-600">{suggestion.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onSoundDelete && onSoundDelete(suggestion.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingSound(suggestion.id)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* Download functionality */}}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};