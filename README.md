# 物件導向程式設計 2026

以 Python 為主要實作語言的 18 週物件導向程式設計教材網站。

第 1–6、8 週、GUI 入門、Django 網站入門、Pygame 射擊遊戲與翻牌配對已依最新版投影片同步，提供繁體中文、英文與日文完整網頁教材，共 393 個原始投影片主題、1179 個語言版本主題。第 7、9–18 週保留原有中文教材與網址。

兩種遊戲另有獨立的三語「變數與物件屬性」網頁補充教材，位於各語言 `/pygame/#variables` 與 `/memory/#variables`。內容涵蓋設定值、物件屬性、參數、區域變數、參照關係與單步狀態，附變數搜尋及檔案／類別索引；教材上方、閱讀目錄、遊戲頁皆有入口。

此補充內容由 `content/game-variables.json` 維護，文字陣列依序為中文、英文、日文；`app/components/variable-reference.tsx` 呈現。它獨立於投影片來源及同步腳本，更新時不需重新產生 PPTX 或範例 ZIP。`scripts/check_export.py` 會驗證六份變數說明、翻譯、入口和錨點。

- 中文：`/`、`/week/1/` 至 `/week/6/`、`/gui/`、`/django/`
- 英文：`/en/`、`/en/week/1/` 至 `/en/week/6/`、`/en/gui/`、`/en/django/`
- 日文：`/ja/`、`/ja/week/1/` 至 `/ja/week/6/`、`/ja/gui/`、`/ja/django/`

新版包含章節目錄、頁內搜尋、程式碼複製、可跨語言保留位置的切換、瀏覽器端閱讀進度、行動版導覽、列印版面與教材下載。網站不要求登入；閱讀進度只保存在目前瀏覽器。

## 教材來源

| 週次 | 最新來源 | 原始投影片 |
| --- | --- | --- |
| 1 | 課程說明・網站校正版 | 中、英、日各 23 頁 |
| 2 | Python 語法完整複習；日文 v4 | 中、英、日各 67 頁 |
| 3 | 類別、物件與物件模型；英、日文 v2 | 中、英、日各 40 頁 |
| 4 | 封裝與資訊隱藏・Django 版 | 中文 56 頁；網頁另補英、日文 |
| 5–6 | 生命週期與 UML・學生版 UML 加強版 | 中文 30 頁；第 5 週 1–11 頁、第 6 週 12–30 頁 |
| 8 | 多型、抽象化與介面；射擊遊戲延伸 | 中、英、日各 32 頁，含 ABC、Protocol、移動策略與可執行下載包 |
| GUI | 五種常見做法・學生版 v2 | 中文 32 頁；五個工具家族與六個可執行範例 |
| Django | 網站建立與專案檔案解析；中文 v3、英文 v2、日文 v3 | 各語言 53 頁，含對應語言的商品目錄專案 |
| Pygame | 射擊遊戲、類別與物件觀察 | 中、英、日各 33 頁；第 31–33 頁為線上版連結、操作與暫停範例 |
| 翻牌配對 | Card、Board、Game 的狀態與參照 | 中、英、日各 27 頁，含線上遊戲、類別圖、物件圖、單步範例；第 19–27 頁補充 Pygame 安裝、操作、事件與繪圖程式碼 |

`content/source-manifest.json` 記錄完整原始檔名、下載檔名、頁數與 SHA-256。第 1–3 週英日文取自既有翻譯投影片，第 4 週翻譯位於 `content/week4-translations.json`。程式碼保留來源縮排，投影片片段不一律視為可獨立執行的程式。

`content/slide-sources.json` 是原始投影片可見文字、表格與程式碼的結構化擷取；`scripts/sync_materials.py` 將其轉為 `content/lessons.json`。第 4 週四張機制示意圖重製為有文字內容、可縮放的網頁流程圖。

`public/materials/` 提供 24 份 PPTX，以及第 3、4、5–6、8 週、GUI、Django、Pygame 和翻牌配對的十個範例 ZIP。第 4 週 ZIP 另加入 `django_product_demo.py` 和三語操作說明，對應最新投影片 47–50 頁；原本的 `slide_XX.py` 檔名保留舊版頁碼，下載包已說明差異。

新增單元的原始擷取、完整英日文翻譯與來源雜湊位於 `content/additional-slide-sources.json`、`content/additional-translations.json`、`content/additional-source-manifest.json`。`scripts/sync_additional.py` 由主同步腳本呼叫，保留 Python 縮排並區分 PowerShell 命令。8 張參考／UML 圖以可縮放 SVG 重製，5 張 GUI 操作畫面直接取自最新版投影片。第 5、6 週沿用原投影片頁碼，因此第 6 週從第 12 頁開始。

第 5–6 週及 GUI 的 ZIP 保留所有原始 Python 程式，README 改成學生用三語執行說明，並校正最新版頁碼。第 4–6 週與 GUI 的網頁完整三語；下載的原始投影片為中文。

Django 單元使用 `content/django-slide-sources.json`，由 `scripts/sync_django.py` 保留三語投影片內容與 12 張原始圖像。命令、目錄、Python、模板 HTML 與 CSS 分開顯示及複製。`content/django-example-sources.json` 保存三語完整範例，含補齊的本機 `config/settings.py`；打包時使用固定 ZIP 時間戳。每個語言專案有 24 個檔案，皆不含資料庫、虛擬環境或使用者資料。`content/django-source-manifest.json` 記錄三份原始投影片雜湊。

## 本機預覽

第 8 週新增 `/week/8/`、`/en/week/8/`、`/ja/week/8/`。共同來源是 `content/week8-slides.json`，`python scripts/sync_week8.py ../output` 同步三語網頁、32 頁 PPTX、範例 ZIP 與 `week8-source-manifest.json`。主同步腳本也會保留這個單元。

