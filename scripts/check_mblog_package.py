"""Test the actual downloadable ZIP in a fresh directory."""
import ast
import base64
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path
from build_mblog_package import project_files

ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'content/mblog-manifest.json').read_text(encoding='utf8'))
archive=ROOT/'public/materials'/manifest['archive']
assert hashlib.sha256(archive.read_bytes()).hexdigest()==manifest['sha256']
source=dict(project_files())
assert {n:hashlib.sha256(b).hexdigest() for n,b in source.items()}==manifest['files']
with tempfile.TemporaryDirectory(prefix='mblog-check-') as temp:
    with zipfile.ZipFile(archive) as package:
        assert set(package.namelist())=={'mblog/'+n for n in source}
        for name in package.namelist():
            assert '..' not in Path(name).parts and name.startswith('mblog/')
            assert package.read(name)==source[name.removeprefix('mblog/')]
            if name.endswith('.py'):ast.parse(package.read(name).decode('utf8'))
        package.extractall(temp)
    project=Path(temp)/'mblog'
    def run(*args):
        result=subprocess.run([sys.executable,'-X','utf8','manage.py',*args],cwd=project,env={**os.environ,'DJANGO_SETTINGS_MODULE':'mblog.settings'},capture_output=True,text=True,encoding='utf8')
        assert result.returncode==0,result.stdout+result.stderr
        return result.stdout+result.stderr
    run('check')
    run('migrate','--noinput')
    assert 'Created 5 posts' in run('seed_demo')
    assert 'Created 0 posts' in run('seed_demo')
    run('makemigrations','--check','--dry-run')
    result=run('test','--verbosity','2')
    assert 'Ran 11 tests' in result and 'OK' in result,result
    run('collectstatic','--noinput')
    assert (project/'staticfiles/mysite/images/logo.svg').exists()
    css=(project/'static/vendor/bootstrap/bootstrap.min.css').read_bytes()
    assert base64.b64encode(hashlib.sha384(css).digest()).decode()=='sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB'
for guide in manifest['guides']:
    content=(ROOT/'public/materials'/guide['file']).read_bytes()
    assert hashlib.sha256(content).hexdigest()==guide['sha256']
    text=content.decode()
    for token in ['mblog-complete.zip','manage.py migrate','manage.py seed_demo','createsuperuser','127.0.0.1:8000']:
        assert token in text,(guide['language'],token)
print('PASS: mblog ZIP matches source, clean migrations, repeatable seeds, 11 behavior tests, static collection, Bootstrap integrity, and three installation guides.')
