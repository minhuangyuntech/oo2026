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
database_lessons=json.loads((ROOT/"content/database-lessons.json").read_text(encoding="utf-8"))
lessons.update({f"{lang}-databases": lesson for lang,lesson in database_lessons.items()})
ubuntu_lessons=json.loads((ROOT/"content/ubuntu-lessons.json").read_text(encoding="utf-8"))
lessons.update({f"{lang}-ubuntu-deploy": lesson for lang,lesson in ubuntu_lessons.items()})
units=[1,2,3,4,5,6,7,8,12,"testing","gui","django","pygame","memory","pypi","django-case","databases","ubuntu-deploy"]
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

# Public Ubuntu lessons must keep the connection details as placeholders.
for lang, prefix in [('zh', ''), ('en', '/en'), ('ja', '/ja')]:
    route = prefix + '/ubuntu-deploy/'
    page = pages[route]
    lesson = ubuntu_lessons[lang]
    public_text = json.dumps(lesson, ensure_ascii=False)
    assert len(lesson['slides']) == 13
    assert not re.search(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', public_text), 'Literal IP in public Ubuntu lesson'
    assert not re.search(r'\b[BbXx]\d{8}\b', public_text), 'Student ID in public Ubuntu lesson'
    assert {'ubuntu-overview-caption', 'ubuntu-deploy-caption', 'ubuntu-request-caption', 'ubuntu-port-caption'} <= page.ids
    assert BASE + route in pages[prefix + '/'].links
    assert all(BASE + other + '/ubuntu-deploy/' in page.links for other in ['', '/en', '/ja'])
    assert BASE + '/materials/mblog-complete.zip' in page.links
    assert lesson['download'] == f'ubuntu-deploy-{lang}.pptx'
    assert BASE + '/materials/' + lesson['download'] in page.links
    with zipfile.ZipFile(ROOT/'public/materials'/lesson['download']) as deck:
        assert len([n for n in deck.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)]) == 19
        xml = '\n'.join(deck.read(n).decode('utf-8') for n in deck.namelist() if n.endswith(('.xml','.rels')))
        assert not re.search(r'\b(?:\d{1,3}\.){3}\d{1,3}\b|\b[BbXx]\d{8}\b', xml)
        assert 'SERVER_IP' in xml and 'LOCAL_PORT' in xml
    code = '\n'.join(snippet['code'] for slide in lesson['slides'] for snippet in slide.get('snippets', []))
    assert 'ssh LOGIN@SERVER_IP' in code
    assert 'python -m venv .venv\nsource .venv/bin/activate\n~/bin/deploy-django' in code
    assert 'source ~/bin/course-env\npython manage.py check' in code
    assert 'ExitOnForwardFailure=yes' in code and 'localhost:LOCAL_PORT' in code
    assert '~/bin/course-tunnel 9124' in code

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
    assert BASE+'/materials/memory-oop-trilingual.zip' in page.links,(route,'missing Pygame download')
    assert BASE+prefix+'/memory/#slide-19' in page.links,(route,'missing Pygame instructions')
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

manifest=[source for name in ['source-manifest.json','additional-source-manifest.json','django-source-manifest.json','pygame-source-manifest.json','memory-source-manifest.json','week8-source-manifest.json','week12-source-manifest.json','testing-source-manifest.json','week7-source-manifest.json','pypi-source-manifest.json','django-case-source-manifest.json','database-source-manifest.json','ubuntu-source-manifest.json'] for source in json.loads((ROOT/'content'/name).read_text(encoding='utf-8'))]
for source in manifest:
    file=ROOT/'public/materials'/source['download']
    assert hashlib.sha256(file.read_bytes()).hexdigest()==source['sha256'],source['source']

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
    for unit in [5,6,8,'gui','django','pygame','memory','pypi','django-case','databases']:
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
    assert len(lesson['slides'])==27
    assert sum(bool(s.get('image')) for s in lesson['slides'])==4
    prefix='' if lang=='zh' else '/'+lang
    game_url='https://minhuangyuntech.github.io'+BASE+prefix+'/memory/play/'
    assert game_url in pages[prefix+'/memory/'].links
    with zipfile.ZipFile(ROOT/'public/materials'/lesson['download']) as pptx:
        assert len([n for n in pptx.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)])==27
        assert 'https://minhuangyuntech.github.io/oo2026/materials/memory-oop-trilingual.zip' in pptx.read('ppt/slides/_rels/slide20.xml.rels').decode('utf-8')
        for number in [1,2]:assert game_url in pptx.read(f'ppt/slides/_rels/slide{number}.xml.rels').decode('utf-8')
    for source,slide in zip(deck,lesson['slides']):
        assert slide['title']==source['title']
        assert slide.get('code')==source.get('code')
        assert [b['text'] for b in slide['body'] if b['type']=='text'][1:1+len(source['notes'])]==source['notes']
        if 'values' in source:assert next(b['rows'] for b in slide['body'] if b['type']=='table')==source['values']
        if slide.get('code') and slide['codeLanguage']=='python':
            ast.parse(slide['code']);codes+=1
