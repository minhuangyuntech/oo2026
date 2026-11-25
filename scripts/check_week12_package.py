"""Run the exact Week 12 download: tests, strict typing, demo output, exercises and sample answers."""
from pathlib import Path
import ast,json,os,re,subprocess,sys,tempfile,zipfile
ROOT=Path(__file__).resolve().parents[1]
slides=json.loads((ROOT/'content/week12-slides.json').read_text(encoding='utf-8'))
def code(lang,number,index=0):
    return [b['text'] for b in slides[lang][number-1]['body'] if b['type']=='code'][index]
with tempfile.TemporaryDirectory(prefix='oo2026-week12-') as temporary:
    folder=Path(temporary)
    with zipfile.ZipFile(ROOT/'public/materials/lab_monitor.zip') as archive:
        for name in archive.namelist():
            assert (folder/name).resolve().is_relative_to(folder.resolve()),name
            assert '__pycache__' not in name and '.mypy_cache' not in name and not name.endswith('.pyc'),name
            assert not name.startswith(('instructor/','.venv/')),name
            if name.endswith('.py'):ast.parse(archive.read(name).decode('utf-8'))
        archive.extractall(folder)
    env={**os.environ,'PYTHONUTF8':'1','PYTHONDONTWRITEBYTECODE':'1'}
    def run(*args,extra=None):
        return subprocess.run([sys.executable,*args],cwd=folder,env={**env,**(extra or {})},capture_output=True,text=True,encoding='utf-8')
    result=run('-m','pytest','-q','-p','no:cacheprovider')
    assert result.returncode==0 and '27 passed' in result.stdout,result.stdout+result.stderr
    result=run('-m','mypy','src')
    assert result.returncode==0 and 'Success' in result.stdout,result.stdout+result.stderr
    demo=run('-m','lab_monitor',extra={'PYTHONPATH':str(folder/'src')})
    assert demo.returncode==0,demo.stderr
    excerpt=code('zh',8,1).splitlines()
    assert excerpt and all(line in demo.stdout.splitlines() for line in excerpt),(excerpt,demo.stdout)
    for exercise,failed in (('a_rate_rule',13),('b_cooldown',10)):
        result=run('-m','pytest','-q','-p','no:cacheprovider',f'exercises/{exercise}')
        assert result.returncode==1 and f'{failed} failed' in result.stdout,result.stdout+result.stderr
    # The published sample answers (slides 88 and 89) must satisfy the unchanged exercise tests.
    for number,path in ((88,'exercises/a_rate_rule/rate_rule.py'),(89,'exercises/b_cooldown/cooldown.py')):
        starter=(folder/path).read_text(encoding='utf-8')
        header=starter[:starter.index('\nclass ')+1]
        (folder/path).write_text(header+'\n'+code('zh',number)+'\n',encoding='utf-8')
    result=run('-m','pytest','-q','-p','no:cacheprovider','tests','exercises')
    assert result.returncode==0 and '50 passed' in result.stdout,result.stdout+result.stderr
    for lang in ('en','ja'):
        readme=(folder/f'README-{lang}.md').read_text(encoding='utf-8')
        assert 'pip install -e ".[dev]"' in readme and 'pytest exercises/a_rate_rule' in readme and 'python -m lab_monitor' in readme
    assert re.search(r'pytest exercises/a_rate_rule',(folder/'README.md').read_text(encoding='utf-8'))
print('PASS: Week 12 download, 27 tests, mypy --strict, demo output, failing exercise starters, 50 tests with the published sample answers, and trilingual READMEs.')
