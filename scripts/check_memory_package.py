"""Extract and test the exact Pygame source archive offered to students."""
from pathlib import Path
import os
import subprocess
import sys
import tempfile
import zipfile

os.environ['PYGAME_HIDE_SUPPORT_PROMPT']='1'
import pygame
assert pygame.version.ver=='2.6.1', 'Install pygame==2.6.1 before checking the package.'

ROOT=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='oo2026-memory-') as temporary:
    folder=Path(temporary)
    with zipfile.ZipFile(ROOT/'public/materials/memory-oop-trilingual.zip') as archive:
        for member in archive.namelist():
            assert (folder/member).resolve().is_relative_to(folder.resolve()),member
        archive.extractall(folder)
    package=folder/'memory_oop'
    assert (package/'requirements.txt').read_text().strip()=='pygame==2.6.1'
    assert (package/'assets/NotoSansCJKtc-Regular.otf').stat().st_size>1_000_000
    assert 'SIL OPEN FONT LICENSE' in (package/'assets/OFL.txt').read_text()
    assert '© 2014-2021 Adobe' in (package/'assets/ATTRIBUTION.txt').read_text(encoding='utf-8')
    for lang in ['zh','en','ja']:
        assert f'python pygame_app.py --lang {lang}' in (package/f'README-{lang}.md').read_text(encoding='utf-8')
    env={**os.environ,'SDL_VIDEODRIVER':'dummy','SDL_AUDIODRIVER':'dummy','PYTHONUTF8':'1'}
    result=subprocess.run([sys.executable,'-m','unittest','discover','-s','tests','-v'],cwd=package,env=env,text=True,capture_output=True,encoding='utf-8')
    print(result.stdout+result.stderr)
    assert result.returncode==0
    assert 'Ran 16 tests' in result.stderr and 'skipped' not in result.stderr
print('PASS: extracted download archive, 6 model tests and 10 Pygame interface tests.')
