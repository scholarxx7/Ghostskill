# 📓 GhostSkill Training Notebooks

This directory contains Jupyter notebooks for training models on the GhostSkill wisdom datasets.

## 📚 Notebooks

### `wisdom_training.ipynb`
Comprehensive notebook for training on historical wisdom datasets.

**Features:**
- ✅ Load and explore all wisdom datasets (Charak Samhita, Bhagavad Gita, Chanakya Niti, etc.)
- ✅ Data preprocessing and cleaning
- ✅ Generate sentence embeddings using state-of-the-art models
- ✅ Build FAISS vector database for semantic search
- ✅ Train category classification models
- ✅ Visualize embeddings with UMAP
- ✅ Export trained models for production use

**Datasets Included:**
- Charak Samhita (Ayurveda)
- Bhagavad Gita (Philosophy)
- Chanakya Niti (Statecraft)
- Meditations by Marcus Aurelius
- Arthashastra (Economics)
- Napoleon's Maxims (Strategy)
- Srimad Bhagavatam (Vedic Literature)
- GhostSkill Custom Dataset

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Notebook

```bash
jupyter notebook wisdom_training.ipynb
```

Or use JupyterLab:

```bash
jupyter lab wisdom_training.ipynb
```

### 3. Run All Cells

Once the notebook is open, run all cells to:
- Load all datasets
- Generate embeddings
- Train classification models
- Export models to `../models/` directory

## 📊 Output Files

After training, the following files will be created in `../models/`:

| File | Description |
|------|-------------|
| `wisdom_dataset_processed.csv` | Cleaned and processed dataset |
| `wisdom_dataset_processed.parquet` | Same data in Parquet format (faster) |
| `wisdom_embeddings.npy` | Pre-computed embeddings for all texts |
| `wisdom_embeddings.index` | FAISS index for semantic search |
| `category_classifier.pkl` | Trained category classification model |
| `label_encoder.pkl` | Label encoder for categories |
| `model_metadata.json` | Metadata about the models and dataset |

## 🎯 Model Performance

- **Embedding Model:** `all-MiniLM-L6-v2` (384 dimensions)
- **Expected Accuracy:** ~90%+ on category classification
- **Search Speed:** Sub-millisecond for semantic search

## 🔍 Usage Example

```python
from sentence_transformers import SentenceTransformer
import faiss
import pickle
import numpy as np

# Load models
model = SentenceTransformer('all-MiniLM-L6-v2')
index = faiss.read_index('../models/wisdom_embeddings.index')

# Search for wisdom
query = "How to become a better leader?"
query_embedding = model.encode([query])
faiss.normalize_L2(query_embedding)

distances, indices = index.search(query_embedding, k=5)
# Get the top 5 most relevant wisdom texts
```

## 🛠️ Requirements

- Python 3.8+
- Jupyter Notebook or JupyterLab
- 4GB+ RAM (for processing embeddings)
- 2GB+ disk space (for datasets and models)

## 📝 Notes

- The notebook includes error handling for corrupted JSON files
- All visualizations are interactive using Plotly
- Training can take 10-30 minutes depending on your hardware
- Models are saved automatically - you can resume from any checkpoint

## 🐛 Troubleshooting

**Issue:** JSON parsing errors
**Solution:** The notebook will automatically skip corrupted files and log errors

**Issue:** Out of memory
**Solution:** Reduce batch size in embedding generation (line with `batch_size=32`)

**Issue:** FAISS not installed
**Solution:** Install with `pip install faiss-cpu` (or `faiss-gpu` for GPU support)

## 📚 Further Reading

- [Sentence Transformers Documentation](https://www.sbert.net/)
- [FAISS Documentation](https://github.com/facebookresearch/faiss)
- [UMAP Documentation](https://umap-learn.readthedocs.io/)
