import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, X, ChevronLeft, ChevronRight, Loader2, AlertCircle, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { getEventPhotos, convertGoogleDriveUrl, getAlternativeGoogleDriveUrl } from '../services/api';

const PhotoGallery = ({ eventName, personName, onBackToEvents }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventPhotos = async () => {
      if (!eventName || !personName) return;

      setIsLoading(true);
      setError(null);

      try {
        const photoData = await getEventPhotos(eventName, personName);
        setPhotos(photoData.photos || []);
      } catch (err) {
        setError(err.message);
        setPhotos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventPhotos();
  }, [eventName, personName]);

  const formatPersonName = (name) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatEventName = (eventName) => {
    return eventName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction) => {
    const newIndex = direction === 'prev'
      ? (selectedIndex - 1 + photos.length) % photos.length
      : (selectedIndex + 1) % photos.length;

    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const openInDrive = (photo) => {
    window.open(photo, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBackToEvents}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Events
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatEventName(eventName)}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Loading photos of {formatPersonName(personName)}...
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-indigo-500 mx-auto animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400 text-lg">Loading photos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBackToEvents}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Events
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatEventName(eventName)}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Card className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30">
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Photos</h2>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="dark:border-slate-600 dark:text-slate-300">
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBackToEvents}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {formatEventName(eventName)}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Photos of {formatPersonName(personName)} • {photos.length} photos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {photos.map((photo, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 bg-white dark:bg-slate-800 group"
                onClick={() => openLightbox(photo, index)}
              >
                <div className="aspect-square relative">
                  <img
                    src={convertGoogleDriveUrl(photo)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Try alternative Google Drive URLs
                      const alternatives = getAlternativeGoogleDriveUrl(photo);
                      const currentSrc = e.target.src;
                      const currentIndex = alternatives.findIndex(url => url === currentSrc);

                      if (currentIndex >= 0 && currentIndex < alternatives.length - 1) {
                        // Try next alternative
                        e.target.src = alternatives[currentIndex + 1];
                      } else {
                        // All alternatives failed, show placeholder
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 items-center justify-center text-center text-slate-600 dark:text-slate-400 hidden">
                    <div>
                      <Camera className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-xs font-medium">Photo {index + 1}</div>
                      <div className="text-xs opacity-75 mt-1">Click for Drive</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-slate-300 dark:text-slate-600 mb-4">
              <Camera className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              No Photos Found
            </h2>
            <p className="text-slate-500 dark:text-slate-500">
              No photos available for {formatPersonName(personName)} in {formatEventName(eventName)}.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl max-h-full">
            {/* Close button */}
            <Button
              onClick={closeLightbox}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <Button
                  onClick={() => navigatePhoto('prev')}
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  onClick={() => navigatePhoto('next')}
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Photo */}
            <img
              src={convertGoogleDriveUrl(selectedPhoto)}
              alt="Full size photo"
              className="max-w-full max-h-[90vh] object-contain bg-black/20 rounded-lg"
              onError={(e) => {
                // Try alternative Google Drive URLs for lightbox
                const alternatives = getAlternativeGoogleDriveUrl(selectedPhoto);
                const currentSrc = e.target.src;
                const currentIndex = alternatives.findIndex(url => url === currentSrc);

                if (currentIndex >= 0 && currentIndex < alternatives.length - 1) {
                  // Try next alternative
                  e.target.src = alternatives[currentIndex + 1];
                } else {
                  // All alternatives failed, show fallback message
                  e.target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'bg-white dark:bg-slate-800 rounded-lg p-8 max-w-md mx-auto text-center';
                  fallback.innerHTML = `
                    <div class="w-16 h-16 text-slate-600 dark:text-slate-400 mx-auto mb-4 flex items-center justify-center">
                      <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Photo ${selectedIndex + 1}</h3>
                    <p class="text-slate-600 dark:text-slate-400 mb-6">Click the button below to view this photo in Google Drive.</p>
                  `;
                  e.target.parentNode.insertBefore(fallback, e.target);
                }
              }}
            />

            {/* Bottom controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              <Button
                onClick={() => openInDrive(selectedPhoto)}
                variant="outline"
                size="sm"
                className="bg-white/90 text-slate-800 hover:bg-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Drive
              </Button>
              <div className="bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
                {selectedIndex + 1} / {photos.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;