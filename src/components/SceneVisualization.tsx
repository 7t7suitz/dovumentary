import React, { useState } from 'react';
import { Scene } from '../types/scene';
import { 
  Camera, 
  Lightbulb, 
  Volume2, 
  MapPin, 
  Calendar,
  DollarSign,
  Cloud,
  Settings,
  ChevronDown,
  ChevronRight,
  Eye,
  Palette
} from 'lucide-react';

interface SceneVisualizationProps {
  scene: Scene;
}

export const SceneVisualization: React.FC<SceneVisualizationProps> = ({ scene }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['visual', 'lighting', 'shots'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderVisualComposition = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => toggleSection('visual')}
      >
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-purple-600" />
          Visual Composition
        </h3>
        {expandedSections.has('visual') ? 
          <ChevronDown className="w-5 h-5 text-gray-500" /> : 
          <ChevronRight className="w-5 h-5 text-gray-500" />
        }
      </div>

      {expandedSections.has('visual') && (
        <div className="mt-4 space-y-6">
          {/* Mood and Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Visual Mood & Style</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mood:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{scene.visualComposition.mood}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cinematography:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{scene.visualComposition.style.cinematography}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Movement:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{scene.visualComposition.movement.type}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Color Palette</h4>
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center">
                  <div 
                    className="w-full h-12 rounded border border-gray-300"
                    style={{ backgroundColor: scene.visualComposition.colorPalette.primary }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1 block">Primary</span>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-12 rounded border border-gray-300"
                    style={{ backgroundColor: scene.visualComposition.colorPalette.secondary }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1 block">Secondary</span>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-12 rounded border border-gray-300"
                    style={{ backgroundColor: scene.visualComposition.colorPalette.accent }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1 block">Accent</span>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-12 rounded border border-gray-300"
                    style={{ backgroundColor: scene.visualComposition.colorPalette.background }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1 block">Background</span>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Temperature: {scene.visualComposition.colorPalette.temperature} • 
                Saturation: {scene.visualComposition.colorPalette.saturation} • 
                Contrast: {scene.visualComposition.colorPalette.contrast}
              </div>
            </div>
          </div>

          {/* Framing and Composition */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Framing & Composition</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Composition Rules:</span>
                  <p className="text-gray-600 mt-1">
                    {scene.visualComposition.framing.composition.join(', ').replace(/-/g, ' ')}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Subject Placement:</span>
                  <p className="text-gray-600 mt-1">{scene.visualComposition.framing.subjectPlacement}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Background Treatment:</span>
                  <p className="text-gray-600 mt-1">{scene.visualComposition.framing.backgroundTreatment}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Focus Strategy:</span>
                  <p className="text-gray-600 mt-1 capitalize">{scene.visualComposition.depth.focusStrategy.replace(/-/g, ' ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Style Influences */}
          {scene.visualComposition.style.influences.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Style Influences</h4>
              <div className="flex flex-wrap gap-2">
                {scene.visualComposition.style.influences.map((influence, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {influence}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderLightingSetup = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => toggleSection('lighting')}
      >
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
          Lighting Setup
        </h3>
        {expandedSections.has('lighting') ? 
          <ChevronDown className="w-5 h-5 text-gray-500" /> : 
          <ChevronRight className="w-5 h-5 text-gray-500" />
        }
      </div>

      {expandedSections.has('lighting') && (
        <div className="mt-4 space-y-6">
          {/* Lighting Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Style</h4>
              <p className="text-sm text-yellow-800 capitalize">{scene.lighting.style}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Mood</h4>
              <p className="text-sm text-orange-800 capitalize">{scene.lighting.mood}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Time of Day</h4>
              <p className="text-sm text-blue-800 capitalize">{scene.lighting.timeOfDay.replace(/-/g, ' ')}</p>
            </div>
          </div>

          {/* Color Temperature */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Color Temperature</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{scene.lighting.colorTemperature.kelvin}K</span>
              <span className="text-sm text-gray-600">{scene.lighting.colorTemperature.description}</span>
              <span className="text-sm text-gray-600">Contrast: {scene.lighting.contrast}</span>
            </div>
          </div>

          {/* Light Sources */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Light Sources ({scene.lighting.sources.length})</h4>
            <div className="space-y-3">
              {scene.lighting.sources.map((source) => (
                <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 capitalize">{source.type} Light</span>
                    <span className="text-sm text-gray-500">{Math.round(source.intensity * 100)}% intensity</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Position:</span>
                      <p className="text-gray-600">{source.position}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Purpose:</span>
                      <p className="text-gray-600 capitalize">{source.purpose.replace(/-/g, ' ')}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Equipment:</span>
                      <p className="text-gray-600">{source.equipment}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-700">Color:</span>
                      <div 
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: source.color }}
                      ></div>
                      <span className="text-gray-600">{source.color}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Light Modifiers */}
          {scene.lighting.modifiers.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Light Modifiers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scene.lighting.modifiers.map((modifier, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-900 capitalize">{modifier.type.replace(/-/g, ' ')}</div>
                    <div className="text-sm text-gray-600">{modifier.size}</div>
                    <div className="text-sm text-gray-600">{modifier.effect}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderShotList = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => toggleSection('shots')}
      >
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-blue-600" />
          Shot List ({scene.shotList.length} shots)
        </h3>
        {expandedSections.has('shots') ? 
          <ChevronDown className="w-5 h-5 text-gray-500" /> : 
          <ChevronRight className="w-5 h-5 text-gray-500" />
        }
      </div>

      {expandedSections.has('shots') && (
        <div className="mt-4 space-y-4">
          {scene.shotList.map((shot) => (
            <div key={shot.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Shot {shot.number}</h4>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                    {shot.shotSize.replace(/-/g, ' ')}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    {shot.duration}s
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{shot.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Angle:</span>
                  <p className="text-gray-600 capitalize">{shot.angle.replace(/-/g, ' ')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Movement:</span>
                  <p className="text-gray-600 capitalize">{shot.movement.type}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Camera:</span>
                  <p className="text-gray-600">{shot.equipment.camera}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Lens:</span>
                  <p className="text-gray-600">{shot.equipment.lens}</p>
                </div>
              </div>

              {shot.notes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="font-medium text-gray-700 text-sm">Notes:</span>
                  <ul className="mt-1 space-y-1">
                    {shot.notes.map((note, index) => (
                      <li key={index} className="text-sm text-gray-600">• {note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAudioDesign = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => toggleSection('audio')}
      >
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Volume2 className="w-5 h-5 mr-2 text-green-600" />
          Audio Design
        </h3>
        {expandedSections.has('audio') ? 
          <ChevronDown className="w-5 h-5 text-gray-500" /> : 
          <ChevronRight className="w-5 h-5 text-gray-500" />
        }
      </div>

      {expandedSections.has('audio') && (
        <div className="mt-4 space-y-6">
          {/* Music Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Music Selection</h4>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Genre:</span>
                  <p className="text-gray-600">{scene.audio.music.genre.join(', ')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Mood:</span>
                  <p className="text-gray-600">{scene.audio.music.mood.join(', ')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tempo:</span>
                  <p className="text-gray-600">{scene.audio.music.tempo.min}-{scene.audio.music.tempo.max} BPM</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Licensing:</span>
                  <p className="text-gray-600 capitalize">{scene.audio.music.licensing.type.replace(/-/g, ' ')}</p>
                </div>
              </div>
              {scene.audio.music.instrumentation.length > 0 && (
                <div className="mt-3">
                  <span className="font-medium text-gray-700 text-sm">Instrumentation:</span>
                  <p className="text-gray-600 text-sm mt-1">{scene.audio.music.instrumentation.join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sound Effects */}
          {scene.audio.soundEffects.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Sound Effects</h4>
              <div className="space-y-2">
                {scene.audio.soundEffects.map((effect) => (
                  <div key={effect.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium text-gray-900">{effect.name}</span>
                      <p className="text-sm text-gray-600">{effect.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Volume: {Math.round(effect.volume * 100)}%</div>
                      <div className="text-xs text-gray-500">{effect.timing}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ambience */}
          {scene.audio.ambience.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ambience</h4>
              <div className="space-y-2">
                {scene.audio.ambience.map((amb) => (
                  <div key={amb.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium text-gray-900">{amb.environment}</span>
                      <p className="text-sm text-gray-600">{amb.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Volume: {Math.round(amb.volume * 100)}%</div>
                      <div className="text-xs text-gray-500">{amb.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recording Setup */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recording Setup</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Format:</span>
                  <p className="text-gray-600">{scene.audio.recording.format.container} ({scene.audio.recording.format.codec})</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Quality:</span>
                  <p className="text-gray-600">{scene.audio.recording.sampleRate/1000}kHz / {scene.audio.recording.bitDepth}-bit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLocationDetails = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => toggleSection('location')}
      >
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-red-600" />
          Location Details
        </h3>
        {expandedSections.has('location') ? 
          <ChevronDown className="w-5 h-5 text-gray-500" /> : 
          <ChevronRight className="w-5 h-5 text-gray-500" />
        }
      </div>

      {expandedSections.has('location') && (
        <div className="mt-4 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Location Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900">{scene.location.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900 capitalize">{scene.location.type.replace(/-/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Permits Required:</span>
                  <span className={`font-medium ${scene.location.permits.required ? 'text-orange-600' : 'text-green-600'}`}>
                    {scene.location.permits.required ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Accessibility</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(scene.location.accessibility).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scouting Notes */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Scouting Notes</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-medium text-gray-700 text-sm">Best Times:</span>
                <ul className="mt-1 space-y-1">
                  {scene.location.scouting.bestTimeOfDay.map((time, index) => (
                    <li key={index} className="text-sm text-gray-600">• {time}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium text-gray-700 text-sm">Challenges:</span>
                <ul className="mt-1 space-y-1">
                  {scene.location.scouting.challenges.map((challenge, index) => (
                    <li key={index} className="text-sm text-gray-600">• {challenge}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium text-gray-700 text-sm">Opportunities:</span>
                <ul className="mt-1 space-y-1">
                  {scene.location.scouting.opportunities.map((opportunity, index) => (
                    <li key={index} className="text-sm text-gray-600">• {opportunity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBudgetOverview = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => toggleSection('budget')}
      >
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Budget Estimate
        </h3>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">{formatCurrency(scene.budget.total)}</div>
          <div className="text-xs text-gray-500">Total estimated cost</div>
        </div>
        {expandedSections.has('budget') ? 
          <ChevronDown className="w-5 h-5 text-gray-500" /> : 
          <ChevronRight className="w-5 h-5 text-gray-500" />
        }
      </div>

      {expandedSections.has('budget') && (
        <div className="mt-4 space-y-4">
          {scene.budget.breakdown.map((category) => (
            <div key={category.category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{category.category}</h4>
                <span className="font-bold text-gray-900">{formatCurrency(category.subtotal)}</span>
              </div>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.name} (×{item.quantity})</span>
                    <span className="text-gray-900">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">{formatCurrency(scene.budget.total - scene.budget.contingency)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Contingency (10%):</span>
              <span className="text-gray-900">{formatCurrency(scene.budget.contingency)}</span>
            </div>
            <div className="flex items-center justify-between font-bold">
              <span className="text-gray-900">Total:</span>
              <span className="text-green-600">{formatCurrency(scene.budget.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Scene Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{scene.title}</h2>
        <p className="text-gray-600 mb-4">{scene.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Created: {scene.createdAt.toLocaleDateString()}</span>
          <span>•</span>
          <span>Updated: {scene.updatedAt.toLocaleDateString()}</span>
          <span>•</span>
          <span>{scene.shotList.length} shots</span>
          <span>•</span>
          <span>{formatCurrency(scene.budget.total)} budget</span>
        </div>
      </div>

      {/* Main Content Sections */}
      {renderVisualComposition()}
      {renderLightingSetup()}
      {renderShotList()}
      {renderAudioDesign()}
      {renderLocationDetails()}
      {renderBudgetOverview()}
    </div>
  );
};