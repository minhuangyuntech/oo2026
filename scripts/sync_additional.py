"""Reproduce the Week 5–6 and GUI web lessons from reviewed source data."""
from pathlib import Path
import hashlib
import json
import posixpath
import shutil
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DIAGRAMS = {2, 14, 16, 17, 18, 20, 24, 27}
GUI_IMAGES = {6: 'Tkinter', 10: 'Qt / PySide6', 15: 'wxPython', 19: 'Kivy', 23: 'Dear PyGui'}
UML_ONLY = {14, 15, 16, 18, 20, 24, 27}

def body_blocks(items):
    return [({'type':'table','rows':[row.split(' | ') for row in item[1:].split('\n')]}
             if item.startswith('|') else {'type':'text','text':item}) for item in items]

def normalize(key, slide):
    n = slide['number']
    blocks = [b for b in slide['blocks'] if b['type']=='table' or b['y']<660]
    title = max((b for b in blocks if b['type']=='text'), key=lambda b:b['fontSize'])
    result = {'number':n, 'title':title['text'].replace('\n',''), 'body':[]}
    codes = [b for b in blocks if b['type']=='code']
    if key=='week56':
        if n in UML_ONLY: codes=[]
        if n==2: codes=[b for b in codes if b['y']>450]
        output=[b for b in codes if b['y']>=566]
        if output: result['output']='\n'.join(b['text'] for b in output)
        codes=[b for b in codes if b['y']<566]
        if n in DIAGRAMS:result['diagram']=f'uml-{n}'
    if codes:
        lines=[]
        steps=[b['y']-a['y'] for a,b in zip(codes,codes[1:]) if b['y']>a['y']]
        step=min(steps) if steps else 30
        for i,b in enumerate(codes):
            if i and b['y']-codes[i-1]['y']>step*1.6:lines.append('')
            lines.append(b['text'])
        result['code']='\n'.join(lines)
        result['codeLanguage']='powershell' if key=='gui' and n in {4,7,11,16,20,24} else 'python'
    for b in blocks:
        if b is title or b['type']=='code':continue
        if b['type']=='table':result['body'].append(b);continue
        if b['text'].startswith(('第 5 週\u3000','第 6 週\u3000','Python 桌面 GUI\u3000','輸出（逐行）')):continue
        result['body'].append({'type':'text','text':b['text']})
    if key=='week56' and n==1:
        result['title']='物件生命週期與記憶體模型'
        result['body']=body_blocks(['第 5、6 週從 Python 的物件參考，連結到類別關係與 UML。第 5 週理解身分、複製、可達性與資源管理；第 6 週建立設計模型。'])
    if key=='week56' and n==2:
        result['body']=body_blocks(['a 與 b 參照同一個 list：[10, 20]。b = a 建立另一個名稱繫結，不會複製 list。','方框與箭頭是概念模型，沒有表示實際記憶體位址或配置。'])
    if key=='week56' and n==15:
        result['body']=body_blocks(['|記法 | 意義\n- name: String | name 是屬性名稱，String 是型別\n+ rename(newName: String) | rename 是操作；newName 是參數\n+ score: Real [0..1] | 可沒有值，或具有一個 Real 值','+ 表公開，− 表私有；方括號內的多重性描述該屬性可具有的值的數量。'])
    if key=='week56' and n in {14,16,18,20,24,27}:
        # Box labels appear in the accessible diagram, not as Python code.
        result['body']=[b for b in result['body'] if b.get('text','') not in {'Student','Enrollment','Course','Order','OrderLine','Product','PricingService','使用'}]
    if key=='week56' and n==30:
        for b in result['body']:
            if b.get('text')=='omg.org/spec/UML/2.5.1':b['text']='https://www.omg.org/spec/UML/2.5.1'
    if key=='gui' and n in GUI_IMAGES:
        result['image']=f'/materials/gui-slide-{n}.jpeg'
        result['imageAlt']=f'{GUI_IMAGES[n]} 計數器，按下 Add 1 兩次後顯示 Count: 2。'
    return result

