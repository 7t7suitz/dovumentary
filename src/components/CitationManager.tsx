import React, { useState } from 'react';
import { Citation, Source, CitationFormat } from '../types/research';
import { 
  BookOpen, 
  Copy, 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Download,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CitationManagerProps {
  citations: Citation[];
  sources: Source[];
  onCitationAdd: (citation: Citation) => void;
  onCitationUpdate: (citation: Citation) => void;
  onCitationDelete: (citationId: string) => void;
  onSourceAdd: (source: Source) => void;
}

export const CitationManager: React.FC<CitationManagerProps> = ({
  citations,
  sources,
  onCitationAdd,
  onCitationUpdate,
  onCitationDelete,
  onSourceAdd
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>('apa');
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSource, setNewSource] = useState<Partial<Source>>({
    title: '',
    type: 'website',
    authors: [''],
    reliability: 'unverified',
    accessDate: new Date(),
    notes: '',
    tags: []
  });
  const [editingCitation, setEditingCitation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sourceTypes: [] as string[],
    formats: [] as string[]
  });

  const handleAddSource = () => {
    if (!newSource.title) return;
    
    const source: Source = {
      id: generateId(),
      title: newSource.title || '',
      url: newSource.url,
      type: newSource.type || 'website',
      authors: newSource.authors || [],
      publicationDate: newSource.publicationDate,
      publisher: newSource.publisher,
      reliability: newSource.reliability || 'unverified',
      accessDate: newSource.accessDate || new Date(),
      content: newSource.content,
      notes: newSource.notes || '',
      tags: newSource.tags || []
    };
    
    onSourceAdd(source);
    
    // Reset form
    setNewSource({
      title: '',
      type: 'website',
      authors: [''],
      reliability: 'unverified',
      accessDate: new Date(),
      notes: '',
      tags: []
    });
    setShowAddSource(false);
    
    // Generate citation for the new source
    generateCitation(source.id);
  };

  const generateCitation = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    if (!source) return;
    
    // Generate citation text based on format and source type
    const citationText = formatCitation(source, selectedFormat);
    const inlineText = formatInlineCitation(source, selectedFormat);
    
    const citation: Citation = {
      id: generateId(),
      sourceId,
      format: selectedFormat,
      text: citationText,
      inlineText,
      documentIds: [],
      claimIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onCitationAdd(citation);
  };

  const formatCitation = (source: Source, format: CitationFormat): string => {
    const authors = source.authors.join(', ');
    const year = source.publicationDate ? new Date(source.publicationDate).getFullYear() : 'n.d.';
    const title = source.title;
    const publisher = source.publisher || '';
    const url = source.url || '';
    const accessDate = new Date(source.accessDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    switch (format) {
      case 'apa':
        return `${authors}. (${year}). ${title}. ${publisher}. ${url ? `Retrieved from ${url}` : ''}`;
      
      case 'mla':
        return `${authors}. "${title}." ${publisher}, ${year}. ${url ? `Web. Accessed ${accessDate}.` : ''}`;
      
      case 'chicago':
        return `${authors}. "${title}." ${publisher}, ${year}. ${url ? `${url}.` : ''}`;
      
      case 'harvard':
        return `${authors} (${year}). ${title}. ${publisher}. ${url ? `Available at: ${url} [Accessed ${accessDate}].` : ''}`;
      
      default:
        return `${authors}. (${year}). ${title}. ${publisher}.`;
    }
  };

  const formatInlineCitation = (source: Source, format: CitationFormat): string => {
    const firstAuthor = source.authors[0] || 'Unknown';
    const lastName = firstAuthor.split(' ').pop() || firstAuthor;
    const year = source.publicationDate ? new Date(source.publicationDate).getFullYear() : 'n.d.';
    
    switch (format) {
      case 'apa':
        return `(${lastName}, ${year})`;
      
      case 'mla':
        return `(${lastName})`;
      
      case 'chicago':
        return `${lastName} ${year}`;
      
      case 'harvard':
        return `(${lastName}, ${year})`;
      
      default:
        return `(${lastName}, ${year})`;
    }
  };

  const handleUpdateCitation = (citation: Citation) => {
    const source = sources.find(s => s.id === citation.sourceId);
    if (!source) return;
    
    const updatedCitation: Citation = {
      ...citation,
      format: selectedFormat,
      text: formatCitation(source, selectedFormat),
      inlineText: formatInlineCitation(source, selectedFormat),
      updatedAt: new Date()
    };
    
    onCitationUpdate(updatedCitation);
    setEditingCitation(null);
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...(newSource.authors || [])];
    newAuthors[index] = value;
    setNewSource({ ...newSource, authors: newAuthors });
  };

  const addAuthorField = () => {
    setNewSource({ ...newSource, authors: [...(newSource.authors || []), ''] });
  };

  const removeAuthorField = (index: number) => {
    const newAuthors = [...(newSource.authors || [])];
    newAuthors.splice(index, 1);
    setNewSource({ ...newSource, authors: newAuthors });
  };

  const filteredCitations = citations.filter(citation => {
    const source = sources.find(s => s.id === citation.sourceId);
    if (!source) return false;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = source.title.toLowerCase().includes(query);
      const matchesAuthors = source.authors.some(author => author.toLowerCase().includes(query));
      const matchesPublisher = source.publisher?.toLowerCase().includes(query);
      
      if (!matchesTitle && !matchesAuthors && !matchesPublisher) {
        return false;
      }
    }
    
    // Apply type filter
    if (filters.sourceTypes.length > 0 && !filters.sourceTypes.includes(source.type)) {
      return false;
    }
    
    // Apply format filter
    if (filters.formats.length > 0 && !filters.formats.includes(citation.format)) {
      return false;
    }
    
    return true;
  });

  const getSourceTypeLabel = (type: string): string => {
    return type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFormatLabel = (format: string): string => {
    switch (format) {
      case 'apa': return 'APA';
      case 'mla': return 'MLA';
      case 'chicago': return 'Chicago';
      case 'harvard': return 'Harvard';
      case 'ieee': return 'IEEE';
      default: return format.toUpperCase();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Citation Manager</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddSource(!showAddSource)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Source</span>
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
        
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search citations by title, author, or publisher..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg ${showFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
            
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as CitationFormat)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="apa">APA</option>
              <option value="mla">MLA</option>
              <option value="chicago">Chicago</option>
              <option value="harvard">Harvard</option>
              <option value="ieee">IEEE</option>
            </select>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source Types
                </label>
                <select
                  multiple
                  value={filters.sourceTypes}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters(prev => ({ ...prev, sourceTypes: values }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  size={4}
                >
                  <option value="academic-journal">Academic Journal</option>
                  <option value="book">Book</option>
                  <option value="news-article">News Article</option>
                  <option value="website">Website</option>
                  <option value="government-document">Government Document</option>
                  <option value="report">Report</option>
                  <option value="interview">Interview</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Citation Formats
                </label>
                <select
                  multiple
                  value={filters.formats}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters(prev => ({ ...prev, formats: values }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  size={4}
                >
                  <option value="apa">APA</option>
                  <option value="mla">MLA</option>
                  <option value="chicago">Chicago</option>
                  <option value="harvard">Harvard</option>
                  <option value="ieee">IEEE</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-3">
              <button
                onClick={() => setFilters({ sourceTypes: [], formats: [] })}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Source Form */}
      {showAddSource && (
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Source</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newSource.title}
                onChange={(e) => setNewSource({ ...newSource, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Type
              </label>
              <select
                value={newSource.type}
                onChange={(e) => setNewSource({ ...newSource, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="academic-journal">Academic Journal</option>
                <option value="book">Book</option>
                <option value="news-article">News Article</option>
                <option value="website">Website</option>
                <option value="government-document">Government Document</option>
                <option value="report">Report</option>
                <option value="interview">Interview</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="social-media">Social Media</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={newSource.url || ''}
                onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publication Date
              </label>
              <input
                type="date"
                value={newSource.publicationDate ? new Date(newSource.publicationDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setNewSource({ ...newSource, publicationDate: e.target.value ? new Date(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publisher
              </label>
              <input
                type="text"
                value={newSource.publisher || ''}
                onChange={(e) => setNewSource({ ...newSource, publisher: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reliability
              </label>
              <select
                value={newSource.reliability}
                onChange={(e) => setNewSource({ ...newSource, reliability: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="academic-peer-reviewed">Academic Peer-Reviewed</option>
                <option value="official-source">Official Source</option>
                <option value="reputable-publication">Reputable Publication</option>
                <option value="news-source">News Source</option>
                <option value="opinion-source">Opinion Source</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Authors
            </label>
            {newSource.authors?.map((author, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => handleAuthorChange(index, e.target.value)}
                  placeholder={`Author ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => removeAuthorField(index)}
                  disabled={newSource.authors?.length === 1}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addAuthorField}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Another Author
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={newSource.notes || ''}
              onChange={(e) => setNewSource({ ...newSource, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddSource(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSource}
              disabled={!newSource.title}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Source & Generate Citation
            </button>
          </div>
        </div>
      )}

      {/* Citations List */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Citations</h3>
          <span className="text-sm text-gray-600">{filteredCitations.length} of {citations.length} citations</span>
        </div>
        
        {filteredCitations.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Citations Found</h4>
            <p className="text-gray-600 mb-4">
              {searchQuery || filters.sourceTypes.length > 0 || filters.formats.length > 0
                ? 'Try adjusting your search or filters'
                : 'Add sources to generate citations'}
            </p>
            {(searchQuery || filters.sourceTypes.length > 0 || filters.formats.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ sourceTypes: [], formats: [] });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCitations.map((citation) => {
              const source = sources.find(s => s.id === citation.sourceId);
              if (!source) return null;
              
              return (
                <div key={citation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{source.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                          {getSourceTypeLabel(source.type)}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {getFormatLabel(citation.format)}
                        </span>
                        {source.publicationDate && (
                          <span>
                            {new Date(source.publicationDate).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {editingCitation === citation.id ? (
                        <>
                          <button
                            onClick={() => setEditingCitation(null)}
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateCitation(citation)}
                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(citation.text);
                              // Show a toast or notification
                            }}
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                            title="Copy Citation"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingCitation(citation.id)}
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                            title="Edit Citation"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onCitationDelete(citation.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                            title="Delete Citation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{citation.text}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Inline:</span>
                      <div className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">
                        {citation.inlineText}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(citation.inlineText);
                          // Show a toast or notification
                        }}
                        className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                        title="Copy Inline Citation"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View Source</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};