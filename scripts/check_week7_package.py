"""Run the distributed Week 7 examples, including state and MRO assertions."""
from pathlib import Path
import subprocess
import sys
import tempfile
import zipfile

root = Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as temp:
    with zipfile.ZipFile(root/'public/materials/week-7-examples.zip') as package:
        package.extractall(temp)
    subprocess.run([sys.executable, 'week7_demo.py'], cwd=temp, check=True)
