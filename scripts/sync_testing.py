"""Sync the supplementary unit "Testing Python programs" from its trilingual decks.

python scripts/sync_testing.py [source folder]

The source folder holds python-testing.pptx, python-testing-en.pptx,
python-testing-ja.pptx and the three example projects gradebook_testing.zip,
gradebook_testing-en.zip and gradebook_testing-ja.zip. With a folder the script
re-extracts content/testing-slides.json and the diagram images, copies the decks
and example ZIPs, and writes content/testing-source-manifest.json (needs
python-pptx and Pillow). Without a folder it only refreshes the testing entries
in content/lessons.json.

The decks come from the same generator as Week 12 and the English and Japanese
decks are in-place translations, so the Week 12 extraction is reused: every
block is classified once from the Chinese deck and applied to the same shape in
the other languages.
"""
from pathlib import Path
import hashlib
import json
import shutil

from sync_week12 import NOTE, OUTPUT, SKIP, build_slide, kind, plan

ROOT = Path(__file__).resolve().parents[1]
FILES = {'zh': 'python-testing.pptx', 'en': 'python-testing-en.pptx', 'ja': 'python-testing-ja.pptx'}
EXAMPLES = {'zh': 'gradebook_testing.zip', 'en': 'gradebook_testing-en.zip', 'ja': 'gradebook_testing-ja.zip'}
SLIDES = 35
# Output excerpts and the pytest configuration are shown as plain text, not Python:
# (slide number, index of the code block on that slide) -> label key.
TEXT_BLOCKS = {(7, 1): 'output', (11, 0): 'output', (20, 1): 'output', (23, 0): 'pyproject.toml',
               (24, 0): 'output', (27, 1): 'output', (29, 0): 'output'}


def extract(folder):
    from pptx import Presentation
    decks = {lang: Presentation(folder / name) for lang, name in FILES.items()}
    counts = {lang: len(deck.slides) for lang, deck in decks.items()}
    assert set(counts.values()) == {SLIDES}, counts
    output = {lang: [] for lang in FILES}
    for index, zh_slide in enumerate(decks['zh'].slides):
        number = index + 1
        zh_shapes, items = plan(zh_slide)
        zh_notes = zh_slide.notes_slide.notes_text_frame.text.strip() if zh_slide.has_notes_slide else ''
        public_note = bool(zh_notes) and not zh_notes.startswith('這是隱藏投影片')
        for lang, deck in decks.items():
            slide = deck.slides[index]
            shapes = [s for s in slide.shapes if kind(s) not in SKIP]
            if slide.slide_layout.name == 'ANSWER':
                shapes.insert(0, next(s for s in slide.shapes if kind(s) == 'chip-text'))
            assert [kind(s) for s in shapes] == [kind(s) for s in zh_shapes], (lang, number)
            image_name = f'testing-{lang}-slide-{number}.png'
            data, notes = build_slide(number, slide, shapes, items, lang, image_name)
            blob = data.pop('_blob', None)
            if blob:
                (ROOT / 'public/materials' / image_name).write_bytes(blob)
            codes = [block for block in data['body'] if block['type'] == 'code']
            for (slide_number, position), label in TEXT_BLOCKS.items():
                if slide_number == number:
                    codes[position].update(language='text', label=OUTPUT[lang] if label == 'output' else label)
            if public_note and notes:
                data['body'].append({'type': 'text', 'text': NOTE[lang] + notes})
            output[lang].append(data)
    path = ROOT / 'content/testing-slides.json'
    path.write_text(json.dumps(output, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


def sync_testing(lessons, folder=None):
    if folder and not (folder / FILES['zh']).exists():
        print(f'Testing sources not found in {folder}; keeping the committed testing files.')
        folder = None
    if folder:
        extract(folder)
    raw = json.loads((ROOT / 'content/testing-slides.json').read_text(encoding='utf-8'))
    manifest = []
    for lang, slides in raw.items():
        download = f'testing-{lang}.pptx'
        lessons[f'{lang}-testing'] = {'source': FILES[lang], 'slides': slides, 'download': download,
                                      'examples': EXAMPLES[lang]}
        if folder:
            source = folder / FILES[lang]
            shutil.copyfile(source, ROOT / 'public/materials' / download)
            shutil.copyfile(folder / EXAMPLES[lang], ROOT / 'public/materials' / EXAMPLES[lang])
            manifest.append({'unit': 'testing', 'language': lang, 'source': FILES[lang], 'download': download,
                             'slides': SLIDES, 'sha256': hashlib.sha256(source.read_bytes()).hexdigest()})
    if folder:
        (ROOT / 'content/testing-source-manifest.json').write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    import sys
    lessons = json.loads((ROOT / 'content/lessons.json').read_text(encoding='utf-8'))
    sync_testing(lessons, Path(sys.argv[1]) if len(sys.argv) > 1 else None)
    (ROOT / 'content/lessons.json').write_text(json.dumps(lessons, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f'Synced 3 testing lessons, {SLIDES * 3} topics.')
