from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from typing import Dict, List
import logging

# Create FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache for external JSON data
_cache = None
_cache_valid = False

def get_photo_data():
    global _cache, _cache_valid
    
    if not _cache_valid:
        try:
            response = requests.get("https://pixeltrace.me/matched_photos.json", timeout=30)
            response.raise_for_status()
            _cache = response.json()
            _cache_valid = True
        except Exception as e:
            if _cache:
                return _cache  # Return stale cache
            raise e
    
    return _cache

@app.get("/api/photos/all")
async def get_all_photos():
    try:
        data = get_photo_data()
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/photos/search")
async def search_people(query: str):
    try:
        data = get_photo_data()
        all_people = set()
        
        for event_data in data.values():
            for person_name in event_data.keys():
                all_people.add(person_name)
        
        query_lower = query.lower()
        matching_people = [
            person for person in all_people 
            if query_lower in person.lower() or 
               query_lower in person.replace('_', ' ').lower()
        ]
        
        return {
            "status": "success", 
            "data": sorted(matching_people),
            "count": len(matching_people)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/photos/person/{person_name}")
async def get_person_events(person_name: str):
    try:
        data = get_photo_data()
        person_events = []
        
        normalized_person_name = person_name.lower().replace(' ', '_')
        
        for event_name, event_data in data.items():
            person_key = None
            for existing_person in event_data.keys():
                if existing_person.lower() == normalized_person_name:
                    person_key = existing_person
                    break
            
            if person_key and event_data[person_key]:
                person_events.append({
                    "eventName": event_name,
                    "photoCount": len(event_data[person_key]),
                    "photos": event_data[person_key]
                })
        
        return {
            "status": "success",
            "data": person_events,
            "personName": person_name,
            "eventCount": len(person_events)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/photos/event/{event_name}/person/{person_name}")
async def get_event_photos(event_name: str, person_name: str):
    try:
        data = get_photo_data()
        
        if event_name not in data:
            return {"status": "error", "message": "Event not found"}
        
        event_data = data[event_name]
        normalized_person_name = person_name.lower().replace(' ', '_')
        
        person_key = None
        for existing_person in event_data.keys():
            if existing_person.lower() == normalized_person_name:
                person_key = existing_person
                break
        
        if not person_key:
            return {"status": "error", "message": "Person not found in this event"}
        
        photos = event_data[person_key]
        
        return {
            "status": "success",
            "data": {
                "eventName": event_name,
                "personName": person_key,
                "photoCount": len(photos),
                "photos": photos
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# For Vercel serverless
from fastapi.middleware.wsgi import WSGIMiddleware
import os

# This is required for Vercel
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)