import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, Clock } from 'lucide-react';

interface MediaSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  suggestions: string[];
  recentSearches?: string[];
}

export const MediaSearch: React.FC<MediaSearchProps> = ({
  query,
  onQueryChange,
  suggestions,
  recentSearches = []
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    onQueryChange(value);
    setShowSuggestions(value.length > 0 || recentSearches.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    onQueryChange('');
    inputRef.current?.focus();
  };

  const searchSuggestions = [
    'people',
    'outdoor',
    'indoor',
    'portrait',
    'group photo',
    'high quality',
    'recent',
    'landscape',
    'close-up',
    'documentary style'
  ];

  const filteredSuggestions = query
    ? searchSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="relative">
      <div className={`relative flex items-center border rounded-lg transition-all duration-200 ${
        isFocused ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
      }`}>
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search by name, tags, people, or description..."
          className="flex-1 px-3 py-2 bg-transparent border-none outline-none"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="p-1 mr-2 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        <div className="border-l border-gray-300 pl-2 pr-3">
          <Filter className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (isFocused || query) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Recent Searches</span>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Query Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="p-3">
              <div className="space-y-1">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <Search className="w-3 h-3 inline mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Smart Search Tips */}
          {!query && recentSearches.length === 0 && (
            <div className="p-3">
              <div className="text-sm text-gray-600 mb-2">Search tips:</div>
              <div className="space-y-1 text-xs text-gray-500">
                <div>• Use quotes for exact phrases: "family photo"</div>
                <div>• Search by person names or locations</div>
                <div>• Filter by quality: "high quality" or "low quality"</div>
                <div>• Find by date: "last week" or "2023"</div>
                <div>• Search emotions: "happy", "serious", "candid"</div>
              </div>
            </div>
          )}

          {/* No Results */}
          {query && filteredSuggestions.length === 0 && (
            <div className="p-3 text-sm text-gray-500 text-center">
              No suggestions found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};