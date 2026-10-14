export type Language = "zh" | "en" | "ja";
export type BodyBlock = { type: string; text?: string; rows?: string[][] };
export type Slide = { number: number; title: string; body: BodyBlock[]; code?: string; output?: string };
export type Lesson = { source: string; slides: Slide[] };
export const locales: Language[] = ["zh", "en", "ja"];
export const languageNames = { zh: "繁體中文", en: "English", ja: "日本語" };
export const htmlLanguage = { zh: "zh-Hant", en: "en", ja: "ja" };
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export function coursePath(lang: Language, week?: number) {
  return `${lang === "zh" ? "" : `/${lang}`}${week ? `/week/${week}` : ""}/`;
}

export const ui = {
  zh: {
    course:"物件導向程式設計", school:"雲林科技大學 · 電子工程系", term:"115 學年度第 1 學期", instructor:"何敏煌", home:"課程總覽", materials:"學習教材", language:"語言", menu:"課程選單", close:"關閉", skip:"跳至主要內容", week:"第", weekSuffix:"週", chapters:"章節", slides:"投影片", source:"教材來源", download:"下載投影片", chineseSource:"下載中文原始投影片", examples:"Python 範例 ZIP", allWeeks:"完整課程大綱", later:"第 5–18 週", original:"中文教材", laterNote:"第 5–18 週沿用原有中文教材。", start:"開始學習", read:"閱讀教材", continue:"繼續學習", welcome:"从理解物件，走向設計系統。".replace("从","從"), intro:"以 Python 建立物件思維，透過程式範例、狀態觀察與設計實作，完成可測試、可重現的個人系統。", current:"第 1–4 週 · 三語教材", updated:"依最新投影片整理", topics:"個主題", reading:"章節目錄", search:"搜尋本週主題或程式碼", noResults:"找不到符合的主題，請試試其他關鍵字。", clear:"清除搜尋", copy:"複製程式碼", copied:"已複製", copyFailed:"請選取程式碼並複製", output:"輸出（依序）", code:"Python · 投影片程式片段", codeNote:"片段可能沿用前頁定義；完整範例見下載區。", mark:"標記本章已讀", done:"本章已讀", progress:"已讀章節", local:"閱讀進度儲存在此瀏覽器；三種語言共用進度。", prev:"上一週", next:"下一週", print:"列印／另存 PDF", resources:"教材下載與參考", resourceNote:"第 1–3 週提供各語言原始投影片；第 4 週網頁提供三語，原始投影片為中文。", footer:"Python · 物件模型 · 設計實作", top:"回到頁首", outline:"18 週學習路線", assessment:"課程評量", attendance:"出席及平時成績", midterm:"期中考試", project:"期末專題", individual:"個人專題", individualNote:"從真實問題出發，以物件責任、UML、測試與 README 完成系統交付。MiniClaw 是可選整合案例。", saved:"接續上次閱讀", refs:"技術參考", tocToggle:"展開章節目錄", chapter:"章節", sourceSlide:"原投影片", back:"返回課程總覽", latest:"最新版", key:"學習主線", translation:"中・英・日", scope:"第 1–4 週", credits:"教材：何敏煌 · 國立雲林科技大學", diagram:"概念流程", week4Note:"Django 範例使用 5.2；Python 範例使用 3.12+。", selectText:"按 Ctrl+C 或 ⌘C 複製選取內容。"
  },
  en: {
    course:"Object-Oriented Programming", school:"YunTech · Electronic Engineering", term:"Fall 2026", instructor:"Min-Huang Ho", home:"Course overview", materials:"Learning materials", language:"Language", menu:"Course menu", close:"Close", skip:"Skip to content", week:"Week", weekSuffix:"", chapters:"chapters", slides:"slides", source:"Source materials", download:"Download slides", chineseSource:"Download source slides (Chinese)", examples:"Python examples ZIP", allWeeks:"Full course outline", later:"Weeks 5–18", original:"Chinese materials", laterNote:"Weeks 5–18 link to the existing Chinese materials.", start:"Start learning", read:"Read lesson", continue:"Continue learning", welcome:"Understand objects. Design better systems.", intro:"Build an object-oriented mindset with Python. Explore working examples, observe state, and design an individual system that can be tested and reproduced.", current:"Weeks 1–4 · In three languages", updated:"Aligned with the latest slides", topics:"topics", reading:"On this page", search:"Search this week's topics or code", noResults:"No matching topics. Try another keyword.", clear:"Clear search", copy:"Copy code", copied:"Copied", copyFailed:"Select and copy the code", output:"Output (in order)", code:"Python · Slide excerpt", codeNote:"An excerpt may use definitions from earlier sections. Complete companion examples are available below.", mark:"Mark chapter as read", done:"Chapter read", progress:"Chapters read", local:"Reading progress is saved in this browser and shared across languages.", prev:"Previous week", next:"Next week", print:"Print / save PDF", resources:"Downloads and references", resourceNote:"Weeks 1–3 include original slides in each language. Week 4 has trilingual web content and Chinese source slides.", footer:"Python · Object models · Software design", top:"Back to top", outline:"The 18-week learning path", assessment:"Assessment", attendance:"Attendance & coursework", midterm:"Midterm exam", project:"Final project", individual:"Individual project", individualNote:"Solve a real problem using object responsibilities, UML, tests, and a reproducible README. MiniClaw is an optional integration example.", saved:"Resume your reading", refs:"Technical references", tocToggle:"Show chapter contents", chapter:"Chapter", sourceSlide:"Source slide", back:"Back to course overview", latest:"Latest edition", key:"Learning path", translation:"Chinese · English · Japanese", scope:"Weeks 1–4", credits:"Materials: Min-Huang Ho · National Yunlin University of Science and Technology", diagram:"Concept flow", week4Note:"Django examples use 5.2; Python examples use 3.12+.", selectText:"Press Ctrl+C or ⌘C to copy the selection."
  },
  ja: {
    course:"オブジェクト指向プログラミング", school:"雲林科技大学 · 電子工程系", term:"2026年度 前期", instructor:"何敏煌", home:"コース概要", materials:"学習教材", language:"言語", menu:"コースメニュー", close:"閉じる", skip:"本文へ移動", week:"第", weekSuffix:"週", chapters:"章", slides:"スライド", source:"元の教材", download:"スライドをダウンロード", chineseSource:"元のスライドをダウンロード（中国語）", examples:"Python サンプル ZIP", allWeeks:"全体のシラバス", later:"第5〜18週", original:"中国語教材", laterNote:"第5〜18週は既存の中国語教材にリンクしています。", start:"学習を始める", read:"教材を読む", continue:"学習を続ける", welcome:"オブジェクトを理解し、システムを設計する。", intro:"Python でオブジェクト指向の考え方を身につけます。コードの実行、状態の観察、設計を通して、テスト可能で再現可能な個人システムを完成させます。", current:"第1〜4週 · 3言語の教材", updated:"最新のスライドに準拠", topics:"トピック", reading:"このページの目次", search:"今週のトピックやコードを検索", noResults:"一致するトピックがありません。別のキーワードを試してください。", clear:"検索をクリア", copy:"コードをコピー", copied:"コピーしました", copyFailed:"コードを選択してコピー", output:"出力（順番）", code:"Python · スライドのコード抜粋", codeNote:"抜粋は前の節の定義を使う場合があります。完全なサンプルはダウンロード欄にあります。", mark:"この章を既読にする", done:"この章は既読", progress:"既読の章", local:"進捗はこのブラウザに保存され、3言語で共有されます。", prev:"前の週", next:"次の週", print:"印刷／PDF 保存", resources:"ダウンロードと参考資料", resourceNote:"第1〜3週は各言語の元のスライドを提供します。第4週のウェブ教材は3言語、元のスライドは中国語です。", footer:"Python · オブジェクトモデル · 設計実践", top:"ページの先頭へ", outline:"18週間の学習計画", assessment:"成績評価", attendance:"出席・平常成績", midterm:"中間試験", project:"最終プロジェクト", individual:"個人プロジェクト", individualNote:"実際の課題を選び、責任分担、UML、テスト、README で再現可能なシステムを作ります。MiniClaw は任意の統合例です。", saved:"前回の続きから読む", refs:"技術資料", tocToggle:"章の目次を表示", chapter:"章", sourceSlide:"元のスライド", back:"コース概要へ戻る", latest:"最新版", key:"学習の流れ", translation:"中国語・英語・日本語", scope:"第1〜4週", credits:"教材：何敏煌 · 国立雲林科技大学", diagram:"概念の流れ", week4Note:"Django の例は 5.2、Python の例は 3.12+ を使用します。", selectText:"Ctrl+C または ⌘C で選択範囲をコピーできます。"
  }
};

