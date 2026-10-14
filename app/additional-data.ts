export const extraInfo = {
  zh: [
    {title:"物件生命週期與記憶體模型",summary:"用參考、複製與可達性理解 Python 物件，並以 with 管理資源。",tag:"生命週期",outcomes:["區分相等、身分、修改與重新繫結","判讀淺複製與深複製的共享範圍","理解 del、回收機制與資源釋放"]},
    {title:"類別關係與 UML 類別圖",summary:"閱讀 UML 符號與多重性，從選課與訂單案例連結設計圖和 Python 狀態。",tag:"UML · 類別關係",outcomes:["閱讀類別圖、物件圖與關係符號","區分關聯、依賴、聚合、組合與一般化","以多重性和責任設計選課與訂單模型"]}
  ],
  en: [
    {title:"Object lifecycle & the memory model",summary:"Understand Python objects through references, copying, and reachability, and manage resources with with.",tag:"Object lifecycle",outcomes:["Distinguish equality, identity, mutation, and rebinding","Trace sharing in shallow and deep copies","Understand del, collection, and resource release"]},
    {title:"Class relationships & UML class diagrams",summary:"Read UML notation and multiplicities, connecting enrollment and order diagrams to Python state.",tag:"UML · Relationships",outcomes:["Read class diagrams, object diagrams, and relationship symbols","Distinguish association, dependency, aggregation, composition, and generalization","Model enrollment and orders through multiplicities and responsibilities"]}
  ],
  ja: [
    {title:"ライフサイクルとメモリモデル",summary:"参照・コピー・到達可能性から Python のオブジェクトを理解し、with でリソースを管理します。",tag:"ライフサイクル",outcomes:["等価性・同一性・変更・再束縛を区別する","浅いコピーと深いコピーの共有範囲を理解する","del・回収機構・リソース解放を理解する"]},
    {title:"クラス間の関係と UML クラス図",summary:"UML の記法と多重度を読み、履修登録と注文の例で設計図と Python の状態を結び付けます。",tag:"UML · クラス間の関係",outcomes:["クラス図・オブジェクト図・関係の記号を読む","関連・依存・集約・コンポジション・汎化を区別する","多重度と責任から履修登録と注文をモデル化する"]}
  ]
};
export const guiInfo = {
  zh:{title:"Python 桌面 GUI 入門",summary:"認識 Tkinter、Qt、wxPython、Kivy 與 Dear PyGui，從環境安裝到按鈕計數器，掌握視窗、版面與事件。",tag:"GUI · 五種工具",outcomes:["比較五種桌面 GUI 工具的特性","建立環境並執行六個獨立計數器範例","理解事件迴圈、callback 與畫面更新"]},
  en:{title:"Python desktop GUI essentials",summary:"Explore Tkinter, Qt, wxPython, Kivy, and Dear PyGui. Go from installation to button counters, windows, layouts, and events.",tag:"GUI · Five toolkits",outcomes:["Compare five desktop GUI toolkit families","Set up an environment and run six independent counter examples","Understand event loops, callbacks, and display updates"]},
  ja:{title:"Python デスクトップ GUI 入門",summary:"Tkinter・Qt・wxPython・Kivy・Dear PyGui を紹介します。環境構築からカウンター作成まで、画面・配置・イベントを学びます。",tag:"GUI · 五つのツール",outcomes:["五つのデスクトップ GUI ツール群を比較する","環境を作り、六つの独立したカウンターを実行する","イベントループ・callback・表示更新を理解する"]}
};
export const extraRanges = [[[1,4],[5,6],[7,9],[10,11]],[[12,16],[17,20],[21,23],[24,25],[26,30]]];
export const guiRanges = [[1,5],[6,9],[10,14],[15,18],[19,22],[23,26],[27,30],[31,32]];
export const extraChapters = {
  zh:[["參考、身分與修改","淺複製與深複製","生命週期與資源管理","共享範圍練習"],["UML 入門與圖種","關係、方向與擁有規則","組合、多重性與 Python","選課模型與狀態","訂單練習與整合"]],
  en:[["References, identity & mutation","Shallow and deep copies","Lifecycle & resource management","Shared-data exercise"],["UML basics & diagram types","Relationships, direction & ownership","Composition, multiplicity & Python","Enrollment model & state","Order exercise & review"]],
  ja:[["参照・同一性・変更","浅いコピーと深いコピー","ライフサイクルとリソース管理","共有範囲の演習"],["UML の基本と図の種類","関係・方向・所有規則","コンポジション・多重度・Python","履修モデルと状態","注文の演習と振り返り"]]
};
export const guiChapters = {
  zh:["工具比較與環境","Tkinter／ttk","Qt：PySide6 與 PyQt6","wxPython","Kivy","Dear PyGui","API 比較與問題排除","完整範例與官方文件"],
  en:["Toolkits & environment","Tkinter / ttk","Qt: PySide6 & PyQt6","wxPython","Kivy","Dear PyGui","API comparison & troubleshooting","Complete examples & documentation"],
  ja:["ツール比較と環境","Tkinter / ttk","Qt：PySide6 と PyQt6","wxPython","Kivy","Dear PyGui","API 比較とトラブル対処","完全な例と公式資料"]
};
