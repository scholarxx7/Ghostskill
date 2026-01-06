"""
Master Data Processing Script for GhostSkill

Runs complete data pipeline:
1. Preprocessing - Clean and validate
2. Post-processing - Index and enhance
3. Validation - Verify quality
"""

import subprocess
import sys
from pathlib import Path


def run_script(script_name: str, description: str):
    """Run a Python script and handle errors"""
    print(f"\n{'='*60}")
    print(f"🔄 {description}")
    print(f"{'='*60}\n")
    
    try:
        result = subprocess.run(
            [sys.executable, script_name],
            capture_output=False,
            text=True,
            check=True
        )
        print(f"\n✅ {description} completed successfully!\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error in {description}")
        print(f"Exit code: {e.returncode}\n")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}\n")
        return False


def main():
    """Run the complete data processing pipeline"""
    print("""
    ╔══════════════════════════════════════════════════════╗
    ║                                                      ║
    ║        GhostSkill Data Processing Pipeline          ║
    ║                                                      ║
    ║  This will process all datasets through:            ║
    ║  1. Preprocessing  - Cleaning & validation          ║
    ║  2. Post-processing - Indexing & enhancement        ║
    ║                                                      ║
    ╚══════════════════════════════════════════════════════╝
    """)
    
    scripts = [
        ("preprocess_data.py", "Step 1: Preprocessing"),
        ("postprocess_data.py", "Step 2: Post-processing"),
    ]
    
    success_count = 0
    
    for script, description in scripts:
        if not Path(script).exists():
            print(f"⚠️  Script not found: {script}")
            continue
        
        if run_script(script, description):
            success_count += 1
    
    # Final summary
    print(f"\n{'='*60}")
    print(f"📊 Processing Pipeline Summary")
    print(f"{'='*60}")
    print(f"✅ Completed: {success_count}/{len(scripts)} steps")
    print()
    
    if success_count == len(scripts):
        print("🎉 All processing completed successfully!")
        print("\n📁 Output locations:")
        print("   • Cleaned data: python-api/preprocessed/")
        print("   • Enhanced data: python-api/enhanced/")
        print("   • Master index: python-api/enhanced/master_index.json")
        print("\n💡 You can now use the enhanced datasets in your API!")
    else:
        print("⚠️  Some steps failed. Check the output above for details.")
    
    print(f"\n{'='*60}\n")


if __name__ == "__main__":
    main()
