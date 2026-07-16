"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const weeks = [
  { week: 1, title: "課程介紹與程式設計典範", tag: "基礎", summary: "從 C 語言的程序式思維，踏入以物件、責任與協作為核心的設計世界。", topics: ["課程目標與評量方式", "程序式、物件導向、函數式典範", "個人專題說明"], practice: "比較同一個問題的程序式與物件導向解法。" },
  { week: 2, title: "Python 程式語言基礎複習", tag: "Python", summary: "快速補齊 Python 語法與執行模型，建立後續課程共同基礎。", topics: ["資料型別、運算子與控制流程", "函式、參數傳遞與容器", "C 與 Python 的語法及執行模式"], practice: "以函式與容器重寫一個 C 語言小程式。" },
  { week: 3, title: "類別、物件與物件模型", tag: "核心", summary: "理解類別如何描述物件，以及狀態與行為如何共同構成模型。", topics: ["類別、物件、狀態與行為", "建構子、self、實體與類別屬性", "實體、類別與靜態方法"], practice: "設計一個具備狀態與行為的 BankAccount 類別。" },
  { week: 4, title: "封裝與資訊隱藏", tag: "核心", summary: "用清楚且安全的介面保護物件狀態，維持類別不變條件。", topics: ["公開與非公開成員、名稱修飾", "Property、Getter 與 Setter", "類別不變條件與介面設計"], practice: "為帳戶類別加入餘額驗證與受控存取。" },
  { week: 5, title: "物件生命週期與記憶體模型", tag: "核心", summary: "釐清變數、參考與物件的關係，避開共享狀態與複製陷阱。", topics: ["物件建立、回收與參考", "Identity、Equality、可變與不可變", "Alias、淺層與深層複製"], practice: "觀察複合物件在淺複製與深複製後的差異。" },
  { week: 6, title: "類別關係與 UML 類別圖", tag: "建模", summary: "將物件之間的協作關係轉成可溝通、可檢查的視覺模型。", topics: ["關聯、聚合、組合與依賴", "類別責任與多重性", "UML 類別圖閱讀與繪製"], practice: "為選課系統繪製 UML 類別圖。" },
  { week: 7, title: "繼承與類別階層", tag: "核心", summary: "運用類別階層重用行為，同時理解多重繼承與解析順序。", topics: ["基底類別、衍生類別與覆寫", "super() 與 Is-a 關係", "多層、多重繼承與 MRO"], practice: "建立 Shape 階層並覆寫面積計算方法。" },
  { week: 8, title: "多型、抽象化與介面", tag: "核心", summary: "以共同介面替換具體實作，讓系統更容易擴充與測試。", topics: ["多型、動態繫結與鴨子型別", "抽象類別、抽象方法與 Protocol", "Type Hints；繼承與組合的選擇"], practice: "以不同付款方式實作相同的支付介面。" },
  { week: 9, title: "期中考試（筆試）", tag: "評量", summary: "整合前半學期的物件模型、關係、繼承、多型與 UML 知識。", topics: ["類別、物件與封裝", "生命週期、關係與繼承", "多型、抽象化與 UML"], practice: "完成概念題、程式閱讀與 UML 綜合題。" },
  { week: 10, title: "Python 進階物件導向機制", tag: "進階", summary: "讓自訂物件自然融入 Python 語言與迭代、生存期管理機制。", topics: ["特殊方法、運算子多載與字串表示", "可呼叫物件", "Iterator、Iterable、Generator、Context Manager"], practice: "實作可迭代的自訂集合與安全資源管理器。" },
  { week: 11, title: "資料類別、泛型與型別設計", tag: "進階", summary: "以資料類別與靜態型別工具改善介面表達力與可靠性。", topics: ["dataclass 與 Enum", "Generic、TypeVar 與 Protocol", "型別提示與靜態型別檢查"], practice: "建立型別安全的泛型 Repository。" },
  { week: 12, title: "物件導向分析與設計", tag: "設計", summary: "從需求文字辨識物件、責任與互動，逐步形成設計模型。", topics: ["候選物件、屬性、方法與責任", "CRC 卡與使用案例", "循序圖與分析模型轉換"], practice: "從租借系統需求產出 CRC 卡與循序圖。" },
  { week: 13, title: "SOLID 與物件導向設計原則", tag: "設計", summary: "以高內聚、低耦合的原則，讓程式碼能面對需求變化。", topics: ["SRP、OCP、LSP、ISP、DIP", "Tell–Don’t–Ask", "Favor Composition over Inheritance"], practice: "辨識違反 SOLID 的程式碼並提出改寫。" },
  { week: 14, title: "設計模式與程式重構", tag: "設計", summary: "使用模式解決常見設計問題，並以測試保護重構過程。", topics: ["Factory、Strategy、Observer、Adapter", "Code Smell、例外處理與重構", "依賴注入、單元測試與 Mock"], practice: "將條件分支重構為 Strategy，並補上單元測試。" },
  { week: 15, title: "Python 網站與資料庫應用（補充）", tag: "整合", summary: "把領域模型放進網站架構，連接路由、表單、資料庫與 CRUD。", topics: ["URL、View、Template 與表單", "ORM 與 CRUD", "Domain Model、Service、Repository"], practice: "規劃一個分層式網站功能的物件協作。" },
  { week: 16, title: "LLM 整合與 Linux 部署（補充）", tag: "整合", summary: "將外部 AI 能力包裝為可替換服務，並掌握基本部署流程。", topics: ["LLM Provider／Service 設計", "API 與 Ollama 基本整合", "環境變數、Git、虛擬環境與 Linux"], practice: "以 Provider 介面隔離雲端 API 與本機模型。" },
  { week: 17, title: "物件導向系統整合與專題輔導", tag: "專題", summary: "用 UML、SOLID、模式與測試全面檢視個人專題品質。", topics: ["類別責任與物件關係", "系統架構與可維護性", "測試、重構與成果輔導"], practice: "進行專題設計審查並完成改善清單。" },
  { week: 18, title: "期末總結及期末專題要求說明", tag: "評量", summary: "收束核心概念，確認專題功能、文件、測試與成果繳交規範。", topics: ["物件導向核心概念總結", "專題功能與物件導向要求", "文件、測試、部署與評分標準"], practice: "完成專題展示、文件與自我檢核。" },
];

