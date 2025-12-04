import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again');
    }
    if (error.response?.status === 404) {
      throw new Error('Data not found');
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error - please try again later');
    }
    throw new Error(error.response?.data?.detail || 'An error occurred');
  }
);

// Helper function to convert Google Drive view links to direct image URLs
export const convertGoogleDriveUrl = (url) => {
  if (url.includes('drive.google.com/file/d/')) {
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
    if (fileId) {
      // Use thumbnail API for better compatibility
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }
  return url;
};

// API service functions
export const photoApi = {
  // Get all photo data
  async getAllPhotos() {
    try {
      const response = await apiClient.get('/photos/all');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching all photos:', error);
      throw error;
    }
  },

  // Search for people
  async searchPeople(query) {
    try {
      if (!query || query.length < 1) {
        return [];
      }
      const response = await apiClient.get(`/photos/search?query=${encodeURIComponent(query)}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching people:', error);
      throw error;
    }
  },

  // Get person's events
  async getPersonEvents(personName) {
    try {
      const response = await apiClient.get(`/photos/person/${encodeURIComponent(personName)}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching person events:', error);
      throw error;
    }
  },

  // Get event photos for a person
  async getEventPhotos(eventName, personName) {
    try {
      const response = await apiClient.get(
        `/photos/event/${encodeURIComponent(eventName)}/person/${encodeURIComponent(personName)}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching event photos:', error);
      throw error;
    }
  },

  // Get API statistics
  async getStats() {
    try {
      const response = await apiClient.get('/photos/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

// Alternative Google Drive URL formats for fallbacks
export const getAlternativeGoogleDriveUrl = (url) => {
  if (url.includes('drive.google.com/file/d/')) {
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
    if (fileId) {
      return [
        `https://lh3.googleusercontent.com/d/${fileId}`,
        `https://drive.google.com/uc?export=view&id=${fileId}`,
        `https://drive.google.com/thumbnail?id=${fileId}&sz=w800-h600`
      ];
    }
  }
  return [url];
};

// Utility functions to replace mock functions
export const searchPeople = async (query) => {
  return await photoApi.searchPeople(query);
};

export const getPersonEvents = async (personName) => {
  return await photoApi.getPersonEvents(personName);
};

export const getEventPhotos = async (eventName, personName) => {
  return await photoApi.getEventPhotos(eventName, personName);
};