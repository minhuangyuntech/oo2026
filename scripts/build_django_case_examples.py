"""Assemble runnable AI examples from the exact localized slide snippets."""
import ast,json,sys,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'content/django-case-slides.json').read_text(encoding='utf8'))
BUILD=ROOT.parent/'.build/django-case/examples'
intro={
 'zh':('# Django 網站實作案例：AI 服務\n\n這是依投影片第 89–127 頁整理的獨立專案，不會覆蓋 mblog 部落格。','先建立虛擬環境並安裝 requirements.txt，再執行以下命令。mock 測試不需要金鑰，不會呼叫雲端服務。','使用 Ollama 前請依第 97 頁安裝、下載模型並啟動。雲端服務需要自己的金鑰與可用額度；將 .env.example 複製為 .env 後設定，勿提交 .env。範例僅供本機執行，公開部署前請完成第 126 頁的準備。'),
 'en':('# Django Website Case Studies: AI services\n\nA standalone project assembled from slides 89–127. Keep it separate from your mblog blog.','Create a virtual environment and install requirements.txt, then run these commands. Mock tests need no keys and make no cloud calls.','Before using Ollama, install it, download the model, and start the service as shown on slide 97. Cloud providers need your own key and quota. Copy .env.example to .env, fill it locally, and never commit .env. This is a local example; complete slide 126 before public deployment.'),
 'ja':('# Django Web サイト実装例：AI サービス\n\n89〜127 枚目から整理した独立プロジェクトです。mblog ブログとは別に配置してください。','仮想環境を作成して requirements.txt をインストールし、以下を実行します。mock テストにキーは不要で、クラウドを呼び出しません。','Ollama は 97 枚目に従って導入・モデル取得・起動を行います。クラウド利用には自分のキーと利用枠が必要です。.env.example を .env にコピーして設定し、.env は Git に登録しません。本例はローカル用です。公開前に 126 枚目の準備を行ってください。')}
def build(lang):
    deck=data[lang];folder=BUILD/lang/'django_ai_demo'
    files={}
    def code(n,index=0):return [b['text'] for b in deck[n-1]['blocks'] if b['code'] and '\n' in b['text']][index]
    def combine(*nums):return '\n\n'.join(code(n)for n in nums)+'\n'
    for name,nums in {'common':(103,104),'ollama':(99,100,101,102),'sdk_common':(106,112,113),'openai_provider':(107,108),'nvidia_provider':(110,111),'registry':(114,115)}.items():files[f'mysite/ai/{name}.py']=combine(*nums)
    files.update({'mysite/forms.py':combine(116,117),'mysite/views.py':combine(118,119),'mblog/urls.py':code(120,0),'mysite/urls.py':code(120,1),'.env.example':code(95)})
    files['mblog/settings.py']='''from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
'''+code(96)+f'''
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY") or "django-insecure-local-classroom-only"
DEBUG = True
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]
INSTALLED_APPS = ["django.contrib.staticfiles", "mysite"]
MIDDLEWARE = ["django.middleware.security.SecurityMiddleware", "django.middleware.common.CommonMiddleware", "django.middleware.csrf.CsrfViewMiddleware"]
ROOT_URLCONF = "mblog.urls"
TEMPLATES = [{{"BACKEND":"django.template.backends.django.DjangoTemplates", "DIRS":[BASE_DIR / "templates"], "APP_DIRS":True, "OPTIONS":{{"context_processors":["django.template.context_processors.request"]}}}}]
WSGI_APPLICATION = "mblog.wsgi.application"
ASGI_APPLICATION = "mblog.asgi.application"
DATABASES = {{"default":{{"ENGINE":"django.db.backends.sqlite3", "NAME":BASE_DIR / "db.sqlite3"}}}}
LANGUAGE_CODE = "{ {'zh':'zh-hant','en':'en','ja':'ja'}[lang]}"
TIME_ZONE = "Asia/Taipei"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
'''
    files['manage.py']='''import os,sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mblog.settings")
from django.core.management import execute_from_command_line
if __name__ == "__main__": execute_from_command_line(sys.argv)
'''
    for kind in ['wsgi','asgi']:
        files[f'mblog/{kind}.py']=f'import os\nos.environ.setdefault("DJANGO_SETTINGS_MODULE", "mblog.settings")\nfrom django.core.{kind} import get_{kind}_application\napplication = get_{kind}_application()\n'
    files['requirements.txt']='Django==5.2.18\nrequests==2.32.5\nopenai==2.29.0\npython-dotenv==1.2.2\n'
    files['.gitignore']='.venv/\n__pycache__/\n*.py[cod]\n.env\n.env.*\n!.env.example\ndb.sqlite3\n'
    for name in ['mblog/__init__.py','mysite/__init__.py','mysite/ai/__init__.py']:files[name]=''
    title={'zh':'Django AI 問答練習','en':'Django AI question practice','ja':'Django AI 質問の実習'}[lang]
    files['templates/mysite/ai_chat.html']='{% load static %}\n<!doctype html>\n'+f'<html lang="{ {"zh":"zh-Hant","en":"en","ja":"ja"}[lang]}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title>'+"<link rel=\"stylesheet\" href=\"{% static 'mysite/css/ai.css' %}\"></head><body><main>"+f'<h1>{title}</h1>'+code(121)+'\n'+code(122,0)+'\n</main></body></html>\n'
    files['static/mysite/css/ai.css']='body{font-family:system-ui,sans-serif;line-height:1.6;background:#f3f6f6;color:#173247;margin:0}main{max-width:760px;margin:3rem auto;padding:2rem;background:white}label{display:block;font-weight:bold}textarea,select{box-sizing:border-box;max-width:100%;width:100%;padding:.6rem;font:inherit}.field{margin:1rem 0}.hint{font-size:.9rem;color:#486370}button{padding:.7rem 1.5rem;background:#176c68;color:white;border:0;font:inherit}.errorlist{color:#a32b20}\n'+code(122,1)+'\n'
    files['mysite/tests.py']=(ROOT/'content/django-case-tests.py').read_text(encoding='utf8')
    files['run_mock_tests.py']='''"""Run offline tests with all outbound sockets blocked."""
import os,sys
from unittest.mock import patch
os.environ["OPENAI_API_KEY"] = ""
os.environ["NVIDIA_API_KEY"] = ""
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mblog.settings")
import django
django.setup()
from django.test.runner import DiscoverRunner
if __name__ == "__main__":
    with patch("socket.socket.connect", side_effect=AssertionError("Network disabled in offline tests")):
        failures = DiscoverRunner(verbosity=2).run_tests(["mysite"])
    sys.exit(bool(failures))
'''
    a,b,c=intro[lang]
    files['README.md']=a+'\n\nPython 3.13/3.14, Django 5.2 LTS.\n\n'+b+'\n\n```sh\npython manage.py check\npython run_mock_tests.py\npython manage.py runserver 127.0.0.1:8000\n```\n\nhttp://127.0.0.1:8000/ai/\n\n'+c+'\n'
    for name,text in files.items():
        if name.endswith('.py'):ast.parse(text,filename=name)
        dest=folder/name;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(text,encoding='utf8')
    target=ROOT/f'public/materials/django-case-{lang}-examples.zip'
    with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
        for name,text in files.items():z.writestr('django_ai_demo/'+name,text)
    print(lang,len(files),'files:',target.name)
if __name__=='__main__':
    for lang in ['zh','en','ja']:build(lang)
