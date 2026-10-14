第 5、6 週 Python 範例 / Weeks 5–6 examples / 第5・6週のサンプル

繁體中文
Python 3.12+，僅使用標準函式庫。每個 .py 可獨立執行。
在此資料夾執行：python 03_copy.py（Windows 也可用 py -3.12）。
04_resource.py 會在目前資料夾建立或覆寫 lesson_note.txt。
對應最新版「學生版 UML 加強版」原投影片頁碼：
01_identity.py — 3：== 與 is
02_mutation.py — 4：修改與重新繫結
03_copy.py — 6：淺複製與深複製
04_resource.py — 9：with 與資源
05_exercise.py — 10–11：共享範圍
06_relationships.py — 19：關聯與依賴
07_composition.py — 21：del 與外部參考
08_enrollment.py — 25：選課資料與成績
07 展示物件仍可由外部參考取得，並未實作完整的領域刪除規則。
08 是簡化的記憶體模型，未強制所有型別、禁止屬性重綁或防止重複選課。

English
Python 3.12+; standard library only. Each .py file runs independently.
From this folder: python 03_copy.py (or py -3.12 on Windows).
04_resource.py creates or overwrites lesson_note.txt in the current folder.
Source slide numbers in the latest student UML edition:
01_identity.py — 3: equality and identity
02_mutation.py — 4: mutation and rebinding
03_copy.py — 6: shallow and deep copies
04_resource.py — 9: with and resources
05_exercise.py — 10–11: shared nested data
06_relationships.py — 19: association and dependency
07_composition.py — 21: del and external references
08_enrollment.py — 25: enrollment data and scores
07 demonstrates reachability through an external reference; it is not a complete implementation of domain deletion rules.
08 is an in-memory example, without full type validation, protection against rebinding, or duplicate-enrollment prevention.

日本語
Python 3.12+ と標準ライブラリだけを使用します。各 .py は単独で実行できます。
このフォルダで python 03_copy.py を実行します（Windows では py -3.12 も使用可能）。
04_resource.py は現在のフォルダで lesson_note.txt を作成または上書きします。
最新版の学生用 UML 教材のスライド番号：
01_identity.py — 3：等価性と同一性
02_mutation.py — 4：変更と再束縛
03_copy.py — 6：浅いコピーと深いコピー
04_resource.py — 9：with とリソース
05_exercise.py — 10–11：入れ子データの共有
06_relationships.py — 19：関連と依存
07_composition.py — 21：del と外部参照
08_enrollment.py — 25：履修登録と成績
07 は外部参照からの到達可能性を示し、業務上の完全な削除規則は実装していません。
08 はメモリ内の簡略例で、完全な型検査、属性の再束縛の禁止、重複登録の防止は行いません。

Expected output / 預期輸出 / 期待する出力
01: True / False / True
02: ['book', 'pen']
03: ['book', 'pen'] / ['book'] / False True
04: False / True
05: [[1, 9], [2]] / [[1, 9], [2], [3]] / [1, 9]
06: Amy
07: 1
08: Amy OOP 90 / Bob None / True / 1
( / separates output lines / 分隔輸出行 / 出力行の区切り )

https://docs.python.org/3.12/reference/datamodel.html
https://docs.python.org/3.12/library/copy.html
https://www.omg.org/spec/UML/2.5.1
