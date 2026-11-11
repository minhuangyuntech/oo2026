# mblog 部落格：安裝與執行

這是「Django 網站實作案例」第 1–88 頁的完整專案。包含文章列表、文章詳情、管理後台、共用模板、Bootstrap、靜態資源與經 nh3 清理的 Markdown。介面與示範文章採繁體中文；三語說明對應同一份程式。

## 1. 準備環境

安裝 Python 3.13 或 3.14（也支援 3.12），解壓縮 ZIP，進入包含 `manage.py` 的 `mblog` 資料夾。第一次安裝套件需要網路。使用 SQLite，不必安裝其他資料庫；不需要 AI 金鑰。

套件固定為 Django 5.2.18、Markdown 3.11.2、nh3 0.3.7，與教材一致。Bootstrap 5.3.8 已附在 `static/vendor/bootstrap/`，包含 MIT 授權；網站樣式不依賴 CDN。

## 2. Windows PowerShell

在解壓縮後的 `mblog` 資料夾開啟 PowerShell，依序執行：

```powershell
python --version
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py seed_demo
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

這裡直接使用虛擬環境中的 Python，不需要執行 Activate.ps1 或更改 PowerShell 執行原則。若 `python` 無法啟動已安裝的 Python，可將前兩行的 `python` 改為 `py -3.14`（或已安裝的版本）。

## 3. macOS / Linux

在同一個 `mblog` 資料夾開啟終端機：

```sh
python3 --version
python3 -m venv .venv
./.venv/bin/python -m pip install -r requirements.txt
./.venv/bin/python manage.py migrate
./.venv/bin/python manage.py seed_demo
./.venv/bin/python manage.py check
./.venv/bin/python manage.py runserver 127.0.0.1:8000
```

只需選擇適合自己作業系統的一組指令。Ubuntu / Debian 若提示缺少 venv，請安裝對應 Python 版本的 venv 套件，再重新建立環境。

## 4. 瀏覽網站與管理文章

保持終端機開啟，瀏覽：

- 首頁：<http://127.0.0.1:8000/>
- 第一篇文章：<http://127.0.0.1:8000/post/hello-django/>
- Markdown 範例：<http://127.0.0.1:8000/post/markdown-demo/>
- 管理後台：<http://127.0.0.1:8000/admin/>

按 `Ctrl+C` 停止伺服器，建立自己的管理員，再重新啟動：

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

自行設定帳號與密碼；輸入密碼時終端機不顯示字元是正常現象。專案沒有預設帳密。在後台的 Posts 新增或修改文章：`title` 是標題、`slug` 是唯一網址名稱（如 `my-first-post`）、`body` 支援 Markdown，`pub_date` 自動產生。中文標題若未自動產生 slug，請手動輸入英數字及連字號。

`seed_demo` 建立五篇缺少的示範文章，重複執行不會覆寫你修改過的內容，也不會建立使用者。首次下載不含資料庫；執行 `migrate` 後才會建立本機 `db.sqlite3`。下次只需執行 `runserver`，不必重新安裝或初始化。

## 5. 程式位置與教材對照

| 檔案 | 用途 | 投影片 |
|---|---|---|
| `mblog/settings.py` | App、模板、資料庫與靜態檔案設定 | 12–13、39、67 |
| `mysite/models.py`、`migrations/0001_initial.py` | Post 模型與資料表建立 | 22–25 |
| `mysite/admin.py` | 後台列表、搜尋、slug 預填 | 30 |
| `mblog/urls.py`、`mysite/urls.py`、`mysite/views.py` | 網址、首頁查詢、文章詳情與 404 | 38、40、47 |
| `templates/`、`static/` | 共用模板、文章畫面、CSS、Logo | 54–71、82 |
| `mysite/templatetags/markdown_extras.py` | Markdown 解析、HTML 允許清單與清理 | 79–80 |
| `mysite/management/commands/seed_demo.py` | 可重複執行的示範資料建立指令 | 下載專案附加工具 |
| `mysite/tests.py` | 網頁、資料約束、後台與 Markdown 測試 | 84 |

## 6. 執行測試

先停止開發伺服器。Windows：

```powershell
.\.venv\Scripts\python.exe manage.py test
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
```

macOS / Linux：

```sh
./.venv/bin/python manage.py test
./.venv/bin/python manage.py makemigrations --check --dry-run
```

測試使用獨立的測試資料庫，不會修改你的文章。確認空列表、文章連結、404、slug 唯一性、排序、重複匯入、後台新增修改刪除、CSRF 與危險 HTML 清理。測試不呼叫外部服務。

## 7. 常見問題

- `No module named django`：請用上面的 `.venv` Python 安裝套件及執行，不要混用系統 Python。
- `no such table`：在 `manage.py` 同層執行 `migrate`。
- 首頁沒有文章：執行 `seed_demo`，或登入後台新增文章。
- 埠號被占用：將 `runserver` 改成 `127.0.0.1:8001`，瀏覽器網址也改為 8001。
- `manage.py` 找不到：終端機所在目錄應是解壓縮後的 `mblog`，不要停在外層資料夾，也不要直接從 ZIP 執行。
- 未知的文章網址顯示 404：這是正常行為。slug 與文章資料必須相符。

## 8. 執行範圍與參考

此專案供本機學習，使用 `DEBUG=True` 與公開的本機練習 SECRET_KEY。公開部署前須更換獨立的環境變數金鑰、關閉 DEBUG、設定正式 ALLOWED_HOSTS、HTTPS、靜態檔案服務、資料備份及正式 WSGI/ASGI server；`runserver` 不是正式服務。不要提交自己的 `db.sqlite3`、虛擬環境或秘密資料。GitHub Pages 僅提供教材與下載，不執行 Django。

- [三語課程教材](https://minhuangyuntech.github.io/oo2026/django-case/)
- [Django 5.2 教學](https://docs.djangoproject.com/en/5.2/intro/tutorial02/)
- [nh3 文件](https://nh3.readthedocs.io/en/latest/)
- [Bootstrap 下載與授權](https://getbootstrap.com/docs/5.3/getting-started/download/)
