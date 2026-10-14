"""Check the GitHub Pages export, localized coverage, assets, and code transfer."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import ast
import hashlib
import json

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
counts = [23,67,40,56]
for locale, prefix, html_lang in [('zh','','zh-Hant'),('en','/en','en'),('ja','/ja','ja')]:
    home=pages[prefix+'/']
    assert home.lang == html_lang
    assert home.headings == 1
    for week,count in enumerate(counts,1):
        route=f'{prefix}/week/{week}/'
        page=pages[route]
        assert page.lang == html_lang,(route,page.lang)
        assert page.headings == 1,route
        assert {f'slide-{i}' for i in range(1,count+1)} <= page.ids,route
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
for week in range(5,19):assert f'/week/{week}/' in pages

manifest=json.loads((ROOT/'content/source-manifest.json').read_text(encoding='utf-8'))
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
print(f'PASS: 3 homepages, 12 complete localized lessons, 14 preserved later weeks, local links/assets/anchors, 10 slide checksums, and {codes} code snippets.')
