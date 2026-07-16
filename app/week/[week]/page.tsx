import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const lessons = [
  ["課程介紹與程式設計典範","基礎","程序式、物件導向與函數式典範","課程評量與個人專題","從 C 的資料與函式轉入物件責任","物件、訊息與協作"],
  ["Python 程式語言基礎複習","Python","資料型別、運算子與控制流程","函式、參數、作用域與回傳值","list、tuple、dict、set","C 與 Python 的執行模式"],
  ["類別、物件與物件模型","核心","類別、物件、身分、狀態與行為","__init__、self 與實體屬性","類別屬性與共享資料","實體、類別與靜態方法"],
  ["封裝與資訊隱藏","核心","公開、單底線與名稱修飾","Property、Getter 與 Setter","驗證規則與類別不變條件","最小且清楚的公開介面"],
  ["物件生命週期與記憶體模型","核心","名稱、參考與物件回收","Identity、Equality 與雜湊","Mutable、Immutable 與 Alias","Shallow Copy 與 Deep Copy"],
  ["類別關係與 UML 類別圖","建模","Association 與 Dependency","Aggregation 與 Composition","類別責任與協作者","Multiplicity 與 UML 符號"],
  ["繼承與類別階層","核心","基底類別與衍生類別","方法覆寫與 super()","Is-a 關係與可替換性","多重繼承與 MRO"],
  ["多型、抽象化與介面","核心","多型、動態繫結與鴨子型別","ABC 與抽象方法","Protocol 與 Type Hints","繼承與組合的選擇"],
  ["期中考試（筆試）","評量","類別、物件與封裝","參考、複製與生命週期","關係、繼承與多型","抽象化與 UML 綜合題"],
  ["Python 進階物件導向機制","進階","特殊方法與字串表示","比較、雜湊與運算子多載","Iterator、Iterable、Generator","Context Manager"],
  ["資料類別、泛型與型別設計","進階","dataclass 與 field","Enum 與有限狀態","Generic 與 TypeVar","Protocol 與靜態型別檢查"],
  ["物件導向分析與設計","設計","從需求辨識候選物件","CRC 卡與責任分配","使用案例與例外流程","循序圖與設計模型"],
  ["SOLID 與物件導向設計原則","設計","SRP 與 OCP","LSP 與 ISP","DIP 與依賴注入","高內聚、低耦合與組合優先"],
  ["設計模式與程式重構","設計","Factory 與 Strategy","Observer 與 Adapter","Code Smell 與小步重構","單元測試、Mock 與依賴注入"],
  ["Python 網站與資料庫應用（補充）","整合","URL、Router、View 與 Template","表單、驗證與錯誤處理","ORM、Transaction 與 CRUD","Domain、Service、Repository"],
  ["LLM 整合與 Linux 部署（補充）","整合","LLM Provider 與 Service","API、Ollama 與可替換實作","環境變數、密鑰與錯誤處理","Git、虛擬環境與 Linux 部署"],
  ["物件導向系統整合與專題輔導","專題","核心類別責任與物件關係","依賴方向與系統架構","測試、例外處理與重構","文件、版本、部署與維護性"],
  ["期末總結及期末專題要求說明","評量","物件導向核心概念總結","專題功能與設計要求","UML、測試與品質證據","文件、部署、展示與評分標準"],
] as const;

const details = [
  "定義：能準確說明概念、目的與常見使用情境。",
  "辨識：能從需求或程式碼中找出此概念的具體位置。",
  "設計：能判斷何時使用，以及不用時可能產生的問題。",
  "實作：能以 Python 建立最小可運作範例。",
  "驗證：能用輸出、測試或圖表證明設計符合預期。",
];

export const generateStaticParams = () => lessons.map((_, i) => ({ week: String(i + 1) }));

export async function generateMetadata({params}:{params:Promise<{week:string}>}):Promise<Metadata>{
  const n=Number((await params).week), lesson=lessons[n-1];
  return lesson?{title:`第 ${n} 週｜${lesson[0]}`,description:`物件導向程式設計第 ${n} 週完整教材`}:{};
}

