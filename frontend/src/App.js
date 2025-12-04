import React, { useState } from "react";
import "./App.css";
import HomePage from "./components/HomePage";
import PersonEvents from "./components/PersonEvents";
import PhotoGallery from "./components/PhotoGallery";

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handlePersonSelect = (personName) => {
    setSelectedPerson(personName);
    setCurrentView('person-events');
  };

  const handleEventSelect = (eventName, personName) => {
    setSelectedEvent(eventName);
    setSelectedPerson(personName);
    setCurrentView('photo-gallery');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPerson(null);
    setSelectedEvent(null);
  };

  const handleBackToEvents = () => {
    setCurrentView('person-events');
    setSelectedEvent(null);
  };

  return (
    <div className="App">
      {currentView === 'home' && (
        <HomePage onPersonSelect={handlePersonSelect} />
      )}
      
      {currentView === 'person-events' && selectedPerson && (
        <PersonEvents
          personName={selectedPerson}
          onEventSelect={handleEventSelect}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentView === 'photo-gallery' && selectedEvent && selectedPerson && (
        <PhotoGallery
          eventName={selectedEvent}
          personName={selectedPerson}
          onBackToEvents={handleBackToEvents}
        />
      )}
    </div>
  );
}

export default App;