import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Images, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { getPersonEvents } from '../services/api';

const PersonEvents = ({ personName, onEventSelect, onBackToHome }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPersonEvents = async () => {
      if (!personName) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const eventData = await getPersonEvents(personName);
        setEvents(eventData);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonEvents();
  }, [personName]);
  
  const formatPersonName = (name) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatEventName = (eventName) => {
    return eventName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBackToHome}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  {formatPersonName(personName)}
                </h1>
                <p className="text-slate-600">Loading events...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-slate-400 mx-auto animate-spin mb-4" />
            <p className="text-slate-600 text-lg">Loading events for {formatPersonName(personName)}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBackToHome}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  {formatPersonName(personName)}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card className="border border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Events</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBackToHome}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {formatPersonName(personName)}
              </h1>
              <p className="text-slate-600">
                Found in {events.length} event{events.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <Card 
                key={event.eventName} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white"
                onClick={() => onEventSelect(event.eventName, personName)}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <span className="text-lg font-semibold text-slate-800">
                      {formatEventName(event.eventName)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Images className="w-4 h-4" />
                      <span className="text-sm">
                        {event.photoCount} photo{event.photoCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-slate-50 hover:bg-slate-100 border-slate-200"
                    >
                      View Photos
                    </Button>
                  </div>
                  
                  {/* Preview thumbnails */}
                  <div className="mt-4 flex gap-1 overflow-hidden rounded-lg">
                    {event.photos.slice(0, 3).map((photo, photoIndex) => {
                      const fileId = photo.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
                      const thumbnailUrl = fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w200-h200-c` : photo;
                      
                      return (
                        <div 
                          key={photoIndex}
                          className="flex-1 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded relative overflow-hidden"
                        >
                          <img 
                            src={thumbnailUrl}
                            alt={`Preview ${photoIndex + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Try alternative thumbnail URL
                              if (!e.target.src.includes('uc?export=view')) {
                                const altUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                                e.target.src = altUrl;
                              } else {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 items-center justify-center hidden">
                            <Images className="w-4 h-4 text-slate-500" />
                          </div>
                        </div>
                      );
                    })}
                    {event.photoCount > 3 && (
                      <div className="flex-1 h-16 bg-slate-800 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          +{event.photoCount - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-slate-300 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-600 mb-2">
              No Events Found
            </h2>
            <p className="text-slate-500">
              {formatPersonName(personName)} doesn't appear in any events yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonEvents;