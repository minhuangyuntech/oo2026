"""Sync Week 12 (OOA/OOD x AI-assisted development) from the trilingual decks.

python scripts/sync_week12.py [source folder]

The source folder holds the teacher-reviewed decks week12-ooad-ai.pptx,
week12-ooad-ai-en.pptx, week12-ooad-ai-ja.pptx and the student project
lab_monitor.zip. With a folder the script re-extracts content/week12-slides.json
and the diagram images, copies the decks, rebuilds the example ZIP and writes
content/week12-source-manifest.json (needs python-pptx and Pillow).
Without a folder it only refreshes the Week 12 entries in content/lessons.json.

The three decks share one layout (the English and Japanese decks are in-place
translations), so every block is classified once from the Chinese deck and the
same decision is applied to the same shape in the other languages.
"""
from pathlib import Path
import hashlib
import json
import re
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
FILES = {'zh': 'week12-ooad-ai.pptx', 'en': 'week12-ooad-ai-en.pptx', 'ja': 'week12-ooad-ai-ja.pptx'}
SOURCE_ZIP = 'lab_monitor.zip'
EXAMPLES = 'lab_monitor.zip'
SLIDES = 89
NOTE = {'zh': '教師提示：', 'en': 'Instructor note: ', 'ja': '教員向けメモ：'}
OUTPUT = {'zh': '輸出', 'en': 'Output', 'ja': '出力'}
PROMPT = {'zh': '提示詞', 'en': 'Prompt', 'ja': 'プロンプト'}
SKIP = ('chip', 'chip-text', 'Slide Number Placeholder', 'code-box', 'quote-box', 'agenda-box',
        'outcome', 'badge', 'chapter-no')
CJK = re.compile(r'[⺀-鿿　-〿＀-￯「」『』（）：；，。、！？]')
ZIP_TIME = (2026, 12, 1, 9, 0, 0)


def kind(shape):
    name = re.sub(r'[-\s]?\d+$', '', shape.name)
    if shape.shape_type == 13:
        return 'diagram'
    if shape.has_table:
        return 'table'
    return name


def join_lines(lines):
    text = ''
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if text and not (CJK.match(text[-1]) or CJK.match(line[0])):
            text += ' '
        text += line
    return text


def paragraphs(frame, keep_breaks=False):
    """Return paragraph texts; <a:br/> becomes a line break that is joined unless keep_breaks."""
    result = []
    for paragraph in frame.paragraphs:
        parts = ['']
        for child in paragraph._p:
            tag = child.tag.rsplit('}', 1)[-1]
            if tag in ('r', 'fld'):
                parts[-1] += ''.join(t.text or '' for t in child.iter('{*}t'))
            elif tag == 'br':
                parts.append('')
        result.append('\n'.join(parts) if keep_breaks else join_lines(parts))
    return result


def text_of(shape):
    return ' '.join(p for p in paragraphs(shape.text_frame) if p)


def code_text(shape):
    lines = '\n'.join(paragraphs(shape.text_frame, keep_breaks=True)).replace('\v', '\n').split('\n')
    lines = [line.rstrip() for line in lines]
    while lines and not lines[-1]:
        lines.pop()
    return '\n'.join(lines)


def cell_text(cell):
    return '\n'.join(p for p in paragraphs(cell.text_frame) if p)


def code_language(zh_code, label):
    first = next((line for line in zh_code.splitlines() if line.strip() and not line.startswith('#')), '')
    if zh_code.startswith('sequenceDiagram'):
        return 'mermaid'
    if zh_code.startswith('## '):
        return 'markdown'
    if label and re.search('輸出|錯誤訊息|執行測試', label) or re.match(r'(---|\.\.\.|FFFF|E   )', zh_code):
        return 'output'
    if re.match(r'(python|pytest|git|mypy|pip|\.venv)\b', first):
        return 'shell'
    if re.search(r'[一-鿿]{6}', first) and not re.search(r'[=(]', first):
        return 'prompt'
    return 'python'


def plan(slide):
    """Classify the Chinese slide once: one entry per kept shape, in reading order."""
    shapes = [s for s in slide.shapes if kind(s) not in SKIP]
    items, titled = [], False
    if slide.slide_layout.name == 'ANSWER':
        # Sample-answer slides carry their chip label ("參考答案") as a heading on the web page.
        chip = next(s for s in slide.shapes if kind(s) == 'chip-text')
        shapes.insert(0, chip)
        items.append({'role': 'heading', 'shape': 0})
    for index, shape in enumerate(shapes):
        k = kind(shape)
        if index == 0 and items:
            continue
        if k == 'Text':
            items.append({'role': 'intro' if titled else 'title', 'shape': index})
            titled = True
        elif k == 'text':
            text = text_of(shape)
            following = kind(shapes[index + 1]) if index + 1 < len(shapes) else None
            if following == 'code' and text.endswith('：') and len(text) <= 14:
                items.append({'role': 'label', 'shape': index})
            elif following in ('list', 'table', 'code') and len(text) <= 24 and not re.search(r'[。！：.!:]$', text):
                items.append({'role': 'heading', 'shape': index})
            elif len(items) == 1 and items[0]['role'] == 'title' and following != 'code':
                items.append({'role': 'intro', 'shape': index})
            else:
                items.append({'role': 'text', 'shape': index})
        elif k in ('badge-text', 'meta-line', 'quote', 'outcome-text', 'agenda'):
            items.append({'role': 'text', 'shape': index})
        elif k == 'outcome-no':
            items.append({'role': 'number', 'shape': index})
        elif k == 'agenda-head':
            items.append({'role': 'heading', 'shape': index})
        elif k == 'list':
            items.append({'role': 'list', 'shape': index})
        elif k == 'table':
            items.append({'role': 'table', 'shape': index})
        elif k == 'code':
            items.append({'role': 'code', 'shape': index})
        elif k == 'diagram':
            items.append({'role': 'image', 'shape': index})
        else:
            raise ValueError(f'Unknown shape {shape.name} on slide')
    # A short "...:" line becomes the label of the code block that follows it.
    for i, item in enumerate(items):
        if item['role'] == 'code':
            previous = items[i - 1] if i else None
            item['label'] = previous['shape'] if previous and previous['role'] == 'label' else None
            zh_label = text_of(shapes[previous['shape']]) if item['label'] is not None else None
            item['language'] = code_language(code_text(shapes[item['shape']]), zh_label)
    return shapes, items


def build_slide(number, slide, shapes, items, lang, image_name):
    result = {'number': number, 'title': '', 'body': []}
    pending_number = None
    for item in items:
        shape = shapes[item['shape']]
        role = item['role']
        if role == 'title':
            result['title'] = text_of(shape)
        elif role == 'intro':
            result['intro'] = '\n'.join(p for p in paragraphs(shape.text_frame) if p)
        elif role == 'number':
            pending_number = text_of(shape)
        elif role in ('text', 'list'):
            for text in paragraphs(shape.text_frame):
                if text:
                    if pending_number:
                        text, pending_number = f'{pending_number}　{text}' if lang != 'en' else f'{pending_number}  {text}', None
                    result['body'].append({'type': 'text', 'text': text})
        elif role == 'heading':
            result['body'].append({'type': 'heading', 'text': text_of(shape)})
        elif role == 'table':
            rows = [[cell_text(cell) for cell in row.cells] for row in shape.table.rows]
            result['body'].append({'type': 'table', 'rows': rows})
        elif role == 'code':
            block = {'type': 'code', 'text': code_text(shape)}
            language = item['language']
            label = text_of(shapes[item['label']]).rstrip('：: ') if item['label'] is not None else None
            if language == 'output':
                block.update(language='text', label=label or OUTPUT[lang])
            elif language == 'prompt':
                block.update(language='text', label=label or PROMPT[lang])
            elif language == 'mermaid':
                block.update(language='text', label=f'Mermaid · {label}' if label else 'Mermaid')
            elif language == 'markdown':
                block.update(language='text', label='Markdown · AGENTS.md')
            else:
                block['language'] = language
                if label:
                    block['label'] = label
            result['body'].append(block)
        elif role == 'image':
            from PIL import Image
            import io
            width, height = Image.open(io.BytesIO(shape.image.blob)).size
            result.update(image=f'/materials/{image_name}', imageAlt=result['title'], imageLayout='wide',
                          imageWidth=width // 2, imageHeight=height // 2)
            result['_blob'] = shape.image.blob
    notes = slide.notes_slide.notes_text_frame.text.strip() if slide.has_notes_slide else ''
    return result, notes


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
            image_name = f'week-12-{lang}-slide-{number}.png'
            data, notes = build_slide(number, slide, shapes, items, lang, image_name)
            blob = data.pop('_blob', None)
            if blob:
                (ROOT / 'public/materials' / image_name).write_bytes(blob)
            if public_note and notes:
                data['body'].append({'type': 'text', 'text': NOTE[lang] + notes})
            if not data['body']:
                del data['body']
            output[lang].append(data)
    for lang in FILES:
        for slide in output[lang]:
            slide.setdefault('body', [])
    path = ROOT / 'content/week12-slides.json'
    path.write_text(json.dumps(output, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    return output


def build_examples(folder):
    """Copy the teacher's project ZIP and add the English and Japanese READMEs."""
    target = ROOT / 'public/materials' / EXAMPLES
    with zipfile.ZipFile(folder / SOURCE_ZIP) as original, zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED) as updated:
        for info in original.infolist():
            assert '__pycache__' not in info.filename and not info.filename.endswith('.pyc'), info.filename
            entry = zipfile.ZipInfo(info.filename, ZIP_TIME)
            entry.external_attr = info.external_attr
            entry.compress_type = zipfile.ZIP_STORED if info.is_dir() else zipfile.ZIP_DEFLATED
            updated.writestr(entry, original.read(info.filename))
        for lang in ('en', 'ja'):
            entry = zipfile.ZipInfo(f'README-{lang}.md', ZIP_TIME)
            entry.external_attr = 0o644 << 16
            entry.compress_type = zipfile.ZIP_DEFLATED
            updated.writestr(entry, (ROOT / f'content/week12-readme-{lang}.md').read_bytes())


def sync_week12(lessons, folder=None):
    if folder and not (folder / FILES['zh']).exists():
        print(f'Week 12 sources not found in {folder}; keeping the committed Week 12 files.')
        folder = None
    if folder:
        extract(folder)
    raw = json.loads((ROOT / 'content/week12-slides.json').read_text(encoding='utf-8'))
    manifest = []
    for lang, slides in raw.items():
        download = f'week-12-{lang}.pptx'
        lessons[f'{lang}-12'] = {'source': FILES[lang], 'slides': slides, 'download': download, 'examples': EXAMPLES}
        if folder:
            source = folder / FILES[lang]
            shutil.copyfile(source, ROOT / 'public/materials' / download)
            manifest.append({'week': 12, 'language': lang, 'source': FILES[lang], 'download': download,
                             'slides': SLIDES, 'sha256': hashlib.sha256(source.read_bytes()).hexdigest()})
    if folder:
        build_examples(folder)
        (ROOT / 'content/week12-source-manifest.json').write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    import sys
    lessons = json.loads((ROOT / 'content/lessons.json').read_text(encoding='utf-8'))
    sync_week12(lessons, Path(sys.argv[1]) if len(sys.argv) > 1 else None)
    (ROOT / 'content/lessons.json').write_text(json.dumps(lessons, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f'Synced 3 Week 12 lessons, {SLIDES * 3} topics.')