export const weekInfo = {
  zh: [
    {title:"課程介紹與程式設計典範",summary:"理解課程目標、三種程式設計典範與個人專題的完成路線。",tag:"課程起點",outcomes:["比較程序式、物件導向與函數式思考","掌握個人專題要求與評量方式","建立可測試、可重現的開發習慣"]},
    {title:"Python 語法完整複習",summary:"從基本語法、容器與函式，一路整理到模組、型別提示及非同步語法。",tag:"Python 基礎",outcomes:["掌握資料、控制流程、函式與參照","使用模組、檔案與例外處理","閱讀類別、型別提示與 async 程式"]},
    {title:"類別、物件與物件模型",summary:"從物件身分與狀態出發，釐清屬性歸屬、共享資料與三種方法。",tag:"物件模型",outcomes:["區分類別、實體與物件身分","理解 __new__、__init__ 與 self","選擇實體方法、類別方法與靜態方法"]},
    {title:"封裝與資訊隱藏",summary:"透過 property、集合邊界與 Django 商品模型，維持物件的合法狀態。",tag:"封裝 · Django",outcomes:["以公開介面維持類別不變條件","分析 property、descriptor 與共享參照","區分 Django 模型驗證與資料庫約束"]}
  ],
  en: [
    {title:"Course overview & programming paradigms",summary:"Explore the course goals, three programming paradigms, and the path to an individual project.",tag:"Getting started",outcomes:["Compare procedural, object-oriented, and functional thinking","Understand the project requirements and assessment","Build testable and reproducible development habits"]},
    {title:"A complete Python syntax review",summary:"From core syntax, containers, and functions to modules, type hints, and asynchronous code.",tag:"Python foundations",outcomes:["Work with data, control flow, functions, and references","Use modules, files, and exception handling","Read classes, type hints, and async code"]},
    {title:"Classes, objects & the object model",summary:"Explore identity and state, attribute ownership, shared data, and the three kinds of methods.",tag:"The object model",outcomes:["Distinguish classes, instances, and object identity","Understand __new__, __init__, and self","Choose instance, class, and static methods"]},
    {title:"Encapsulation & information hiding",summary:"Maintain valid object state through properties, collection boundaries, and a Django product model.",tag:"Encapsulation · Django",outcomes:["Maintain invariants through a public interface","Analyze properties, descriptors, and shared references","Distinguish Django validation from database constraints"]}
  ],
  ja: [
    {title:"コース紹介とプログラミングパラダイム",summary:"学習目標、三つのパラダイム、個人プロジェクトを完成させる流れを理解します。",tag:"学習の出発点",outcomes:["手続き型・オブジェクト指向・関数型を比較する","個人プロジェクトの要件と評価方法を理解する","テストと再現性を重視した開発習慣を身につける"]},
    {title:"Python 構文の総復習",summary:"基本構文、コンテナ、関数から、モジュール、型ヒント、非同期構文まで整理します。",tag:"Python の基礎",outcomes:["データ・制御フロー・関数・参照を理解する","モジュール・ファイル・例外処理を使う","クラス・型ヒント・async のコードを読む"]},
    {title:"クラス・オブジェクト・オブジェクトモデル",summary:"同一性と状態を出発点に、属性の所属、共有データ、三種類のメソッドを理解します。",tag:"オブジェクトモデル",outcomes:["クラス・インスタンス・同一性を区別する","__new__・__init__・self を理解する","インスタンス・クラス・静的メソッドを選ぶ"]},
    {title:"カプセル化と情報隠蔽",summary:"property、コレクションの境界、Django の商品モデルを通して正しい状態を維持します。",tag:"カプセル化 · Django",outcomes:["公開インターフェースで不変条件を維持する","property・ディスクリプタ・共有参照を分析する","Django の検証とデータベース制約を区別する"]}
  ]
};

