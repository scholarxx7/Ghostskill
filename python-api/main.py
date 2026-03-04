from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
import os
from pathlib import Path
import random
from ai_search import search_engine, initialize_search_engine

app = FastAPI(
    title="GhostSkill Wisdom API",
    description="Python FastAPI service for serving ancient wisdom from traditional texts with AI-powered semantic search",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base path for datasets
DATASETS_PATH = Path("../Datasets")
CUSTOM_DATASET_PATH = Path("../dataset")

# Models
class WisdomQuery(BaseModel):
    persona: str
    topic: Optional[str] = None
    keywords: Optional[List[str]] = None
    max_results: Optional[int] = 5

class WisdomResponse(BaseModel):
    source: str
    text: str
    reference: Optional[str] = None
    category: Optional[str] = None
    relevance: Optional[List[str]] = None

# Dataset loaders
def load_chanakya_data():
    """Load all Chanakya Niti chapters"""
    data = []
    chanakya_path = DATASETS_PATH / "chanakya" / "Chanakya-Niti"
    
    if chanakya_path.exists():
        for chapter_file in sorted(chanakya_path.glob("chapter*.json")):
            try:
                with open(chapter_file, 'r', encoding='utf-8') as f:
                    chapter_data = json.load(f)
                    chapter_num = chapter_file.stem.replace('chapter', '')
                    for verse in chapter_data:
                        data.append({
                            "source": "Chanakya Niti",
                            "text": verse.get("text", "").strip(),
                            "reference": f"Chapter {chapter_num}, Verse {verse.get('verse_id', '')}",
                            "category": "strategy"
                        })
            except Exception as e:
                print(f"Error loading {chapter_file}: {e}")
    
    return data

def load_bhagavad_gita_data():
    """Load Bhagavad Gita from custom dataset"""
    gita_path = CUSTOM_DATASET_PATH / "bhagavad_gita.json"
    
    if gita_path.exists():
        try:
            with open(gita_path, 'r', encoding='utf-8') as f:
                gita_data = json.load(f)
                return [{
                    "source": "Bhagavad Gita",
                    "text": verse.get("text", ""),
                    "reference": f"Chapter {verse.get('chapter', '')}, Verse {verse.get('verse', '')}",
                    "category": verse.get("category", ""),
                    "relevance": verse.get("relevance", [])
                } for verse in gita_data.get("verses", [])]
        except Exception as e:
            print(f"Error loading Bhagavad Gita: {e}")
    
    return []

def load_arthashastra_data():
    """Load Arthashastra from custom dataset"""
    artha_path = CUSTOM_DATASET_PATH / "arthashastra.json"
    
    if artha_path.exists():
        try:
            with open(artha_path, 'r', encoding='utf-8') as f:
                artha_data = json.load(f)
                return [{
                    "source": "Arthashastra",
                    "text": teaching.get("text", ""),
                    "reference": teaching.get("topic", ""),
                    "category": teaching.get("category", ""),
                    "relevance": teaching.get("relevance", [])
                } for teaching in artha_data.get("teachings", [])]
        except Exception as e:
            print(f"Error loading Arthashastra: {e}")
    
    return []

def load_meditations_data():
    """Load Marcus Aurelius Meditations"""
    med_path = CUSTOM_DATASET_PATH / "meditations.json"
    
    if med_path.exists():
        try:
            with open(med_path, 'r', encoding='utf-8') as f:
                med_data = json.load(f)
                return [{
                    "source": "Meditations",
                    "text": med.get("text", ""),
                    "reference": f"Book {med.get('book', '')}, Entry {med.get('entry', '')}",
                    "category": med.get("category", ""),
                    "relevance": med.get("relevance", [])
                } for med in med_data.get("meditations", [])]
        except Exception as e:
            print(f"Error loading Meditations: {e}")
    
    return []

def load_napoleon_data():
    """Load Napoleon's Maxims"""
    nap_path = CUSTOM_DATASET_PATH / "napoleon_maxims.json"
    
    if nap_path.exists():
        try:
            with open(nap_path, 'r', encoding='utf-8') as f:
                nap_data = json.load(f)
                return [{
                    "source": "Napoleon's Maxims",
                    "text": maxim.get("text", ""),
                    "reference": f"Maxim {maxim.get('number', '')}" if maxim.get('number') else "Teaching",
                    "category": maxim.get("category", ""),
                    "relevance": maxim.get("relevance", [])
                } for maxim in nap_data.get("maxims", [])]
        except Exception as e:
            print(f"Error loading Napoleon's Maxims: {e}")
    
    return []

# Load all datasets on startup
wisdom_database = {
    "chanakya": [],
    "bose": [],
    "aurelius": [],
    "napoleon": [],
    "friend": []
}

@app.on_event("startup")
async def load_all_data():
    """Load all wisdom data on startup"""
    print("📚 Loading wisdom datasets...")
    
    # Load traditional datasets
    # Chanakya gets ONLY Chanakya Niti + Arthashastra (strategic texts only)
    chanakya_niti = load_chanakya_data()
    arthashastra = load_arthashastra_data()
    
    wisdom_database["chanakya"] = chanakya_niti + arthashastra
    
    # Bose gets Bhagavad Gita (focus on duty, courage, action)
    gita_data = load_bhagavad_gita_data()
    wisdom_database["bose"] = [v for v in gita_data if any(tag in v.get("relevance", []) for tag in ["duty", "courage", "action", "discipline"])]
    
    # If filtered Gita is empty, use all Gita verses
    if not wisdom_database["bose"]:
        wisdom_database["bose"] = gita_data
    
    # Marcus Aurelius gets Meditations + disciplined Gita verses
    meditations = load_meditations_data()
    gita_discipline = [v for v in gita_data if any(tag in v.get("relevance", []) for tag in ["discipline", "mind-control", "stoicism"])]
    wisdom_database["aurelius"] = meditations + gita_discipline
    
    # Napoleon gets his maxims
    wisdom_database["napoleon"] = load_napoleon_data()
    
    # Friend gets everything combined
    wisdom_database["friend"] = (
        wisdom_database["chanakya"] + 
        wisdom_database["bose"] + 
        wisdom_database["aurelius"] + 
        wisdom_database["napoleon"]
    )
    
    print(f"✅ Loaded {len(wisdom_database['chanakya'])} verses for Chanakya (Chanakya Niti + Arthashastra)")
    print(f"✅ Loaded {len(wisdom_database['bose'])} verses for Bose (Bhagavad Gita)")
    print(f"✅ Loaded {len(wisdom_database['aurelius'])} verses for Aurelius (Meditations + Gita)")
    print(f"✅ Loaded {len(wisdom_database['napoleon'])} maxims for Napoleon")
    print(f"✅ Loaded {len(wisdom_database['friend'])} total wisdom texts for Friend")
    
    # Initialize AI search engine
    print("\n🤖 Initializing AI search engine...")
    ai_loaded = initialize_search_engine()
    if ai_loaded:
        print("✅ AI-powered semantic search enabled!")
    else:
        print("⚠️  AI search unavailable, using fallback methods")

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "GhostSkill Wisdom API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "wisdom": "/wisdom/{persona}",
            "random": "/wisdom/{persona}/random",
            "search": "/wisdom/search"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "datasets_loaded": {
            "chanakya": len(wisdom_database["chanakya"]),
            "bose": len(wisdom_database["bose"]),
            "aurelius": len(wisdom_database["aurelius"]),
            "napoleon": len(wisdom_database["napoleon"])
        }
    }

