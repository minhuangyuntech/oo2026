"""Sync Week 8 from the common trilingual slide source."""
from pathlib import Path
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    'zh':'Week8_多型抽象化與介面_繁體中文.pptx',
    'en':'Week8_Polymorphism_Abstraction_Interfaces_English.pptx',
    'ja':'Week8_多態性抽象化インターフェース_日本語.pptx',
}

def sync_week8(lessons, folder=None):
    raw=json.loads((ROOT/'content/week8-slides.json').read_text(encoding='utf-8'))
    manifest=[]
    for lang,deck in raw.items():
        slides=[]
        for source in deck:
            slide={'number':source['number'],'title':source['title'].replace('\n',' '),
                   'body':[{'type':'text','text':source['sub']}]}
            if 'code' in source:
                slide.update(code=source['code'],codeLanguage=source.get('codeLanguage','python'))
                if slide['codeLanguage']=='bash':slide['codeLanguage']='shell'
            if 'values' in source:slide['body'].append({'type':'table','rows':source['values']})
            slide['body'] += [{'type':'text','text':t} for t in source['notes']]
            slide['body'] += [{'type':'text','text':f'{label}: {url}'} for label,url in source.get('links',[])]
            if 'image' in source:
                observed=source['number']==28
                slide.update(image='/materials/'+source['image'],imageAlt=source['title'],imageLayout='wide',
                             imageWidth=470 if observed else 1200,imageHeight=388 if observed else 800)
            slides.append(slide)
        download=f'week-8-{lang}.pptx'
        lessons[f'{lang}-8']={'source':FILES[lang],'slides':slides,'download':download,'examples':'week-8-examples.zip'}
        if folder:
            source=folder/FILES[lang]
            shutil.copyfile(source,ROOT/'public/materials'/download)
            manifest.append({'week':8,'language':lang,'source':FILES[lang],'download':download,'slides':32,
                             'sha256':hashlib.sha256(source.read_bytes()).hexdigest()})
    if folder:
        shutil.copyfile(folder/'Week8_Polymorphism_Examples.zip',ROOT/'public/materials/week-8-examples.zip')
        (ROOT/'content/week8-source-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

if __name__=='__main__':
    import sys
    lessons=json.loads((ROOT/'content/lessons.json').read_text(encoding='utf-8'))
    sync_week8(lessons,Path(sys.argv[1]) if len(sys.argv)>1 else None)
    (ROOT/'content/lessons.json').write_text(json.dumps(lessons,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    print('Synced 3 Week 8 lessons, 96 topics.')
