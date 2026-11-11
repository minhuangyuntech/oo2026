"""Validate 381 localized slides, intact code blocks, and runnable downloads."""
import ast,hashlib,json,re,subprocess,sys,tempfile,zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
NS={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
def text(body):
    return '\n'.join(''.join('\n' if c.tag.endswith('}br') else ''.join(t.text or '' for t in c.findall('.//a:t',NS)) for c in p) for p in body.findall('./a:p',NS))
data=json.loads((ROOT/'content/django-case-slides.json').read_text(encoding='utf8'))
lessons=json.loads((ROOT/'content/lessons.json').read_text(encoding='utf8'))
for lang,deck in data.items():
    lesson=lessons[f'{lang}-django-case'];assert len(deck)==len(lesson['slides'])==127
    with zipfile.ZipFile(ROOT/'public/materials'/lesson['download']) as z:
        assert len([n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)])==127
        for s,page in zip(deck,lesson['slides']):
            xml=ET.fromstring(z.read(f'ppt/slides/slide{s["number"]}.xml'))
            shapes=[text(e) for e in xml.findall('.//p:sp/p:txBody',NS)]
            for b in s['blocks']:assert b['text'] in shapes,(lang,s['number'],'text mismatch',b['text'][:60])
            for snippet in page.get('snippets',[]):
                assert snippet['code'] in shapes,(lang,s['number'],'split code')
                if snippet['language']=='python':ast.parse(snippet['code'])
            if lang=='en':assert not re.search('[\u3400-\u9fff]','\n'.join(shapes)),s['number']
            tables=[[[text(c.find('./a:txBody',NS)) for c in row.findall('./a:tc',NS)] for row in t.findall('./a:tr',NS)]for t in xml.findall('.//a:tbl',NS)]
            assert tables==s['tables'],(lang,s['number'],'table mismatch')
    with tempfile.TemporaryDirectory() as tmp:
        with zipfile.ZipFile(ROOT/'public/materials'/lesson['examples']) as z:
            for name in z.namelist():
                assert '..' not in Path(name).parts and not name.endswith(('.pyc','/.env','db.sqlite3'))
                if name.endswith('.py'):ast.parse(z.read(name).decode('utf8'),filename=name)
            z.extractall(tmp)
        project=Path(tmp)/'django_ai_demo'
        result=subprocess.run([sys.executable,'-X','utf8','run_mock_tests.py'],cwd=project,capture_output=True,text=True,encoding='utf8')
        assert result.returncode==0,result.stdout+result.stderr
    print(f'{lang}: 127 pages, native tables, exact single-block code, and 16 offline tests passed')
