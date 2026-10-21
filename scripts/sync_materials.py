"""Normalize the reviewed PowerPoint extraction into accessible lesson content.

Run with Python 3.12+: python scripts/sync_materials.py [original output folder]
No model service or network is required. Week 4 translations are reviewed text.
"""
from pathlib import Path
import json
import hashlib
import shutil
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = json.loads((ROOT / 'content/slide-sources.json').read_text(encoding='utf-8'))

def normalize(slide):
    blocks = [b for b in slide['blocks'] if b['type'] == 'table' or b['y'] < 660]
    titles = [b for b in blocks if b['type'] == 'text' and b['fontSize'] >= 25 and b['y'] < 150]
    title = titles[0] if titles else next(b for b in blocks if b['type'] == 'text')
    subtitle = next((b for b in blocks if b['type'] == 'text' and 110 < b['y'] < 160), None)
    result = {'number': slide['number'], 'title': title['text'].replace('\n', ' '), 'body': []}
    code = [b for b in blocks if b['type'] == 'code' and b['y'] < 580]
    output = [b for b in blocks if b['type'] == 'code' and b['y'] >= 580]
    if code:
        # The PPT stores each source line separately, with empty lines as gaps.
        steps = [b['y']-a['y'] for a,b in zip(code,code[1:]) if b['y']>a['y']]
        step = min(steps) if steps else 30
        lines = []
        for i,b in enumerate(code):
            if i and b['y']-code[i-1]['y'] > step*1.6: lines.append('')
            lines.append(b['text'])
        result['code'] = '\n'.join(lines)
    if output: result['output'] = '\n'.join(b['text'] for b in output)
    for b in blocks:
        if b is title or b is subtitle or b['type'] == 'code': continue
        if b['type'] == 'table':
            result['body'].append({'type': 'table', 'rows': b['rows']})
        elif not (output and 570 <= b['y'] <= 620):
            result['body'].append({'type': 'heading' if b['fontSize'] >= 18.5 and b['y'] < 580 else 'text', 'text': b['text']})
    return result

lessons = {k: {'source': v['file'], 'slides': [normalize(s) for s in v['slides']]} for k,v in SOURCE.items()}
translations = json.loads((ROOT/'content/week4-translations.json').read_text(encoding='utf-8'))
for lang in ['en','ja']:
    slides = json.loads(json.dumps(lessons['zh-4']['slides']))
    for slide in slides:
        t = translations[str(slide['number'])][lang]
        slide['title'] = t['title']
        # Translated bodies are complete, with tables represented as pipe-separated rows.
        slide['body'] = [({'type':'table','rows':[row.split(' | ') for row in b[1:].split('\n')]} if b.startswith('|') else {'type':'text','text':b}) for b in t['body']]
    lessons[lang+'-4'] = {'source':SOURCE['zh-4']['file'], 'slides':slides}

from sync_memory import sync_memory
from sync_pygame import sync_pygame
from sync_django import sync_django
from sync_additional import sync_additional
sync_additional(lessons, Path(sys.argv[1]) if len(sys.argv)>1 else None)
sync_django(lessons, Path(sys.argv[1]) if len(sys.argv)>1 else None)
sync_pygame(lessons, Path(sys.argv[1]) if len(sys.argv)>1 else None)
sync_memory(lessons, Path(sys.argv[1]) if len(sys.argv)>1 else None)
(ROOT/'content/lessons.json').write_text(json.dumps(lessons,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
if len(sys.argv)>1:
    folder = Path(sys.argv[1])
    manifest = []
    for key,deck in SOURCE.items():
        lang,week = key.split('-')
        target = f'week-{week}-{lang}.pptx'
        source = folder/deck['file']
        shutil.copyfile(source,ROOT/'public/materials'/target)
        manifest.append({'week':int(week),'language':lang,'source':deck['file'],'download':target,'slides':len(deck['slides']),'sha256':hashlib.sha256(source.read_bytes()).hexdigest()})
    for week,label in [(3,'三'),(4,'四')]:
        target=ROOT/f'public/materials/week-{week}-examples.zip'
        if week==3:
            shutil.copyfile(folder/f'OO第{label}週_Python範例.zip',target)
        else:
            with zipfile.ZipFile(folder/f'OO第{label}週_Python範例.zip') as original, zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as updated:
                for name in original.namelist():
                    if name.endswith('/README.md'): continue
                    updated.writestr(name,original.read(name))
                updated.writestr('week4_examples/README.md',(ROOT/'content/week4-examples-readme.txt').read_bytes())
                updated.writestr('week4_examples/django_product_demo.py',(ROOT/'content/django_product_demo.py').read_bytes())
    (ROOT/'content/source-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Generated', len(lessons), 'localized lessons;', sum(len(x['slides']) for x in lessons.values()), 'sections.')