with zipfile.ZipFile(ROOT/'public/materials/memory-oop-trilingual.zip') as examples:
    assert {'memory_oop/pygame_app.py','memory_oop/pygame_text.py','memory_oop/requirements.txt','memory_oop/assets/OFL.txt','memory_oop/assets/ATTRIBUTION.txt','memory_oop/assets/NotoSansCJKtc-Regular.otf','memory_oop/tests/test_pygame_app.py'} <= set(examples.namelist())
    assert examples.read('memory_oop/browser/engine.ts')==(ROOT/'app/memory/engine.ts').read_bytes()
    for lang in ['zh','en','ja']:
        html=examples.read(f'memory_oop/docs/lesson-{lang}.html').decode('utf-8')
        assert len(re.findall(r'<section id="slide-',html))==27
    for name in examples.namelist():
        assert '__pycache__' not in name and not name.endswith('.pyc')
        if name.endswith('.py'):ast.parse(examples.read(name).decode('utf-8'))
week8_raw=json.loads((ROOT/'content/week8-slides.json').read_text(encoding='utf-8'))
for lang,deck in week8_raw.items():
    lesson=lessons[f'{lang}-8']
    prefix='' if lang=='zh' else '/'+lang
    route=prefix+'/week/8/'
    assert len(lesson['slides'])==len(deck)==32
    assert sum(bool(s.get('image')) for s in lesson['slides'])==2
    assert BASE+route in pages[prefix+'/'].links
    for locale in ['','/en','/ja']:assert BASE+locale+'/week/8/' in pages[route].links
    game_url='https://minhuangyuntech.github.io'+BASE+prefix+'/pygame/play/'
    assert game_url in pages[route].links
    with zipfile.ZipFile(ROOT/'public/materials'/lesson['download']) as pptx:
        assert len([n for n in pptx.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)])==32
        assert game_url in pptx.read('ppt/slides/_rels/slide28.xml.rels').decode('utf-8')
        assert 'week-8-examples.zip' in pptx.read('ppt/slides/_rels/slide29.xml.rels').decode('utf-8')
    for source,slide in zip(deck,lesson['slides']):
        assert slide['title']==source['title'].replace('\n',' ')
        assert slide.get('code')==source.get('code')
        assert [b['text'] for b in slide['body'] if b['type']=='text'][1:1+len(source['notes'])]==source['notes']
        if 'values' in source:assert next(b['rows'] for b in slide['body'] if b['type']=='table')==source['values']
        if slide.get('code') and slide['codeLanguage']=='python':ast.parse(slide['code']);codes+=1
week12_raw=json.loads((ROOT/'content/week12-slides.json').read_text(encoding='utf-8'))
week12_layout=None
for lang,deck in week12_raw.items():
    lesson=lessons[f'{lang}-12']
    prefix='' if lang=='zh' else '/'+lang
    route=prefix+'/week/12/'
    page=pages[route]
    assert lesson['slides']==deck and len(deck)==89 and lesson['examples']=='lab_monitor.zip'
    # The English and Japanese decks are in-place translations: every slide keeps the same blocks.
    layout=[([(b['type'],b.get('language')) for b in s['body']],'intro' in s,s.get('image','').replace(f'-{lang}-','-')) for s in deck]
    week12_layout=week12_layout or layout
    assert layout==week12_layout,lang
    assert BASE+route in pages[prefix+'/'].links
    for locale in ['','/en','/ja']:assert BASE+locale+'/week/12/' in page.links
    assert BASE+'/materials/'+lesson['download'] in page.links and BASE+'/materials/lab_monitor.zip' in page.links
    images=[s['image'] for s in deck if s.get('image')]
    assert len(images)==6 and all(BASE+image in page.assets and (ROOT/'public'/image.lstrip('/')).exists() for image in images)
    with zipfile.ZipFile(ROOT/'public/materials'/lesson['download']) as pptx:
        assert len([n for n in pptx.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)])==89
    from html import unescape
    text=unescape((OUT/route.lstrip('/')/'index.html').read_text(encoding='utf-8'))
    for slide in deck:
        for block in slide['body']:
            if block['type']!='code':continue
            assert block['text'] in text,(route,slide['number'])
            if block['language']=='python' and slide['number']!=80:ast.parse(block['text']);codes+=1
