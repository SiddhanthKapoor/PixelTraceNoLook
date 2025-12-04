// Mock data structure matching the API format
export const mockPhotoData = {
  "Under25": {
    "anchal_apurva": [
      "https://drive.google.com/file/d/1bW-7QZdg0L0wUIyV3Z7leZKhzu5Att_W/view?usp=drivesdk",
      "https://drive.google.com/file/d/175OqZL6bSSWBmH4wcDSZ3bAAc_nQChcu/view?usp=drivesdk",
      "https://drive.google.com/file/d/1SI81om5ReT7zAIIrgCGaiu1qR0848iaY/view?usp=drivesdk",
      "https://drive.google.com/file/d/1huGPP9M-tZlpLW71Leq5NfzYgBfdaUnn/view?usp=drivesdk",
      "https://drive.google.com/file/d/1PLLrVhCXEY41EdWZBMEygmGTbZfNdC2a/view?usp=drivesdk"
    ],
    "ishan_ganguly": [
      "https://drive.google.com/file/d/1bW-7QZdg0L0wUIyV3Z7leZKhzu5Att_W/view?usp=drivesdk",
      "https://drive.google.com/file/d/175OqZL6bSSWBmH4wcDSZ3bAAc_nQChcu/view?usp=drivesdk",
      "https://drive.google.com/file/d/1SnhQMXNFSMM9YVP6QeswkwBy0C8I8nm1/view?usp=drivesdk",
      "https://drive.google.com/file/d/1SI81om5ReT7zAIIrgCGaiu1qR0848iaY/view?usp=drivesdk"
    ],
    "ashmit_kumar_nayak": [
      "https://drive.google.com/file/d/1bW-7QZdg0L0wUIyV3Z7leZKhzu5Att_W/view?usp=drivesdk",
      "https://drive.google.com/file/d/1oVkDWwyqEyGsAi884TRN9dq68f3eJhWb/view?usp=drivesdk",
      "https://drive.google.com/file/d/1iDfseaTupqzi5bqmpV40cJPDOL84wcDA/view?usp=drivesdk"
    ]
  },
  "Garba night 25": {
    "anchal_apurva": [
      "https://drive.google.com/file/d/1Qtjr9Otsfx_lYDyMXMeRKEL-b7XgefW8/view?usp=drivesdk",
      "https://drive.google.com/file/d/1vzU-4LmnI9tLq0ZEZ6pqx8MJbG_ABAXA/view?usp=drivesdk"
    ],
    "nistha_sarawagi": [
      "https://drive.google.com/file/d/1PxRQQ_iHOgREWPfkNlFlrS_kxNVijk7a/view?usp=drivesdk",
      "https://drive.google.com/file/d/1Fb1a_xyuQZpuk4jws66tt4tYGw-9MIwD/view?usp=drivesdk",
      "https://drive.google.com/file/d/1lNsxEhowDffdCnt6TrzjncXONsMBFj1Y/view?usp=drivesdk"
    ],
    "mohammad_tauqueer": [
      "https://drive.google.com/file/d/1qaCNKbuFSr6RA-LzJKBNT4S5PnL0uDNz/view?usp=drivesdk",
      "https://drive.google.com/file/d/16nyiITGznBZxblbQkRfWkU-1HElliQYg/view?usp=drivesdk",
      "https://drive.google.com/file/d/1bz1EBgv4UlY7BjOnWWWo-Smkx-pBEs1Y/view?usp=drivesdk"
    ]
  }
};

// Helper function to convert Google Drive view links to direct image URLs
export const convertGoogleDriveUrl = (url) => {
  if (url.includes('drive.google.com/file/d/')) {
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  return url;
};

// Helper function to get all events for a person
export const getPersonEvents = (personName) => {
  const events = [];
  
  Object.keys(mockPhotoData).forEach(eventName => {
    const normalizedPersonName = personName.toLowerCase().replace(/\s+/g, '_');
    
    // Check if person exists in this event (case-insensitive)
    const personExists = Object.keys(mockPhotoData[eventName]).some(
      name => name.toLowerCase() === normalizedPersonName
    );
    
    if (personExists) {
      const exactPersonKey = Object.keys(mockPhotoData[eventName]).find(
        name => name.toLowerCase() === normalizedPersonName
      );
      
      events.push({
        eventName,
        photoCount: mockPhotoData[eventName][exactPersonKey].length,
        photos: mockPhotoData[eventName][exactPersonKey]
      });
    }
  });
  
  return events;
};

// Helper function to search for people
export const searchPeople = (query) => {
  const allPeople = new Set();
  
  Object.values(mockPhotoData).forEach(event => {
    Object.keys(event).forEach(person => {
      allPeople.add(person);
    });
  });
  
  const searchQuery = query.toLowerCase();
  return Array.from(allPeople).filter(person => 
    person.toLowerCase().includes(searchQuery) ||
    person.replace(/_/g, ' ').toLowerCase().includes(searchQuery)
  );
};