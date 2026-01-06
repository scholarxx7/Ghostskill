# GhostSkill Data Processing Scripts

Python scripts for preprocessing and post-processing wisdom datasets.

## Scripts

### 1. `preprocess_data.py`
Cleans and validates raw dataset files.

**Features:**
- Text cleaning and normalization
- JSON structure validation
- Duplicate detection and removal
- Metadata extraction (word count, length)
- Character encoding fixes
- Processing report generation

**Usage:**
```bash
python preprocess_data.py
```

**Output:**
- `preprocessed/` directory with cleaned JSON files
- `preprocessed/preprocessing_report.txt` with statistics

### 2. `postprocess_data.py`
Performs advanced analysis and indexing.

**Features:**
- Keyword extraction (strategy, courage, wisdom, etc.)
- Topic identification (friendship, wealth, duty, etc.)
- Relevance scoring
- Search index generation
  - By keyword
  - By topic
  - By length (short/medium/long)
  - By relevance (high/medium/low)
- Statistical analysis
- Master index creation

**Usage:**
```bash
python postprocess_data.py
```

**Output:**
- `enhanced/` directory with indexed JSON files
- `enhanced/master_index.json` with global statistics
- `enhanced/postprocessing_report.txt`

### 3. `process_all.py`
Master script that runs the complete pipeline.

**Usage:**
```bash
python process_all.py
```

This runs:
1. Preprocessing
2. Post-processing
3. Generates all reports

## Data Flow

```
Raw Datasets (../Datasets, ../dataset)
         ↓
  preprocess_data.py
         ↓
Cleaned Data (preprocessed/)
         ↓
  postprocess_data.py
         ↓
Enhanced Data (enhanced/)
         ↓
    Used by main.py (FastAPI)
```

## Output Structure

```
python-api/
├── preprocessed/
│   ├── chanakya_niti_cleaned.json
│   ├── bhagavad_gita_cleaned.json
│   ├── meditations_cleaned.json
│   └── preprocessing_report.txt
│
├── enhanced/
│   ├── chanakya_niti_cleaned_enhanced.json
│   ├── bhagavad_gita_cleaned_enhanced.json
│   ├── meditations_cleaned_enhanced.json
│   ├── master_index.json
│   └── postprocessing_report.txt
```

## Enhanced Data Format

Each enhanced JSON file includes:

```json
{
  "source": "Source Name",
  "verses": [
    {
      "text": "Original text here",
      "verse_id": "1",
      "length": 123,
      "word_count": 45,
      "keywords": ["wisdom", "strategy"],
      "topics": ["knowledge", "duty"],
      "relevance_score": 25.5,
      "searchable": "combined searchable text"
    }
  ],
  "index": {
    "by_keyword": {
      "wisdom": [0, 5, 12],
      "strategy": [2, 8]
    },
    "by_topic": {...},
    "by_length": {...},
    "by_relevance": {...}
  },
  "statistics": {
    "total_verses": 200,
    "avg_length": 150.5,
    "top_keywords": {...},
    "top_topics": {...}
  }
}
```

## Keyword Categories

The system extracts these keyword categories:
- **strategy** - Planning and approach
- **leadership** - Command and influence
- **wisdom** - Knowledge and insight
- **courage** - Bravery and boldness
- **discipline** - Control and focus
- **decision** - Choice and judgment
- **war** - Conflict and battle
- **virtue** - Morality and ethics
- **action** - Execution and practice
- **mind** - Thought and consciousness

## Topic Patterns

Automatically detected topics:
- friendship
- wealth
- knowledge
- duty
- power
- time
- character

## Statistics Generated

- Total verses
- Average text length
- Min/max length
- Top 10 keywords
- Top 10 topics
- Keyword distribution
- Topic distribution

## Integration with API

The FastAPI service (`main.py`) can use either:
1. **Original datasets** - Directly from dataset folders
2. **Enhanced datasets** - From `enhanced/` folder with better search

To use enhanced data, update `main.py` to load from:
```python
enhanced_path = Path("enhanced")
```

## Running the Pipeline

### Full Pipeline
```bash
cd python-api
python process_all.py
```

### Individual Steps
```bash
# Just preprocessing
python preprocess_data.py

# Just post-processing (requires preprocessing first)
python postprocess_data.py
```

## Performance

- **Preprocessing**: ~2-5 seconds for all datasets
- **Post-processing**: ~3-7 seconds with indexing
- **Total**: Under 15 seconds for complete pipeline

## Future Enhancements

- [ ] Sentiment analysis
- [ ] Entity extraction (people, places)
- [ ] Semantic similarity using embeddings
- [ ] Multi-language support
- [ ] Custom stopword removal
- [ ] TF-IDF keyword weighting

## Troubleshooting

**FileNotFoundError**: Ensure datasets are in correct locations
- `../Datasets/` for Chanakya, Bhagavatam, Ayurveda
- `../dataset/` for custom datasets

**UnicodeDecodeError**: Files should be UTF-8 encoded

**JSON DecodeError**: Check source files for valid JSON format

---

*Part of the GhostSkill Wisdom Platform* 📚
