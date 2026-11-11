"""Sync the formal trilingual PyPI slides into the online lesson data."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
slides=json.loads((ROOT/'content/pypi-slides.json').read_text(encoding='utf-8'))
target=ROOT/'content/lessons.json'
labels={
 'zh':{'source':'來源文件','mixed':'終端機與程式片段（依註解分別執行）','toml':'pyproject.toml · 設定檔'},
 'en':{'source':'Source documentation','mixed':'Terminal and code excerpts (run separately as labeled)','toml':'pyproject.toml · Configuration'},
 'ja':{'source':'出典文書','mixed':'ターミナルとコード（コメントに従い別々に実行）','toml':'pyproject.toml · 設定ファイル'}}
def sync_pypi(lessons):
    for lang,deck in slides.items():
        assert len(deck)==49
        pages=[]
        for d in deck:
            blocks=[{'type':'text','text':d['lead']}]
            if d['type']=='table':
                blocks+=[{'type':'table','rows':d['values']},{'type':'text','text':d['foot']}]
            else:
                blocks += [{'type':'text','text':v} for v in d.get('items',d.get('notes',[]))]
            blocks += [{'type':'text','text':labels[lang]['source']+': '+url} for url in d.get('src',[])]
            page={'number':d['number'],'title':d['title'].replace('\n',' '),'body':blocks}
            if d.get('code'):
                n=d['number']
                language='powershell' if n in [11,13,25,44] else 'bash' if n in [15,17] else 'text' if n in [24,27,28] else 'shell' if n in [40,43,45,46] else 'python'
                label=labels[lang]['mixed'] if n in [3,7,9,39] else labels[lang]['toml'] if n in [27,28] else None
                page['snippets']=[{'code':d['code'],'language':language,'label':label}]
            pages.append(page)
        lessons[f'{lang}-pypi']={'source':f'pypi-{lang}.pptx','slides':pages,'download':f'pypi-{lang}.pptx','examples':'house_price_demo.zip','sourceLanguage':lang}


if __name__ == "__main__":
    lessons=json.loads(target.read_text(encoding="utf-8"))
    sync_pypi(lessons)
    target.write_text(json.dumps(lessons,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    print('Synced 49 pages in each of zh/en/ja.')
