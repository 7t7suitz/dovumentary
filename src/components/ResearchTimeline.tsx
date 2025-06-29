import React, { useState, useRef, useEffect } from 'react';
import { TimelineEvent, Entity } from '../types/research';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit3, 
  Trash2,
  Check,
  X,
  Filter,
  Download,
  Search
} from 'lucide-react';
import * as d3 from 'd3';

interface ResearchTimelineProps {
  events: TimelineEvent[];
  entities: Entity[];
  onEventAdd: (event: TimelineEvent) => void;
  onEventUpdate: (event: TimelineEvent) => void;
  onEventDelete: (eventId: string) => void;
}

export const ResearchTimeline: React.FC<ResearchTimelineProps> = ({
  events,
  entities,
  onEventAdd,
  onEventUpdate,
  onEventDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<[Date, Date]>([
    new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
    new Date()
  ]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    title: '',
    date: new Date(),
    description: '',
    sources: [],
    entities: [],
    importance: 'minor',
    category: '',
    verificationStatus: 'unverified'
  });
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (events.length > 0 && svgRef.current && containerRef.current) {
      drawTimeline();
    }
  }, [events, searchQuery, selectedCategory, selectedEntity, timeRange, zoomLevel]);

  const drawTimeline = () => {
    if (!svgRef.current || !containerRef.current) return;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Filter events
    const filteredEvents = filterEvents();
    if (filteredEvents.length === 0) return;
    
    // Set up dimensions
    const containerWidth = containerRef.current.clientWidth;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', 400);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const timeExtent = d3.extent(filteredEvents, d => d.date) as [Date, Date];
    const xScale = d3.scaleTime()
      .domain(timeExtent)
      .range([0, width]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d3.timeFormat('%b %Y'));
    
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('y', 10)
      .attr('x', -8)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
    
    // Create timeline line
    g.append('line')
      .attr('x1', 0)
      .attr('y1', height / 2)
      .attr('x2', width)
      .attr('y2', height / 2)
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 2);
    
    // Create event points
    const eventGroups = g.selectAll('.event-point')
      .data(filteredEvents)
      .enter()
      .append('g')
      .attr('class', 'event-point')
      .attr('transform', d => `translate(${xScale(d.date)},${height / 2})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        // Show event details
        console.log('Event clicked:', d);
      });
    
    // Add circles for events
    eventGroups.append('circle')
      .attr('r', d => d.importance === 'major' ? 8 : 5)
      .attr('fill', d => getCategoryColor(d.category))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);
    
    // Add event labels
    eventGroups.append('text')
      .attr('y', d => d.importance === 'major' ? -15 : -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', d => d.importance === 'major' ? '12px' : '10px')
      .attr('fill', '#4b5563')
      .text(d => d.title.length > 20 ? d.title.substring(0, 20) + '...' : d.title);
    
    // Add date labels
    eventGroups.append('text')
      .attr('y', d => d.importance === 'major' ? 20 : 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('fill', '#6b7280')
      .text(d => d.date.toLocaleDateString());
  };

  const filterEvents = () => {
    return events.filter(event => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!event.title.toLowerCase().includes(query) && 
            !event.description.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // Apply category filter
      if (selectedCategory && event.category !== selectedCategory) {
        return false;
      }
      
      // Apply entity filter
      if (selectedEntity && !event.entities.includes(selectedEntity)) {
        return false;
      }
      
      // Apply time range filter
      if (event.date < timeRange[0] || event.date > timeRange[1]) {
        return false;
      }
      
      return true;
    });
  };

  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      'political': '#3b82f6', // blue
      'social': '#10b981', // green
      'economic': '#f59e0b', // amber
      'technological': '#8b5cf6', // purple
      'cultural': '#ec4899', // pink
      'environmental': '#34d399', // emerald
      'scientific': '#6366f1', // indigo
      'legal': '#f43f5e', // rose
    };
    
    return colorMap[category] || '#9ca3af'; // gray default
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    
    const event: TimelineEvent = {
      id: generateId(),
      title: newEvent.title || '',
      date: newEvent.date || new Date(),
      description: newEvent.description || '',
      sources: newEvent.sources || [],
      entities: newEvent.entities || [],
      importance: newEvent.importance || 'minor',
      category: newEvent.category || '',
      verificationStatus: newEvent.verificationStatus || 'unverified'
    };
    
    onEventAdd(event);
    
    // Reset form
    setNewEvent({
      title: '',
      date: new Date(),
      description: '',
      sources: [],
      entities: [],
      importance: 'minor',
      category: '',
      verificationStatus: 'unverified'
    });
    setShowAddEvent(false);
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const shiftTimeRangeLeft = () => {
    const rangeSpan = timeRange[1].getTime() - timeRange[0].getTime();
    const shiftAmount = rangeSpan * 0.25; // Shift by 25% of the current range
    
    setTimeRange([
      new Date(timeRange[0].getTime() - shiftAmount),
      new Date(timeRange[1].getTime() - shiftAmount)
    ]);
  };

  const shiftTimeRangeRight = () => {
    const rangeSpan = timeRange[1].getTime() - timeRange[0].getTime();
    const shiftAmount = rangeSpan * 0.25; // Shift by 25% of the current range
    
    setTimeRange([
      new Date(timeRange[0].getTime() + shiftAmount),
      new Date(timeRange[1].getTime() + shiftAmount)
    ]);
  };

  const getUniqueCategories = () => {
    return [...new Set(events.map(event => event.category))].filter(Boolean);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Research Timeline</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
            
            <button
              onClick={() => {/* Export functionality */}}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <div>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedEntity || ''}
              onChange={(e) => setSelectedEntity(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Entities</option>
              {entities.map(entity => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={zoomOut}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Zoom Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
            <button
              onClick={zoomIn}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Zoom In"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
            <button
              onClick={shiftTimeRangeLeft}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Shift Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={shiftTimeRangeRight}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Shift Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Event Form */}
      {showAddEvent && (
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Timeline Event</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={newEvent.date ? new Date(newEvent.date).toISOString().split('T')[0] : ''}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value ? new Date(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={newEvent.category || ''}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                list="categories"
              />
              <datalist id="categories">
                {getUniqueCategories().map(category => (
                  <option key={category} value={category} />
                ))}
                <option value="political" />
                <option value="social" />
                <option value="economic" />
                <option value="technological" />
                <option value="cultural" />
                <option value="environmental" />
                <option value="scientific" />
                <option value="legal" />
              </datalist>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Importance
              </label>
              <select
                value={newEvent.importance || 'minor'}
                onChange={(e) => setNewEvent({ ...newEvent, importance: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="major">Major</option>
                <option value="minor">Minor</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newEvent.description || ''}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Entities
            </label>
            <select
              multiple
              value={newEvent.entities || []}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setNewEvent({ ...newEvent, entities: values });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size={3}
            >
              {entities.map(entity => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddEvent(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEvent}
              disabled={!newEvent.title || !newEvent.date}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Event
            </button>
          </div>
        </div>
      )}

      {/* Timeline Visualization */}
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing events from {timeRange[0].toLocaleDateString()} to {timeRange[1].toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-600">
            Zoom: {zoomLevel.toFixed(1)}x
          </div>
        </div>
        
        <div ref={containerRef} className="w-full overflow-x-auto">
          <svg ref={svgRef} className="min-w-full"></svg>
        </div>
        
        {filterEvents().length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h4>
            <p className="text-gray-600">
              {searchQuery || selectedCategory || selectedEntity
                ? 'Try adjusting your search or filters'
                : 'Add events to your timeline'}
            </p>
          </div>
        )}
      </div>

      {/* Event List */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event List</h3>
        
        {filterEvents().length === 0 ? (
          <p className="text-center text-gray-600">No events match your current filters</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterEvents()
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.date.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {event.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.importance === 'major' ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Major
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Minor
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {event.verificationStatus.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {/* Edit event */}}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onEventDelete(event.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};