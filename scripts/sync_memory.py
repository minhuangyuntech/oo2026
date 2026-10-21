"""Sync the matching-game lesson from the same content as its three decks."""
from pathlib import Path
import hashlib, json, shutil
ROOT=Path(__file__).resolve().parents[1]
FILES={'zh':'翻牌配對_物件導向教學_繁體中文.pptx','en':'Card_Matching_OOP_English.pptx','ja':'神経衰弱_オブジェクト指向_日本語.pptx'}
def sync_memory(lessons,folder=None):
 raw=json.loads((ROOT/'content/memory-slides.json').read_text(encoding='utf-8'))
 manifest=[]
 for lang,deck in raw.items():
  slides=[]
  for d in deck:
   s={'number':d['number'],'title':d['title'],'body':[{'type':'text','text':d['sub']}]}
   if 'code' in d:s.update(code=d['code'],codeLanguage=d['codeLanguage'])
   if 'values' in d:s['body'].append({'type':'table','rows':d['values']})
   s['body'] += [{'type':'text','text':n} for n in d['notes']]
   s['body'] += [{'type':'text','text':f'{label}: {url}'} for label,url in d.get('links',[])]
   if d['type'] in ('classes','objects'):
    s.update(image=f'/materials/memory-{lang}-{d["type"]}.svg',imageAlt=d['title'],imageLayout='wide',imageWidth=1160,imageHeight=450)
   if d['type']=='screenshot':
    s.update(image=f'/materials/memory-{lang}-preview.png',imageAlt=d['title'],imageLayout='wide',imageWidth=1184,imageHeight={'zh':859,'en':900,'ja':878}[lang])
   if d['type']=='desktop':
    s.update(image=f'/materials/memory-{lang}-pygame.png',imageAlt=d['title'],imageLayout='wide',imageWidth=1280,imageHeight=800)
   slides.append(s)
  lessons[f'{lang}-memory']={'source':FILES[lang],'slides':slides,'download':f'memory-{lang}.pptx','examples':'memory-oop-trilingual.zip'}
  if folder:
   source=folder/FILES[lang];shutil.copyfile(source,ROOT/f'public/materials/memory-{lang}.pptx')
   shutil.copyfile(folder/f'memory_oop/docs/preview-{lang}.png',ROOT/f'public/materials/memory-{lang}-preview.png')
   shutil.copyfile(folder/f'memory_oop/docs/pygame-{lang}.png',ROOT/f'public/materials/memory-{lang}-pygame.png')
   manifest.append({'unit':'memory','language':lang,'source':FILES[lang],'download':f'memory-{lang}.pptx','slides':len(slides),'sha256':hashlib.sha256(source.read_bytes()).hexdigest()})
 if folder:
  shutil.copyfile(folder/'Memory_OOP_Trilingual.zip',ROOT/'public/materials/memory-oop-trilingual.zip')
  (ROOT/'content/memory-source-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
if __name__=='__main__':
 import sys
 lessons=json.loads((ROOT/'content/lessons.json').read_text(encoding='utf-8'))
 sync_memory(lessons,Path(sys.argv[1]) if len(sys.argv)>1 else None)
 (ROOT/'content/lessons.json').write_text(json.dumps(lessons,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
 print('Synced 3 matching-game lessons, 81 topics.')