@app.get("/wisdom/{persona}")
async def get_wisdom(persona: str, limit: int = 5):
    """Get wisdom for a specific persona"""
    if persona not in wisdom_database:
        raise HTTPException(status_code=404, detail=f"Persona '{persona}' not found")
    
    data = wisdom_database[persona]
    if not data:
        raise HTTPException(status_code=404, detail=f"No wisdom data available for '{persona}'")
    
    # Return random selection
    sample_size = min(limit, len(data))
    selected = random.sample(data, sample_size)
    
    return {
        "persona": persona,
        "count": len(selected),
        "wisdom": selected
    }

@app.get("/wisdom/{persona}/random")
async def get_random_wisdom(persona: str):
    """Get a single random wisdom quote for a persona"""
    if persona not in wisdom_database:
        raise HTTPException(status_code=404, detail=f"Persona '{persona}' not found")
    
    data = wisdom_database[persona]
    if not data:
        raise HTTPException(status_code=404, detail=f"No wisdom data available for '{persona}'")
    
    selected = random.choice(data)
    
    return {
        "persona": persona,
        "wisdom": selected
    }

@app.post("/wisdom/search")
async def search_wisdom(query: WisdomQuery):
    """Search for wisdom based on topic/keywords"""
    if query.persona not in wisdom_database:
        raise HTTPException(status_code=404, detail=f"Persona '{query.persona}' not found")
    
    data = wisdom_database[query.persona]
    results = []
    
    # Simple keyword-based search
    for item in data:
        text_lower = item["text"].lower()
        
        # Check keywords
        if query.keywords:
            if any(keyword.lower() in text_lower for keyword in query.keywords):
                results.append(item)
        # Check topic in relevance
        elif query.topic:
            relevance = item.get("relevance", [])
            if query.topic.lower() in [r.lower() for r in relevance]:
                results.append(item)
        else:
            results.append(item)
        
        # Limit results
        if len(results) >= query.max_results:
            break
    
    # If no results, return random
    if not results:
        results = random.sample(data, min(query.max_results, len(data)))
    
    return {
        "persona": query.persona,
        "query": query.dict(),
        "count": len(results),
        "results": results
    }

