"""
Post-Processing Script for GhostSkill Datasets

This script performs advanced analysis and indexing on cleaned datasets.

Features:
- Keyword extraction
- Category tagging
- Relevance scoring
- Index generation for fast lookup
- Statistics and analytics
- Vector preparation (for future embedding)
"""

import json
from pathlib import Path
from typing import Dict, List, Set
from collections import Counter
import re


class DataPostprocessor:
    def __init__(self, input_path: str, output_path: str):
        self.input_path = Path(input_path)
        self.output_path = Path(output_path)
        self.output_path.mkdir(exist_ok=True)
        
        # Keywords for categorization
        self.keywords = {
            'strategy': ['strategy', 'plan', 'preparation', 'approach', 'method', 'tactics'],
            'leadership': ['leader', 'king', 'command', 'authority', 'guide', 'influence'],
            'wisdom': ['wisdom', 'knowledge', 'understanding', 'insight', 'truth'],
            'courage': ['courage', 'brave', 'fear', 'bold', 'daring', 'fearless'],
            'discipline': ['discipline', 'control', 'restraint', 'focus', 'practice'],
            'decision': ['decision', 'choice', 'judgment', 'determine', 'resolve'],
            'war': ['war', 'battle', 'enemy', 'conflict', 'fight', 'victory'],
            'virtue': ['virtue', 'goodness', 'righteous', 'moral', 'ethical'],
            'action': ['action', 'act', 'do', 'execute', 'perform', 'accomplish'],
            'mind': ['mind', 'thought', 'thinking', 'mental', 'consciousness'],
        }
        
        self.stats = {
            'verses_processed': 0,
            'categories_assigned': 0,
            'keywords_extracted': 0
        }
    
    def extract_keywords(self, text: str) -> List[str]:
        """Extract relevant keywords from text"""
        text_lower = text.lower()
        found_keywords = []
        
        for category, keywords in self.keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    found_keywords.append(category)
                    break  # One match per category
        
        return list(set(found_keywords))  # Remove duplicates
    
    def calculate_relevance_score(self, text: str, keywords: List[str]) -> float:
        """Calculate relevance score based on keywords and length"""
        base_score = len(keywords) * 10
        length_bonus = min(len(text) / 100, 5)  # Max 5 points for length
        return round(base_score + length_bonus, 2)
    
    def extract_topics(self, text: str) -> List[str]:
        """Extract main topics from text"""
        topics = []
        
        # Common wisdom topics
        topic_patterns = {
            'friendship': r'\b(friend|friendship|ally|companion)\b',
            'wealth': r'\b(wealth|money|riches|treasure|prosperity)\b',
            'knowledge': r'\b(knowledge|learn|study|education|wisdom)\b',
            'duty': r'\b(duty|obligation|responsibility|dharma)\b',
            'power': r'\b(power|authority|strength|force)\b',
            'time': r'\b(time|moment|opportunity|season)\b',
            'character': r'\b(character|virtue|quality|nature)\b',
        }
        
        for topic, pattern in topic_patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                topics.append(topic)
        
        return topics
    
    def process_verse(self, verse: Dict) -> Dict:
        """Add post-processing metadata to a verse"""
        text = verse.get('text', '')
        
        # Extract keywords and topics
        keywords = self.extract_keywords(text)
        topics = self.extract_topics(text)
        
        # Calculate relevance score
        relevance_score = self.calculate_relevance_score(text, keywords)
        
        # Add metadata
        verse['keywords'] = keywords
        verse['topics'] = topics
        verse['relevance_score'] = relevance_score
        verse['searchable'] = f"{text} {' '.join(keywords)} {' '.join(topics)}".lower()
        
        self.stats['verses_processed'] += 1
        self.stats['categories_assigned'] += len(keywords)
        self.stats['keywords_extracted'] += len(keywords) + len(topics)
        
        return verse
    
    def create_index(self, verses: List[Dict]) -> Dict:
        """Create search index for fast lookup"""
        index = {
            'by_keyword': {},
            'by_topic': {},
            'by_length': {'short': [], 'medium': [], 'long': []},
            'by_relevance': {'high': [], 'medium': [], 'low': []}
        }
        
        for i, verse in enumerate(verses):
            verse_id = i
            
            # Index by keyword
            for keyword in verse.get('keywords', []):
                if keyword not in index['by_keyword']:
                    index['by_keyword'][keyword] = []
                index['by_keyword'][keyword].append(verse_id)
            
            # Index by topic
            for topic in verse.get('topics', []):
                if topic not in index['by_topic']:
                    index['by_topic'][topic] = []
                index['by_topic'][topic].append(verse_id)
            
            # Index by length
            text_length = verse.get('length', len(verse.get('text', '')))
            if text_length < 100:
                index['by_length']['short'].append(verse_id)
            elif text_length < 300:
                index['by_length']['medium'].append(verse_id)
            else:
                index['by_length']['long'].append(verse_id)
            
            # Index by relevance
            relevance = verse.get('relevance_score', 0)
            if relevance > 30:
                index['by_relevance']['high'].append(verse_id)
            elif relevance > 15:
                index['by_relevance']['medium'].append(verse_id)
            else:
                index['by_relevance']['low'].append(verse_id)
        
        return index
    
    def generate_statistics(self, verses: List[Dict]) -> Dict:
        """Generate statistical analysis"""
        all_keywords = []
        all_topics = []
        lengths = []
        
        for verse in verses:
            all_keywords.extend(verse.get('keywords', []))
            all_topics.extend(verse.get('topics', []))
            lengths.append(verse.get('length', 0))
        
        keyword_counts = Counter(all_keywords)
        topic_counts = Counter(all_topics)
        
        stats = {
            'total_verses': len(verses),
            'avg_length': round(sum(lengths) / len(lengths), 2) if lengths else 0,
            'min_length': min(lengths) if lengths else 0,
            'max_length': max(lengths) if lengths else 0,
            'top_keywords': dict(keyword_counts.most_common(10)),
            'top_topics': dict(topic_counts.most_common(10)),
            'keyword_distribution': dict(keyword_counts),
            'topic_distribution': dict(topic_counts)
        }
        
        return stats
    
    def process_file(self, input_file: Path):
        """Process a single cleaned dataset file"""
        print(f"📊 Post-processing {input_file.name}...")
        
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Process verses
            if 'verses' in data:
                data['verses'] = [self.process_verse(v) for v in data['verses']]
                verses_key = 'verses'
            elif 'teachings' in data:
                data['teachings'] = [self.process_verse(t) for t in data['teachings']]
                verses_key = 'teachings'
            elif 'meditations' in data:
                data['meditations'] = [self.process_verse(m) for m in data['meditations']]
                verses_key = 'meditations'
            elif 'maxims' in data:
                data['maxims'] = [self.process_verse(m) for m in data['maxims']]
                verses_key = 'maxims'
            else:
                print(f"⚠️  Unknown structure in {input_file.name}")
                return
            
            # Create index
            verses = data[verses_key]
            index = self.create_index(verses)
            data['index'] = index
            
            # Generate statistics
            statistics = self.generate_statistics(verses)
            data['statistics'] = statistics
            
            # Save enhanced data
            output_file = self.output_path / f"{input_file.stem}_enhanced.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Saved enhanced data to {output_file}")
            
            # Print statistics
            print(f"   📝 Processed {statistics['total_verses']} items")
            print(f"   📏 Avg length: {statistics['avg_length']} chars")
            print(f"   🔑 Top keywords: {list(statistics['top_keywords'].keys())[:5]}")
            print()
            
        except Exception as e:
            print(f"❌ Error processing {input_file}: {e}")
    
    def generate_master_index(self):
        """Generate a master index across all datasets"""
        print("📑 Generating master index...")
        
        master_index = {
            'datasets': {},
            'global_keywords': {},
            'global_topics': {},
            'total_verses': 0
        }
        
        for enhanced_file in self.output_path.glob("*_enhanced.json"):
            with open(enhanced_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            dataset_name = enhanced_file.stem.replace('_cleaned_enhanced', '')
            master_index['datasets'][dataset_name] = {
                'file': enhanced_file.name,
                'statistics': data.get('statistics', {})
            }
            
            # Aggregate global counts
            stats = data.get('statistics', {})
            master_index['total_verses'] += stats.get('total_verses', 0)
            
            # Merge keywords
            for keyword, count in stats.get('keyword_distribution', {}).items():
                master_index['global_keywords'][keyword] = \
                    master_index['global_keywords'].get(keyword, 0) + count
            
            # Merge topics
            for topic, count in stats.get('topic_distribution', {}).items():
                master_index['global_topics'][topic] = \
                    master_index['global_topics'].get(topic, 0) + count
        
        # Sort by frequency
        master_index['global_keywords'] = dict(
            sorted(master_index['global_keywords'].items(), 
                   key=lambda x: x[1], reverse=True)
        )
        master_index['global_topics'] = dict(
            sorted(master_index['global_topics'].items(), 
                   key=lambda x: x[1], reverse=True)
        )
        
        # Save master index
        master_file = self.output_path / "master_index.json"
        with open(master_file, 'w', encoding='utf-8') as f:
            json.dump(master_index, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Master index saved to {master_file}")
        print(f"   📚 Total datasets: {len(master_index['datasets'])}")
        print(f"   📝 Total verses: {master_index['total_verses']}")
        print(f"   🔑 Unique keywords: {len(master_index['global_keywords'])}")
        print()
    
    def generate_report(self):
        """Generate post-processing report"""
        report = f"""
        ╔══════════════════════════════════════════╗
        ║   Post-Processing Report                 ║
        ╚══════════════════════════════════════════╝
        
        📝 Verses Processed: {self.stats['verses_processed']}
        🏷️  Categories Assigned: {self.stats['categories_assigned']}
        🔑 Keywords Extracted: {self.stats['keywords_extracted']}
        
        ✅ Enhanced datasets with:
           • Keyword extraction
           • Topic identification
           • Relevance scoring
           • Search indexing
           • Statistical analysis
        
        """
        
        print(report)
        
        # Save report
        report_file = self.output_path / "postprocessing_report.txt"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"📄 Report saved to {report_file}")
    
    def run(self):
        """Run all post-processing tasks"""
        print("=" * 50)
        print("⚙️  Starting Post-Processing...")
        print("=" * 50)
        print()
        
        # Process all cleaned files
        for cleaned_file in self.input_path.glob("*_cleaned.json"):
            self.process_file(cleaned_file)
        
        # Generate master index
        self.generate_master_index()
        
        # Generate report
        self.generate_report()
        print()
        print("✅ Post-processing complete!")


if __name__ == "__main__":
    # Paths
    input_path = "preprocessed"
    output_path = "enhanced"
    
    # Run post-processing
    postprocessor = DataPostprocessor(input_path, output_path)
    postprocessor.run()
