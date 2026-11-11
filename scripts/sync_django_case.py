"""Normalize the complete, aligned Django case-study decks."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
DIAGRAMS={4,9,20,24,28,31,34,37,46,50,52,58,62,65,66,67,72,76,78,81,83,91,123}
def sync_django_case(lessons):
    data=json.loads((ROOT/'content/django-case-slides.json').read_text(encoding='utf8'))
    for lang,deck in data.items():
        pages=[]
        for s in deck:
            n=s['number'];blocks=[b for b in s['blocks'] if b['y']<670]
            title=blocks[1] if blocks[0]['text'].isdigit() else blocks[0]
            if n==1:title={'text':{'zh':'Django 網站實作案例','en':'Django Website Case Studies','ja':'Django Web サイト実装例'}[lang]}
            page={'number':n,'title':title['text'].replace('\n',' '),'body':[]}
            snippets=[]
            for i,b in enumerate(blocks):
                if b is title or b['text'].isdigit() or b['text']=='✓':continue
                if b['code'] and '\n' in b['text']:
                    label=blocks[i-1]['text'] if i else ''
                    code=b['text'];language='python'
                    if n in [6,7,8,14,17,25,26,77,94,97,124]:language='shell'
                    elif n in [9,16,39,95] or (n==67 and not code.startswith('#')):language='text'
                    elif code.lstrip().startswith(('<','{%')):language='html'
                    elif n==44 or (n==122 and code.startswith('.answer')):language='css'
                    elif n==76:language='markdown'
                    elif n==32:language='text'
                    snippets.append({'code':code,'language':language,'label':label})
                else:page['body'].append({'type':'heading' if b['fontSize']>=18 and b['y']<580 else 'text','text':b['text']})
            page['body'] += [{'type':'table','rows':t} for t in s['tables']]
            if snippets:page['snippets']=snippets
            if n in DIAGRAMS:
                page.update(image=f'/materials/django-case-{lang}-slide-{n}.png',imageAlt=page['title'],imageWidth=1280,imageHeight=720,imageLayout='wide')
            pages.append(page)
        lessons[f'{lang}-django-case']={'source':f'django-case-{lang}.pptx','slides':pages,'download':f'django-case-{lang}.pptx','examples':f'django-case-{lang}-examples.zip','sourceLanguage':lang}
if __name__=='__main__':
    target=ROOT/'content/lessons.json';lessons=json.loads(target.read_text(encoding='utf8'))
    sync_django_case(lessons)
    target.write_text(json.dumps(lessons,ensure_ascii=False,separators=(',',':')),encoding='utf8')
    print('Synced Django case study: 127 slides x 3 languages')