@app.get("/datasets/stats")
async def get_stats():
    """Get statistics about loaded datasets"""
    return {
        "total_texts": sum(len(v) for v in wisdom_database.values()),
        "by_persona": {
            persona: {
                "count": len(data),
                "sources": list(set(item["source"] for item in data))
            }
            for persona, data in wisdom_database.items()
        }
    }

# AI-Powered Endpoints
@app.post("/ai/semantic-search")
async def ai_semantic_search(
    query: str,
    persona: Optional[str] = None,
    limit: int = 5
):
    """
    AI-powered semantic search using trained embeddings
    
    This endpoint uses the trained FAISS index and sentence transformers
    to find the most semantically relevant wisdom based on the query meaning,
    not just keyword matching.
    """
    try:
        results = search_engine.semantic_search(
            query=query,
            top_k=limit,
            persona=persona
        )
        
        return {
            "query": query,
            "persona": persona,
            "count": len(results),
            "results": results,
            "method": "ai_semantic_search"
        }
    except RuntimeError as e:
        # Fallback to traditional search if AI not available
        raise HTTPException(
            status_code=503,
            detail=f"AI search unavailable: {str(e)}"
        )

@app.get("/ai/predict-category/{text}")
async def predict_category(text: str):
    """
    Predict the category of a given text using trained classifier
    """
    try:
        category = search_engine.predict_category(text)
        return {
            "text": text[:100] + "..." if len(text) > 100 else text,
            "predicted_category": category
        }
    except RuntimeError as e:
        raise HTTPException(
            status_code=503,
            detail=f"AI classifier unavailable: {str(e)}"
        )

@app.get("/ai/by-category/{category}")
async def get_by_category(
    category: str,
    persona: Optional[str] = None,
    limit: int = 5
):
    """
    Get wisdom filtered by predicted category
    """
    try:
        results = search_engine.get_wisdom_by_category(
            category=category,
            limit=limit,
            persona=persona
        )
        
        return {
            "category": category,
            "persona": persona,
            "count": len(results),
            "results": results
        }
    except RuntimeError as e:
        raise HTTPException(
            status_code=503,
            detail=f"AI search unavailable: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
