import React, { useState, useEffect } from 'react';
import { Script, StoryboardFrame, TranscriptionProject } from './types/production';
import { ScriptEditor } from './components/ScriptEditor';
import { StoryboardConverter } from './components/StoryboardConverter';
import { TranscriptionEditor } from './components/TranscriptionEditor';
import { VoiceoverGenerator } from './components/VoiceoverGenerator';
import { ScriptExporter } from './components/ScriptExporter';
import { ScriptCollaboration } from './components/ScriptCollaboration';
import { ScriptAnalyzer } from './components/ScriptAnalyzer';
import { ABTestingTool } from './components/ABTestingTool';
import { EmotionalArcAnalyzer } from './components/EmotionalArcAnalyzer';
import { ProductionManagementSystem } from './components/ProductionManagementSystem';
import { ProductionProject } from './types/production';
import { 
  FileText, 
  Film, 
  Mic, 
  Download,
  Users,
  BarChart2,
  Split,
  Settings,
  Wand2,
  Edit3,
  Heart,
  Calendar
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'storyboard' | 'transcription' | 'voiceover' | 'analyze' | 'collaborate' | 'abtest' | 'emotional' | 'production'>('editor');
  const [script, setScript] = useState<Script | null>(null);
  const [showExporter, setShowExporter] = useState(false);
  const [currentUser] = useState({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  // Sample production project for demo
  const [productionProject, setProductionProject] = useState<ProductionProject>({
    id: '1',
    title: 'The Journey Home',
    description: 'A documentary exploring the concept of home and belonging',
    status: 'pre-production',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-12-31'),
    budget: {
      totalBudget: 50000,
      allocatedBudget: 35000,
      remainingBudget: 35000,
      categories: [
        {
          id: 'cat-1',
          name: 'Equipment',
          allocation: 10000,
          spent: 0,
          remaining: 10000,
          notes: 'Camera, audio, and lighting equipment'
        },
        {
          id: 'cat-2',
          name: 'Crew',
          allocation: 15000,
          spent: 0,
          remaining: 15000,
          notes: 'Director, DP, sound engineer, etc.'
        },
        {
          id: 'cat-3',
          name: 'Location',
          allocation: 5000,
          spent: 0,
          remaining: 5000,
          notes: 'Location permits and fees'
        },
        {
          id: 'cat-4',
          name: 'Post-Production',
          allocation: 5000,
          spent: 0,
          remaining: 5000,
          notes: 'Editing, color grading, sound mixing'
        }
      ],
      expenses: [],
      currency: 'USD',
      lastUpdated: new Date()
    },
    schedule: {
      shootDays: [
        {
          id: 'shoot-1',
          date: new Date('2023-07-15'),
          locationId: 'loc-1',
          callTime: '08:00',
          wrapTime: '18:00',
          scenes: [],
          teamMembers: ['team-1', 'team-2', 'team-3'],
          equipment: ['equip-1', 'equip-2'],
          status: 'scheduled',
          notes: 'First day of shooting'
        }
      ],
      preProductionTasks: [
        {
          id: 'task-1',
          title: 'Location Scouting',
          description: 'Find and secure filming locations',
          assignedTo: ['team-1'],
          startDate: new Date('2023-06-01'),
          dueDate: new Date('2023-06-15'),
          status: 'in-progress',
          priority: 'high',
          dependencies: [],
          progress: 50,
          notes: ''
        },
        {
          id: 'task-2',
          title: 'Equipment Rental',
          description: 'Secure camera, audio, and lighting equipment',
          assignedTo: ['team-2'],
          startDate: new Date('2023-06-10'),
          dueDate: new Date('2023-06-30'),
          status: 'not-started',
          priority: 'medium',
          dependencies: [],
          progress: 0,
          notes: ''
        }
      ],
      postProductionTasks: [
        {
          id: 'task-3',
          title: 'Editing',
          description: 'Edit footage into rough cut',
          assignedTo: ['team-4'],
          startDate: new Date('2023-08-01'),
          dueDate: new Date('2023-09-15'),
          status: 'not-started',
          priority: 'medium',
          dependencies: [],
          progress: 0,
          notes: ''
        }
      ],
      distributionTasks: []
    },
    team: [
      {
        id: 'team-1',
        name: 'John Director',
        role: 'Director',
        email: 'john@example.com',
        phone: '555-123-4567',
        rate: {
          amount: 500,
          unit: 'daily'
        },
        availability: [],
        skills: ['Directing', 'Interviewing', 'Story Development'],
        documents: [],
        notes: ''
      },
      {
        id: 'team-2',
        name: 'Sarah Producer',
        role: 'Producer',
        email: 'sarah@example.com',
        phone: '555-987-6543',
        rate: {
          amount: 450,
          unit: 'daily'
        },
        availability: [],
        skills: ['Budgeting', 'Scheduling', 'Location Management'],
        documents: [],
        notes: ''
      },
      {
        id: 'team-3',
        name: 'Mike Cameraman',
        role: 'Cinematographer',
        email: 'mike@example.com',
        rate: {
          amount: 400,
          unit: 'daily'
        },
        availability: [],
        skills: ['Camera Operation', 'Lighting', 'Composition'],
        documents: [],
        notes: ''
      },
      {
        id: 'team-4',
        name: 'Lisa Editor',
        role: 'Editor',
        email: 'lisa@example.com',
        rate: {
          amount: 350,
          unit: 'daily'
        },
        availability: [],
        skills: ['Premiere Pro', 'After Effects', 'Color Grading'],
        documents: [],
        notes: ''
      }
    ],
    equipment: [
      {
        id: 'equip-1',
        name: 'Sony FX6 Camera',
        category: 'camera',
        description: 'Full-frame cinema camera',
        serialNumber: 'FX6-12345',
        owner: 'owned',
        cost: 6000,
        status: 'available',
        notes: ''
      },
      {
        id: 'equip-2',
        name: 'Sennheiser MKH 416 Shotgun Mic',
        category: 'audio',
        description: 'Professional shotgun microphone',
        serialNumber: 'MKH-67890',
        owner: 'owned',
        cost: 1000,
        status: 'available',
        notes: ''
      }
    ],
    locations: [
      {
        id: 'loc-1',
        name: 'City Park',
        address: '123 Park Ave, Anytown, USA',
        contactName: 'Park Manager',
        contactPhone: '555-111-2222',
        permitRequired: true,
        permitStatus: 'pending',
        permitCost: 250,
        facilities: ['Parking', 'Restrooms'],
        restrictions: ['No filming after sunset'],
        notes: 'Beautiful location with good natural light'
      }
    ],
    documents: [],
    milestones: [
      {
        id: 'mile-1',
        title: 'Pre-production Complete',
        description: 'All pre-production tasks completed',
        dueDate: new Date('2023-06-30'),
        status: 'not-started',
        dependencies: [],
        tasks: ['task-1', 'task-2'],
        notes: ''
      },
      {
        id: 'mile-2',
        title: 'Production Complete',
        description: 'All filming completed',
        dueDate: new Date('2023-07-31'),
        status: 'not-started',
        dependencies: ['mile-1'],
        tasks: [],
        notes: ''
      }
    ],
    notes: 'This documentary explores the concept of home and belonging through personal stories.',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15')
  });

  const handleScriptUpdate = (updatedScript: Script) => {
    setScript(updatedScript);
  };

  const handleScriptGenerated = (generatedScript: Script) => {
    setScript(generatedScript);
    setActiveTab('editor');
  };

  const handleProductionProjectUpdate = (updatedProject: ProductionProject) => {
    setProductionProject(updatedProject);
  };

  // Sample transcription project for demo
  const sampleTranscription: TranscriptionProject = {
    id: '1',
    name: 'Interview with Subject',
    audioUrl: '#',
    duration: 600, // 10 minutes
    status: 'completed',
    transcript: [
      {
        id: '1',
        startTime: 0,
        endTime: 15,
        text: "Hello and welcome to our documentary interview. Today we're speaking with Jane Smith about her experiences.",
        speaker: 'interviewer',
        confidence: 0.95,
        edited: false,
        locked: false
      },
      {
        id: '2',
        startTime: 16,
        endTime: 30,
        text: "Thank you for having me. I'm excited to share my story with your audience.",
        speaker: 'subject',
        confidence: 0.92,
        edited: false,
        locked: false
      },
      {
        id: '3',
        startTime: 31,
        endTime: 45,
        text: "Let's start at the beginning. Can you tell us about your early experiences in the field?",
        speaker: 'interviewer',
        confidence: 0.94,
        edited: false,
        locked: false
      },
      {
        id: '4',
        startTime: 46,
        endTime: 90,
        text: "Of course. I started my journey about fifteen years ago when the industry was very different. There were many challenges we faced that people today wouldn't even imagine. The technology was primitive by today's standards, and we had to be much more creative with our solutions.",
        speaker: 'subject',
        confidence: 0.88,
        edited: false,
        locked: false
      }
    ],
    speakers: [
      {
        id: 'interviewer',
        name: 'Interviewer',
        color: '#4f46e5',
        segments: 2,
        totalDuration: 30,
        averageConfidence: 0.945
      },
      {
        id: 'subject',
        name: 'Jane Smith',
        color: '#10b981',
        segments: 2,
        totalDuration: 60,
        averageConfidence: 0.9
      }
    ],
    settings: {
      language: 'en-US',
      speakerDiarization: true,
      punctuation: true,
      timestamps: true,
      confidence: true,
      filterProfanity: false,
      enhanceAudio: true,
      customVocabulary: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const tabs = [
    { id: 'editor', label: 'Script Editor', icon: Edit3 },
    { id: 'storyboard', label: 'Storyboard Converter', icon: Film },
    { id: 'transcription', label: 'Transcription Editor', icon: FileText },
    { id: 'voiceover', label: 'Voiceover Generator', icon: Mic },
    { id: 'analyze', label: 'Script Analysis', icon: BarChart2 },
    { id: 'collaborate', label: 'Collaboration', icon: Users },
    { id: 'abtest', label: 'A/B Testing', icon: Split },
    { id: 'emotional', label: 'Emotional Arcs', icon: Heart },
    { id: 'production', label: 'Production Manager', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Script Writing Assistant</h1>
                <p className="text-sm text-gray-500">Professional script formatting and collaboration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {script && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Script:</span> {script.title}
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowExporter(true)}
                  disabled={!script}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
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
                  disabled={tab.id === 'editor' && !script}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'editor' && script ? (
          <ScriptEditor
            script={script}
            onScriptUpdate={handleScriptUpdate}
            collaborators={script.collaborators}
            isCollaborative={script.settings.collaborativeEditing}
          />
        ) : activeTab === 'storyboard' ? (
          <StoryboardConverter
            onScriptGenerated={handleScriptGenerated}
          />
        ) : activeTab === 'transcription' ? (
          <TranscriptionEditor
            project={sampleTranscription}
            onProjectUpdate={() => {}}
            onScriptGenerate={handleScriptGenerated}
          />
        ) : activeTab === 'voiceover' ? (
          <VoiceoverGenerator
            onVoiceoverGenerated={() => {}}
          />
        ) : activeTab === 'analyze' && script ? (
          <ScriptAnalyzer
            script={script}
            onScriptUpdate={handleScriptUpdate}
          />
        ) : activeTab === 'collaborate' && script ? (
          <ScriptCollaboration
            script={script}
            currentUser={currentUser}
            onScriptUpdate={handleScriptUpdate}
          />
        ) : activeTab === 'abtest' && script ? (
          <ABTestingTool
            script={script}
            onVersionSelect={handleScriptUpdate}
          />
        ) : activeTab === 'emotional' ? (
          <EmotionalArcAnalyzer />
        ) : activeTab === 'production' ? (
          <ProductionManagementSystem 
            project={productionProject}
            onProjectUpdate={handleProductionProjectUpdate}
          />
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wand2 className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {!script ? 'No Script Available' : 'Select a Tool'}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {!script 
                ? 'Start by converting a storyboard or transcription into a script'
                : 'Choose one of the tools above to work with your script'}
            </p>
            {!script && (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setActiveTab('storyboard')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Film className="w-4 h-4" />
                  <span>Convert Storyboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('transcription')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <FileText className="w-4 h-4" />
                  <span>Edit Transcription</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Export Modal */}
      {showExporter && script && (
        <ScriptExporter
          script={script}
          onClose={() => setShowExporter(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              AI Script Writing Assistant - Professional script formatting and collaboration
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Powered by advanced AI for script generation, analysis, and optimization
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;