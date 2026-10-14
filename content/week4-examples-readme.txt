Week 4 / 第四週 / 第4週 — Python + Django

Python 3.12+

中文
原始 Python 範例使用標準函式庫。執行 python slide_11.py。
契約測試：python -m unittest -v test_bank_account.py
新增 django_product_demo.py 對應最新版 Django 投影片第 47–50 頁。
安裝：python -m pip install "Django>=5.2,<5.3"
執行：python django_product_demo.py
範例使用 SQLite 記憶體資料庫，不需啟動網站或設定伺服器。
slide_XX.py 檔名沿用早期版投影片編號；新增示意圖後，頁碼已有調整。
可由程式內容對照主題；Django 範例使用明確的主題檔名。

English
The original Python examples use the standard library. Run python slide_11.py.
Contract tests: python -m unittest -v test_bank_account.py
django_product_demo.py covers slides 47–50 of the latest Django edition.
Install: python -m pip install "Django>=5.2,<5.3"
Run: python django_product_demo.py
It uses an in-memory SQLite database; no web server or external service is needed.
The original slide_XX.py names use the earlier edition's page numbers. Diagram
insertions changed those numbers. Match their code to the corresponding topic.

日本語
元の Python サンプルは標準ライブラリを使用します。実行：python slide_11.py
契約テスト：python -m unittest -v test_bank_account.py
django_product_demo.py は最新版のスライド 47〜50 に対応します。
インストール：python -m pip install "Django>=5.2,<5.3"
実行：python django_product_demo.py
メモリ上の SQLite を使うため、ウェブサーバーや外部サービスは不要です。
元の slide_XX.py は旧版のページ番号です。図の追加によって番号が変わったため、
コードの内容とトピックを照合してください。

Django output / 輸出 / 出力
80.00
ValidationError
150.00
20.00
IntegrityError
Database state preserved: 20.00
All Django contract checks passed.

The original error demonstrations catch expected exceptions. BankAccount is a
single-threaded in-memory model using integer units, not a production banking system.