def sync_additional(lessons, folder=None):
    raw=json.loads((ROOT/'content/additional-slide-sources.json').read_text(encoding='utf-8'))
    translations=json.loads((ROOT/'content/additional-translations.json').read_text(encoding='utf-8'))
    for key,deck in raw.items():
        chinese=[normalize(key,s) for s in deck['slides']]
        for lang in ['zh','en','ja']:
            slides=json.loads(json.dumps(chinese))
            for slide in slides:
                n=slide['number']
                if lang!='zh':
                    translation=translations[key][str(n)][lang]
                    slide['title']=translation['title']
                    slide['body']=body_blocks(translation['body'])
                if key=='gui' and n in GUI_IMAGES and lang!='zh':
                    slide['imageAlt']=(f'{GUI_IMAGES[n]} counter showing Count: 2 after two clicks on Add 1.' if lang=='en' else f'{GUI_IMAGES[n]}：Add 1 を 2 回押し、Count: 2 と表示されたカウンター。')
                if key=='gui' and n==32 and lang=='zh':
                    urls=['https://docs.python.org/3.12/library/tkinter.html','https://doc.qt.io/qtforpython-6/gettingstarted.html','https://www.riverbankcomputing.com/software/pyqt/','https://wxpython.org/pages/downloads/','https://kivy.org/doc/stable/gettingstarted/installation.html','https://dearpygui.readthedocs.io/en/latest/tutorials/first-steps.html','https://dearpygui.readthedocs.io/en/latest/documentation/item-callbacks.html']
                    slide['body']=body_blocks(['版本與平台支援可能更新；安裝時以官方文件為準。']+urls+['原投影片資料查核：2026-10-14。'])
            for unit,subset in ([('gui',slides)] if key=='gui' else [(5,slides[:11]),(6,slides[11:])]):
                stem='gui' if key=='gui' else 'week-5-6'
                lessons[f'{lang}-{unit}']={'source':deck['file'],'slides':subset,'download':f'{stem}-zh.pptx','examples':f'{stem}-examples.zip','sourceLanguage':'zh'}
    if folder is None:return
    manifest=[]
    for key,deck in raw.items():
        stem='gui' if key=='gui' else 'week-5-6'
        source=folder/deck['file']; target=f'{stem}-zh.pptx'
        shutil.copyfile(source,ROOT/'public/materials'/target)
        manifest.append({'unit':key,'language':'zh','source':deck['file'],'download':target,'slides':len(deck['slides']),'sha256':hashlib.sha256(source.read_bytes()).hexdigest()})
        archive=folder/('Python桌面GUI_五種常見做法_Python範例.zip' if key=='gui' else 'OO第五六週_三小時精簡版_Python範例.zip')
        with zipfile.ZipFile(archive) as original, zipfile.ZipFile(ROOT/f'public/materials/{stem}-examples.zip','w',zipfile.ZIP_DEFLATED) as updated:
            for name in original.namelist():
                if Path(name).name.lower().startswith('readme'):continue
                updated.writestr(name,original.read(name))
            readme_name='README.txt' if key=='gui' else 'week5_6_examples/README.txt'
            updated.writestr(readme_name,(ROOT/f'content/{stem}-examples-readme.txt').read_bytes())
        if key=='gui':
            with zipfile.ZipFile(source) as z:
                ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
                for n in GUI_IMAGES:
                    targets={e.attrib['Id']:e.attrib['Target'] for e in ET.fromstring(z.read(f'ppt/slides/_rels/slide{n}.xml.rels'))}
                    root=ET.fromstring(z.read(f'ppt/slides/slide{n}.xml'))
                    blips=root.findall('.//a:blip',ns);assert len(blips)==1
                    target=targets[blips[0].attrib['{'+ns['r']+'}embed']].lstrip('/')
                    name=target if target in z.namelist() else posixpath.normpath('ppt/slides/'+target)
                    (ROOT/f'public/materials/gui-slide-{n}.jpeg').write_bytes(z.read(name))
    (ROOT/'content/additional-source-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
