# 物件導向程式設計 2026

以 Python 為主要實作語言的 18 週物件導向程式設計教材網站。

第 1–4 週已依最新版投影片同步，提供繁體中文、英文與日文完整網頁教材，共 186 個原始投影片主題、558 個語言版本主題。第 5–18 週保留原有中文教材與網址。

- 中文：`/`、`/week/1/` 至 `/week/4/`
- 英文：`/en/`、`/en/week/1/` 至 `/en/week/4/`
- 日文：`/ja/`、`/ja/week/1/` 至 `/ja/week/4/`

新版包含章節目錄、頁內搜尋、程式碼複製、可跨語言保留位置的切換、瀏覽器端閱讀進度、行動版導覽、列印版面與教材下載。網站不要求登入；閱讀進度只保存在目前瀏覽器。

## 教材來源

| 週次 | 最新來源 | 原始投影片 |
| --- | --- | --- |
| 1 | 課程說明・網站校正版 | 中、英、日各 23 頁 |
| 2 | Python 語法完整複習；日文 v4 | 中、英、日各 67 頁 |
| 3 | 類別、物件與物件模型；英、日文 v2 | 中、英、日各 40 頁 |
| 4 | 封裝與資訊隱藏・Django 版 | 中文 56 頁；網頁另補英、日文 |

`content/source-manifest.json` 記錄完整原始檔名、下載檔名、頁數與 SHA-256。第 1–3 週英日文取自既有翻譯投影片，第 4 週翻譯位於 `content/week4-translations.json`。程式碼保留來源縮排，投影片片段不一律視為可獨立執行的程式。

`content/slide-sources.json` 是原始投影片可見文字、表格與程式碼的結構化擷取；`scripts/sync_materials.py` 將其轉為 `content/lessons.json`。第 4 週四張機制示意圖重製為有文字內容、可縮放的網頁流程圖。

`public/materials/` 提供 10 份原始 PPTX 與第 3、4 週的範例 ZIP。第 4 週 ZIP 另加入 `django_product_demo.py` 和三語操作說明，對應最新投影片 47–50 頁；原本的 `slide_XX.py` 檔名保留舊版頁碼，下載包已說明差異。

## 本機預覽

```bash
npm ci
npm run dev
```

## 靜態建置

```bash
GITHUB_ACTIONS=true npm run build
python scripts/check_export.py
npm run lint
```

推送至 `main` 分支後，GitHub Actions 會自動建置並發布至 GitHub Pages。

Node.js 需 22.13+；Python 檢查工具需 3.12+。PowerShell 建置時先使用 `$env:GITHUB_ACTIONS='true'`，再執行 `npm run build`，以驗證正式 `/oo2026` 路徑。一般 `npm run dev` 不加此前綴。

重新整理教材資料（第二個參數是原始教材所在目錄）：

```bash
python scripts/sync_materials.py ../output
```

檢查工具驗證三語頁面、主題完整性、下載檔案雜湊、站內連結、錨點、靜態資產、原始程式行及 Python 語法。Django 範例另以 5.2.x 執行驗證；帳戶範例沿用其 13 項公開契約測試。
