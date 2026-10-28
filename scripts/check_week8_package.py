"""Run the exact Week 8 download and check the intentional type error."""
from pathlib import Path
import ast,os,subprocess,sys,tempfile,zipfile
ROOT=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='oo2026-week8-') as temporary:
    folder=Path(temporary)
    with zipfile.ZipFile(ROOT/'public/materials/week-8-examples.zip') as archive:
        for name in archive.namelist():
            assert (folder/name).resolve().is_relative_to(folder.resolve()),name
            assert '__pycache__' not in name and '.mypy_cache' not in name and not name.endswith('.pyc')
            if name.endswith('.py'):ast.parse(archive.read(name).decode('utf-8'))
        archive.extractall(folder)
    package=folder/'week8_examples'
    env={**os.environ,'SDL_VIDEODRIVER':'dummy','SDL_AUDIODRIVER':'dummy','PYGAME_HIDE_SUPPORT_PROMPT':'1','PYTHONUTF8':'1'}
    def run(*args):
        return subprocess.run([sys.executable,*args],cwd=package,env=env,capture_output=True,text=True,encoding='utf-8')
    result=run('contracts.py')
    assert result.returncode==0 and result.stdout.strip()=='40.0 0.5\nTrue',result
    result=run('-m','unittest','discover','-s','tests','-v')
    print(result.stdout+result.stderr)
    assert result.returncode==0 and 'Ran 7 tests' in result.stderr and 'skipped' not in result.stderr
    result=run('-m','mypy','--strict','contracts.py','motion.py')
    assert result.returncode==0,result.stdout+result.stderr
    result=run('-m','mypy','--strict','typing_error.py')
    assert result.returncode==1 and '[assignment]' in result.stdout and 'Found 1 error' in result.stdout,result.stdout+result.stderr
    result=run('typing_error.py')
    assert result.returncode!=0 and 'TypeError' in result.stderr
    for lang in ('zh','en','ja'):
        assert f'python demo_game.py --lang {lang}' in (package/f'README-{lang}.md').read_text(encoding='utf-8')
        assert (package/f'docs/lesson-{lang}.html').read_text(encoding='utf-8').count('<section id="slide-')==32
print('PASS: Week 8 download, 7 behavior tests, static contracts, intentional type/runtime error, and trilingual offline lessons.')
