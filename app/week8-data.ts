export const week8Info = {
  zh:{title:"多型、抽象化與介面",summary:"延續射擊遊戲，從 update(dt) 的共同呼叫理解多型，並用 ABC、Protocol 與移動策略建立可替換的物件。",tag:"多型 · ABC · Protocol",outcomes:["追蹤動態繫結與覆寫方法","比較鴨子型別、抽象類別與 Protocol","以組合替換移動策略並檢查物件狀態"]},
  en:{title:"Polymorphism, abstraction & interfaces",summary:"Continue the shooter example: trace update(dt), compare ABCs and Protocols, and build replaceable objects with movement strategies.",tag:"Polymorphism · ABC · Protocol",outcomes:["Trace dynamic dispatch and overridden methods","Compare duck typing, abstract classes, and Protocols","Replace movement through composition and check object state"]},
  ja:{title:"多態性・抽象化・インターフェース",summary:"シューティングゲームの update(dt) を出発点に、ABC・Protocol・移動戦略を使って差し替え可能なオブジェクトを作ります。",tag:"多態性 · ABC · Protocol",outcomes:["動的ディスパッチとオーバーライドを追跡する","ダックタイピング・抽象クラス・Protocol を比較する","コンポジションで移動戦略を替え、状態を確かめる"]}
};
export const week8Ranges = [[1,4],[5,10],[11,13],[14,16],[17,22],[23,27],[28,32]];
export const week8Chapters = {
  zh:["原遊戲與共同責任","多型、覆寫與動態繫結","鴨子型別與介面契約","抽象類別 ABC","Protocol 與型別檢查","組合與移動策略","觀察、執行與練習"],
  en:["The original game and shared responsibilities","Polymorphism, overriding, and dispatch","Duck typing and interface contracts","Abstract base classes","Protocols and type checking","Composition and movement strategies","Observe, run, and practice"],
  ja:["元のゲームと共通の役割","多態性・オーバーライド・ディスパッチ","ダックタイピングと契約","抽象基底クラス ABC","Protocol と型検査","コンポジションと移動戦略","観察・実行・演習"]
};
export const week8ResourceNote = {
  zh:"各語言提供 32 頁學生版投影片。ZIP 包含可執行的 Pygame 第 8 週版本、ABC／Protocol 小範例、移動策略、測試與三語說明。線上遊戲為原版射擊遊戲，新增策略請執行下載包。",
  en:"Each language has a 32-slide student deck. The ZIP includes the Week 8 Pygame game, small ABC/Protocol examples, movement strategies, tests, and trilingual instructions. The browser game remains the original shooter; run the download for the new strategies.",
  ja:"各言語に学生用の 32 枚のスライドを用意しています。ZIP には第 8 週の Pygame 版、ABC／Protocol の例、移動戦略、テスト、3 言語の説明が入っています。ブラウザー版は元のゲームです。新戦略はダウンロード版で実行してください。"
};