const phases = [
  { range: "01—05", title: "建立物件思維", copy: "從語法回顧開始，掌握類別、封裝與記憶體模型。" },
  { range: "06—11", title: "組織可替換的系統", copy: "運用關係、繼承、多型與 Python 進階機制。" },
  { range: "12—18", title: "分析、設計與整合", copy: "以 SOLID、模式、測試與部署完成個人專題。" },
];

export function CourseSite() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("全部");
  const tags = ["全部", ...Array.from(new Set(weeks.map((item) => item.tag)))];
  const visible = useMemo(() => weeks.filter((item) => {
    const matchesFilter = filter === "全部" || item.tag === filter;
    const text = `${item.title} ${item.summary} ${item.topics.join(" ")} ${item.practice}`.toLowerCase();
    return matchesFilter && text.includes(query.trim().toLowerCase());
  }), [query, filter]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="回到頁首"><span>OO</span> 物件導向程式設計</a>
        <nav aria-label="主要導覽">
          <a href="#roadmap">學習路徑</a><a href="#weeks">每週課程</a><a href="#project">期末專題</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Python × Object-Oriented Programming</p>
          <h1>不只會寫類別，<br /><em>更要會設計系統。</em></h1>
          <p className="lead">從 C 語言的程序式思維出發，以 18 週建立物件建模、設計原則、測試重構到系統整合的完整能力。</p>
          <div className="hero-actions"><a className="button primary" href="#weeks">查看 18 週課程</a><a className="button secondary" href="#project">專題要求</a></div>
        </div>
        <div className="code-card" aria-label="Python 類別程式碼範例">
          <div className="code-dots"><i></i><i></i><i></i><span>strategy.py</span></div>
          <pre><code><b>from</b> abc <b>import</b> ABC, abstractmethod{"\n\n"}<b>class</b> <strong>Payment</strong>(ABC):{"\n"}    @abstractmethod{"\n"}    <b>def</b> <strong>pay</strong>(self, amount: float) -&gt; None:{"\n"}        ...{"\n\n"}<b>class</b> <strong>Checkout</strong>:{"\n"}    <b>def</b> __init__(self, payment: Payment):{"\n"}        self.payment = payment</code></pre>
          <p className="code-note">依賴抽象，而不是具體實作。</p>
        </div>
      </section>

      <section className="course-facts" aria-label="課程摘要">
        <div><strong>18</strong><span>週完整課程</span></div><div><strong>Python</strong><span>主要實作語言</span></div><div><strong>1</strong><span>個人整合專題</span></div><div><strong>設計 × 實作</strong><span>雙軌學習</span></div>
      </section>

      <section className="section roadmap" id="roadmap">
        <div className="section-heading"><p className="eyebrow">Learning roadmap</p><h2>一學期，三段能力成長</h2><p>概念不是分散的章節，而是一條從「寫得出來」走向「設計得好」的路徑。</p></div>
        <div className="phase-grid">{phases.map((phase, index) => <article className="phase" key={phase.range}><span>PHASE {index + 1}</span><b>{phase.range}</b><h3>{phase.title}</h3><p>{phase.copy}</p></article>)}</div>
      </section>

      <section className="section weeks-section" id="weeks">
        <div className="section-heading"><p className="eyebrow">Weekly syllabus</p><h2>每週課程與實作</h2><p>搜尋概念或依主題篩選；點開週次可查看學習重點與課堂實作。</p></div>
        <div className="tools"><label><span>搜尋課程</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="例如：UML、SOLID、測試…" /></label><div className="filters" aria-label="主題篩選">{tags.map((tag) => <button className={filter === tag ? "active" : ""} onClick={() => setFilter(tag)} key={tag}>{tag}</button>)}</div></div>
        <div className="week-list">{visible.map((item) => <details className="week" key={item.week}><summary><span className="week-number">W{String(item.week).padStart(2, "0")}</span><span className="week-title"><small>{item.tag}</small><b>{item.title}</b><em>{item.summary}</em></span><span className="plus">＋</span></summary><div className="week-detail"><div><h4>本週重點</h4><ul>{item.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul></div><div className="practice"><h4>實作任務</h4><p>{item.practice}</p><Link className="lesson-link" href={`/week/${item.week}/`}>進入第 {item.week} 週完整教材 →</Link></div></div></details>)}</div>
        {visible.length === 0 && <p className="empty">找不到符合條件的課程，請嘗試其他關鍵字。</p>}
      </section>

      <section className="project" id="project">
        <div><p className="eyebrow">Capstone project</p><h2>期末專題：用作品證明你的設計</h2><p>選擇一個真實問題，完成可執行、可測試、可說明的物件導向系統。重點不只在功能數量，更在類別責任與系統品質。</p></div>
        <ol><li><span>01</span><b>問題與需求</b><p>清楚界定使用者、情境與功能範圍。</p></li><li><span>02</span><b>物件模型</b><p>提供 UML、類別責任與關係說明。</p></li><li><span>03</span><b>程式品質</b><p>運用 SOLID、模式、例外處理與重構。</p></li><li><span>04</span><b>驗證與交付</b><p>包含測試、文件、版本紀錄與部署成果。</p></li></ol>
      </section>

      <footer><div><span className="footer-mark">OO</span><p>物件導向程式設計<br />Python 教材網站</p></div><p>從物件開始，設計能持續成長的軟體。</p><a href="#top">回到頁首 ↑</a></footer>
    </main>
  );
}
