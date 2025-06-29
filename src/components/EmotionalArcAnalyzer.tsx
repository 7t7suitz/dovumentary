import React, { useState } from 'react';
import { EmotionalAnalysis, EmotionalArc, EmotionalBeat, MusicSuggestion, SoundDesignSuggestion, InterviewPlacementSuggestion, EmpathyMap, AccessibilityConsideration } from '../types/emotion';
import { EmotionalJourneyTimeline } from './EmotionalJourneyTimeline';
import { MusicSuggestionPanel } from './MusicSuggestionPanel';
import { EmpathyMapCreator } from './EmpathyMapCreator';
import { 
  Heart, 
  Upload, 
  FileText, 
  Music, 
  Volume2, 
  Mic, 
  Users, 
  Accessibility,
  Download,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Settings,
  BarChart2
} from 'lucide-react';

export const EmotionalArcAnalyzer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'music' | 'empathy' | 'accessibility'>('overview');
  const [analysis, setAnalysis] = useState<EmotionalAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAddEmpathyMap, setShowAddEmpathyMap] = useState(false);
  const [selectedElement, setSelectedElement] = useState<{ type: string; id: string } | null>(null);
  
  // Mock data for demonstration
  const mockAnalysis: EmotionalAnalysis = {
    id: '1',
    documentId: 'doc-1',
    title: 'The Journey Home',
    overallTone: 'contemplative',
    emotionalArcs: [
      {
        id: 'arc-1',
        name: 'Opening Reflection',
        description: 'A contemplative beginning that establishes the subject\'s connection to their past',
        startPosition: 0,
        endPosition: 0.2,
        startIntensity: 0.3,
        peakIntensity: 0.5,
        endIntensity: 0.4,
        dominantEmotion: 'nostalgia',
        secondaryEmotions: ['curiosity', 'hope'],
        resolution: 'partial',
        audienceImpact: 0.6
      },
      {
        id: 'arc-2',
        name: 'Conflict Revelation',
        description: 'The central challenge or obstacle is revealed, creating tension',
        startPosition: 0.2,
        endPosition: 0.5,
        startIntensity: 0.4,
        peakIntensity: 0.8,
        endIntensity: 0.7,
        dominantEmotion: 'anxiety',
        secondaryEmotions: ['frustration', 'determination'],
        resolution: 'unresolved',
        audienceImpact: 0.8
      },
      {
        id: 'arc-3',
        name: 'Resolution Journey',
        description: 'The path toward resolution and acceptance',
        startPosition: 0.5,
        endPosition: 0.9,
        startIntensity: 0.7,
        peakIntensity: 0.9,
        endIntensity: 0.5,
        dominantEmotion: 'hope',
        secondaryEmotions: ['determination', 'relief'],
        resolution: 'resolved',
        audienceImpact: 0.9
      },
      {
        id: 'arc-4',
        name: 'Final Reflection',
        description: 'A reflective conclusion that brings emotional closure',
        startPosition: 0.9,
        endPosition: 1.0,
        startIntensity: 0.5,
        peakIntensity: 0.7,
        endIntensity: 0.4,
        dominantEmotion: 'peace',
        secondaryEmotions: ['satisfaction', 'hope'],
        resolution: 'resolved',
        audienceImpact: 0.7
      }
    ],
    emotionalBeats: [
      {
        id: 'beat-1',
        position: 0.05,
        emotion: 'nostalgia',
        intensity: 0.4,
        duration: 15,
        trigger: 'Childhood home footage',
        context: 'Subject views old family photos'
      },
      {
        id: 'beat-2',
        position: 0.15,
        emotion: 'joy',
        intensity: 0.5,
        duration: 10,
        trigger: 'Reunion with old friend',
        context: 'Unexpected meeting brings back positive memories'
      },
      {
        id: 'beat-3',
        position: 0.3,
        emotion: 'anxiety',
        intensity: 0.7,
        duration: 20,
        trigger: 'Revelation of family secret',
        context: 'Subject learns troubling information about their past'
      },
      {
        id: 'beat-4',
        position: 0.45,
        emotion: 'anger',
        intensity: 0.8,
        duration: 15,
        trigger: 'Confrontation',
        context: 'Subject confronts family member about deception'
      },
      {
        id: 'beat-5',
        position: 0.6,
        emotion: 'determination',
        intensity: 0.75,
        duration: 25,
        trigger: 'Decision to seek truth',
        context: 'Subject commits to discovering full story'
      },
      {
        id: 'beat-6',
        position: 0.75,
        emotion: 'relief',
        intensity: 0.6,
        duration: 20,
        trigger: 'Discovery of letters',
        context: 'Finding evidence that explains family history'
      },
      {
        id: 'beat-7',
        position: 0.85,
        emotion: 'forgiveness',
        intensity: 0.7,
        duration: 30,
        trigger: 'Reconciliation scene',
        context: 'Subject forgives family member'
      },
      {
        id: 'beat-8',
        position: 0.95,
        emotion: 'peace',
        intensity: 0.6,
        duration: 25,
        trigger: 'Return to childhood home',
        context: 'Subject revisits location with new perspective'
      }
    ],
    audienceEngagement: {
      peakEngagementPoints: [
        {
          position: 0.3,
          score: 0.85,
          reason: 'Emotional revelation creates strong viewer interest',
          suggestion: 'Consider extending this moment slightly to let impact resonate'
        },
        {
          position: 0.75,
          score: 0.9,
          reason: 'Discovery of truth creates powerful catharsis',
          suggestion: 'Enhance with subtle music cue to amplify emotional impact'
        }
      ],
      lowEngagementPoints: [
        {
          position: 0.55,
          score: 0.4,
          reason: 'Extended exposition slows narrative momentum',
          suggestion: 'Consider tightening this section or adding visual interest'
        }
      ],
      overallEngagementScore: 0.75,
      attentionRetentionScore: 0.8,
      emotionalImpactScore: 0.85,
      memorabilityScore: 0.7,
      recommendedPacingAdjustments: [
        {
          startPosition: 0.5,
          endPosition: 0.6,
          currentPacing: 'too-slow',
          recommendation: 'Condense exposition and increase visual variety',
          priority: 'medium'
        }
      ]
    },
    musicSuggestions: [
      {
        id: 'music-1',
        position: 0,
        duration: 45,
        emotionalGoal: 'Establish nostalgic, contemplative mood',
        genre: ['ambient', 'classical'],
        mood: 'reflective',
        tempo: 'slow',
        intensity: 0.4,
        instrumentation: ['piano', 'strings', 'light percussion'],
        transitionType: 'fade-in',
        notes: 'Gentle piano theme with subtle string accompaniment'
      },
      {
        id: 'music-2',
        position: 0.3,
        duration: 30,
        emotionalGoal: 'Build tension during revelation',
        genre: ['orchestral', 'dramatic'],
        mood: 'tense',
        tempo: 'moderate',
        intensity: 0.7,
        instrumentation: ['strings', 'percussion', 'brass'],
        transitionType: 'gradual',
        notes: 'Gradually increasing intensity with string ostinato'
      },
      {
        id: 'music-3',
        position: 0.6,
        duration: 60,
        emotionalGoal: 'Support emotional journey toward resolution',
        genre: ['cinematic', 'emotional'],
        mood: 'hopeful',
        tempo: 'moderate',
        intensity: 0.6,
        instrumentation: ['piano', 'strings', 'guitar'],
        transitionType: 'cross-fade',
        notes: 'Theme that evolves from minor to major tonality'
      },
      {
        id: 'music-4',
        position: 0.85,
        duration: 90,
        emotionalGoal: 'Provide emotional closure and reflection',
        genre: ['ambient', 'cinematic'],
        mood: 'peaceful',
        tempo: 'slow',
        intensity: 0.5,
        instrumentation: ['piano', 'strings', 'ambient textures'],
        transitionType: 'fade-out',
        notes: 'Return to opening theme with fuller orchestration'
      }
    ],
    soundDesignSuggestions: [
      {
        id: 'sound-1',
        position: 0.05,
        duration: 20,
        type: 'ambient',
        description: 'Subtle childhood environment sounds',
        emotionalPurpose: 'Enhance nostalgia of family photos',
        intensity: 0.3,
        layering: ['distant children playing', 'gentle breeze', 'old film projector'],
        notes: 'Keep very subtle, just enough to evoke memory'
      },
      {
        id: 'sound-2',
        position: 0.3,
        duration: 15,
        type: 'effect',
        description: 'Heartbeat with subtle low frequency rumble',
        emotionalPurpose: 'Underscore anxiety of revelation',
        intensity: 0.6,
        layering: ['heartbeat', 'low rumble', 'room tone drop'],
        notes: 'Gradually increase intensity then abruptly stop'
      },
      {
        id: 'sound-3',
        position: 0.75,
        duration: 10,
        type: 'effect',
        description: 'Paper rustling and discovery moment',
        emotionalPurpose: 'Highlight importance of finding letters',
        intensity: 0.5,
        layering: ['paper handling', 'subtle gasp', 'room tone shift'],
        notes: 'Emphasize texture of old paper'
      },
      {
        id: 'sound-4',
        position: 0.95,
        duration: 30,
        type: 'ambient',
        description: 'Return to childhood home environment',
        emotionalPurpose: 'Create sense of closure and coming full circle',
        intensity: 0.4,
        layering: ['gentle wind', 'distant voices', 'footsteps on familiar ground'],
        notes: 'Echo elements from opening but with subtle differences'
      }
    ],
    interviewSuggestions: [
      {
        id: 'interview-1',
        position: 0.25,
        emotionalContext: 'After establishing nostalgia but before revelation',
        subjectMood: 'reflective',
        questionType: 'reflective',
        suggestedQuestions: [
          'What feelings come up when you look at these old photos?',
          'How would you describe your relationship with your family growing up?',
          'When did you first sense there might be more to the story?'
        ],
        visualDirection: 'Medium close-up, soft lighting, family photos visible in background',
        notes: 'Allow for pauses and emotional processing'
      },
      {
        id: 'interview-2',
        position: 0.55,
        emotionalContext: 'After confrontation, during period of determination',
        subjectMood: 'resolute',
        questionType: 'challenging',
        suggestedQuestions: [
          'What gave you the strength to pursue this difficult truth?',
          'How did this revelation change your understanding of your past?',
          'What were you hoping to discover?'
        ],
        visualDirection: 'Slightly closer framing, more direct lighting, neutral background',
        notes: 'Subject may be emotional but composed, focus on determination'
      },
      {
        id: 'interview-3',
        position: 0.9,
        emotionalContext: 'After resolution, during period of acceptance',
        subjectMood: 'peaceful',
        questionType: 'reflective',
        suggestedQuestions: [
          'How has this journey changed you?',
          'What would you say to others facing similar family secrets?',
          'What does home mean to you now?'
        ],
        visualDirection: 'Warm lighting, relaxed composition, possibly in childhood home location',
        notes: 'Allow for thoughtful reflection and emotional conclusion'
      }
    ],
    empathyMaps: [
      {
        id: 'empathy-1',
        audienceSegment: 'General Viewers',
        demographics: ['25-54', 'diverse backgrounds', 'interested in human stories'],
        emotionalNeeds: ['connection', 'understanding', 'reflection'],
        painPoints: ['complexity', 'emotional distance', 'lack of context'],
        goals: ['be emotionally moved', 'understand the human experience', 'reflect on own family'],
        thoughtsAndFeelings: ['curiosity', 'empathy', 'reflection'],
        resonantMoments: [
          { position: 0.3, reason: 'Universal moment of discovery' },
          { position: 0.75, reason: 'Emotional catharsis' }
        ],
        dissonantMoments: [
          { position: 0.55, reason: 'Pacing issues may lose attention' }
        ],
        engagementStrategies: [
          'Use universal themes of family and identity',
          'Balance emotional moments with context',
          'Provide clear narrative throughline'
        ]
      },
      {
        id: 'empathy-2',
        audienceSegment: 'People with Family Estrangement',
        demographics: ['30-65', 'experienced family conflict', 'seeking resolution'],
        emotionalNeeds: ['validation', 'hope', 'understanding'],
        painPoints: ['triggering content', 'oversimplification', 'unrealistic resolution'],
        goals: ['see authentic representation', 'find hope in resolution', 'process own experiences'],
        thoughtsAndFeelings: ['recognition', 'emotional resonance', 'personal reflection'],
        resonantMoments: [
          { position: 0.45, reason: 'Authentic portrayal of family conflict' },
          { position: 0.85, reason: 'Nuanced approach to forgiveness' }
        ],
        dissonantMoments: [
          { position: 0.95, reason: 'Resolution may feel too neat for some' }
        ],
        engagementStrategies: [
          'Acknowledge complexity of family relationships',
          'Show realistic path to healing',
          'Avoid oversimplification of reconciliation',
          'Include expert perspectives on family dynamics'
        ]
      }
    ],
    accessibilityConsiderations: [
      {
        id: 'access-1',
        type: 'emotional',
        description: 'Content contains emotional family conflict that may be triggering',
        affectedAudience: 'Viewers with family trauma or PTSD',
        positions: [0.3, 0.45],
        recommendations: [
          'Provide content warning at beginning',
          'Consider offering a less intense alternative cut',
          'Ensure marketing materials indicate emotional content'
        ],
        priority: 'high'
      },
      {
        id: 'access-2',
        type: 'visual',
        description: 'Key emotional moments rely heavily on subtle facial expressions',
        affectedAudience: 'Viewers with visual impairments',
        positions: [0.3, 0.75, 0.85],
        recommendations: [
          'Ensure audio description captures emotional nuance',
          'Consider adding subtle narrative context',
          'Use sound design to reinforce emotional shifts'
        ],
        priority: 'medium'
      },
      {
        id: 'access-3',
        type: 'auditory',
        description: 'Important revelation includes whispered dialogue',
        affectedAudience: 'Viewers with hearing impairments',
        positions: [0.3],
        recommendations: [
          'Ensure clear captioning',
          'Consider visual reinforcement of key information',
          'Adjust audio mix to emphasize dialogue'
        ],
        priority: 'high'
      }
    ],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-20')
  };

  const handleAnalyzeDocument = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleElementClick = (elementType: string, elementId: string) => {
    setSelectedElement({ type: elementType, id: elementId });
  };

  const handleAddEmpathyMap = (map: EmpathyMap) => {
    if (!analysis) return;
    
    const updatedAnalysis = {
      ...analysis,
      empathyMaps: [...analysis.empathyMaps, map]
    };
    
    setAnalysis(updatedAnalysis);
    setShowAddEmpathyMap(false);
  };

  const handleAddMusicSuggestion = (suggestion: MusicSuggestion) => {
    if (!analysis) return;
    
    const updatedAnalysis = {
      ...analysis,
      musicSuggestions: [...analysis.musicSuggestions, suggestion]
    };
    
    setAnalysis(updatedAnalysis);
  };

  const handleAddSoundSuggestion = (suggestion: SoundDesignSuggestion) => {
    if (!analysis) return;
    
    const updatedAnalysis = {
      ...analysis,
      soundDesignSuggestions: [...analysis.soundDesignSuggestions, suggestion]
    };
    
    setAnalysis(updatedAnalysis);
  };

  const handleDeleteMusicSuggestion = (id: string) => {
    if (!analysis) return;
    
    const updatedAnalysis = {
      ...analysis,
      musicSuggestions: analysis.musicSuggestions.filter(s => s.id !== id)
    };
    
    setAnalysis(updatedAnalysis);
  };

  const handleDeleteSoundSuggestion = (id: string) => {
    if (!analysis) return;
    
    const updatedAnalysis = {
      ...analysis,
      soundDesignSuggestions: analysis.soundDesignSuggestions.filter(s => s.id !== id)
    };
    
    setAnalysis(updatedAnalysis);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Emotional Arc Analyzer</h1>
            <p className="text-gray-600 mt-1">Analyze emotional beats and optimize audience engagement</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1 ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('music')}
                className={`px-3 py-1 ${activeTab === 'music' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Music & Sound
              </button>
              <button
                onClick={() => setActiveTab('empathy')}
                className={`px-3 py-1 ${activeTab === 'empathy' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Audience
              </button>
              <button
                onClick={() => setActiveTab('accessibility')}
                className={`px-3 py-1 ${activeTab === 'accessibility' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Accessibility
              </button>
            </div>
          </div>
        </div>
        
        {!analysis && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Analyze Your Content</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a script, transcript, or storyboard to analyze its emotional arcs and get suggestions for music, sound design, and audience engagement.
                </p>
                <button
                  onClick={handleAnalyzeDocument}
                  disabled={isAnalyzing}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Document</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {analysis && (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Emotional Journey Timeline */}
              <EmotionalJourneyTimeline 
                emotionalArcs={analysis.emotionalArcs}
                emotionalBeats={analysis.emotionalBeats}
                musicSuggestions={analysis.musicSuggestions}
                soundSuggestions={analysis.soundDesignSuggestions}
                interviewSuggestions={analysis.interviewSuggestions}
                duration={600} // 10 minutes
                onElementClick={handleElementClick}
              />
              
              {/* Emotional Analysis Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Emotional Analysis Summary</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-5 h-5 text-pink-600" />
                      <h3 className="font-medium text-gray-900">Overall Tone</h3>
                    </div>
                    <p className="text-lg font-semibold text-pink-600 capitalize">{analysis.overallTone}</p>
                    <p className="text-sm text-pink-700 mt-1">
                      {analysis.emotionalArcs.length} emotional arcs, {analysis.emotionalBeats.length} emotional beats
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <h3 className="font-medium text-gray-900">Audience Engagement</h3>
                    </div>
                    <p className="text-lg font-semibold text-purple-600">{Math.round(analysis.audienceEngagement.overallEngagementScore * 100)}%</p>
                    <p className="text-sm text-purple-700 mt-1">
                      {analysis.audienceEngagement.peakEngagementPoints.length} peak moments identified
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Music className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-gray-900">Music & Sound</h3>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">{analysis.musicSuggestions.length + analysis.soundDesignSuggestions.length}</p>
                    <p className="text-sm text-blue-700 mt-1">
                      {analysis.musicSuggestions.length} music cues, {analysis.soundDesignSuggestions.length} sound design elements
                    </p>
                  </div>
                </div>
                
                {/* Emotional Arcs */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Emotional Arcs</h3>
                  <div className="space-y-3">
                    {analysis.emotionalArcs.map(arc => (
                      <div 
                        key={arc.id} 
                        className={`p-4 border rounded-lg ${
                          selectedElement?.type === 'arc' && selectedElement.id === arc.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedElement({ type: 'arc', id: arc.id })}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{arc.name}</h4>
                          <span className="text-sm text-gray-500">
                            {Math.round(arc.startPosition * 100)}% - {Math.round(arc.endPosition * 100)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{arc.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 bg-pink-100 text-pink-800 rounded-full text-xs">
                              {arc.dominantEmotion}
                            </span>
                            <span className="text-gray-500">
                              Peak intensity: {Math.round(arc.peakIntensity * 100)}%
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            arc.resolution === 'resolved' ? 'bg-green-100 text-green-800' :
                            arc.resolution === 'unresolved' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {arc.resolution}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Audience Engagement */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Audience Engagement Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Peak Engagement Moments</h4>
                      <div className="space-y-2">
                        {analysis.audienceEngagement.peakEngagementPoints.map((point, index) => (
                          <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                Position: {Math.round(point.position * 100)}%
                              </span>
                              <span className="text-sm font-medium text-green-700">
                                {Math.round(point.score * 100)}% engagement
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{point.reason}</p>
                            <p className="text-xs text-green-700 italic">{point.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Engagement Challenges</h4>
                      <div className="space-y-2">
                        {analysis.audienceEngagement.lowEngagementPoints.map((point, index) => (
                          <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                Position: {Math.round(point.position * 100)}%
                              </span>
                              <span className="text-sm font-medium text-red-700">
                                {Math.round(point.score * 100)}% engagement
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{point.reason}</p>
                            <p className="text-xs text-red-700 italic">{point.suggestion}</p>
                          </div>
                        ))}
                        
                        {analysis.audienceEngagement.recommendedPacingAdjustments.map((adjustment, index) => (
                          <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                Pacing Issue: {adjustment.currentPacing.replace('-', ' ')}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                                {adjustment.priority} priority
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              Section: {Math.round(adjustment.startPosition * 100)}% - {Math.round(adjustment.endPosition * 100)}%
                            </p>
                            <p className="text-xs text-yellow-700 italic">{adjustment.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Interview Placement Suggestions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Mic className="w-5 h-5 mr-2 text-purple-600" />
                    Interview Placement Suggestions
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {analysis.interviewSuggestions.map(suggestion => (
                    <div 
                      key={suggestion.id} 
                      className={`border rounded-lg ${
                        selectedElement?.type === 'interview' && selectedElement.id === suggestion.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedElement({ type: 'interview', id: suggestion.id })}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              Position: {Math.round(suggestion.position * 100)}%
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                              {suggestion.questionType} questions
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Subject mood: {suggestion.subjectMood}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Emotional Context</h4>
                          <p className="text-sm text-gray-600">{suggestion.emotionalContext}</p>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Suggested Questions</h4>
                          <ul className="space-y-1">
                            {suggestion.suggestedQuestions.map((question, index) => (
                              <li key={index} className="text-sm text-gray-600">• {question}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Visual Direction</h4>
                            <p className="text-sm text-gray-600">{suggestion.visualDirection}</p>
                          </div>
                          
                          {suggestion.notes && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                              <p className="text-sm text-gray-600">{suggestion.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Music & Sound Tab */}
          {activeTab === 'music' && (
            <MusicSuggestionPanel 
              musicSuggestions={analysis.musicSuggestions}
              soundSuggestions={analysis.soundDesignSuggestions}
              onMusicAdd={handleAddMusicSuggestion}
              onSoundAdd={handleAddSoundSuggestion}
              onMusicDelete={handleDeleteMusicSuggestion}
              onSoundDelete={handleDeleteSoundSuggestion}
            />
          )}

          {/* Empathy Maps Tab */}
          {activeTab === 'empathy' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Audience Empathy Maps
                  </h2>
                  
                  <button
                    onClick={() => setShowAddEmpathyMap(true)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Audience Segment</span>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {analysis.empathyMaps.map(map => (
                    <div key={map.id} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{map.audienceSegment}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Demographics</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {map.demographics.map((demo, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                {demo}
                              </span>
                            ))}
                          </div>
                          
                          <h4 className="font-medium text-gray-700 mb-2">Emotional Needs</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {map.emotionalNeeds.map((need, index) => (
                              <span key={index} className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                                {need}
                              </span>
                            ))}
                          </div>
                          
                          <h4 className="font-medium text-gray-700 mb-2">Pain Points</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {map.painPoints.map((point, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                {point}
                              </span>
                            ))}
                          </div>
                          
                          <h4 className="font-medium text-gray-700 mb-2">Goals</h4>
                          <div className="flex flex-wrap gap-2">
                            {map.goals.map((goal, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {goal}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Thoughts & Feelings</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {map.thoughtsAndFeelings.map((thought, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                {thought}
                              </span>
                            ))}
                          </div>
                          
                          <h4 className="font-medium text-gray-700 mb-2">Resonant Moments</h4>
                          <div className="space-y-2 mb-4">
                            {map.resonantMoments.map((moment, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                                <span className="text-sm text-gray-700">{moment.reason}</span>
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                                  {Math.round(moment.position * 100)}%
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <h4 className="font-medium text-gray-700 mb-2">Dissonant Moments</h4>
                          <div className="space-y-2 mb-4">
                            {map.dissonantMoments.map((moment, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                                <span className="text-sm text-gray-700">{moment.reason}</span>
                                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                                  {Math.round(moment.position * 100)}%
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <h4 className="font-medium text-gray-700 mb-2">Engagement Strategies</h4>
                          <ul className="space-y-1">
                            {map.engagementStrategies.map((strategy, index) => (
                              <li key={index} className="text-sm text-gray-600">• {strategy}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Accessibility Tab */}
          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Accessibility className="w-5 h-5 mr-2 text-blue-600" />
                    Accessibility Considerations
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {analysis.accessibilityConsiderations.map(consideration => (
                    <div key={consideration.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900 capitalize">{consideration.type} Consideration</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          consideration.priority === 'high' ? 'bg-red-100 text-red-800' :
                          consideration.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {consideration.priority} priority
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{consideration.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Affected Audience</h4>
                        <p className="text-gray-600">{consideration.affectedAudience}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Content Positions</h4>
                        <div className="flex flex-wrap gap-2">
                          {consideration.positions.map((position, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              {Math.round(position * 100)}%
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                        <ul className="space-y-2">
                          {consideration.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="mt-1 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-xs">{index + 1}</span>
                              </div>
                              <span className="text-gray-700">{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Empathy Map Modal */}
      {showAddEmpathyMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <EmpathyMapCreator 
                onSave={handleAddEmpathyMap}
                onCancel={() => setShowAddEmpathyMap(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};