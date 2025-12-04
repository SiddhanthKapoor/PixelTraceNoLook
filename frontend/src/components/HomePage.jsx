import React, { useState, useCallback, useRef } from 'react';
import { Search, Camera, Users, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { searchPeople } from '../services/api';

const HomePage = ({ onPersonSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeoutRef = useRef(null);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (value.length > 1) { // Only start searching after 2 characters
      setIsSearching(true);
      setError(null);
      
      // Increase debounce time to 800ms to prevent frequent API calls
      timeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await searchPeople(value);
          setSearchResults(results);
        } catch (err) {
          setError(err.message);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 800);
    } else {
      setIsSearching(false);
      setSearchResults([]);
      setIsLoading(false);
    }
  }, []);

  const formatPersonName = (name) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Camera className="w-8 h-8 text-slate-700" />
              <h1 className="text-4xl font-bold text-slate-800">Photo Gallery</h1>
            </div>
            <p className="text-slate-600 text-lg">
              Search for people and discover all the events they've been part of
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for a person (e.g., anchal apurva, ishan ganguly)..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-12 pr-4 py-4 text-lg border-slate-200 focus:ring-2 focus:ring-slate-300 focus:border-transparent"
                disabled={isLoading}
              />
              {isLoading && (
                <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 animate-spin" />
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Search Results */}
            {isSearching && !error && (
              <div className="mt-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-slate-400 mx-auto animate-spin mb-2" />
                    <p className="text-slate-600">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Found {searchResults.length} people
                    </h3>
                    <div className="grid gap-3">
                      {searchResults.map((person) => (
                        <Button
                          key={person}
                          onClick={() => onPersonSelect(person)}
                          variant="outline"
                          className="justify-start text-left p-4 h-auto border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                        >
                          <div>
                            <div className="font-medium text-slate-800">
                              {formatPersonName(person)}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              Click to view their events
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-slate-400 mb-2">
                      <Search className="w-8 h-8 mx-auto" />
                    </div>
                    <p className="text-slate-600">No people found matching "{searchQuery}"</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Try searching with a different name or check the spelling
                    </p>
                  </div>
                )}
              </div>
            )}

            {!isSearching && !error && (
              <div className="text-center py-8">
                <div className="text-slate-300 mb-4">
                  <Camera className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-slate-500 text-lg">Type at least 2 characters to search</p>
                <p className="text-sm text-slate-400 mt-2">
                  Find photos from all the events they've attended
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-slate-400 text-sm">
        <p>Discover memories from every event</p>
      </div>
    </div>
  );
};

export default HomePage;