export default async function WeekPage({params}:{params:Promise<{week:string}>}){
  const n=Number((await params).week), lesson=lessons[n-1];
  if(!lesson) notFound();
  const topics=lesson.slice(2);
  return <main className="lesson-page">
    <header className="site-header"><Link className="brand" href="/"><span>OO</span> 物件導向程式設計</Link><nav><Link href="/">課程首頁</Link><a href="#notes">詳細講義</a><a href="#lab">課堂實作</a></nav></header>
    <section className="lesson-hero"><div><p className="eyebrow">WEEK {String(n).padStart(2,"0")} · {lesson[1]}</p><h1>{lesson[0]}</h1><p>本頁提供第 {n} 週的完整課堂講義、概念圖、實作流程與課後檢核，適合課堂投影與學生複習。</p></div><aside><b>本週學習重點</b><ol>{topics.slice(0,3).map(x=><li key={x}>{x}</li>)}</ol></aside></section>
    <div className="lesson-layout"><aside className="lesson-toc"><b>本頁目錄</b><a href="#objectives">學習目標</a><a href="#notes">詳細講義</a><a href="#diagram">概念圖</a><a href="#lab">實作任務</a><a href="#checklist">課後檢核</a></aside><article className="lesson-content">
      <section id="objectives" className="content-section"><p className="section-index">01 / OBJECTIVES</p><h2>本週學習目標</h2><ul className="objective-list">{topics.map(x=><li key={x}>{x}</li>)}</ul></section>
      <section id="notes" className="content-section"><p className="section-index">02 / LECTURE NOTES</p><h2>詳細講義內容</h2><div className="note-grid">{topics.map((topic,i)=><section className="note-card" key={topic}><span>0{i+1}</span><h3>{topic}</h3><ul>{details.map((x,j)=><li key={x}>{x.replace("此概念",j===0?topic:"這項設計")}</li>)}</ul></section>)}</div><div className="teaching-flow"><b>建議教學流程</b><div><span>概念引導<small>20 分鐘</small></span><i>→</i><span>程式示範<small>30 分鐘</small></span><i>→</i><span>分組討論<small>20 分鐘</small></span><i>→</i><span>動手實作<small>50 分鐘</small></span></div></div></section>
      <section id="diagram" className="content-section"><p className="section-index">03 / VISUAL MODEL</p><figure className="concept-diagram"><div className="diagram-heading"><span>CONCEPT MAP</span><h2>{lesson[0]}概念關係圖</h2></div><div className="diagram-flow">{topics.map((x,i)=><div className="diagram-step" key={x}><div>{x}</div>{i<topics.length-1&&<i>→</i>}</div>)}</div><figcaption>由左至右閱讀，呈現本週核心概念的學習順序與相互關係。</figcaption></figure></section>
      <section id="lab" className="content-section practice-panel"><p className="section-index">04 / HANDS-ON LAB</p><h2>課堂實作任務</h2><p className="lab-brief">選擇一個生活或專題情境，運用「{topics[0]}」與「{topics[1]}」建立 Python 範例，並用圖或測試說明設計結果。</p><ol className="lab-steps"><li><b>分析</b><span>圈出需求中的資料、行為與限制。</span></li><li><b>設計</b><span>決定責任、介面與物件關係。</span></li><li><b>實作</b><span>以小步驟完成核心流程。</span></li><li><b>驗證</b><span>測試正常、邊界與錯誤情境。</span></li></ol></section>
      <section id="checklist" className="content-section"><p className="section-index">05 / CHECKLIST</p><h2>課後任務與檢核</h2><ul className="deliverable-list"><li><span>✓</span>能用自己的話解釋四項核心概念</li><li><span>✓</span>完成實作並保留執行或測試證據</li><li><span>✓</span>將本週技巧套用到個人專題</li></ul><div className="reflection"><b>反思問題</b><p>本週概念解決了什麼問題？如果不使用它，程式最可能在哪裡變得難以維護？</p></div></section>
    </article></div>
    <nav className="lesson-pagination">{n>1?<Link href={`/week/${n-1}/`}><small>← 上一週</small><b>{lessons[n-2][0]}</b></Link>:<span/>}{n<18?<Link href={`/week/${n+1}/`}><small>下一週 →</small><b>{lessons[n][0]}</b></Link>:<Link href="/"><small>完成課程</small><b>回到課程首頁</b></Link>}</nav>
  </main>;
}
