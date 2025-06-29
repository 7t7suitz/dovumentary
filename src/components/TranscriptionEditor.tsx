import React, { useState, useRef, useEffect } from 'react';
import { TranscriptionProject, TranscriptSegment, Script } from '../types/script';
import { ScriptProcessor } from '../utils/scriptProcessor';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Edit3, 
  Save, 
  Trash2,
  User,
  Clock,
  Volume2,
  Mic,
  FileText,
  Wand2,
  Settings
} from 'lucide-react';

interface TranscriptionEditorProps {
  project: TranscriptionProject;
  onProjectUpdate: (project: TranscriptionProject) => void;
  onScriptGenerate: (script: Script) => void;
}

export const TranscriptionEditor: React.FC<TranscriptionEditorProps> = ({
  project,
  onProjectUpdate,
  onScriptGenerate
}) => {
  const [currentSegment, setCurrentSegment] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [editedText, setEditedText] = useState<Record<string, string>>({});
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize edited text from project
    const initialEdits: Record<string, string> = {};
    project.transcript.forEach(segment => {
      initialEdits[segment.id] = segment.text;
    });
    setEditedText(initialEdits);
  }, [project]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentSegment) {
      const segment = project.transcript.find(s => s.id === currentSegment);
      if (segment && audioRef.current) {
        audioRef.current.currentTime = segment.startTime;
        setCurrentTime(segment.startTime);
      }
    }
  }, [currentSegment, project.transcript]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // Find current segment based on time
      const currentSegment = project.transcript.find(segment => 
        audioRef.current!.currentTime >= segment.startTime && 
        audioRef.current!.currentTime <= segment.endTime
      );
      
      if (currentSegment) {
        setCurrentSegment(currentSegment.id);
      }
    }
  };

  const handleSegmentClick = (segmentId: string) => {
    setCurrentSegment(segmentId);
    const segment = project.transcript.find(s => s.id === segmentId);
    if (segment && audioRef.current) {
      audioRef.current.currentTime = segment.startTime;
      setCurrentTime(segment.startTime);
      setIsPlaying(true);
    }
  };

  const handleTextEdit = (segmentId: string, text: string) => {
    setEditedText(prev => ({ ...prev, [segmentId]: text }));
  };

  const saveSegmentEdit = (segmentId: string) => {
    const updatedTranscript = project.transcript.map(segment => 
      segment.id === segmentId ? 
        { ...segment, text: editedText[segmentId], edited: true } : 
        segment
    );
    
    onProjectUpdate({
      ...project,
      transcript: updatedTranscript,
      updatedAt: new Date()
    });
  };

  const assignSpeaker = (segmentId: string, speakerId: string) => {
    const updatedTranscript = project.transcript.map(segment => 
      segment.id === segmentId ? { ...segment, speaker: speakerId } : segment
    );
    
    onProjectUpdate({
      ...project,
      transcript: updatedTranscript,
      updatedAt: new Date()
    });
  };

  const handleGenerateScript = () => {
    const script = ScriptProcessor.processTranscription(project);
    onScriptGenerate(script);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSpeakerColor = (speakerId?: string) => {
    if (!speakerId) return 'bg-gray-400';
    const speaker = project.speakers.find(s => s.id === speakerId);
    return speaker?.color ? `bg-[${speaker.color}]` : 'bg-blue-500';
  };

  const getSpeakerName = (speakerId?: string) => {
    if (!speakerId) return 'Unknown';
    const speaker = project.speakers.find(s => s.id === speakerId);
    return speaker?.name || 'Unknown';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Audio Player */}
      <div className="bg-gray-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{project.name}</h2>
            <div className="text-sm text-gray-400">
              {formatTime(currentTime)} / {formatTime(project.duration)}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
                  setCurrentTime(audioRef.current.currentTime);
                }
              }}
              className="p-2 text-gray-400 hover:text-white rounded-full"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-white text-gray-900 rounded-full hover:bg-gray-200"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.min(project.duration, audioRef.current.currentTime + 5);
                  setCurrentTime(audioRef.current.currentTime);
                }
              }}
              className="p-2 text-gray-400 hover:text-white rounded-full"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            
            <div className="flex-1">
              <div 
                ref={waveformRef}
                className="h-12 bg-gray-800 rounded-lg overflow-hidden"
              >
                {/* Waveform visualization would be rendered here */}
                <div 
                  className="h-full bg-blue-500 opacity-20"
                  style={{ width: `${(currentTime / project.duration) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="1"
                className="w-20"
                onChange={(e) => {
                  if (audioRef.current) {
                    audioRef.current.volume = parseFloat(e.target.value);
                  }
                }}
              />
            </div>
          </div>
          
          <audio
            ref={audioRef}
            src={project.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Transcript Editor */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Transcript Editor</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded ${
                    showSettings ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleGenerateScript}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Script</span>
                </button>
              </div>
            </div>

            {/* Transcript Segments */}
            <div className="space-y-4">
              {project.transcript.map((segment) => (
                <div
                  key={segment.id}
                  className={`border rounded-lg transition-all duration-200 ${
                    currentSegment === segment.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between p-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getSpeakerColor(segment.speaker)}`}></div>
                      <div className="relative">
                        <select
                          value={segment.speaker || ''}
                          onChange={(e) => assignSpeaker(segment.id, e.target.value)}
                          className="appearance-none bg-transparent pr-8 py-1 pl-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Speaker</option>
                          {project.speakers.map(speaker => (
                            <option key={speaker.id} value={speaker.id}>{speaker.name}</option>
                          ))}
                        </select>
                        <User className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(segment.startTime)} - {formatTime(segment.endTime)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleSegmentClick(segment.id)}
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        
                        {segment.edited ? (
                          <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Edited
                          </div>
                        ) : segment.confidence < 0.8 ? (
                          <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            Low Confidence
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <textarea
                      value={editedText[segment.id] || segment.text}
                      onChange={(e) => handleTextEdit(segment.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      disabled={segment.locked}
                    />
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            // AI enhancement logic
                            const enhancedText = editedText[segment.id] + " [AI enhanced]";
                            handleTextEdit(segment.id, enhancedText);
                          }}
                          className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
                        >
                          <Wand2 className="w-3 h-3" />
                          <span>Enhance</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            // Reset to original
                            handleTextEdit(segment.id, segment.text);
                          }}
                          className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                        >
                          <SkipBack className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => saveSegmentEdit(segment.id)}
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transcription Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Speakers</h4>
                  <div className="space-y-2">
                    {project.speakers.map(speaker => (
                      <div key={speaker.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: speaker.color }}
                          ></div>
                          <span className="text-sm font-medium">{speaker.name}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {speaker.segments} segments
                        </div>
                      </div>
                    ))}
                    
                    <button className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                      + Add Speaker
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Audio Enhancement</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={project.settings.enhanceAudio}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Noise Reduction</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={project.settings.punctuation}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Auto Punctuation</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={project.settings.filterProfanity}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Filter Profanity</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Script Generation</h4>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Script Format
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="documentary">Documentary</option>
                      <option value="interview">Interview</option>
                      <option value="narrative">Narrative</option>
                    </select>
                    
                    <label className="flex items-center space-x-2 mt-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Include Speaker Labels</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Include Timestamps</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Generate B-Roll Suggestions</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};