import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Users, Loader2, AlertCircle, Moon, Sun } from 'lucide-react';
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
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all duration-200"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <img
                src="/logo.png"
                alt="PixelTraceNoLook Logo"
                className="w-12 h-12 rounded-lg shadow-md"
              />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                PixelTraceNoLook
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Search for people and discover all the events they've been part of
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800 dark:border dark:border-slate-700">
          <CardContent className="p-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for a person (e.g., Shubham Shah, Mayank Gupta)..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-12 pr-4 py-4 text-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
              {isLoading && (
                <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 animate-spin" />
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Search Results */}
            {isSearching && !error && (
              <div className="mt-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-indigo-500 mx-auto animate-spin mb-2" />
                    <p className="text-slate-600 dark:text-slate-400">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Found {searchResults.length} people
                    </h3>
                    <div className="grid gap-3">
                      {searchResults.map((person) => (
                        <Button
                          key={person}
                          onClick={() => onPersonSelect(person)}
                          variant="outline"
                          className="justify-start text-left p-4 h-auto border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200"
                        >
                          <div>
                            <div className="font-medium text-slate-800 dark:text-slate-200">
                              {formatPersonName(person)}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              Click to view their events
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-slate-400 dark:text-slate-500 mb-2">
                      <Search className="w-8 h-8 mx-auto" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">No people found matching "{searchQuery}"</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                      Try searching with a different name or check the spelling
                    </p>
                  </div>
                )}
              </div>
            )}

            {!isSearching && !error && (
              <div className="text-center py-8">
                <div className="text-slate-300 dark:text-slate-600 mb-4">
                  <img
                    src="/logo.png"
                    alt="PixelTraceNoLook"
                    className="w-16 h-16 mx-auto rounded-lg opacity-50"
                  />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-lg">Type at least 2 characters to search</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                  Find photos from all the events they've attended
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
        <p>Discover memories from every event</p>
      </div>
    </div>
  );
};

export default HomePage;