export const databaseInfo = {
  zh: {
    title: "用 Python 直接存取 SQLite 與 MongoDB",
    summary: "用三筆讀書紀錄練習 SQL、交易與文件查詢，再用 Python 比較 SQLite 與 MongoDB 的結果。",
    tag: "資料庫 · SQL 與 NoSQL",
    outcomes: ["依查詢需求比較關聯式與文件模型", "用 SQL 篩選、分組、接合並修改資料", "用 sqlite3 與 PyMongo 執行並核對同一組練習"],
  },
  en: {
    title: "Working with SQLite and MongoDB in Python",
    summary: "Use three reading sessions to learn SQL, transactions and document queries, then compare the results from SQLite and MongoDB in Python.",
    tag: "Databases · SQL and NoSQL",
    outcomes: ["Compare relational and document models for a query", "Filter, group, join and update records with SQL", "Run the same exercise with sqlite3 and PyMongo and check the results"],
  },
  ja: {
    title: "Python で SQLite と MongoDB を操作する",
    summary: "3 件の読書記録を使って SQL、トランザクション、ドキュメント検索を学び、Python で SQLite と MongoDB の結果を比較します。",
    tag: "データベース · SQL と NoSQL",
    outcomes: ["検索の目的に応じて関係モデルとドキュメントモデルを比較する", "SQL で抽出・集計・結合・更新を行う", "sqlite3 と PyMongo で同じ課題に取り組み、結果を確かめる"],
  },
};

export const databaseRanges = [[1,6],[7,15],[16,19],[20,28],[29,32],[33,40],[41,51],[52,58]];
export const databaseChapters = {
  zh: ["資料庫與關聯模型","NoSQL 與模型比較","讀書紀錄與環境準備","SQL 建表與查詢","SQL 更新與交易","Python 與 SQLite","Python 與 MongoDB","觀念對照、排錯與練習"],
  en: ["Database and relational fundamentals","NoSQL and model comparisons","Reading log and setup","Creating tables and querying with SQL","SQL updates and transactions","SQLite with Python","MongoDB with Python","Comparison, troubleshooting and review"],
  ja: ["データベースと関係モデル","NoSQL とモデルの比較","読書記録と環境の準備","SQL のテーブル作成と検索","SQL の更新とトランザクション","Python と SQLite","Python と MongoDB","比較・トラブルシューティング・演習"],
};
export const databaseResourceNote = {
  zh: "下載本語言的 58 頁投影片與讀書紀錄範例。解壓縮後，先執行 python run_sql_lab.py，再依 README 執行 SQLite 與 MongoDB 練習。",
  en: "Download the 58 slides and reading-log examples in English. Extract the ZIP, run python run_sql_lab.py, then follow the README for the SQLite and MongoDB labs.",
  ja: "日本語のスライド全 58 枚と読書記録のサンプルです。ZIP を展開し、まず python run_sql_lab.py を実行してから、README に沿って SQLite と MongoDB の演習に進んでください。",
};
