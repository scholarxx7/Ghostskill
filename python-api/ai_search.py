"""
AI-powered semantic search using trained models
"""
from pathlib import Path
import numpy as np
import faiss
import pickle
import pandas as pd
from sentence_transformers import SentenceTransformer
from typing import List, Dict

# Paths to trained models
MODELS_PATH = Path("../models")

class WisdomSearchEngine:
    """Semantic search engine using trained embeddings"""
    
    def __init__(self):
        self.model = None
        self.index = None
        self.df = None
        self.label_encoder = None
        self.classifier = None
        
    def load_models(self):
        """Load all trained models"""
        print("🔄 Loading AI models...")
        
        # Load sentence transformer
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Loaded sentence transformer")
        
        # Load FAISS index
        faiss_path = MODELS_PATH / "wisdom_embeddings.index"
        if faiss_path.exists():
            self.index = faiss.read_index(str(faiss_path))
            print(f"✅ Loaded FAISS index with {self.index.ntotal} vectors")
        
        # Load processed dataset
        csv_path = MODELS_PATH / "wisdom_dataset_processed.csv"
        if csv_path.exists():
            self.df = pd.read_csv(csv_path)
            print(f"✅ Loaded dataset with {len(self.df)} documents")
        
        # Load classifier
        classifier_path = MODELS_PATH / "category_classifier.pkl"
        if classifier_path.exists():
            with open(classifier_path, 'rb') as f:
                self.classifier = pickle.load(f)
            print("✅ Loaded category classifier")
        
        # Load label encoder
        encoder_path = MODELS_PATH / "label_encoder.pkl"
        if encoder_path.exists():
            with open(encoder_path, 'rb') as f:
                self.label_encoder = pickle.load(f)
            print("✅ Loaded label encoder")
    
    def semantic_search(
        self,
        query: str,
        top_k: int = 5,
        persona: str = None
    ) -> List[Dict]:
        """
        Perform semantic search using embeddings
        
        Args:
            query: User's question or topic
            top_k: Number of results to return
            persona: Filter by persona (optional)
        
        Returns:
            List of wisdom results with similarity scores
        """
        if self.model is None or self.index is None:
            raise RuntimeError("Models not loaded. Call load_models() first.")
        
        # Encode query
        query_embedding = self.model.encode([query])
        faiss.normalize_L2(query_embedding)
        
        # Search in FAISS index
        distances, indices = self.index.search(query_embedding, top_k * 2)  # Get extra for filtering
        
        # Get results
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx >= len(self.df):
                continue
                
            row = self.df.iloc[idx]
            
            # Filter by persona if specified
            if persona and self._map_source_to_persona(row['source']) != persona:
                continue
            
            result = {
                'text': row['clean_text'],
                'source': row['source'],
                'category': row['category'],
                'similarity': float(1 - dist),  # Convert distance to similarity
                'relevance': 'high' if (1 - dist) > 0.7 else 'medium' if (1 - dist) > 0.5 else 'low'
            }
            results.append(result)
            
            if len(results) >= top_k:
                break
        
        return results
    
    def predict_category(self, text: str) -> str:
        """Predict category of a text"""
        if self.model is None or self.classifier is None:
            raise RuntimeError("Models not loaded. Call load_models() first.")
        
        # Generate embedding
        embedding = self.model.encode([text])
        
        # Predict
        prediction = self.classifier.predict(embedding)
        category = self.label_encoder.inverse_transform(prediction)[0]
        
        return category
    
    def get_wisdom_by_category(
        self,
        category: str,
        limit: int = 5,
        persona: str = None
    ) -> List[Dict]:
        """Get wisdom filtered by category"""
        if self.df is None:
            raise RuntimeError("Dataset not loaded. Call load_models() first.")
        
        # Filter by category
        filtered_df = self.df[self.df['category'] == category]
        
        # Filter by persona if specified
        if persona:
            filtered_df = filtered_df[
                filtered_df['source'].apply(lambda x: self._map_source_to_persona(x) == persona)
            ]
        
        # Sample random results
        sample_size = min(limit, len(filtered_df))
        if sample_size == 0:
            return []
        
        sampled = filtered_df.sample(n=sample_size)
        
        results = []
        for _, row in sampled.iterrows():
            results.append({
                'text': row['clean_text'],
                'source': row['source'],
                'category': row['category']
            })
        
        return results
    
    def _map_source_to_persona(self, source: str) -> str:
        """Map wisdom source to persona"""
        source_lower = source.lower()
        
        if 'chanakya' in source_lower or 'arthashastra' in source_lower:
            return 'chanakya'
        elif 'gita' in source_lower or 'bhagavad' in source_lower:
            return 'bose'
        elif 'meditations' in source_lower or 'aurelius' in source_lower:
            return 'aurelius'
        elif 'napoleon' in source_lower or 'maxim' in source_lower:
            return 'napoleon'
        
        return 'unknown'

# Global instance
search_engine = WisdomSearchEngine()

def initialize_search_engine():
    """Initialize the search engine on startup"""
    try:
        search_engine.load_models()
        return True
    except Exception as e:
        print(f"⚠️  Failed to load AI models: {e}")
        return False
