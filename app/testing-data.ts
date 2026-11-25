export const testingInfo = {
  zh:{title:"Python 程式測試：原理與方法",summary:"從「怎麼證明程式是對的」出發，理解 assert、測試結構與測試框架的運作，再用 unittest 與 pytest 為成績簿類別寫出可以重複執行的測試。",tag:"單元測試 · unittest · pytest",outcomes:["說明測試框架如何收集、執行與回報測試，並用 AAA 結構寫出測試","用 unittest 的 TestCase、setUp 與 assert 方法測試類別","用 pytest 的 assert、fixture、parametrize 與 pytest.raises 寫出精簡的測試"]},
  en:{title:"Testing Python programs: principles & methods",summary:"Start from “How do you show that a program is correct?” Understand assert, test structure, and how test frameworks work, then write repeatable tests for a grade book class with unittest and pytest.",tag:"Unit testing · unittest · pytest",outcomes:["Explain how a test framework collects, runs, and reports tests, and write tests in the AAA structure","Test a class with unittest’s TestCase, setUp, and assert methods","Write concise tests with pytest’s assert, fixtures, parametrize, and pytest.raises"]},
  ja:{title:"Python プログラムのテスト：原理と方法",summary:"「プログラムが正しいことをどう示すか」から出発し、assert、テストの構造、テストフレームワークの仕組みを理解したうえで、unittest と pytest で成績簿クラスの繰り返し実行できるテストを書きます。",tag:"単体テスト · unittest · pytest",outcomes:["テストフレームワークがテストを収集・実行・報告する仕組みを説明し、AAA の構造でテストを書く","unittest の TestCase、setUp、assert メソッドでクラスをテストする","pytest の assert、fixture、parametrize、pytest.raises で簡潔なテストを書く"]}
};
export const testingRanges = [[1,5],[6,14],[15,20],[21,30],[31,35]];
export const testingChapters = {
  zh:["為什麼要寫測試","測試的原理","unittest：標準函式庫的測試框架","pytest：更簡潔的測試框架","練習與總結"],
  en:["Why write tests","Principles of testing","unittest: the standard library’s test framework","pytest: a more concise test framework","Exercise and summary"],
  ja:["なぜテストを書くのか","テストの原理","unittest：標準ライブラリのテストフレームワーク","pytest：より簡潔なテストフレームワーク","演習とまとめ"]
};
export const testingResourceNote = {
  zh:"各語言提供 35 頁投影片，含參考答案頁與備忘稿中的教師提示。ZIP 為對應語言的成績簿範例專案：GradeBook 類別、迷你測試執行器、unittest 與 pytest 兩種寫法的測試，以及邊界值練習。主程式只用標準函式庫，測試需要 pytest。",
  en:"Each language has a 35-slide deck, including the sample-answer slide and instructor notes. The ZIP is the grade book sample project in the same language: the GradeBook class, a mini test runner, tests written with both unittest and pytest, and the boundary-value exercise. The program uses only the standard library; the tests need pytest.",
  ja:"各言語に 35 枚のスライドがあり、解答例のスライドとノートの教員向けメモも含みます。ZIP は同じ言語の成績簿サンプルプロジェクトです。GradeBook クラス、ミニテスト実行器、unittest と pytest の 2 通りで書いたテスト、境界値の演習が入っています。本体は標準ライブラリのみを使い、テストには pytest が必要です。"
};
