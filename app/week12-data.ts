export const week12Info = {
  zh:{title:"物件導向分析與設計 × AI 輔助開發",summary:"從實驗室環境監測站的模糊需求出發，走過使用者故事、領域模型、CRC 卡、循序圖與介面設計，再以「規格 → 測試 → AI 實作 → 審查」完成功能。",tag:"OOA · OOD · AI 協作",outcomes:["把模糊需求整理成使用者故事、驗收條件與領域模型","用 CRC 卡、循序圖與介面分配職責，避免什麼都做的類別","以測試為合約讓 AI 實作，並能解釋與驗證結果"]},
  en:{title:"Object-oriented analysis & design × AI-assisted development",summary:"Start from vague requirements for a lab monitoring station. Work through user stories, a domain model, CRC cards, sequence diagrams, and interfaces, then build features with spec → tests → AI implementation → review.",tag:"OOA · OOD · AI collaboration",outcomes:["Turn vague requirements into user stories, acceptance criteria, and a domain model","Assign responsibilities with CRC cards, sequence diagrams, and interfaces; avoid god classes","Use tests as the contract for AI implementation, then explain and verify the results"]},
  ja:{title:"オブジェクト指向分析・設計 × AI支援開発",summary:"実験室環境モニタリングステーションのあいまいな要求から出発し、ユーザーストーリー、ドメインモデル、CRCカード、シーケンス図、インターフェースを経て、「仕様 → テスト → AI実装 → レビュー」で機能を完成させます。",tag:"OOA · OOD · AIとの協働",outcomes:["あいまいな要求をユーザーストーリー、受け入れ条件、ドメインモデルに整理する","CRCカード、シーケンス図、インターフェースで責務を割り当て、何でも屋クラスを避ける","テストを契約として AI に実装させ、結果を説明・検証する"]}
};
export const week12Ranges = [[1,8],[9,18],[19,25],[26,31],[32,37],[38,46],[47,53],[54,62],[63,67],[68,75],[76,81],[82,89]];
export const week12Chapters = {
  zh:["從「有類別圖」到「沒有類別圖」","需求整理：使用者故事與使用案例","從名詞與動詞找候選類別","CRC 卡與情境演練","AI 第一次介入：對照分析","職責分配","循序圖","用介面隔開會變的部分","AI 設計找碴","AI 輔助開發流程","示範：用測試驅動 AI","實作練習"],
  en:["From having a class diagram to having none","Requirements: user stories and use cases","Finding candidate classes from nouns and verbs","CRC cards and scenario role-play","First AI step: comparing analyses","Assigning responsibilities","Sequence diagrams","Hiding what changes behind interfaces","Spot the flaws in an AI design","AI-assisted development workflow","Demo: driving AI with tests","Hands-on exercises"],
  ja:["「クラス図あり」から「クラス図なし」へ","要求の整理：ユーザーストーリーとユースケース","名詞と動詞から候補クラスを見つける","CRCカードとシナリオ・ロールプレイ","AIの初登場：比較分析","責務の割り当て","シーケンス図","インターフェースで変わる部分を切り離す","AI設計の問題探し","AI支援開発の流れ","デモ：テストでAIを駆動する","実装演習"]
};
export const week12ResourceNote = {
  zh:"各語言提供 89 頁投影片，含參考答案頁與備忘稿中的教師提示。ZIP 為範例專案 lab_monitor：主程式與 27 項測試、練習 A／B 起始檔、AI 設計找碴檔案、docs/ 需求與設計範本及 AGENTS.md，另附英日文 README。只使用標準函式庫，測試需 pytest，型別檢查需 mypy。",
  en:"Each language has an 89-slide deck, including the sample-answer slides and instructor notes. The ZIP contains the lab_monitor sample project: the main program with 27 tests, starter files for Exercises A and B, the spot-the-flaws file, requirement and design templates in docs/, AGENTS.md, and English and Japanese READMEs. The code uses only the standard library; tests need pytest and type checks need mypy. Code comments and documents are in Chinese.",
  ja:"各言語に 89 枚のスライドを用意しています。解答例のスライドとノートの教員向けメモも含みます。ZIP はサンプルプロジェクト lab_monitor です。本体と 27 個のテスト、演習A・B の開始ファイル、AI設計の問題探しのファイル、docs/ の要求・設計テンプレート、AGENTS.md、英語・日本語の README が入っています。標準ライブラリのみを使い、テストには pytest、型チェックには mypy が必要です。コメントとドキュメントは中国語です。"
};
