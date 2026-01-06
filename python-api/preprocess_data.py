"""
Data Preprocessing Script for GhostSkill Datasets

This script cleans, validates, and enhances the raw dataset files.

Features:
- Text cleaning and normalization
- Validation of JSON structure
- Duplicate detection
- Metadata extraction
- Character encoding fixes
- Length statistics
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any
import unicodedata


class DataPreprocessor:
    def __init__(self, datasets_path: str, output_path: str):
        self.datasets_path = Path(datasets_path)
        self.output_path = Path(output_path)
        self.output_path.mkdir(exist_ok=True)
        self.stats = {
            'files_processed': 0,
            'verses_cleaned': 0,
            'duplicates_found': 0,
            'errors': []
        }
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Normalize unicode characters
        text = unicodedata.normalize('NFKD', text)
        
        # Remove special characters but keep punctuation
        text = text.strip()
        
        # Fix common issues
        text = text.replace('\r\n', ' ').replace('\n', ' ')
        text = re.sub(r'\s+', ' ', text)
        
        return text
    
    def validate_verse(self, verse: Dict[str, Any]) -> bool:
        """Validate verse structure"""
        required_fields = ['verse_id', 'text']
        return all(field in verse for field in required_fields)
    
    def process_chanakya_file(self, file_path: Path) -> List[Dict]:
        """Process a Chanakya Niti chapter file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            cleaned_verses = []
            seen_texts = set()
            
            for verse in data:
                if not self.validate_verse(verse):
                    self.stats['errors'].append(f"Invalid verse in {file_path.name}")
                    continue
                
                # Clean text
                cleaned_text = self.clean_text(verse['text'])
                
                # Check for duplicates
                if cleaned_text in seen_texts:
                    self.stats['duplicates_found'] += 1
                    continue
                
                seen_texts.add(cleaned_text)
                
                # Create cleaned verse
                cleaned_verse = {
                    'verse_id': verse['verse_id'],
                    'text': cleaned_text,
                    'length': len(cleaned_text),
                    'word_count': len(cleaned_text.split()),
                    'source_file': file_path.name
                }
                
                cleaned_verses.append(cleaned_verse)
                self.stats['verses_cleaned'] += 1
            
            return cleaned_verses
            
        except Exception as e:
            self.stats['errors'].append(f"Error processing {file_path}: {str(e)}")
            return []
    
    def process_custom_dataset(self, file_path: Path) -> Dict:
        """Process custom dataset files (Gita, Meditations, etc.)"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Different structure for different files
            if 'verses' in data:  # Bhagavad Gita
                for verse in data['verses']:
                    verse['text'] = self.clean_text(verse['text'])
                    verse['word_count'] = len(verse['text'].split())
                    self.stats['verses_cleaned'] += 1
                    
            elif 'teachings' in data:  # Arthashastra
                for teaching in data['teachings']:
                    teaching['text'] = self.clean_text(teaching['text'])
                    teaching['word_count'] = len(teaching['text'].split())
                    self.stats['verses_cleaned'] += 1
                    
            elif 'meditations' in data:  # Marcus Aurelius
                for meditation in data['meditations']:
                    meditation['text'] = self.clean_text(meditation['text'])
                    meditation['word_count'] = len(meditation['text'].split())
                    self.stats['verses_cleaned'] += 1
                    
            elif 'maxims' in data:  # Napoleon
                for maxim in data['maxims']:
                    maxim['text'] = self.clean_text(maxim['text'])
                    maxim['word_count'] = len(maxim['text'].split())
                    self.stats['verses_cleaned'] += 1
            
            return data
            
        except Exception as e:
            self.stats['errors'].append(f"Error processing {file_path}: {str(e)}")
            return {}
    
    def process_all_chanakya(self):
        """Process all Chanakya Niti files"""
        chanakya_path = self.datasets_path / "chanakya" / "Chanakya-Niti"
        
        if not chanakya_path.exists():
            print(f"⚠️  Chanakya path not found: {chanakya_path}")
            return
        
        all_verses = []
        
        for chapter_file in sorted(chanakya_path.glob("chapter*.json")):
            print(f"Processing {chapter_file.name}...")
            verses = self.process_chanakya_file(chapter_file)
            all_verses.extend(verses)
            self.stats['files_processed'] += 1
        
        # Save combined output
        output_file = self.output_path / "chanakya_niti_cleaned.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'source': 'Chanakya Niti',
                'total_verses': len(all_verses),
                'chapters': self.stats['files_processed'],
                'verses': all_verses
            }, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Saved cleaned Chanakya data to {output_file}")
    
    def process_all_custom(self):
        """Process all custom dataset files"""
        custom_path = Path("../dataset")
        
        if not custom_path.exists():
            print(f"⚠️  Custom dataset path not found: {custom_path}")
            return
        
        for json_file in custom_path.glob("*.json"):
            print(f"Processing {json_file.name}...")
            cleaned_data = self.process_custom_dataset(json_file)
            
            if cleaned_data:
                output_file = self.output_path / f"{json_file.stem}_cleaned.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(cleaned_data, f, indent=2, ensure_ascii=False)
                
                self.stats['files_processed'] += 1
                print(f"✅ Saved to {output_file}")
    
    def generate_report(self):
        """Generate preprocessing report"""
        report = f"""
        ╔══════════════════════════════════════════╗
        ║   Data Preprocessing Report              ║
        ╚══════════════════════════════════════════╝
        
        📁 Files Processed: {self.stats['files_processed']}
        📝 Verses Cleaned: {self.stats['verses_cleaned']}
        🔄 Duplicates Removed: {self.stats['duplicates_found']}
        ⚠️  Errors Found: {len(self.stats['errors'])}
        
        """
        
        if self.stats['errors']:
            report += "\n⚠️  Errors:\n"
            for error in self.stats['errors']:
                report += f"  • {error}\n"
        
        print(report)
        
        # Save report to file
        report_file = self.output_path / "preprocessing_report.txt"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"📄 Report saved to {report_file}")
    
    def run(self):
        """Run all preprocessing tasks"""
        print("=" * 50)
        print("🔄 Starting Data Preprocessing...")
        print("=" * 50)
        print()
        
        # Process Chanakya Niti
        print("📚 Processing Chanakya Niti...")
        self.process_all_chanakya()
        print()
        
        # Process custom datasets
        print("📚 Processing custom datasets...")
        self.process_all_custom()
        print()
        
        # Generate report
        self.generate_report()
        print()
        print("✅ Preprocessing complete!")


if __name__ == "__main__":
    # Paths
    datasets_path = "../Datasets"
    output_path = "preprocessed"
    
    # Run preprocessing
    preprocessor = DataPreprocessor(datasets_path, output_path)
    preprocessor.run()
