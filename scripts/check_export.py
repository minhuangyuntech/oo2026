"""Check the GitHub Pages export, localized coverage, assets, and code transfer."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import ast
import hashlib
import json
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'out'
BASE = '/oo2026'

class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.ids = set()
        self.links = []
        self.assets = []
        self.lang = None
        self.headings = 0
        self.feed(file.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, values):
        attrs = dict(values)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'Duplicate ID: {attrs["id"]}'
            self.ids.add(attrs['id'])
        if tag == 'html': self.lang = attrs.get('lang')
        if tag == 'h1': self.headings += 1
        if tag == 'a' and 'href' in attrs: self.links.append(attrs['href'])
        if tag in ['script','img'] and 'src' in attrs: self.assets.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'stylesheet': self.assets.append(attrs['href'])

pages = {('/'+str(file.relative_to(OUT)).replace('\\','/').removesuffix('index.html')):Page(file) for file in OUT.rglob('index.html')}
lessons=json.loads((ROOT/"content/lessons.json").read_text(encoding="utf-8"))
units=[1,2,3,4,5,6,"gui","django","pygame","memory"]
for locale, prefix, html_lang in [('zh','','zh-Hant'),('en','/en','en'),('ja','/ja','ja')]:
    home=pages[prefix+'/']
    assert home.lang == html_lang
    assert home.headings == 1
    for week in units:
        route=f'{prefix}/{week}/' if isinstance(week,str) else f'{prefix}/week/{week}/'
        page=pages[route]
        assert page.lang == html_lang,(route,page.lang)
        assert page.headings == 1,route
        assert {f'slide-{slide["number"]}' for slide in lessons[f'{locale}-{week}']['slides']} <= page.ids,route
        for url in page.links + page.assets:
            parsed=urlsplit(url)
            if parsed.scheme or parsed.netloc:continue
            if not parsed.path:
                if parsed.fragment:assert unquote(parsed.fragment) in page.ids,(route,url)
                continue
            assert parsed.path.startswith(BASE+'/'),(route,'missing basePath',url)
            target=OUT/unquote(parsed.path[len(BASE):]).lstrip('/')
            if target.is_dir():target=target/'index.html'
            assert target.exists(),(route,'missing file',url)
            if parsed.fragment and target.suffix=='.html':
                assert unquote(parsed.fragment) in Page(target).ids,(route,'missing target anchor',url)
for week in range(7,19):assert f'/week/{week}/' in pages

for locale, prefix, html_lang in [('zh','','zh-Hant'),('en','/en','en'),('ja','/ja','ja')]:
    route = prefix + '/pygame/play/'
    page = pages[route]
    assert page.lang == html_lang and page.headings == 1, route
    assert {'game-main', 'game-controls', 'object-select'} <= page.ids, route
    assert BASE + route in pages[prefix + '/'].links, (route, 'missing home entry')
    assert BASE + route in pages[prefix + '/pygame/'].links, (route, 'missing lesson entry')
    assert BASE + prefix + '/pygame/' in page.links, (route, 'missing lesson return')
    for url in page.links + page.assets:
        parsed = urlsplit(url)
        if parsed.scheme or parsed.netloc: continue
        if not parsed.path:
            assert unquote(parsed.fragment) in page.ids, (route, url)
            continue
        assert parsed.path.startswith(BASE + '/'), (route, 'missing basePath', url)
        target = OUT / unquote(parsed.path[len(BASE):]).lstrip('/')
        if target.is_dir(): target = target / 'index.html'
        assert target.exists(), (route, 'missing file', url)
    html = (OUT / route.lstrip('/') / 'index.html').read_text(encoding='utf-8')
    assert 'rel="canonical" href="https://minhuangyuntech.github.io' + BASE + route + '"' in html

for locale, prefix, html_lang in [('zh','','zh-Hant'),('en','/en','en'),('ja','/ja','ja')]:
    route=prefix+'/memory/play/'
    page=pages[route]
    assert page.lang==html_lang and page.headings==1,route
    assert {'memory-main','memory-board','memory-select'}<=page.ids,route
    assert BASE+route in pages[prefix+'/'].links,(route,'missing home entry')
    assert BASE+route in pages[prefix+'/memory/'].links,(route,'missing lesson entry')
    assert BASE+prefix+'/memory/' in page.links,(route,'missing lesson return')
    for url in page.links+page.assets:
        parsed=urlsplit(url)
        if parsed.scheme or parsed.netloc:continue
        if not parsed.path:
            assert unquote(parsed.fragment) in page.ids,(route,url)
            continue
        assert parsed.path.startswith(BASE+'/'),(route,'missing basePath',url)
        target=OUT/unquote(parsed.path[len(BASE):]).lstrip('/')
        if target.is_dir():target=target/'index.html'
        assert target.exists(),(route,'missing file',url)
    html=(OUT/route.lstrip('/')/'index.html').read_text(encoding='utf-8')
    assert 'rel="canonical" href="https://minhuangyuntech.github.io'+BASE+route+'"' in html

manifest=[source for name in ['source-manifest.json','additional-source-manifest.json','django-source-manifest.json','pygame-source-manifest.json','memory-source-manifest.json'] for source in json.loads((ROOT/'content'/name).read_text(encoding='utf-8'))]
for source in manifest:
    file=ROOT/'public/materials'/source['download']
    assert hashlib.sha256(file.read_bytes()).hexdigest()==source['sha256'],source['source']

lessons=json.loads((ROOT/'content/lessons.json').read_text(encoding='utf-8'))
raw=json.loads((ROOT/'content/slide-sources.json').read_text(encoding='utf-8'))
codes=0
for key,deck in raw.items():
    for source,normalized in zip(deck['slides'],lessons[key]['slides']):
        original_lines=[line for block in source['blocks'] if block['type']=='code' and block['y']<580 for line in block['text'].splitlines() if line.strip()]
        copied_lines=[line for line in normalized.get('code','').splitlines() if line.strip()]
        assert original_lines==copied_lines,(key,source['number'],'changed code lines')
        if normalized.get('code'):
            ast.parse(normalized['code'])
            codes+=1
from sync_additional import normalize
additional=json.loads((ROOT/'content/additional-slide-sources.json').read_text(encoding='utf-8'))
for source_key,deck in additional.items():
    for original in deck['slides']:
        source=normalize(source_key,original)
        unit='gui' if source_key=='gui' else 5 if source['number']<=11 else 6
        for lang in ['zh','en','ja']:
            slide=next(s for s in lessons[f'{lang}-{unit}']['slides'] if s['number']==source['number'])
            assert slide.get('code')==source.get('code'),(lang,unit,slide['number'],'code changed')
            assert slide.get('output')==source.get('output')
            assert slide['title'] and slide['body']
            for block in slide['body']:
                if block['type']=='table':assert len({len(row) for row in block['rows']})==1,(lang,unit,slide['number'],'table columns')
        if source.get('code') and source['codeLanguage']=='python':
            code=source['code']
            # Continuation methods are deliberately shown inside the preceding class.
            if code.startswith('    '):code='class SlideExcerpt:\n'+code
            ast.parse(code)
            codes+=1
for lang in ['zh','en','ja']:
    for unit in [5,6,'gui','django','pygame','memory']:
        lesson=lessons[f'{lang}-{unit}']
        route=('' if lang=='zh' else '/'+lang)+(f'/{unit}/' if isinstance(unit,str) else f'/week/{unit}/')
        for name in [lesson['download'],lesson['examples']]:assert f'{BASE}/materials/{name}' in pages[route].links
        if unit=='gui':
            assert len([s for s in lesson['slides'] if s.get('image')])==5
            assert all(s.get('imageAlt') for s in lesson['slides'] if s.get('image'))
django_raw=json.loads((ROOT/'content/django-slide-sources.json').read_text(encoding='utf-8'))
for lang,deck in django_raw.items():
    lesson=lessons[f'{lang}-django']
    assert len(lesson['slides'])==53
    assert len([s for s in lesson['slides'] if s.get('image')])==4
    for source,slide in zip(deck['slides'],lesson['slides']):
        original=[line for b in source['blocks'] if b['type']=='code' and b['y']<660 for line in b['text'].splitlines() if line.strip()]
        transferred=[line for snippet in slide.get('snippets',[]) for line in snippet['code'].splitlines() if line.strip()]
        assert original==transferred,(lang,slide['number'],'Django code changed')
        for snippet in slide.get('snippets',[]):
            if snippet['language']=='python':
                code=snippet['code']
                if slide['number']==24:code='class Product:\n'+code
                if slide['number']==32:code='{\n'+code+'\n}'
                ast.parse(code)
                codes+=1
pygame_raw=json.loads((ROOT/'content/pygame-slides.json').read_text(encoding='utf-8'))
for lang,deck in pygame_raw.items():
    lesson=lessons[f'{lang}-pygame']
    assert len(lesson['slides'])==33
    assert sum(bool(s.get('image')) for s in lesson['slides'])==6
    prefix='' if lang=='zh' else '/'+lang
    game_url='https://minhuangyuntech.github.io'+BASE+prefix+'/pygame/play/'
    assert game_url in pages[prefix+'/pygame/'].links
    with zipfile.ZipFile(ROOT/'public/materials'/lesson['download']) as pptx:
        assert len([n for n in pptx.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)])==33
        assert game_url in pptx.read('ppt/slides/_rels/slide31.xml.rels').decode('utf-8')
    for source,slide in zip(deck,lesson['slides']):
        assert slide.get('code')==source.get('code')
        assert slide['title']==source['title']
        assert [b['text'] for b in slide['body'] if b['type']=='text'][1:1+len(source['notes'])]==source['notes']
        if slide.get('code') and slide['codeLanguage']=='python':
            ast.parse(slide['code']);codes+=1
memory_raw=json.loads((ROOT/'content/memory-slides.json').read_text(encoding='utf-8'))
for lang,deck in memory_raw.items():
    lesson=lessons[f'{lang}-memory']
    assert len(lesson['slides'])==18
    assert sum(bool(s.get('image')) for s in lesson['slides'])==3
    prefix='' if lang=='zh' else '/'+lang
    game_url='https://minhuangyuntech.github.io'+BASE+prefix+'/memory/play/'
    assert game_url in pages[prefix+'/memory/'].links
    with zipfile.ZipFile(ROOT/'public/materials'/lesson['download']) as pptx:
        assert len([n for n in pptx.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)])==18
        for number in [1,2]:assert game_url in pptx.read(f'ppt/slides/_rels/slide{number}.xml.rels').decode('utf-8')
    for source,slide in zip(deck,lesson['slides']):
        assert slide['title']==source['title']
        assert slide.get('code')==source.get('code')
        assert [b['text'] for b in slide['body'] if b['type']=='text'][1:1+len(source['notes'])]==source['notes']
        if 'values' in source:assert next(b['rows'] for b in slide['body'] if b['type']=='table')==source['values']
        if slide.get('code') and slide['codeLanguage']=='python':
            ast.parse(slide['code']);codes+=1
with zipfile.ZipFile(ROOT/'public/materials/memory-oop-trilingual.zip') as examples:
    assert examples.read('memory_oop/browser/engine.ts')==(ROOT/'app/memory/engine.ts').read_bytes()
    for lang in ['zh','en','ja']:
        html=examples.read(f'memory_oop/docs/lesson-{lang}.html').decode('utf-8')
        assert len(re.findall(r'<section id="slide-',html))==18
    for name in examples.namelist():
        assert '__pycache__' not in name and not name.endswith('.pyc')
        if name.endswith('.py'):ast.parse(examples.read(name).decode('utf-8'))
topics=sum(len(lesson['slides']) for lesson in lessons.values())
print(f'PASS: 3 homepages, 30 localized lessons ({topics} topics), 6 playable game pages, 12 preserved later weeks, links/assets/anchors, 21 deck checksums, and {codes} Python excerpts.')