testing_raw=json.loads((ROOT/'content/testing-slides.json').read_text(encoding='utf-8'))
testing_layout=None
for lang,deck in testing_raw.items():
    lesson=lessons[f'{lang}-testing']
    prefix='' if lang=='zh' else '/'+lang
    route=prefix+'/testing/'
    page=pages[route]
    assert lesson['slides']==deck and len(deck)==35
    # The English and Japanese decks are in-place translations: every slide keeps the same blocks.
    layout=[([(b['type'],b.get('language')) for b in s['body']],'intro' in s,s.get('image','').replace(f'-{lang}-','-')) for s in deck]
    testing_layout=testing_layout or layout
    assert layout==testing_layout,lang
    assert BASE+route in pages[prefix+'/'].links and BASE+route in pages[prefix+'/week/12/'].links
    for locale in ['','/en','/ja']:assert BASE+locale+'/testing/' in page.links
    assert BASE+'/materials/'+lesson['download'] in page.links and BASE+'/materials/'+lesson['examples'] in page.links
    images=[s['image'] for s in deck if s.get('image')]
    assert len(images)==1 and all(BASE+image in page.assets and (ROOT/'public'/image.lstrip('/')).exists() for image in images)
    with zipfile.ZipFile(ROOT/'public/materials'/lesson['download']) as pptx:
        assert len([n for n in pptx.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)])==35
        assert not any(b'show="0"' in pptx.read(n) for n in pptx.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n))
    from html import unescape
    text=unescape((OUT/route.lstrip('/')/'index.html').read_text(encoding='utf-8'))
    for slide in deck:
        for block in slide['body']:
            if block['type']!='code':continue
            assert block['text'] in text,(route,slide['number'])
            if block['language']=='python':ast.parse(block['text']);codes+=1
week7_raw=json.loads((ROOT/'content/week7-slides.json').read_text(encoding='utf-8'))
for lang,deck in week7_raw.items():
    lesson=lessons[f'{lang}-7']
    prefix='' if lang=='zh' else '/'+lang
    route=prefix+'/week/7/'
    assert len(lesson['slides'])==len(deck)==24
    assert BASE+route in pages[prefix+'/'].links
    for locale in ['','/en','/ja']:assert BASE+locale+'/week/7/' in pages[route].links
    for source,slide in zip(deck,lesson['slides']):
        assert slide['title']==source['title'].replace('\n',' ')
        assert slide.get('code')==source.get('code')
        if slide.get('code') and slide['codeLanguage']=='python':ast.parse(slide['code']);codes+=1
    with zipfile.ZipFile(ROOT/'public/materials'/lesson['download']) as pptx:
        assert len([n for n in pptx.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)])==24
topics=sum(len(lesson['slides']) for lesson in lessons.values())

for lang,prefix in [('zh',''),('en','/en'),('ja','/ja')]:
    page=pages[prefix+'/django-case/']
    assert 'mblog-download' in page.ids
    assert BASE+'/materials/mblog-complete.zip' in page.links
    for code in ['zh','en','ja']:
        assert BASE+f'/materials/mblog-guide-{code}.html' in page.links
guides=json.loads((ROOT/'content/game-variables.json').read_text(encoding='utf-8'))
for unit,guide in guides.items():
    assert len({s['id'] for s in guide['sections']})==len(guide['sections'])
    translations=[guide['intro']]
    for section in guide['sections']:
        translations += [section['title'], *section['notes'], *[r['meaning'] for r in section['rows']]]
        if section.get('code'):ast.parse(section['code'])
    assert all(len(value)==3 and all(isinstance(t,str) and t.strip() for t in value) for value in translations)
    for index,lang in enumerate(['zh','en','ja']):
        prefix='' if lang=='zh' else '/'+lang
        route=prefix+'/'+unit+'/'
        page=pages[route]
        assert {'variables','variable-search',*[f"variables-{s['id']}" for s in guide['sections']]}<=page.ids
        assert '#variables' in page.links
        assert BASE+route+'#variables' in pages[route+'play/'].links
        html=(OUT/route.lstrip('/')/'index.html').read_text(encoding='utf-8')
        from html import unescape
        html=unescape(html)
        for section in guide['sections']:
            assert section['title'][index] in html
            for row in section['rows']:
                assert row['name'] in html and row['meaning'][index] in html,(route,row['name'])
        for other in ['','/en','/ja']:
            assert BASE+other+'/'+unit+'/#variables' in page.links
print('PASS: 6 localized variable guides, translations, code snippets, lesson/game entry links, and language anchors.')
print(f'PASS: 3 homepages, {3*len(units)} localized lessons ({topics} topics), 6 playable game pages, 9 preserved legacy weeks, links/assets/anchors, {len(manifest)} deck checksums, and {codes} Python excerpts.')
