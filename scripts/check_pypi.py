"""Verify page alignment, code-copy fidelity, decks, and the downloadable module."""
import ast
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile

ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'content/pypi-slides.json').read_text(encoding='utf-8'))
lessons=json.loads((ROOT/'content/lessons.json').read_text(encoding='utf-8'))
NS={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
def shape_text(shape):
    paragraphs=[]
    for para in shape.findall('./p:txBody/a:p',NS):
        text=''
        for node in para:
            if node.tag.endswith('}br'):text+='\n'
            else:text+=''.join(node.itertext()) if node.tag.endswith('}r') or node.tag.endswith('}fld') else ''
        paragraphs.append(text)
    return '\n'.join(paragraphs)

for lang,deck in data.items():
    assert [d['number'] for d in deck]==list(range(1,50))
    lesson=lessons[f'{lang}-pypi']
    assert len(lesson['slides'])==49
    assert lesson['download']==f'pypi-{lang}.pptx'
    assert lesson['examples']=='house_price_demo.zip'
    with zipfile.ZipFile(ROOT/'public/materials'/lesson['download']) as pptx:
        names=[n for n in pptx.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)]
        assert len(names)==49
        code_count=0
        for d,page in zip(deck,lesson['slides']):
            assert page['title']==d['title'].replace('\n',' ')
            slide=ET.fromstring(pptx.read(f'ppt/slides/slide{d["number"]}.xml'))
            if d['type']=='table':assert len(slide.findall('.//a:tbl',NS))==1
            if d.get('code'):
                code_count+=1
                assert page['snippets'][0]['code']==d['code']
                # Exactly one editable shape must contain the entire unmodified code block.
                matches=[s for s in slide.findall('.//p:sp',NS) if shape_text(s)==d['code']]
                assert len(matches)==1,(lang,d['number'],'code is fragmented or changed')
                if page['snippets'][0]['language']=='python' and d['number'] not in [3,7,9,39]:ast.parse(d['code'])
                if lang=='en':
                    # The Chinese input string is intentional in the OpenCC demonstration.
                    assert not re.search(r'[\u3400-\u9fff]',d['code'].replace('软件与数据库','')),(lang,d['number'])
            assert all(word not in d['title'] for word in ['討論稿','20 分鐘實作','完成條件'])
        assert code_count==31

with tempfile.TemporaryDirectory() as tmp:
    with zipfile.ZipFile(ROOT/'public/materials/house_price_demo.zip') as package:
        members=set(package.namelist())
        assert {'house_price_demo/demo.py','house_price_demo/house_price/rates.py','house_price_demo/pyproject.toml',*[f'house_price_demo/README{x}.md' for x in ['', '-en','-ja']]}<=members
        assert not any('/.venv/' in n or '__pycache__' in n or n.endswith('.pyc') for n in members)
        package.extractall(tmp)
    project=Path(tmp)/'house_price_demo'
    check='''from decimal import Decimal
from house_price import twd_per_ping
prices=[Decimal("30250"),Decimal("60500")]
results=[twd_per_ping(p,Decimal("4.5")) for p in prices]
assert results == [Decimal("450000"),Decimal("900000")]
assert results[0]/10000 == 45 and results[1]/results[0] == 2
'''
    subprocess.run([sys.executable,'-c',check],cwd=project,check=True)
    for invalid in ['0','-1','NaN','Infinity','abc']:
        result=subprocess.run([sys.executable,'demo.py',invalid],cwd=project,capture_output=True)
        assert result.returncode==2,invalid
print('PASS: 3 x 49 slides; 93 single-textbox code blocks match web excerpts; package, formula, and invalid-input checks.')
