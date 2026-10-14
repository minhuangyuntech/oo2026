"""Sync the three reviewed Django decks and their runnable companion projects."""
from pathlib import Path
import hashlib
import json
import posixpath
import shutil
import struct
import xml.etree.ElementTree as ET
import zipfile

ROOT=Path(__file__).resolve().parents[1]
IMAGES={2,22,25,41}
LABELS={
    'zh':{'tree':'目錄結構','browser':'瀏覽器網址','download':'完成版範例見本頁下載區。'},
    'en':{'tree':'Directory structure','browser':'Browser URL','download':'The complete project is available in the downloads section.'},
    'ja':{'tree':'ディレクトリ構造','browser':'ブラウザの URL','download':'完成版プロジェクトは、このページのダウンロード欄にあります。'}
}
ALTS={
    'zh':{2:'商品目錄網站：瀏覽商品、查看價格與庫存，並進入新增商品頁。',22:'瀏覽器請求依序經過 config/urls.py、catalog/urls.py 與 views.py。View 查詢模型及資料庫，再以 template 和 context 產生 HTML 回應。',25:'models.py 經 makemigrations 產生遷移檔，再由 migrate 更新資料庫。只修改 models.py 不會更新資料表。',41:'新增商品表單：商品名稱、價格、庫存與儲存按鈕。'},
    'en':{2:'Product catalog website with product prices, stock status, and navigation to the creation form.',22:'The browser request passes through config/urls.py, catalog/urls.py, and views.py. The view queries models and the database, then renders a template with context into an HTML response.',25:'makemigrations turns model changes into migration files; migrate applies them to the database. Editing models.py alone does not update tables.',41:'Product creation form with name, price, stock, and a save button.'},
    'ja':{2:'商品一覧サイト。価格・在庫状況と、商品登録ページへのリンクを表示します。',22:'ブラウザの要求は config/urls.py、catalog/urls.py、views.py を通ります。ビューがモデルとデータベースを検索し、テンプレートとコンテキストから HTML 応答を生成します。',25:'makemigrations がモデル変更から移行ファイルを生成し、migrate がデータベースへ適用します。models.py の変更だけではテーブルは更新されません。',41:'商品登録フォーム。商品名、価格、在庫、保存ボタンを表示します。'}
}

def code_text(blocks):
    steps=[b['y']-a['y'] for a,b in zip(blocks,blocks[1:]) if b['y']>a['y']]
    step=min(steps) if steps else 31
    lines=[]
    for i,b in enumerate(blocks):
        if i and b['y']-blocks[i-1]['y']>step*1.6:lines.append('')
        lines.append(b['text'])
    return '\n'.join(lines)

def normalize(lang,slide):
    n=slide['number'];blocks=[b for b in slide['blocks'] if b['type']=='table' or b['y']<678]
    title=max((b for b in blocks if b['type']=='text'),key=lambda b:b['fontSize'])
    result={'number':n,'title':title['text'].replace('\n',' '),'body':[]}
    for b in blocks:
        if b is title or b['type']=='code':continue
        if b['type']=='table':result['body'].append({'type':'table','rows':b['rows']});continue
        value=b['text']
        if n==2 and b['y']>670:value=LABELS[lang]['download']
        result['body'].append({'type':'heading' if b['x']<150 and b['fontSize']>=18 and 180<b['y']<600 else 'text','text':value})
    code=[b for b in blocks if b['type']=='code']
    if code:
        # Keep separately copyable commands, file content, and directory listings.
        ranges={
            7:[(0,270,'powershell',None),(270,350,'text','requirements.txt'),(350,660,'powershell',None)],
            8:[(0,230,'powershell',None),(230,660,'text',LABELS[lang]['tree'])],
            16:[(0,250,'powershell',None),(250,340,'text',LABELS[lang]['browser']),(340,660,'powershell',None)],
            17:[(0,230,'powershell',None),(230,660,'text',LABELS[lang]['tree'])],
            18:[(0,390,'python','catalog/apps.py'),(390,660,'python','config/settings.py · INSTALLED_APPS')],
            26:[(0,280,'powershell',None),(280,660,'text',LABELS[lang]['tree'])],
            30:[(0,250,'powershell',None),(250,660,'text',LABELS[lang]['browser'])],
            32:[(0,420,'text',LABELS[lang]['tree']),(420,660,'python','config/settings.py · TEMPLATES')],
            37:[(0,420,'python','catalog/views.py'),(420,660,'html','catalog/product_detail.html')]
        }.get(n,[(0,660,'powershell' if n in {6,10} else 'html' if n in {33,34,40} else 'css' if n==35 else 'python',None)])
        snippets=[]
        for start,end,language,label in ranges:
            selected=[b for b in code if start<=b['y']<end]
            if selected:snippets.append({'code':code_text(selected),'language':language,'label':label})
        result['snippets']=snippets
    if n in IMAGES:
        image=f'/materials/django-{lang}-slide-{n}.png'
        width,height=struct.unpack('>II',(ROOT/'public'/image.lstrip('/')).read_bytes()[16:24])
        result.update({'image':image,'imageAlt':ALTS[lang][n],'imageLayout':'wide','imageWidth':width,'imageHeight':height})
    return result

def sync_django(lessons,folder=None):
    raw=json.loads((ROOT/'content/django-slide-sources.json').read_text(encoding='utf-8'))
    examples=json.loads((ROOT/'content/django-example-sources.json').read_text(encoding='utf-8'))
    manifest=[]
    for lang,deck in raw.items():
        name=f'django-{lang}.pptx';archive=f'django-{lang}-examples.zip'
        lessons[f'{lang}-django']={'source':deck['file'],'sourceLanguage':lang,'download':name,'examples':archive,'slides':[normalize(lang,s) for s in deck['slides']]}
        # Fixed metadata makes regenerated archives byte-for-byte reproducible.
        with zipfile.ZipFile(ROOT/'public/materials'/archive,'w',zipfile.ZIP_DEFLATED) as z:
            for path,content in sorted(examples[lang].items()):
                info=zipfile.ZipInfo('django_shop/'+path,date_time=(2026,10,14,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED
                z.writestr(info,content.encode('utf-8'))
        if folder is not None:
            source=folder/deck['file'];shutil.copyfile(source,ROOT/'public/materials'/name)
            manifest.append({'unit':'django','language':lang,'source':deck['file'],'download':name,'slides':53,'sha256':hashlib.sha256(source.read_bytes()).hexdigest()})
            with zipfile.ZipFile(source) as z:
                ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
                for n in IMAGES:
                    targets={e.attrib['Id']:e.attrib['Target'] for e in ET.fromstring(z.read(f'ppt/slides/_rels/slide{n}.xml.rels'))}
                    root=ET.fromstring(z.read(f'ppt/slides/slide{n}.xml'));blips=root.findall('.//a:blip',ns);assert len(blips)==1
                    target=targets[blips[0].attrib['{'+ns['r']+'}embed']].lstrip('/')
                    name=target if target in z.namelist() else posixpath.normpath('ppt/slides/'+target)
                    (ROOT/f'public/materials/django-{lang}-slide-{n}.png').write_bytes(z.read(name))
    if folder is not None:(ROOT/'content/django-source-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':
    import sys
    lessons=json.loads((ROOT/'content/lessons.json').read_text(encoding='utf-8'))
    sync_django(lessons,Path(sys.argv[1]) if len(sys.argv)>1 else None)
    (ROOT/'content/lessons.json').write_text(json.dumps(lessons,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    print('Synced 3 Django lessons, 159 topics, and 3 example archives.')
