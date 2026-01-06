# GhostSkill Python Wisdom API

FastAPI service for serving ancient wisdom from traditional Indian and Western texts.

## 🌟 Features

- Serves wisdom from **Bhagavad Gita**, **Chanakya Niti**, **Arthashastra**, **Marcus Aurelius' Meditations**, and **Napoleon's Maxims**
- Integrates with existing **Datasets** folder (Chanakya Niti, Srimad Bhagavatam, Ayurveda)
- Persona-specific wisdom filtering
- Random wisdom selection
- Keyword-based search
- RESTful API with automatic documentation

## 📚 Data Sources

### From Existing Datasets Folder:
- **Chanakya Niti** - 17 chapters of political and ethical wisdom
- **Srimad Bhagavatam** - 12 Cantos with purports
- **Ayurveda (Charak Samhita)** - Traditional medical wisdom

### From Custom Dataset Folder:
- **Bhagavad Gita** - 10 key verses on duty, discipline, and wisdom
- **Arthashastra** - Chanakya's strategic teachings
- **Meditations** - Marcus Aurelius' Stoic philosophy
- **Napoleon's Maxims** - Military strategy and leadership

## 🚀 Quick Start

### Installation
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### Run Server
```bash
python main.py
```

Server runs on: `http://localhost:8000`

### Auto Documentation
FastAPI provides automatic interactive docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📡 API Endpoints

### Root
- **GET** `/` - API information

### Health Check
- **GET** `/health` - Check service health and loaded datasets

### Wisdom Endpoints
- **GET** `/wisdom/{persona}?limit=5` - Get wisdom for a specific persona
- **GET** `/wisdom/{persona}/random` - Get a random wisdom quote
- **POST** `/wisdom/search` - Search wisdom by keywords or topic

### Statistics
- **GET** `/datasets/stats` - Get dataset statistics

## 📝 Example Usage

### Get wisdom for Chanakya
```bash
curl http://localhost:8000/wisdom/chanakya?limit=3
```

### Get random Marcus Aurelius quote
```bash
curl http://localhost:8000/wisdom/aurelius/random
```

### Search for wisdom
```bash
curl -X POST http://localhost:8000/wisdom/search \
  -H "Content-Type: application/json" \
  -d '{
    "persona": "chanakya",
    "keywords": ["strategy", "war"],
    "max_results": 5
  }'
```

## 🗂️ Project Structure

```
python-api/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── venv/               # Virtual environment (gitignored)
└── README.md

../Datasets/            # Existing datasets
├── chanakya/
│   └── Chanakya-Niti/
├── srimad-bhagavatam/
└── Ayurveda/

../dataset/             # Custom curated datasets
├── bhagavad_gita.json
├── arthashastra.json
├── meditations.json
└── napoleon_maxims.json
```

## 🔧 Integration with Node Backend

The Python API is integrated with the Node.js backend through HTTP requests:

1. Node backend calls Python API to fetch wisdom
2. Python API returns relevant quotes from datasets
3. Node backend incorporates quotes into AI responses

Environment variable in Node backend:
```env
PYTHON_API_URL=http://localhost:8000
```

## 📊 Dataset Statistics

- **Chanakya**: ~200+ verses from Chanakya Niti
- **Bose/Gita**: 10+ key Bhagavad Gita verses
- **Aurelius**: 10+ Meditations entries + Gita discipline verses
- **Napoleon**: 10+ military maxims

## 🐛 Debugging

All requests are logged to console. Check the terminal running `python main.py` for logs.

## 📄 License

ISC © 2025

---

**Part of the GhostSkill AI Training Platform** 🧠
