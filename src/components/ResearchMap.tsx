import React, { useState, useRef, useEffect } from 'react';
import { ResearchMap, ResearchNode, ResearchEdge, Claim, Source, Entity, Expert } from '../types/research';
import { 
  Network, 
  Plus, 
  Minus, 
  Save, 
  Download, 
  Settings, 
  Move,
  Trash2,
  Edit3,
  Search,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize
} from 'lucide-react';
import * as d3 from 'd3';

interface ResearchMapProps {
  map: ResearchMap;
  claims: Claim[];
  sources: Source[];
  entities: Entity[];
  experts: Expert[];
  onMapUpdate: (map: ResearchMap) => void;
}

export const ResearchMapComponent: React.FC<ResearchMapProps> = ({
  map,
  claims,
  sources,
  entities,
  experts,
  onMapUpdate
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [newNodeType, setNewNodeType] = useState<'claim' | 'source' | 'entity' | 'expert'>('claim');
  const [newEdgeType, setNewEdgeType] = useState<'supports' | 'contradicts' | 'relates' | 'cites' | 'mentions'>('relates');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    nodeTypes: [] as string[],
    edgeTypes: [] as string[]
  });
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (map.nodes.length > 0 && svgRef.current && containerRef.current) {
      drawResearchMap();
    }
  }, [map, selectedNode, selectedEdge, zoomLevel, searchQuery, filters]);

  const drawResearchMap = () => {
    if (!svgRef.current || !containerRef.current) return;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Filter nodes and edges
    const filteredNodes = filterNodes();
    const filteredEdges = filterEdges(filteredNodes);
    
    if (filteredNodes.length === 0) return;
    
    // Set up dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = 600;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight);
    
    // Create simulation
    const simulation = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(filteredEdges).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(containerWidth / 2, containerHeight / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.size + 10));
    
    // Create edges
    const edges = svg.append('g')
      .selectAll('line')
      .data(filteredEdges)
      .enter()
      .append('g')
      .attr('class', 'edge');
    
    const edgePaths = edges.append('path')
      .attr('stroke', (d: any) => getEdgeColor(d.type))
      .attr('stroke-width', (d: any) => d.strength * 3)
      .attr('fill', 'none')
      .attr('marker-end', (d: any) => `url(#arrow-${d.type})`)
      .attr('class', (d: any) => selectedEdge === d.id ? 'selected-edge' : '');
    
    // Create edge labels
    const edgeLabels = edges.append('text')
      .attr('dy', -5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#6b7280')
      .text((d: any) => d.label);
    
    // Create arrow markers
    const markerTypes = ['supports', 'contradicts', 'relates', 'cites', 'mentions'];
    
    markerTypes.forEach(type => {
      svg.append('defs').append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', getEdgeColor(type));
    });
    
    // Create nodes
    const nodes = svg.append('g')
      .selectAll('circle')
      .data(filteredNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d.id);
      });
    
    // Add circles for nodes
    nodes.append('circle')
      .attr('r', (d: any) => d.size)
      .attr('fill', (d: any) => d.color)
      .attr('stroke', (d: any) => selectedNode === d.id ? '#000000' : '#ffffff')
      .attr('stroke-width', (d: any) => selectedNode === d.id ? 2 : 1);
    
    // Add icons for nodes
    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '10px')
      .attr('fill', '#ffffff')
      .text((d: any) => getNodeIcon(d.type));
    
    // Add labels for nodes
    nodes.append('text')
      .attr('dx', 0)
      .attr('dy', (d: any) => d.size + 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#4b5563')
      .text((d: any) => d.label.length > 20 ? d.label.substring(0, 20) + '...' : d.label);
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
      edgePaths.attr('d', (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });
      
      edgeLabels.attr('transform', (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const midX = (d.source.x + d.target.x) / 2;
        const midY = (d.source.y + d.target.y) / 2;
        return `translate(${midX},${midY}) rotate(${angle})`;
      });
      
      nodes.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      
      // Update node position in the map
      const updatedNodes = map.nodes.map(node => 
        node.id === d.id ? { ...node, position: { x: d.x, y: d.y } } : node
      );
      
      onMapUpdate({
        ...map,
        nodes: updatedNodes
      });
    }
  };

  const filterNodes = () => {
    return map.nodes.filter(node => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!node.label.toLowerCase().includes(query) && 
            !node.description.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // Apply node type filter
      if (filters.nodeTypes.length > 0 && !filters.nodeTypes.includes(node.type)) {
        return false;
      }
      
      return true;
    });
  };

  const filterEdges = (filteredNodes: ResearchNode[]) => {
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    
    return map.edges.filter(edge => {
      // Only include edges where both source and target nodes are in the filtered set
      if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
        return false;
      }
      
      // Apply edge type filter
      if (filters.edgeTypes.length > 0 && !filters.edgeTypes.includes(edge.type)) {
        return false;
      }
      
      return true;
    });
  };

  const getNodeColor = (type: string): string => {
    switch (type) {
      case 'claim':
        return '#3b82f6'; // blue
      case 'source':
        return '#10b981'; // green
      case 'entity':
        return '#f59e0b'; // amber
      case 'expert':
        return '#8b5cf6'; // purple
      default:
        return '#6b7280'; // gray
    }
  };

  const getEdgeColor = (type: string): string => {
    switch (type) {
      case 'supports':
        return '#10b981'; // green
      case 'contradicts':
        return '#ef4444'; // red
      case 'relates':
        return '#6b7280'; // gray
      case 'cites':
        return '#3b82f6'; // blue
      case 'mentions':
        return '#8b5cf6'; // purple
      default:
        return '#6b7280'; // gray
    }
  };

  const getNodeIcon = (type: string): string => {
    switch (type) {
      case 'claim':
        return 'C';
      case 'source':
        return 'S';
      case 'entity':
        return 'E';
      case 'expert':
        return 'X';
      default:
        return '?';
    }
  };

  const handleAddNode = () => {
    if (!isAddingNode) {
      setIsAddingNode(true);
      return;
    }
    
    // In a real implementation, this would open a modal to select the specific item
    // For demo purposes, we'll add a mock node
    const newNode: ResearchNode = {
      id: generateId(),
      type: newNodeType,
      referenceId: generateId(),
      label: `New ${newNodeType}`,
      description: `Description for new ${newNodeType}`,
      position: { x: 300, y: 300 },
      color: getNodeColor(newNodeType),
      size: 20
    };
    
    onMapUpdate({
      ...map,
      nodes: [...map.nodes, newNode]
    });
    
    setIsAddingNode(false);
  };

  const handleAddEdge = () => {
    if (!isAddingEdge) {
      setIsAddingEdge(true);
      return;
    }
    
    if (!selectedNode) {
      alert('Please select a source node first');
      return;
    }
    
    // In a real implementation, this would open a modal to select the target node
    // For demo purposes, we'll add a mock edge to the first available node that isn't the selected one
    const targetNode = map.nodes.find(node => node.id !== selectedNode);
    
    if (!targetNode) {
      alert('No target node available');
      return;
    }
    
    const newEdge: ResearchEdge = {
      id: generateId(),
      source: selectedNode,
      target: targetNode.id,
      label: newEdgeType,
      type: newEdgeType,
      strength: 0.7
    };
    
    onMapUpdate({
      ...map,
      edges: [...map.edges, newEdge]
    });
    
    setIsAddingEdge(false);
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;
    
    // Remove the node and any connected edges
    const updatedNodes = map.nodes.filter(node => node.id !== selectedNode);
    const updatedEdges = map.edges.filter(edge => 
      edge.source !== selectedNode && edge.target !== selectedNode
    );
    
    onMapUpdate({
      ...map,
      nodes: updatedNodes,
      edges: updatedEdges
    });
    
    setSelectedNode(null);
  };

  const handleDeleteEdge = () => {
    if (!selectedEdge) return;
    
    const updatedEdges = map.edges.filter(edge => edge.id !== selectedEdge);
    
    onMapUpdate({
      ...map,
      edges: updatedEdges
    });
    
    setSelectedEdge(null);
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Network className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{map.title}</h2>
              <p className="text-sm text-gray-600">
                {map.nodes.length} nodes • {map.edges.length} connections • 
                Last updated {new Date(map.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {/* Save functionality */}}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Save Map"
            >
              <Save className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => {/* Export functionality */}}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Export Map"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded ${showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
              title="Show Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => {/* Settings functionality */}}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Map Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nodes..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <button
              onClick={resetZoom}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Reset Zoom"
            >
              <Maximize className="w-5 h-5" />
            </button>
            
            <button
              onClick={zoomIn}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Node Types
                </label>
                <div className="space-y-2">
                  {['claim', 'source', 'entity', 'expert'].map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.nodeTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              nodeTypes: [...prev.nodeTypes, type]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              nodeTypes: prev.nodeTypes.filter(t => t !== type)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edge Types
                </label>
                <div className="space-y-2">
                  {['supports', 'contradicts', 'relates', 'cites', 'mentions'].map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.edgeTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              edgeTypes: [...prev.edgeTypes, type]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              edgeTypes: prev.edgeTypes.filter(t => t !== type)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-3">
              <button
                onClick={() => setFilters({ nodeTypes: [], edgeTypes: [] })}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Visualization */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddNode}
              className={`px-3 py-1 rounded ${
                isAddingNode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isAddingNode ? 'Select Node Type:' : 'Add Node'}
            </button>
            
            {isAddingNode && (
              <select
                value={newNodeType}
                onChange={(e) => setNewNodeType(e.target.value as any)}
                className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="claim">Claim</option>
                <option value="source">Source</option>
                <option value="entity">Entity</option>
                <option value="expert">Expert</option>
              </select>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddEdge}
              disabled={!selectedNode && !isAddingEdge}
              className={`px-3 py-1 rounded ${
                isAddingEdge ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${!selectedNode && !isAddingEdge ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAddingEdge ? 'Select Edge Type:' : 'Add Connection'}
            </button>
            
            {isAddingEdge && (
              <select
                value={newEdgeType}
                onChange={(e) => setNewEdgeType(e.target.value as any)}
                className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="supports">Supports</option>
                <option value="contradicts">Contradicts</option>
                <option value="relates">Relates</option>
                <option value="cites">Cites</option>
                <option value="mentions">Mentions</option>
              </select>
            )}
          </div>
        </div>
        
        <div ref={containerRef} className="w-full border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <svg 
            ref={svgRef} 
            className="w-full" 
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
          ></svg>
          
          {map.nodes.length === 0 && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Network className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Nodes in Map</h3>
                <p className="text-gray-600 mb-4">Add nodes to start building your research map</p>
                <button
                  onClick={handleAddNode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add First Node
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Selected Item Details */}
        {(selectedNode || selectedEdge) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">
                {selectedNode ? 'Selected Node' : 'Selected Connection'}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {/* Edit functionality */}}
                  className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={selectedNode ? handleDeleteNode : handleDeleteEdge}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {selectedNode && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {map.nodes.find(node => node.id === selectedNode)?.description || 'No description available'}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="px-2 py-0.5 rounded-full bg-gray-200">
                    {map.nodes.find(node => node.id === selectedNode)?.type}
                  </span>
                  <span>
                    {map.edges.filter(edge => edge.source === selectedNode || edge.target === selectedNode).length} connections
                  </span>
                </div>
              </div>
            )}
            
            {selectedEdge && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Connection type: {map.edges.find(edge => edge.id === selectedEdge)?.type}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>
                    Strength: {Math.round((map.edges.find(edge => edge.id === selectedEdge)?.strength || 0) * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getNodeColor('claim') }}></div>
            <span className="text-sm text-gray-700">Claim</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getNodeColor('source') }}></div>
            <span className="text-sm text-gray-700">Source</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getNodeColor('entity') }}></div>
            <span className="text-sm text-gray-700">Entity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getNodeColor('expert') }}></div>
            <span className="text-sm text-gray-700">Expert</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 rounded" style={{ backgroundColor: getEdgeColor('supports') }}></div>
            <span className="text-sm text-gray-700">Supports</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 rounded" style={{ backgroundColor: getEdgeColor('contradicts') }}></div>
            <span className="text-sm text-gray-700">Contradicts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 rounded" style={{ backgroundColor: getEdgeColor('relates') }}></div>
            <span className="text-sm text-gray-700">Relates</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 rounded" style={{ backgroundColor: getEdgeColor('cites') }}></div>
            <span className="text-sm text-gray-700">Cites</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 rounded" style={{ backgroundColor: getEdgeColor('mentions') }}></div>
            <span className="text-sm text-gray-700">Mentions</span>
          </div>
        </div>
      </div>
    </div>
  );
};