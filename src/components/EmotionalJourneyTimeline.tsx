import React, { useRef, useEffect, useState } from 'react';
import { EmotionalArc, EmotionalBeat, MusicSuggestion, SoundDesignSuggestion, InterviewPlacementSuggestion } from '../types/emotion';
import { 
  Heart, 
  Music, 
  Volume2, 
  Mic, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  EyeOff,
  Layers,
  Filter
} from 'lucide-react';
import * as d3 from 'd3';

interface EmotionalJourneyTimelineProps {
  emotionalArcs: EmotionalArc[];
  emotionalBeats: EmotionalBeat[];
  musicSuggestions: MusicSuggestion[];
  soundSuggestions: SoundDesignSuggestion[];
  interviewSuggestions: InterviewPlacementSuggestion[];
  duration?: number; // in seconds, for timestamp display
  onElementClick?: (elementType: string, elementId: string) => void;
}

export const EmotionalJourneyTimeline: React.FC<EmotionalJourneyTimelineProps> = ({
  emotionalArcs,
  emotionalBeats,
  musicSuggestions,
  soundSuggestions,
  interviewSuggestions,
  duration = 600, // default 10 minutes
  onElementClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewRange, setViewRange] = useState<[number, number]>([0, 1]); // 0-1 range of content to view
  const [visibleLayers, setVisibleLayers] = useState({
    arcs: true,
    beats: true,
    music: true,
    sound: true,
    interviews: true
  });

  useEffect(() => {
    if (svgRef.current) {
      drawTimeline();
    }
  }, [emotionalArcs, emotionalBeats, musicSuggestions, soundSuggestions, interviewSuggestions, zoomLevel, viewRange, visibleLayers]);

  const drawTimeline = () => {
    if (!svgRef.current) return;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Set up dimensions
    const width = svgRef.current.clientWidth || 800;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([viewRange[0], viewRange[1]])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d => {
        const position = Number(d);
        const seconds = position * duration;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
      });
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d * 100}%`);
    
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);
    
    g.append('g')
      .call(yAxis);
    
    // Add labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 35)
      .attr('text-anchor', 'middle')
      .text('Timeline');
    
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .text('Emotional Intensity');
    
    // Create color scales
    const emotionColors: Record<string, string> = {
      'joy': '#10b981', // green
      'sadness': '#3b82f6', // blue
      'anger': '#ef4444', // red
      'fear': '#8b5cf6', // purple
      'surprise': '#f59e0b', // amber
      'anticipation': '#f97316', // orange
      'trust': '#06b6d4', // cyan
      'disgust': '#6b7280', // gray
      'hope': '#22c55e', // green
      'anxiety': '#7c3aed', // violet
      'relief': '#0ea5e9', // sky
      'disappointment': '#64748b', // slate
      'pride': '#eab308', // yellow
      'shame': '#9f1239', // rose
      'love': '#ec4899', // pink
      'grief': '#1e40af' // indigo
    };
    
    // Draw timeline elements
    
    // 1. Draw emotional arcs
    if (visibleLayers.arcs) {
      emotionalArcs.forEach(arc => {
        // Create points for the arc
        const points = [
          { x: arc.startPosition, y: arc.startIntensity },
          { x: (arc.startPosition + arc.endPosition) / 2, y: arc.peakIntensity },
          { x: arc.endPosition, y: arc.endIntensity }
        ];
        
        // Create line generator
        const line = d3.line<{x: number, y: number}>()
          .x(d => xScale(d.x))
          .y(d => yScale(d.y))
          .curve(d3.curveBasis);
        
        // Draw the arc
        g.append('path')
          .datum(points)
          .attr('fill', 'none')
          .attr('stroke', emotionColors[arc.dominantEmotion] || '#6b7280')
          .attr('stroke-width', 3)
          .attr('stroke-opacity', 0.7)
          .attr('d', line)
          .attr('class', 'interactive-element')
          .on('click', () => onElementClick && onElementClick('arc', arc.id));
        
        // Add arc label
        g.append('text')
          .attr('x', xScale((arc.startPosition + arc.endPosition) / 2))
          .attr('y', yScale(arc.peakIntensity) - 10)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', emotionColors[arc.dominantEmotion] || '#6b7280')
          .text(arc.dominantEmotion);
      });
    }
    
    // 2. Draw emotional beats
    if (visibleLayers.beats) {
      emotionalBeats.forEach(beat => {
        // Draw beat point
        g.append('circle')
          .attr('cx', xScale(beat.position))
          .attr('cy', yScale(beat.intensity))
          .attr('r', 5)
          .attr('fill', emotionColors[beat.emotion] || '#6b7280')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.5)
          .attr('class', 'interactive-element')
          .on('click', () => onElementClick && onElementClick('beat', beat.id))
          .append('title')
          .text(`${beat.emotion} (${Math.round(beat.intensity * 100)}%): ${beat.context}`);
      });
    }
    
    // 3. Draw music suggestions
    if (visibleLayers.music) {
      const musicHeight = innerHeight * 0.15;
      
      musicSuggestions.forEach(music => {
        const startX = xScale(music.position);
        const width = xScale(music.position + (music.duration / duration)) - startX;
        
        g.append('rect')
          .attr('x', startX)
          .attr('y', innerHeight + 5)
          .attr('width', width)
          .attr('height', musicHeight)
          .attr('fill', '#818cf8') // indigo-400
          .attr('fill-opacity', 0.6)
          .attr('stroke', '#4f46e5') // indigo-600
          .attr('stroke-width', 1)
          .attr('rx', 3)
          .attr('class', 'interactive-element')
          .on('click', () => onElementClick && onElementClick('music', music.id))
          .append('title')
          .text(`${music.emotionalGoal} (${music.mood})`);
        
        // Add music icon
        if (width > 20) {
          g.append('text')
            .attr('x', startX + 5)
            .attr('y', innerHeight + musicHeight / 2 + 5)
            .attr('font-family', 'sans-serif')
            .attr('font-size', '10px')
            .attr('fill', '#4f46e5')
            .text('♪');
        }
      });
    }
    
    // 4. Draw sound design suggestions
    if (visibleLayers.sound) {
      const soundHeight = innerHeight * 0.15;
      const soundY = innerHeight + (visibleLayers.music ? innerHeight * 0.15 + 10 : 5);
      
      soundSuggestions.forEach(sound => {
        const startX = xScale(sound.position);
        const width = xScale(sound.position + (sound.duration / duration)) - startX;
        
        g.append('rect')
          .attr('x', startX)
          .attr('y', soundY)
          .attr('width', width)
          .attr('height', soundHeight)
          .attr('fill', '#34d399') // emerald-400
          .attr('fill-opacity', 0.6)
          .attr('stroke', '#059669') // emerald-600
          .attr('stroke-width', 1)
          .attr('rx', 3)
          .attr('class', 'interactive-element')
          .on('click', () => onElementClick && onElementClick('sound', sound.id))
          .append('title')
          .text(`${sound.description} (${sound.type})`);
        
        // Add sound icon
        if (width > 20) {
          g.append('text')
            .attr('x', startX + 5)
            .attr('y', soundY + soundHeight / 2 + 5)
            .attr('font-family', 'sans-serif')
            .attr('font-size', '10px')
            .attr('fill', '#059669')
            .text('◉');
        }
      });
    }
    
    // 5. Draw interview suggestions
    if (visibleLayers.interviews) {
      interviewSuggestions.forEach(interview => {
        g.append('line')
          .attr('x1', xScale(interview.position))
          .attr('y1', 0)
          .attr('x2', xScale(interview.position))
          .attr('y2', innerHeight)
          .attr('stroke', '#8b5cf6') // purple-500
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4,4')
          .attr('class', 'interactive-element')
          .on('click', () => onElementClick && onElementClick('interview', interview.id));
        
        g.append('circle')
          .attr('cx', xScale(interview.position))
          .attr('cy', 0)
          .attr('r', 6)
          .attr('fill', '#8b5cf6')
          .attr('class', 'interactive-element')
          .on('click', () => onElementClick && onElementClick('interview', interview.id))
          .append('title')
          .text(`Interview: ${interview.emotionalContext}`);
        
        g.append('text')
          .attr('x', xScale(interview.position))
          .attr('y', -10)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', '#8b5cf6')
          .text('Interview');
      });
    }
  };

  const zoomIn = () => {
    if (zoomLevel >= 4) return;
    
    const newZoom = Math.min(zoomLevel + 0.5, 4);
    setZoomLevel(newZoom);
    
    // Adjust view range to zoom around center
    const currentCenter = (viewRange[0] + viewRange[1]) / 2;
    const newRangeSize = 1 / newZoom;
    const newStart = Math.max(0, currentCenter - newRangeSize / 2);
    const newEnd = Math.min(1, newStart + newRangeSize);
    
    setViewRange([newStart, newEnd]);
  };

  const zoomOut = () => {
    if (zoomLevel <= 1) return;
    
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    
    if (newZoom === 1) {
      setViewRange([0, 1]); // Reset to full view
    } else {
      // Adjust view range to zoom around center
      const currentCenter = (viewRange[0] + viewRange[1]) / 2;
      const newRangeSize = 1 / newZoom;
      const newStart = Math.max(0, currentCenter - newRangeSize / 2);
      const newEnd = Math.min(1, newStart + newRangeSize);
      
      setViewRange([newStart, newEnd]);
    }
  };

  const panLeft = () => {
    const rangeSize = viewRange[1] - viewRange[0];
    const panAmount = rangeSize * 0.2;
    const newStart = Math.max(0, viewRange[0] - panAmount);
    const newEnd = newStart + rangeSize;
    
    if (newEnd <= 1) {
      setViewRange([newStart, newEnd]);
    } else {
      setViewRange([1 - rangeSize, 1]);
    }
  };

  const panRight = () => {
    const rangeSize = viewRange[1] - viewRange[0];
    const panAmount = rangeSize * 0.2;
    const newEnd = Math.min(1, viewRange[1] + panAmount);
    const newStart = newEnd - rangeSize;
    
    if (newStart >= 0) {
      setViewRange([newStart, newEnd]);
    } else {
      setViewRange([0, rangeSize]);
    }
  };

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const formatTimePosition = (position: number): string => {
    const seconds = position * duration;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-500" />
          Emotional Journey Timeline
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-lg">
            <ZoomOut 
              className={`w-4 h-4 ${zoomLevel > 1 ? 'text-gray-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
              onClick={zoomOut}
            />
            <span className="text-sm text-gray-700">{zoomLevel.toFixed(1)}x</span>
            <ZoomIn 
              className={`w-4 h-4 ${zoomLevel < 4 ? 'text-gray-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
              onClick={zoomIn}
            />
          </div>
          
          <div className="flex items-center space-x-1">
            <ChevronLeft 
              className={`w-5 h-5 p-0.5 rounded hover:bg-gray-100 ${viewRange[0] > 0 ? 'text-gray-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
              onClick={panLeft}
            />
            <ChevronRight 
              className={`w-5 h-5 p-0.5 rounded hover:bg-gray-100 ${viewRange[1] < 1 ? 'text-gray-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
              onClick={panRight}
            />
          </div>
          
          <div className="relative">
            <button
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            >
              <Layers className="w-5 h-5" />
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 hidden group-hover:block">
              <div className="p-2 space-y-1">
                <label className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleLayers.arcs}
                    onChange={() => toggleLayer('arcs')}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span className="text-sm text-gray-700">Emotional Arcs</span>
                </label>
                
                <label className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleLayers.beats}
                    onChange={() => toggleLayer('beats')}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span className="text-sm text-gray-700">Emotional Beats</span>
                </label>
                
                <label className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleLayers.music}
                    onChange={() => toggleLayer('music')}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Music className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-gray-700">Music</span>
                </label>
                
                <label className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleLayers.sound}
                    onChange={() => toggleLayer('sound')}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <Volume2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Sound Design</span>
                </label>
                
                <label className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleLayers.interviews}
                    onChange={() => toggleLayer('interviews')}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <Mic className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-700">Interviews</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-2 text-sm text-gray-600">
        Viewing {formatTimePosition(viewRange[0])} to {formatTimePosition(viewRange[1])} 
        {zoomLevel > 1 && ` (${Math.round((viewRange[1] - viewRange[0]) * 100)}% of content)`}
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <svg ref={svgRef} className="w-full"></svg>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span className="text-xs text-gray-600">Emotional Arcs</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600">Emotional Beats</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          <span className="text-xs text-gray-600">Music</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">Sound Design</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-xs text-gray-600">Interviews</span>
        </div>
      </div>
    </div>
  );
};