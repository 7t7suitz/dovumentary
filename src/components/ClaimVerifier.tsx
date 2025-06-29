import React, { useState, useEffect } from 'react';
import { Claim, VerificationSource, Source, Expert, SearchResult } from '../types/research';
import { 
  Search, 
  Check, 
  X, 
  AlertTriangle, 
  HelpCircle, 
  ExternalLink, 
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  BookOpen,
  User,
  Link,
  Save,
  RefreshCw
} from 'lucide-react';

interface ClaimVerifierProps {
  claim: Claim;
  onClaimUpdate: (updatedClaim: Claim) => void;
  availableSources: Source[];
  onSourceAdd: (source: Source) => void;
}

export const ClaimVerifier: React.FC<ClaimVerifierProps> = ({
  claim,
  onClaimUpdate,
  availableSources,
  onSourceAdd
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    dateFrom: '',
    dateTo: '',
    sourceTypes: [] as string[],
    reliability: [] as string[]
  });
  const [suggestedExperts, setSuggestedExperts] = useState<Expert[]>([]);
  const [isGeneratingExperts, setIsGeneratingExperts] = useState(false);

  useEffect(() => {
    // Pre-populate search query based on claim text
    setSearchQuery(generateSearchQuery(claim.text));
  }, [claim]);

  const generateSearchQuery = (claimText: string): string => {
    // Extract key terms from claim
    const text = claimText.toLowerCase();
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'of', 'that', 'which'];
    
    // Split into words, filter out stop words, and take the most important ones
    const words = text.split(/\s+/)
      .filter(word => !stopWords.includes(word) && word.length > 2)
      .slice(0, 6);
    
    return words.join(' ');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Simulate API search delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock search results
      const results = mockSearchAPI(searchQuery, searchFilters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const mockSearchAPI = (query: string, filters: any): SearchResult[] => {
    // This would be replaced with actual API calls in production
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: `Research on ${query}`,
        url: 'https://example.com/research',
        source: 'Journal of Research',
        snippet: `Recent studies have shown significant findings related to ${query} with implications for documentary accuracy.`,
        date: new Date(2023, 5, 15),
        authors: ['Dr. Jane Smith', 'Dr. John Doe'],
        sourceType: 'academic-journal',
        reliability: 'academic-peer-reviewed',
        relevanceScore: 0.92
      },
      {
        id: '2',
        title: `${query} - Wikipedia`,
        url: 'https://en.wikipedia.org/wiki/example',
        source: 'Wikipedia',
        snippet: `${query} refers to a concept that has been studied extensively in various fields including...`,
        date: new Date(2023, 8, 22),
        sourceType: 'website',
        reliability: 'reputable-publication',
        relevanceScore: 0.85
      },
      {
        id: '3',
        title: `Government Report on ${query}`,
        url: 'https://gov.example.com/reports',
        source: 'Department of Research',
        snippet: `Official statistics and data regarding ${query} show trends that contradict common assumptions.`,
        date: new Date(2022, 11, 5),
        authors: ['Government Research Division'],
        sourceType: 'government-document',
        reliability: 'official-source',
        relevanceScore: 0.89
      },
      {
        id: '4',
        title: `News Analysis: The Truth About ${query}`,
        url: 'https://news.example.com/analysis',
        source: 'Example News Network',
        snippet: `Our investigation into ${query} reveals important context that is often overlooked in documentaries.`,
        date: new Date(2023, 2, 18),
        authors: ['Sarah Johnson'],
        sourceType: 'news-article',
        reliability: 'news-source',
        relevanceScore: 0.78
      },
      {
        id: '5',
        title: `Expert Interview: Understanding ${query}`,
        url: 'https://podcast.example.com/episode42',
        source: 'Research Podcast',
        snippet: `In this interview, Professor Williams explains the nuances of ${query} and why common perceptions are often inaccurate.`,
        date: new Date(2023, 7, 30),
        sourceType: 'audio',
        reliability: 'reputable-publication',
        relevanceScore: 0.81
      }
    ];
    
    // Apply filters
    let filtered = [...mockResults];
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(result => result.date && result.date >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filtered = filtered.filter(result => result.date && result.date <= toDate);
    }
    
    if (filters.sourceTypes.length > 0) {
      filtered = filtered.filter(result => filters.sourceTypes.includes(result.sourceType));
    }
    
    if (filters.reliability.length > 0) {
      filtered = filtered.filter(result => filters.reliability.includes(result.reliability));
    }
    
    return filtered;
  };

  const handleSourceSelect = (result: SearchResult) => {
    // Check if already selected
    if (selectedSources.includes(result.id)) {
      setSelectedSources(prev => prev.filter(id => id !== result.id));
      return;
    }
    
    // Add to selected sources
    setSelectedSources(prev => [...prev, result.id]);
    
    // Create a new source if it doesn't exist in available sources
    const existingSource = availableSources.find(s => s.url === result.url);
    
    if (!existingSource) {
      const newSource: Source = {
        id: result.id,
        title: result.title,
        url: result.url,
        type: result.sourceType,
        authors: result.authors || [],
        publicationDate: result.date,
        publisher: result.source,
        reliability: result.reliability,
        accessDate: new Date(),
        notes: `Added during verification of claim: "${claim.text.substring(0, 50)}..."`,
        tags: []
      };
      
      onSourceAdd(newSource);
    }
  };

  const handleVerificationUpdate = () => {
    // Create verification sources from selected sources
    const verificationSources: VerificationSource[] = selectedSources.map(sourceId => {
      const searchResult = searchResults.find(r => r.id === sourceId);
      const supports = Math.random() > 0.3; // In a real app, this would be user-determined
      
      return {
        id: generateId(),
        sourceId,
        relevance: searchResult?.relevanceScore || 0.5,
        supports,
        contradicts: !supports,
        notes: verificationNotes,
        excerpts: [searchResult?.snippet || ''],
        addedAt: new Date()
      };
    });
    
    // Determine verification status based on sources
    let status: any = 'unverified';
    if (verificationSources.length > 0) {
      const supportCount = verificationSources.filter(s => s.supports).length;
      const contradictCount = verificationSources.filter(s => s.contradicts).length;
      
      if (supportCount > 0 && contradictCount === 0) {
        status = 'verified';
      } else if (contradictCount > 0 && supportCount === 0) {
        status = 'debunked';
      } else if (supportCount > 0 && contradictCount > 0) {
        status = 'partially-verified';
      } else {
        status = 'inconclusive';
      }
    }
    
    // Update the claim
    const updatedClaim: Claim = {
      ...claim,
      verificationStatus: status,
      verificationSources: [...claim.verificationSources, ...verificationSources],
      updatedAt: new Date()
    };
    
    onClaimUpdate(updatedClaim);
    
    // Reset form
    setSelectedSources([]);
    setVerificationNotes('');
  };

  const generateSuggestedExperts = async () => {
    setIsGeneratingExperts(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock experts based on claim category
      const experts = generateMockExperts(claim);
      setSuggestedExperts(experts);
      
      // Update claim with suggested experts
      const updatedClaim = {
        ...claim,
        suggestedExperts: experts
      };
      
      onClaimUpdate(updatedClaim);
    } catch (error) {
      console.error('Failed to generate experts:', error);
    } finally {
      setIsGeneratingExperts(false);
    }
  };

  const generateMockExperts = (claim: Claim): Expert[] => {
    const expertsByCategory: Record<string, Expert[]> = {
      'historical': [
        {
          id: generateId(),
          name: 'Dr. Amanda Peterson',
          title: 'Professor of History',
          organization: 'Stanford University',
          expertise: ['Modern History', 'Historical Documentation', 'Archival Research'],
          relevance: 0.92,
          notes: 'Specializes in the time period relevant to this claim'
        },
        {
          id: generateId(),
          name: 'Dr. Robert Chen',
          title: 'Curator',
          organization: 'National Historical Museum',
          expertise: ['Historical Artifacts', 'Cultural History', 'Authentication'],
          relevance: 0.85,
          notes: 'Has published extensively on related historical events'
        }
      ],
      'scientific': [
        {
          id: generateId(),
          name: 'Dr. Sarah Johnson',
          title: 'Research Scientist',
          organization: 'MIT',
          expertise: ['Environmental Science', 'Climate Research', 'Data Analysis'],
          relevance: 0.94,
          notes: 'Leading researcher in this specific scientific field'
        },
        {
          id: generateId(),
          name: 'Prof. Michael Wong',
          title: 'Department Chair',
          organization: 'California Institute of Technology',
          expertise: ['Physics', 'Scientific Methodology', 'Peer Review Process'],
          relevance: 0.88,
          notes: 'Can speak to the scientific consensus on this topic'
        }
      ],
      'statistical': [
        {
          id: generateId(),
          name: 'Dr. Emily Rodriguez',
          title: 'Data Scientist',
          organization: 'National Statistics Institute',
          expertise: ['Statistical Analysis', 'Data Visualization', 'Survey Methodology'],
          relevance: 0.91,
          notes: 'Expert in interpreting statistical data related to this claim'
        },
        {
          id: generateId(),
          name: 'Prof. David Kim',
          title: 'Professor of Economics',
          organization: 'London School of Economics',
          expertise: ['Econometrics', 'Statistical Modeling', 'Data Interpretation'],
          relevance: 0.87,
          notes: 'Can provide context on the statistical methods used'
        }
      ]
    };
    
    // Default experts for other categories
    const defaultExperts: Expert[] = [
      {
        id: generateId(),
        name: 'Dr. James Wilson',
        title: 'Research Director',
        organization: 'Fact Check Institute',
        expertise: ['Fact Verification', 'Source Analysis', 'Media Literacy'],
        relevance: 0.82,
        notes: 'General fact-checking expert'
      },
      {
        id: generateId(),
        name: 'Prof. Lisa Thompson',
        title: 'Professor of Media Studies',
        organization: 'Columbia University',
        expertise: ['Media Analysis', 'Documentary Ethics', 'Source Verification'],
        relevance: 0.79,
        notes: 'Specializes in documentary fact-checking'
      }
    ];
    
    return expertsByCategory[claim.category] || defaultExperts;
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'debunked':
        return <X className="w-5 h-5 text-red-500" />;
      case 'partially-verified':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'inconclusive':
        return <HelpCircle className="w-5 h-5 text-gray-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'debunked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'partially-verified':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inconclusive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'factual':
        return 'bg-blue-100 text-blue-800';
      case 'statistical':
        return 'bg-purple-100 text-purple-800';
      case 'historical':
        return 'bg-amber-100 text-amber-800';
      case 'scientific':
        return 'bg-green-100 text-green-800';
      case 'opinion':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'academic-peer-reviewed':
        return 'bg-green-100 text-green-800';
      case 'official-source':
        return 'bg-blue-100 text-blue-800';
      case 'reputable-publication':
        return 'bg-teal-100 text-teal-800';
      case 'news-source':
        return 'bg-yellow-100 text-yellow-800';
      case 'unverified':
      case 'questionable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Claim Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900">Claim Verification</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claim.verificationStatus)}`}>
              {claim.verificationStatus.replace('-', ' ')}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(claim.category)}`}>
            {claim.category}
          </span>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
          <p className="text-gray-900 font-medium">{claim.text}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Confidence: {Math.round(claim.confidence * 100)}%</span>
            <span>Importance: {claim.importance}</span>
          </div>
          <span>Last updated: {claim.updatedAt.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Search for Sources</h3>
          <button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <Filter className="w-4 h-4" />
            <span>Advanced Search</span>
            {showAdvancedSearch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for sources to verify this claim..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
        
        {/* Advanced Search Options */}
        {showAdvancedSearch && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={searchFilters.dateFrom}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={searchFilters.dateTo}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Types</label>
                <select
                  multiple
                  value={searchFilters.sourceTypes}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setSearchFilters(prev => ({ ...prev, sourceTypes: values }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  size={3}
                >
                  <option value="academic-journal">Academic Journals</option>
                  <option value="government-document">Government Documents</option>
                  <option value="news-article">News Articles</option>
                  <option value="website">Websites</option>
                  <option value="book">Books</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reliability</label>
                <select
                  multiple
                  value={searchFilters.reliability}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setSearchFilters(prev => ({ ...prev, reliability: values }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  size={3}
                >
                  <option value="academic-peer-reviewed">Academic Peer-Reviewed</option>
                  <option value="official-source">Official Source</option>
                  <option value="reputable-publication">Reputable Publication</option>
                  <option value="news-source">News Source</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => setSearchFilters({
                    dateFrom: '',
                    dateTo: '',
                    sourceTypes: [],
                    reliability: []
                  })}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Search Results</h4>
                <span className="text-sm text-gray-600">{searchResults.length} sources found</span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {searchResults.map((result) => (
                <div key={result.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-gray-900">{result.title}</h5>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getReliabilityColor(result.reliability)}`}>
                          {result.reliability.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{result.snippet}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{result.source}</span>
                        {result.date && <span>{result.date.toLocaleDateString()}</span>}
                        {result.authors && result.authors.length > 0 && (
                          <span>{result.authors.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleSourceSelect(result)}
                        className={`p-2 rounded-full ${
                          selectedSources.includes(result.id)
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Verification Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Details</h3>
        
        <div className="space-y-4">
          {/* Selected Sources */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Sources ({selectedSources.length})
            </label>
            
            {selectedSources.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No sources selected yet</p>
                <p className="text-xs text-gray-500 mt-1">Search and select sources to verify this claim</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedSources.map(sourceId => {
                  const result = searchResults.find(r => r.id === sourceId);
                  if (!result) return null;
                  
                  return (
                    <div key={sourceId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <p className="font-medium text-gray-900">{result.title}</p>
                        <p className="text-xs text-gray-600">{result.source}</p>
                      </div>
                      <button
                        onClick={() => setSelectedSources(prev => prev.filter(id => id !== sourceId))}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Verification Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Notes
            </label>
            <textarea
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="Add notes about your verification process, findings, and conclusions..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Update Button */}
          <div className="flex justify-end">
            <button
              onClick={handleVerificationUpdate}
              disabled={selectedSources.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Update Verification</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expert Suggestions */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Expert Suggestions</h3>
          <button
            onClick={generateSuggestedExperts}
            disabled={isGeneratingExperts}
            className="flex items-center space-x-2 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isGeneratingExperts ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Generate Experts</span>
              </>
            )}
          </button>
        </div>
        
        {suggestedExperts.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No expert suggestions yet</p>
            <p className="text-xs text-gray-500 mt-1">Generate expert suggestions to find interview candidates</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestedExperts.map(expert => (
              <div key={expert.id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{expert.name}</h4>
                    <p className="text-sm text-gray-600">{expert.title}{expert.organization ? `, ${expert.organization}` : ''}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {expert.expertise.map((area, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                    
                    {expert.notes && (
                      <p className="text-xs text-gray-600 mt-2">{expert.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-purple-800">
                      {Math.round(expert.relevance * 100)}% match
                    </span>
                    <button className="p-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200">
                      <Link className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};