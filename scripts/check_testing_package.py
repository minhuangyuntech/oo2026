"""Run the exact testing downloads in three languages and compare their output with the lessons."""
from pathlib import Path
import ast,json,os,subprocess,sys,tempfile,zipfile
ROOT=Path(__file__).resolve().parents[1]
slides=json.loads((ROOT/'content/testing-slides.json').read_text(encoding='utf-8'))
EXAMPLES={'zh':'gradebook_testing.zip','en':'gradebook_testing-en.zip','ja':'gradebook_testing-ja.zip'}
def code(lang,number,index=0):
    return [b['text'] for b in slides[lang][number-1]['body'] if b['type']=='code'][index]
for lang,archive_name in EXAMPLES.items():
    with tempfile.TemporaryDirectory(prefix=f'oo2026-testing-{lang}-') as temporary:
        folder=Path(temporary)
        with zipfile.ZipFile(ROOT/'public/materials'/archive_name) as archive:
            for name in archive.namelist():
                assert (folder/name).resolve().is_relative_to(folder.resolve()),name
                assert '__pycache__' not in name and not name.endswith('.pyc') and not name.startswith('instructor/'),name
                if name.endswith('.py'):ast.parse(archive.read(name).decode('utf-8'))
            archive.extractall(folder)
        env={**os.environ,'PYTHONUTF8':'1','PYTHONDONTWRITEBYTECODE':'1'}
        def run(*args):
            return subprocess.run([sys.executable,*args],cwd=folder,env=env,capture_output=True,text=True,encoding='utf-8')
        # Slide 11: the mini runner prints exactly the lines on the slide.
        result=run('-m','demo.mini_runner')
        assert result.returncode==0 and result.stdout.strip()==code(lang,11),(lang,result.stdout)
        # Slides 7 and 24: the same assert run by python and by pytest.
        snippet=code(lang,7)
        (folder/'plain_assert.py').write_text('from gradebook import GradeBook\n\n'+snippet+'\n',encoding='utf-8')
        result=run('plain_assert.py')
        assert result.stderr.strip().endswith(code(lang,7,1)),(lang,result.stderr)
        (folder/'test_rewrite.py').write_text('from gradebook import GradeBook\n\n\ndef test_passed_list():\n'+''.join('    '+line+'\n' for line in snippet.splitlines()),encoding='utf-8')
        result=run('-m','pytest','-p','no:cacheprovider','test_rewrite.py')
        assert all(line in result.stdout.splitlines() for line in code(lang,24).splitlines()),(lang,result.stdout)
        (folder/'plain_assert.py').unlink();(folder/'test_rewrite.py').unlink()
        result=run('-m','unittest','discover','-s','tests_unittest','-v')
        assert result.returncode==0 and 'Ran 6 tests' in result.stderr,(lang,result.stderr)
        # Slide 20: a wrong expectation and a missing student give one F and one E.
        test_file=folder/'tests_unittest/test_gradebook_unittest.py'
        source=test_file.read_text(encoding='utf-8')
        test_file.write_text(source.replace('self.assertEqual(self.book.average(), 85)','self.assertEqual(self.book.average(), 80)').replace(
            '    def test_add_increases_count(self) -> None:',
            '    def test_unknown_student(self) -> None:\n        self.assertEqual(self.book.score_of("Z999"), 0)\n\n    def test_add_increases_count(self) -> None:'),encoding='utf-8')
        result=run('-m','unittest','discover','-s','tests_unittest')
        for line in code(lang,20,1).splitlines():
            assert line in result.stderr.splitlines() or (line.startswith('Ran ') and line.split(' in ')[0] in result.stderr),(lang,line)
        test_file.write_text(source,encoding='utf-8')
        result=run('-m','pytest','-p','no:cacheprovider','-q')
        assert result.returncode==0 and '21 passed' in result.stdout,(lang,result.stdout)
        result=run('-m','pytest','-p','no:cacheprovider','-q','tests_unittest')
        assert result.returncode==0 and '6 passed' in result.stdout,(lang,result.stdout)
        result=run('-m','pytest','-p','no:cacheprovider','-v','tests/test_letter_grade.py')
        assert all(line.split(' PASSED')[0] in result.stdout for line in code(lang,27,1).splitlines()),(lang,result.stdout)
        # Slides 32 and 33: the starter passes, the published answer finds the 80-point bug, the fix passes.
        exercise=folder/'exercises/boundaries'
        result=run('-m','pytest','-p','no:cacheprovider','-q','exercises/boundaries')
        assert result.returncode==0 and '2 passed' in result.stdout,(lang,result.stdout)
        starter=(exercise/'test_grading.py').read_text(encoding='utf-8')
        (exercise/'test_grading.py').write_text(starter[:starter.index('@pytest.mark.parametrize')]+code(lang,33)+'\n',encoding='utf-8')
        result=run('-m','pytest','-p','no:cacheprovider','-q','exercises/boundaries')
        assert result.returncode==1 and '1 failed, 12 passed' in result.stdout and "assert 'C' == 'B'" in result.stdout,(lang,result.stdout)
        grading=(exercise/'grading.py').read_text(encoding='utf-8')
        (exercise/'grading.py').write_text(grading.replace('if score > 80:','if score >= 80:'),encoding='utf-8')
        result=run('-m','pytest','-p','no:cacheprovider','-q','exercises/boundaries')
        assert result.returncode==0 and '13 passed' in result.stdout,(lang,result.stdout)
        assert 'pip install -r requirements.txt' in (folder/'README.md').read_text(encoding='utf-8')
print('PASS: 3 testing downloads; slide output for python/pytest asserts, the mini runner and unittest; 6 unittest and 21 pytest tests; the published answer finds the boundary bug and 13 tests pass after the fix.')
