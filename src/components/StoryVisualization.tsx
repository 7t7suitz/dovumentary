import React, { useEffect, useRef, useState } from 'react';
import { StoryAnalysis } from '../types/story';
import * as d3 from 'd3';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface StoryVisualizationProps {
  analysis: StoryAnalysis;
}

export const StoryVisualization: React.FC<StoryVisualizationProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'characters' | 'pacing' | 'recommendations'>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['structure', 'gaps']));
  const structureRef = useRef<SVGSVGElement>(null);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  useEffect(() => {
    if (activeTab === 'structure' && structureRef.current) {
      drawStructureDiagram();
    }
  }, [activeTab, analysis]);

  const drawStructureDiagram = () => {
    const svg = d3.select(structureRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Draw acts
    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0]);

    // Act backgrounds
    analysis.structure.acts.forEach((act, index) => {
      g.append('rect')
        .attr('x', xScale(act.startPosition / 100))
        .attr('y', 0)
        .attr('width', xScale((act.endPosition - act.startPosition) / 100))
        .attr('height', innerHeight)
        .attr('fill', `hsl(${index * 120}, 30%, 95%)`)
        .attr('stroke', `hsl(${index * 120}, 50%, 70%)`)
        .attr('stroke-width', 1);

      // Act labels
      g.append('text')
        .attr('x', xScale((act.startPosition + act.endPosition) / 200))
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('fill', `hsl(${index * 120}, 50%, 40%)`)
        .text(act.name);
    });

    // Plot points
    analysis.plotPoints.forEach(point => {
      const x = xScale(point.position);
      const y = yScale(point.strength);
      
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', point.present ? 8 : 4)
        .attr('fill', point.present ? '#10b981' : '#ef4444')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

      g.append('text')
        .attr('x', x)
        .attr('y', y - 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#374151')
        .text(point.name);
    });

    // Tension curve
    const tensionLine = d3.line<any>()
      .x(d => xScale(d.position))
      .y(d => yScale(d.tension))
      .curve(d3.curveCardinal);

    g.append('path')
      .datum(analysis.pacing.tensionCurve)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 3)
      .attr('d', tensionLine);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `${Math.round(+d * 100)}%`));

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => `${Math.round(+d * 100)}%`));

    // Labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Tension / Strength');

    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom})`)
      .style('text-anchor', 'middle')
      .text('Story Progress');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'structure', label: 'Structure', icon: TrendingUp },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'pacing', label: 'Pacing', icon: Target },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Story Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Story Analysis Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Structure</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {Math.round(analysis.structure.completeness * 100)}%
            </p>
            <p className="text-sm text-blue-700">Complete</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Characters</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">{analysis.characters.length}</p>
            <p className="text-sm text-green-700">Identified</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Pacing</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900 mt-1 capitalize">
              {analysis.pacing.overallPacing.replace('-', ' ')}
            </p>
            <p className="text-sm text-yellow-700">Overall</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">Issues</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-1">{analysis.gaps.length}</p>
            <p className="text-sm text-purple-700">Found</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Synopsis</h4>
            <p className="text-sm text-gray-600 mb-3">{analysis.synopsis.medium}</p>
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-700">Primary Genre:</span>
                <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                  {analysis.genre.primary.name}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-700">Structure Type:</span>
                <span className="ml-2 text-xs text-gray-600 capitalize">
                  {analysis.structure.type.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Loglines</h4>
            <div className="space-y-3">
              {analysis.loglines.slice(0, 2).map((logline, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700 capitalize">
                      {logline.type.replace('-', ' ')}
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${logline.strength * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(logline.strength * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{logline.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Story Gaps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('gaps')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Story Gaps & Issues ({analysis.gaps.length})
          </h3>
          {expandedSections.has('gaps') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.has('gaps') && (
          <div className="mt-4 space-y-3">
            {analysis.gaps.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Major Issues Found</h4>
                <p className="text-gray-600">Your story structure appears to be solid!</p>
              </div>
            ) : (
              analysis.gaps.map((gap) => (
                <div key={gap.id} className={`border-l-4 p-4 rounded-r-lg ${
                  gap.severity === 'critical' ? 'border-red-500 bg-red-50' :
                  gap.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                  gap.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {gap.type.replace('-', ' ')}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      gap.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      gap.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      gap.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {gap.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{gap.description}</p>
                  <div className="bg-white p-3 rounded border">
                    <span className="text-xs font-medium text-gray-700">Suggestions:</span>
                    <ul className="mt-1 space-y-1">
                      {gap.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-xs text-gray-600">• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStructure = () => (
    <div className="space-y-6">
      {/* Structure Diagram */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Story Structure Visualization</h3>
        <div className="mb-4">
          <svg ref={structureRef} className="w-full border border-gray-200 rounded"></svg>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Present Plot Points</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Missing Plot Points</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
            <span>Tension Curve</span>
          </div>
        </div>
      </div>

      {/* Plot Points Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plot Points Analysis</h3>
        <div className="space-y-4">
          {analysis.plotPoints.map((point) => (
            <div key={point.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${point.present ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <h4 className="font-medium text-gray-900">{point.name}</h4>
                  <p className="text-sm text-gray-600">{Math.round(point.position * 100)}% through story</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Strength:</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${point.present ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${point.strength * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round(point.strength * 100)}%</span>
                </div>
                {!point.present && (
                  <p className="text-xs text-red-600 mt-1">Missing - consider adding</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acts Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acts Analysis</h3>
        <div className="space-y-4">
          {analysis.structure.acts.map((act, index) => (
            <div key={act.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{act.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Strength:</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${act.strength * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round(act.strength * 100)}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{act.purpose}</p>
              <div className="text-xs text-gray-500">
                Position: {act.startPosition}% - {act.endPosition}%
              </div>
              {act.suggestions.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <span className="text-xs font-medium text-gray-700">Suggestions:</span>
                  <ul className="mt-1 space-y-1">
                    {act.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-xs text-gray-600">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCharacters = () => (
    <div className="space-y-6">
      {/* Character Development Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Character Development</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analysis.characters.map(char => ({
            name: char.name,
            development: char.development.changeStrength * 100,
            importance: char.importance * 100,
            screenTime: char.screenTime * 100
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="development" fill="#8884d8" name="Character Development" />
            <Bar dataKey="importance" fill="#82ca9d" name="Importance" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Character Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Character Analysis</h3>
        <div className="space-y-4">
          {analysis.characters.map((character) => (
            <div key={character.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{character.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      character.role === 'protagonist' ? 'bg-blue-100 text-blue-800' :
                      character.role === 'antagonist' ? 'bg-red-100 text-red-800' :
                      character.role === 'mentor' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {character.role.replace('-', ' ')}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
                      {character.arcType.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Development</div>
                  <div className="text-lg font-bold text-gray-900">
                    {Math.round(character.development.changeStrength * 100)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Start State:</span>
                  <p className="text-gray-600">{character.development.startState}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">End State:</span>
                  <p className="text-gray-600">{character.development.endState}</p>
                </div>
                {character.development.motivations.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Motivations:</span>
                    <ul className="text-gray-600 mt-1">
                      {character.development.motivations.slice(0, 2).map((motivation, idx) => (
                        <li key={idx} className="text-xs">• {motivation}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {character.development.conflicts.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Conflicts:</span>
                    <ul className="text-gray-600 mt-1">
                      {character.development.conflicts.slice(0, 2).map((conflict, idx) => (
                        <li key={idx} className="text-xs">• {conflict}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {character.suggestions.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <span className="text-xs font-medium text-gray-700">Suggestions:</span>
                  <ul className="mt-1 space-y-1">
                    {character.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-xs text-gray-600">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPacing = () => (
    <div className="space-y-6">
      {/* Tension Curve */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tension Curve</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analysis.pacing.tensionCurve.map(point => ({
            position: Math.round(point.position * 100),
            tension: Math.round(point.tension * 100),
            event: point.event
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="position" label={{ value: 'Story Progress (%)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Tension Level (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              labelFormatter={(value) => `${value}% through story`}
              formatter={(value: any, name: string) => [`${value}%`, 'Tension']}
            />
            <Area type="monotone" dataKey="tension" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pacing Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pacing Analysis</h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Pacing</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              analysis.pacing.overallPacing === 'optimal' ? 'bg-green-100 text-green-800' :
              analysis.pacing.overallPacing.includes('fast') ? 'bg-orange-100 text-orange-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {analysis.pacing.overallPacing.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Act Pacing</h4>
          {analysis.pacing.actPacing.map((act) => (
            <div key={act.act} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Act {act.act}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  act.pacing === 'optimal' ? 'bg-green-100 text-green-800' :
                  act.pacing.includes('fast') ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {act.pacing.replace('-', ' ')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Current Duration:</span>
                  <span className="ml-2 font-medium">{act.duration} units</span>
                </div>
                <div>
                  <span className="text-gray-600">Ideal Duration:</span>
                  <span className="ml-2 font-medium">{Math.round(act.idealDuration)} units</span>
                </div>
              </div>
              {act.suggestions.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <span className="text-xs font-medium text-gray-700">Suggestions:</span>
                  <ul className="mt-1 space-y-1">
                    {act.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-xs text-gray-600">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pacing Issues */}
      {analysis.pacing.issues.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pacing Issues</h3>
          <div className="space-y-3">
            {analysis.pacing.issues.map((issue, index) => (
              <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                issue.severity === 'high' ? 'border-red-500 bg-red-50' :
                issue.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 capitalize">
                    {issue.type.replace('-', ' ')}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                    issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                <div className="bg-white p-3 rounded border">
                  <span className="text-xs font-medium text-gray-700">Solutions:</span>
                  <ul className="mt-1 space-y-1">
                    {issue.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-xs text-gray-600">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      {/* Priority Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Recommendations</h3>
        <div className="space-y-4">
          {analysis.suggestions.map((suggestion) => (
            <div key={suggestion.id} className={`border-l-4 p-4 rounded-r-lg ${
              suggestion.priority === 'critical' ? 'border-red-500 bg-red-50' :
              suggestion.priority === 'high' ? 'border-orange-500 bg-orange-50' :
              suggestion.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 capitalize">
                  {suggestion.type.replace('-', ' ')}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  suggestion.priority === 'critical' ? 'bg-red-100 text-red-800' :
                  suggestion.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {suggestion.priority}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border">
                  <span className="text-xs font-medium text-gray-700">Implementation:</span>
                  <p className="text-xs text-gray-600 mt-1">{suggestion.implementation}</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <span className="text-xs font-medium text-gray-700">Expected Impact:</span>
                  <p className="text-xs text-gray-600 mt-1">{suggestion.expectedImpact}</p>
                </div>
              </div>
              
              {suggestion.examples.length > 0 && (
                <div className="mt-3 bg-white p-3 rounded border">
                  <span className="text-xs font-medium text-gray-700">Examples:</span>
                  <ul className="mt-1 space-y-1">
                    {suggestion.examples.map((example, idx) => (
                      <li key={idx} className="text-xs text-gray-600">• {example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Genre Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Genre-Specific Recommendations</h3>
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Primary Genre:</span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              {analysis.genre.primary.name}
            </span>
            <span className="text-sm text-gray-500">
              ({Math.round(analysis.genre.primary.confidence * 100)}% confidence)
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          {analysis.genre.recommendations.map((recommendation, index) => (
            <div key={index} className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="text-sm text-indigo-800">{recommendation}</p>
            </div>
          ))}
        </div>

        {analysis.genre.conventions.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Genre Conventions</h4>
            <div className="space-y-2">
              {analysis.genre.conventions.map((convention, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${convention.present ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-900">{convention.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      convention.importance === 'high' ? 'bg-red-100 text-red-800' :
                      convention.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {convention.importance}
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(convention.strength * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{analysis.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Analyzed on {analysis.uploadDate.toLocaleDateString()} • 
              {analysis.content.split(/\s+/).length} words • 
              {analysis.structure.type.replace('-', ' ')} structure
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-600">
              {Math.round(analysis.structure.completeness * 100)}%
            </div>
            <div className="text-sm text-gray-600">Structure Complete</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
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
                      ? 'border-indigo-500 text-indigo-600'
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
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'structure' && renderStructure()}
        {activeTab === 'characters' && renderCharacters()}
        {activeTab === 'pacing' && renderPacing()}
        {activeTab === 'recommendations' && renderRecommendations()}
      </div>
    </div>
  );
};