// Stable source-slide ranges keep chapter links and progress aligned across languages.
export const chapterRanges = [
  [[1,6],[7,11],[12,16],[17,19],[20,23]],
  [[1,10],[11,15],[16,20],[21,28],[29,38],[39,43],[44,48],[49,52],[53,59],[60,64],[65,67]],
  [[1,8],[9,13],[14,18],[19,24],[25,30],[31,36],[37,40]],
  [[1,10],[11,17],[18,21],[22,28],[29,34],[35,41],[42,46],[47,50],[51,56]]
];
export const chapterNames = {
  zh:[
    ["課程目標與專題","典範與學習路線","專題交付與整合","工具與需求","評量與課程資源"],
    ["基礎語法與運算","字串與編碼","條件與迴圈","容器與推導式","函式、作用域與參照","迭代器、模組與環境","檔案與資料格式","例外與除錯","類別與物件語法","型別提示與非同步","整合與參考"],
    ["物件導向與物件模型","建立物件與 self","身分、狀態與屬性","類別資料與共享","三種方法的選擇","有效狀態與物件介面","整合與回顧"],
    ["介面、名稱與不變條件","Property 與驗證","唯讀與計算屬性","BankAccount 與完整操作","集合與共享參照","跨欄位規則與 descriptor","數值驗證與介面演進","Django 模型與資料庫約束","測試、回顧與參考"]
  ],
  en:[
    ["Course goals & the project","Paradigms & the learning path","Project delivery & integration","Tools & requirements","Assessment & resources"],
    ["Core syntax & operators","Strings & encoding","Conditions & loops","Containers & comprehensions","Functions, scope & references","Iterators, modules & environments","Files & data formats","Exceptions & debugging","Class & object syntax","Type hints & async","Integration & references"],
    ["OOP & the object model","Creating objects & self","Identity, state & attributes","Class data & sharing","Choosing between methods","Valid state & object interfaces","Integration & review"],
    ["Interfaces, names & invariants","Properties & validation","Read-only & computed properties","BankAccount & complete operations","Collections & shared references","Cross-field rules & descriptors","Numeric validation & interface evolution","Django models & database constraints","Tests, review & references"]
  ],
  ja:[
    ["学習目標とプロジェクト","パラダイムと学習計画","成果物とシステム統合","ツールと要件","評価とコース資料"],
    ["基本構文と演算子","文字列とエンコーディング","条件分岐とループ","コンテナと内包表記","関数・スコープ・参照","イテレータ・モジュール・環境","ファイルとデータ形式","例外とデバッグ","クラスとオブジェクトの構文","型ヒントと非同期処理","統合と参考資料"],
    ["オブジェクト指向とモデル","オブジェクト生成と self","同一性・状態・属性","クラスのデータと共有","三種類のメソッド","正しい状態とインターフェース","統合と振り返り"],
    ["インターフェース・名前・不変条件","Property と検証","読み取り専用と計算プロパティ","BankAccount と完全な操作","コレクションと共有参照","フィールド間の規則とディスクリプタ","数値検証とインターフェースの進化","Django モデルとデータベース制約","テスト・振り返り・参考資料"]
  ]
};
export const laterWeeks = {
  zh:["物件生命週期與記憶體模型","類別關係與 UML 類別圖","繼承與類別階層","多型、抽象化與介面","期中考試（筆試）","Python 進階物件導向機制","資料類別、泛型與型別設計","物件導向分析與設計","SOLID 與物件導向設計原則","設計模式與程式重構","Python 網站與資料庫應用（補充）","LLM 整合與 Linux 部署（補充）","系統整合與專題輔導","期末總結及專題要求"],
  en:["Object lifecycle & the memory model","Class relationships & UML diagrams","Inheritance & class hierarchies","Polymorphism, abstraction & interfaces","Midterm examination","Advanced Python OOP mechanisms","Dataclasses, generics & type design","Object-oriented analysis & design","SOLID & design principles","Design patterns & refactoring","Python web & database applications (supplement)","LLM integration & Linux deployment (supplement)","System integration & project review","Course review & final project requirements"],
  ja:["ライフサイクルとメモリモデル","クラス間の関係と UML クラス図","継承とクラス階層","多態性・抽象化・インターフェース","中間試験（筆記）","Python の高度なオブジェクト指向機構","データクラス・ジェネリクス・型設計","オブジェクト指向分析と設計","SOLID と設計原則","デザインパターンとリファクタリング","Python のウェブ・データベース応用（補足）","LLM 統合と Linux 配備（補足）","システム統合とプロジェクトレビュー","総復習と最終プロジェクトの要件"]
};
export function weekLabel(lang: Language, week: number) {
  return `${ui[lang].week} ${String(week).padStart(2,"0")} ${ui[lang].weekSuffix}`.trim();
}