下載包 `materials/week-8-examples.zip` 包含原射擊遊戲與新 `WeavingEnemy`、`StrategyEnemy`，以 `python demo_game.py --lang zh` 執行；另有 ABC／Protocol 範例、三種 Motion、三語 README 和離線 HTML。C 切換既有策略敵人的直線／擺動方式，P 暫停，N 單步。瀏覽器射擊遊戲維持原版。

`python scripts/check_week8_package.py` 驗證實際 ZIP 的 7 項行為測試、成功的型別檢查與刻意失敗的 `typing_error.py`。需要 pygame==2.6.1 與 mypy==2.4.0；GitHub Actions 也會執行。

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

## Pygame 瀏覽器遊戲

三語教材第八章（第 31–33 頁）包含各語言的遊戲網址、鍵盤／觸控操作與實際暫停畫面。範例追蹤 B01、B02 的共同 owner，以及單步後 B01.y 從 490.0 變為 479.7。`content/pygame-slides.json` 是共同內容來源；`python scripts/sync_pygame.py ../output` 同步三語網頁、PPTX、圖片、ZIP 與來源雜湊。ZIP 的三語 HTML 教材也收錄這三個主題。

課程首頁與 Pygame 教材皆有遊戲入口：`/pygame/play/`、`/en/pygame/play/`、`/ja/pygame/play/`。這是原 Pygame 範例的 TypeScript / Canvas 移植版，無須安裝 Python、套件或瀏覽器外掛。切換語言保留現有場景、分數、標籤設定與選取物件；重新整理網頁則重新開始。

- `app/game/engine.ts`：Actor、Player、Enemy、Bullet、Game 五個類別，沿用原遊戲座標、速度、射擊間隔、碰撞規則、HP、200 分目標與五種狀態。
- `app/game/draw.ts`：Canvas 畫面、物件標籤、碰撞範圍與選取子彈的 owner 連線。
- `app/game/text.ts`：中英日 UI 與事件翻譯。
- `app/components/shooter-game.tsx`：鍵盤、可長按的觸控按鈕、暫停、1/60 秒單步、物件檢視器及自動暫停。

點選畫面角色或使用物件下拉選單可暫停並選取物件。「載入觀察範例」建立含兩顆子彈的全新暫停場景。群組保存物件參照；`kill()` 移除群組成員，檢視器仍可保留被移除物件的參照，對應教材的生命週期說明。瀏覽器以 `L` 切換物件標籤，保留 `Tab` 作一般焦點導覽。

執行 `npm run test:game` 驗證物件身分、冷卻、移動、碰撞、計分、生命、暫停、單步、清除與勝敗。GitHub Actions 會在發布前自動執行。`scripts/check_export.py` 同時檢查三語遊戲頁面與首頁／教材入口。

## 翻牌配對與單步觀察

三語教材：`/memory/`、`/en/memory/`、`/ja/memory/`。遊戲網址為各教材路徑後加 `play/`。首頁與教材都有入口，遊戲免安裝，支援滑鼠、觸控與鍵盤。

- `app/memory/engine.ts`：Card、Board、Game 三個類別。12 張牌、6 組配對，以參照保存 first、second、pending。
- `app/components/memory-game.tsx`：一般遊玩、單步觀察、物件標籤、物件檢視器、方法呼叫記錄與固定範例。
- `app/memory/text.ts`：完整三語介面。切換語言保留遊戲狀態。
- `content/memory-slides.json`：三語投影片及網頁教材的共同內容來源。

一般模式翻兩張牌後按「確認這一回合」。單步模式選牌只保存 pending，按 N 或「下一步」依序翻牌、比較、結算。比較後 matched 仍為 false，結算才標記配對或蓋回。成功範例是 C01/C02，失敗範例是 C03/C04。載入範例建立固定棋盤並開啟觀察模式。L 切換標籤，下拉選單只更換檢視對象。

`python scripts/sync_memory.py ../output` 同步三語教材、27 頁 PPTX、6 張遊戲實照、6 張 SVG、ZIP 與 SHA-256 manifest。ZIP 包含 Pygame 視窗版、Python 模型與三語終端機、16 項模型／介面測試、TypeScript 模型及三語離線 HTML 教材。視窗版使用 Python 3.12、Pygame 2.6.1；原有模型與終端機版不需額外套件。

`npm run test:game` 同時執行射擊遊戲的 16 項測試與翻牌配對的 8 項測試。匯出檢查也驗證三語遊戲頁、教材入口、81 個翻牌配對主題、PPTX 內的遊戲超連結及範例 ZIP 中的模型。


下載 `materials/memory-oop-trilingual.zip`，解壓縮後在 `memory_oop` 執行：

```sh
python -m pip install -r requirements.txt
python pygame_app.py --lang zh --sample
python -m unittest discover -s tests -v
```

PygameApp 持有原有 Game，處理事件、縮放座標與繪圖。物件標籤用 L 切換，N 執行單步，M 切換模式，F1 / F2 開啟成功／失敗範例，1 / 2 / 3 切換語言並保留物件狀態。右鍵與方向鍵只切換檢視對象，Enter 選牌，Space 確認回合，Esc 結束。沒有計時器自動推進配對。隨附 Noto Sans CJK TC 字型及 SIL OFL 授權，可離線顯示中日文字。

`python scripts/check_memory_package.py` 從實際下載 ZIP 解壓縮，執行 6 項模型測試與 10 項 Pygame 介面測試；需先安裝 pygame==2.6.1。介面測試使用 SDL dummy driver，驗證事件、語言、縮放、單步與繪圖。GitHub Actions 發布前也會執行。
