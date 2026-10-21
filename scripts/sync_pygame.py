"""Build web lessons from the same authored content as the three PPTX decks."""
from pathlib import Path
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
FILES = {"zh": "Pygame_物件導向射擊遊戲_繁體中文.pptx",
         "en": "Pygame_OOP_Shooter_English.pptx",
         "ja": "Pygame_オブジェクト指向シューティング_日本語.pptx"}

def sync_pygame(lessons, folder=None):
    raw = json.loads((ROOT / "content/pygame-slides.json").read_text(encoding="utf-8"))
    manifest = []
    for lang, deck in raw.items():
        result = []
        for source in deck:
            slide = {"number": source["number"], "title": source["title"],
                     "body": [{"type":"text","text":source["sub"]}]}
            if "code" in source:
                slide["code"] = source["code"]
                slide["codeLanguage"] = source.get("codeLanguage","python")
            if "values" in source:
                slide["body"].append({"type":"table","rows":source["values"]})
            slide["body"] += [{"type":"text","text":t} for t in source["notes"]]
            if source["type"] in ["inheritance","relations","objects","states"]:
                slide.update(image=f"/materials/pygame-{lang}-{source['type']}.svg",
                             imageAlt=source["title"]+" — "+source["sub"],
                             imageLayout="wide",imageWidth=1160,imageHeight=470)
            if source["type"] == "screenshot":
                slide.update(image=f"/materials/pygame-{lang}-preview.png",
                             imageAlt=source["title"],imageLayout="wide",
                             imageWidth=1200,imageHeight=800)
            if source["type"] == "browser-snapshot":
                slide.update(image=f"/materials/pygame-{lang}-browser-observe.png",
                             imageAlt=source["title"],imageLayout="wide",
                             imageWidth=470,imageHeight=388)
            if "links" in source:
                slide["body"] += [{"type":"text","text":f"{label}: {url}"} for label,url in source["links"]]
            result.append(slide)
        filename = f"pygame-{lang}.pptx"
        lessons[f"{lang}-pygame"] = {"source":FILES[lang],"slides":result,
                                    "download":filename,"examples":"pygame-oop-shooter.zip"}
        if folder:
            source=folder/FILES[lang]
            shutil.copyfile(source,ROOT/"public/materials"/filename)
            manifest.append({"unit":"pygame","language":lang,"source":FILES[lang],
                             "download":filename,"slides":len(result),
                             "sha256":hashlib.sha256(source.read_bytes()).hexdigest()})
            shutil.copyfile(folder/f"pygame_oop_shooter/docs/game-preview-{lang}.png",
                            ROOT/f"public/materials/pygame-{lang}-preview.png")
            shutil.copyfile(folder/f"pygame_oop_shooter/docs/browser-observe-{lang}.png",
                            ROOT/f"public/materials/pygame-{lang}-browser-observe.png")
    if folder:
        shutil.copyfile(folder/"Pygame_OOP_Shooter_Trilingual.zip",ROOT/"public/materials/pygame-oop-shooter.zip")
        (ROOT/"content/pygame-source-manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")

if __name__=="__main__":
    import sys
    lessons=json.loads((ROOT/"content/lessons.json").read_text(encoding="utf-8"))
    sync_pygame(lessons,Path(sys.argv[1]) if len(sys.argv)>1 else None)
    (ROOT/"content/lessons.json").write_text(json.dumps(lessons,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    print(f"Synced 3 Pygame lessons, {sum(len(lessons[f'{lang}-pygame']['slides']) for lang in FILES)} topics.")
