# mblog：インストールと実行

「Django Web サイト実装例」の 1〜88 枚目に対応する完全なプロジェクトです。記事一覧、詳細ページ、管理画面、共通テンプレート、Bootstrap、静的ファイル、nh3 で安全に処理する Markdown を含みます。ブログの画面とサンプル記事は元の例に合わせて繁体字中国語です。三言語の説明は同じプロジェクトに対応しています。

## 1. 準備

Python 3.13 または 3.14 をインストールします（3.12 も利用可能）。ZIP を展開し、`manage.py` がある `mblog` フォルダーを開いてください。最初のパッケージ導入にはインターネット接続が必要です。SQLite は Python に含まれるため、別のデータベースや AI キーは不要です。

教材に合わせて Django 5.2.18、Markdown 3.11.2、nh3 0.3.7 を指定しています。Bootstrap 5.3.8 と MIT ライセンスは `static/vendor/bootstrap/` に同梱しており、ページの表示に CDN 接続は不要です。

## 2. Windows PowerShell

展開後の `mblog` フォルダーで PowerShell を開き、順に実行します。

```powershell
python --version
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py seed_demo
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

仮想環境の Python を直接使うため、Activate.ps1 の実行や PowerShell の実行ポリシー変更は不要です。`python` で導入済みの Python が起動しない場合は、最初の二つのコマンドを `py -3.14`（または導入済みバージョン）で実行してください。

## 3. macOS / Linux

同じ `mblog` フォルダーでターミナルを開きます。

```sh
python3 --version
python3 -m venv .venv
./.venv/bin/python -m pip install -r requirements.txt
./.venv/bin/python manage.py migrate
./.venv/bin/python manage.py seed_demo
./.venv/bin/python manage.py check
./.venv/bin/python manage.py runserver 127.0.0.1:8000
```

自分の OS に対応するコマンドだけを実行します。Ubuntu / Debian で venv が使えない場合は、Python のバージョンに対応する venv パッケージを導入してから仮想環境を作成してください。

## 4. ページと管理画面

ターミナルを開いたまま、次の URL にアクセスします。

- トップページ：<http://127.0.0.1:8000/>
- 最初の記事：<http://127.0.0.1:8000/post/hello-django/>
- Markdown の例：<http://127.0.0.1:8000/post/markdown-demo/>
- 管理画面：<http://127.0.0.1:8000/admin/>

`Ctrl+C` でサーバーを停止し、自分の管理者を作成して再起動します。

Windows：

```powershell
.\.venv\Scripts\python.exe manage.py createsuperuser
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

macOS / Linux：

```sh
./.venv/bin/python manage.py createsuperuser
./.venv/bin/python manage.py runserver 127.0.0.1:8000
```

ユーザー名とパスワードは自分で設定します。入力中のパスワードが表示されないのは正常です。既定の管理者やパスワードはありません。管理画面の Posts から記事を追加・編集できます。`title` は見出し、`slug` は一意の URL 名（例：`my-first-post`）、`body` は Markdown 本文、`pub_date` は自動生成される日時です。中国語のタイトルから slug が作られない場合は、英数字とハイフンで手入力してください。

`seed_demo` は不足している五つのサンプル記事を作成します。再実行しても既存の記事や編集内容を上書きせず、ユーザーも作成しません。ZIP にデータベースは含まれません。`migrate` がローカルの `db.sqlite3` を作成します。次回からは `runserver` だけで起動でき、導入と初期化を繰り返す必要はありません。

## 5. ファイルと教材の対応

| ファイル | 役割 | スライド |
|---|---|---|
| `mblog/settings.py` | App、テンプレート、データベース、静的ファイルの設定 | 12–13、39、67 |
| `mysite/models.py`、`migrations/0001_initial.py` | Post モデルとテーブル作成 | 22–25 |
| `mysite/admin.py` | 管理一覧、検索、slug の事前入力 | 30 |
| `mblog/urls.py`、`mysite/urls.py`、`mysite/views.py` | URL、一覧の取得、詳細、404 | 38、40、47 |
| `templates/`、`static/` | 共通構造、記事画面、CSS、ロゴ | 54–71、82 |
| `mysite/templatetags/markdown_extras.py` | Markdown 解析と許可リストによる HTML の無害化 | 79–80 |
| `mysite/management/commands/seed_demo.py` | 再実行できるサンプルデータ作成コマンド | ダウンロード版の補助機能 |
| `mysite/tests.py` | ページ、データ制約、管理画面、Markdown のテスト | 84 |

## 6. テスト

開発サーバーを停止してから実行します。Windows：

```powershell
.\.venv\Scripts\python.exe manage.py test
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
```

macOS / Linux：

```sh
./.venv/bin/python manage.py test
./.venv/bin/python manage.py makemigrations --check --dry-run
```

独立したテスト用データベースを使うため、自分の記事は変更されません。空の一覧、リンク、404、slug の一意性、並び順、サンプルの再作成、管理画面での追加・編集・削除、CSRF、危険な HTML の除去を確認します。外部サービスは呼び出しません。

## 7. よくある問題

- `No module named django`：インストールと実行の両方で `.venv` の Python を使います。
- `no such table`：`manage.py` があるフォルダーで `migrate` を実行します。
- 記事が表示されない：`seed_demo` を実行するか、管理画面で記事を追加します。
- ポートが使用中：`runserver 127.0.0.1:8001` を使い、ブラウザーの URL も 8001 に変更します。
- `manage.py` が見つからない：展開後の `mblog` に移動します。ZIP 内や親フォルダーから直接実行しないでください。
- 存在しない記事が 404 になる：正常です。slug は登録済みの記事と一致する必要があります。

## 8. 利用範囲と参考資料

本プロジェクトはローカル学習用で、`DEBUG=True` と公開の練習用 SECRET_KEY を使います。公開時には環境変数から独立した秘密鍵を読み込み、DEBUG を無効にし、正式な ALLOWED_HOSTS、HTTPS、静的ファイル配信、バックアップ、WSGI/ASGI サーバーを設定してください。`runserver` は本番用ではありません。データベース、仮想環境、秘密情報は Git に登録しません。GitHub Pages は教材とファイルを提供し、Django 自体は実行しません。

- [日本語の教材](https://minhuangyuntech.github.io/oo2026/ja/django-case/)
- [Django 5.2 チュートリアル](https://docs.djangoproject.com/ja/5.2/intro/tutorial02/)
- [nh3 ドキュメント](https://nh3.readthedocs.io/en/latest/)
- [Bootstrap のダウンロードとライセンス](https://getbootstrap.com/docs/5.3/getting-started/download/)
