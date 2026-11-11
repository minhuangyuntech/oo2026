"""Build the reproducible mblog archive and three standalone installation guides."""
import hashlib
import html
import json
import zipfile
from pathlib import Path
import markdown

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'examples/mblog'
PUBLIC = ROOT / 'public/materials'
ARCHIVE = PUBLIC / 'mblog-complete.zip'

def project_files():
    for path in sorted(SOURCE.rglob('*')):
        if not path.is_file():
            continue
        relative = path.relative_to(SOURCE)
        if any(part in {'__pycache__', '.venv', 'staticfiles', '.git'} for part in relative.parts):
            continue
        if path.name == '.gitignore' or path.name == 'LICENSE' or path.suffix in {'.py', '.md', '.txt', '.html', '.css', '.map', '.svg'}:
            yield relative.as_posix(), path.read_bytes().replace(b'\r\n', b'\n')

def build():
    files = dict(project_files())
    assert not any(n.endswith(('.sqlite3', '.pyc')) or n == '.env' for n in files)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(ARCHIVE, 'w', zipfile.ZIP_DEFLATED) as archive:
        for name, content in files.items():
            item = zipfile.ZipInfo('mblog/' + name, date_time=(2026, 11, 11, 0, 0, 0))
            item.compress_type = zipfile.ZIP_DEFLATED
            item.external_attr = 0o644 << 16
            archive.writestr(item, content)
    guides = []
    for lang, suffix, title, back, download in [
        ('zh','zh-TW','mblog 安裝與執行','回到課程教材','下載完整專案 ZIP'),
        ('en','en','mblog installation and running guide','Back to course','Download complete project ZIP'),
        ('ja','ja','mblog のインストールと実行','教材に戻る','完全なプロジェクト ZIP'),
    ]:
        body = markdown.markdown(files[f'README.{suffix}.md'].decode('utf8'), extensions=['fenced_code','tables'])
        prefix = '' if lang == 'zh' else lang + '/'
        links=' · '.join(f'<a href="mblog-guide-{code}.html" lang="{code}">{label}</a>' for code,label in [('zh','繁體中文'),('en','English'),('ja','日本語')])
        document=f'''<!doctype html>
<html lang="{'zh-Hant' if lang=='zh' else lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title>
<style>body{{font:17px/1.75 system-ui,sans-serif;color:#17333a;background:#f7f9f5;margin:0}}main{{max-width:900px;margin:auto;padding:2rem 1.25rem}}h1,h2{{line-height:1.4}}h2{{margin-top:2.4rem}}a{{color:#176c68}}nav{{display:flex;flex-wrap:wrap;gap:1rem}}pre{{background:#132f39;color:#e5f7f1;padding:1.2rem;overflow:auto;border-radius:8px}}pre code{{font-size:14px}}table{{display:block;overflow:auto;border-collapse:collapse}}td,th{{border:1px solid #ccd6d1;padding:.5rem;text-align:left}}code{{overflow-wrap:anywhere}}.download{{display:inline-block;margin-top:1rem;padding:.6rem 1rem;background:#176c68;color:white;border-radius:6px}}</style></head>
<body><main><nav><a href="../{prefix}django-case/#mblog-download">← {back}</a><span>{links}</span></nav><a class="download" download href="mblog-complete.zip">{download}</a>{body}</main></body></html>'''
        name=f'mblog-guide-{lang}.html'
        (PUBLIC/name).write_bytes(document.encode('utf8'))
        guides.append({'language':lang,'file':name,'sha256':hashlib.sha256(document.encode()).hexdigest()})
    manifest={'archive':ARCHIVE.name,'sha256':hashlib.sha256(ARCHIVE.read_bytes()).hexdigest(),
              'files':{name:hashlib.sha256(content).hexdigest() for name,content in files.items()},'guides':guides}
    (ROOT/'content/mblog-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(f'Built {ARCHIVE.name}: {len(files)} files and three HTML guides')

if __name__=='__main__':
    build()
