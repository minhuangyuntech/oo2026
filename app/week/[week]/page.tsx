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

const weekNotes: string[][] = [
  ["程序式設計把資料與處理資料的函式分開管理，流程通常由主程式控制。","物件導向將狀態與行為封裝在物件內，控制權分散到負責任的物件。","函數式設計偏好不可變資料與純函式，降低隱藏狀態造成的副作用。","從 C 轉換時，可把 struct 視為狀態，把操作 struct 的函式移入類別。","類別不是資料表；沒有行為、只放欄位的類別通常無法發揮物件導向價值。","物件之間應以方法呼叫傳遞訊息，而不是任意修改彼此內部資料。","專題評量會同時檢查功能、類別責任、物件關係、測試、文件與部署。","選擇典範時應考量問題特性，不需要把所有程式都強迫寫成類別。"],
  ["Python 名稱在執行時繫結到物件，名稱本身沒有固定型別。","bool 是 int 的子型別，但條件式應優先使用清楚的布林語意。","list 適合有順序且會變動的資料；tuple 適合固定結構或不可變紀錄。","dict 以鍵快速查找值；set 適合唯一性、交集、聯集與成員判斷。","預設參數在函式定義時建立，不可直接使用 list 或 dict 作為可變預設值。","*args 收集額外位置參數，**kwargs 收集額外關鍵字參數。","Python 的參數傳遞可理解為物件參考的傳值；函式收到新的名稱繫結。","容器推導式應保持簡短，複雜條件應改用一般迴圈提高可讀性。"],
  ["物件具有 identity、state、behavior；三者共同形成可辨識的執行個體。","__new__ 建立物件，__init__ 負責把已建立的物件初始化為有效狀態。","self 不是關鍵字，但依慣例必須使用 self 表示接收訊息的實體。","實體屬性放在個別物件的 __dict__，類別屬性則由類別與實體共同查找。","若以實體指定同名屬性，會遮蔽類別屬性而不是修改類別本身。","classmethod 的第一個參數是 cls，可依實際子類別建立物件。","staticmethod 不接收 self 或 cls，適合與類別語意相關的純工具操作。","建構子應建立有效物件，避免先建立不完整狀態再由外部補欄位。"],
  ["封裝的重點是保護設計決策與不變條件，不只是把名稱加上底線。","單底線表示非公開慣例；雙底線觸發 name mangling，主要避免子類別名稱衝突。","property 可在不改變呼叫語法的情況下加入驗證、計算或相容處理。","setter 應拒絕非法狀態，而不是默默修正所有錯誤輸入。","唯讀 property 只提供 getter，讓外部能觀察但不能直接改寫。","可變集合應回傳副本、tuple 或唯讀檢視，避免呼叫端繞過驗證。","Tell–Don’t–Ask 鼓勵要求物件完成工作，而不是取出資料後替它做決策。","公開介面一旦被使用就形成契約，命名與例外行為應保持穩定。"],
  ["變數保存的是物件參考；a=b 不會複製物件，只讓兩個名稱指向同一物件。","is 比較是否為同一物件；== 呼叫物件的相等語意。","小整數或字串可能被快取，因此不可用 is 比較一般資料值。","可變物件能在 identity 不變時改變內容，不可變物件的操作會得到新物件。","函式修改傳入 list 的內容會影響呼叫端，重新繫結參數則不會。","shallow copy 建立新外層容器，但內部元素仍指向原物件。","deepcopy 遞迴複製物件圖，成本較高且不一定適合外部資源。","循環參考可由垃圾回收器處理，但資源釋放不應依賴回收時機。"],
  ["Association 表示物件長期知道另一物件，通常對應屬性或集合。","Dependency 表示暫時使用，常出現在方法參數、區域變數或回傳值。","Aggregation 的部分可獨立存在；Composition 的部分生命週期由整體管理。","UML 實心菱形表示組合，空心菱形表示聚合，虛線箭頭表示依賴。","Multiplicity 1、0..1、*、1..* 分別表達必有、可選、多個與至少一個。","關聯類別可承載兩個類別關係本身的資料，例如 Enrollment 的成績。","雙向關聯會增加同步責任，沒有雙向導覽需求時應保持單向。","先寫類別責任再畫關係，可避免把資料庫外鍵直接當成物件設計。"],
  ["繼承表達 Is-a 與可替換關係，不只是為了少寫幾行程式。","方法覆寫必須維持基底類別使用者所期待的前置與後置條件。","super() 不是固定呼叫父類別，而是沿目前類別的 MRO 尋找下一個實作。","協作式多重繼承要求每層方法都使用相容簽名並呼叫 super。","Mixin 應小而聚焦，通常不獨立建立物件，也不保存核心領域狀態。","菱形繼承若直接指定父類別方法，可能造成重複初始化。","Class.mro() 可顯示 C3 linearization 計算出的解析順序。","若子類別需要停用或拒絕父類別能力，通常代表繼承關係不恰當。"],
  ["多型讓呼叫端只依賴共同操作，不需要知道物件的具體類別。","動態繫結會依執行時物件選擇方法實作，支援開放式擴充。","鴨子型別以可用行為判斷相容性，不要求共同名義基底類別。","ABC 適合需要共享實作、執行期檢查或明確繼承關係的情況。","Protocol 適合結構式型別；既有類別不必顯式繼承即可符合介面。","型別提示不會自動進行執行期驗證，需搭配靜態檢查工具。","策略物件透過組合注入，可在執行時替換並方便建立測試替身。","依賴抽象時，抽象應由使用端需要的能力決定，而非複製實作端全部方法。"],
  ["先用術語表確認 identity、equality、encapsulation、polymorphism 等定義。","程式追蹤題應畫出名稱到物件的箭頭，逐行記錄狀態變化。","遇到 copy 題目要區分外層容器與巢狀元素是否共享。","UML 題先辨識責任，再標示關係與 multiplicity。","繼承題應先列出 MRO，再依順序追蹤 super 呼叫。","多型題應檢查呼叫端是否依賴共同介面而非 isinstance 分支。","封裝題應說明被保護的不變條件，而不只回答使用 private。","設計題沒有唯一答案，但每個關係與方法配置都必須有需求依據。"],
  ["__repr__ 應提供無歧義、利於除錯的表示；__str__ 提供使用者友善文字。","實作 __eq__ 後若物件可變，通常不應提供穩定 __hash__。","運算子多載應符合既有運算語意，避免讓 + 產生令人意外的副作用。","__call__ 讓物件像函式使用，適合保存設定或累積狀態的策略。","Iterable 的 __iter__ 可回傳新的 iterator；Iterator 的 __iter__ 回傳自己。","__next__ 無資料時必須拋出 StopIteration。","generator 以 yield 暫停並保存區域狀態，適合惰性資料流。","context manager 的 __exit__ 必須保證清理，並決定是否抑制例外。"],
  ["dataclass 適合以資料值為主的物件，但領域規則仍應放入方法。","default_factory 用於建立每個實體獨立的 list、dict 等可變預設值。","frozen=True 提供淺層不可變性，內部可變欄位仍可能被修改。","slots=True 可限制動態屬性並減少大量實體的記憶體成本。","Enum 成員是具名稱的唯一值，適合取代魔術字串與整數常數。","TypeVar 表達多個位置必須維持相同型別的關係。","Generic[T] 讓容器、Repository 與服務在保留型別資訊下重用。","Protocol 可搭配 TypeVar 描述泛型能力介面。"],
  ["分析階段關注問題領域，避免過早加入資料庫、框架或畫面元件。","需求名詞只是候選類別，需排除屬性、角色重複與無行為資料。","動詞提示責任，但責任應配置到擁有必要資訊的物件。","CRC 卡以 Class、Responsibilities、Collaborators 快速檢查分工。","使用案例描述角色目標、前置條件、主要流程、替代流程與後置條件。","系統循序圖把系統視為黑箱；設計循序圖則顯示內部物件協作。","Controller 應協調流程，不應吸收所有領域規則。","從互動反推方法介面，再以類別圖整理穩定結構。"],
  ["SRP 的責任可理解為變更原因，並非要求每個類別只能有一個方法。","OCP 對預期變化建立擴充點，不能為所有未知可能性過度抽象。","LSP 要求子型別維持行為契約，不能加強前置條件或削弱後置條件。","ISP 讓用戶只依賴真正需要的方法，避免胖介面。","DIP 讓高階政策與低階細節共同依賴抽象。","依賴注入是提供依賴的方式，DIP 是依賴方向的設計原則。","高內聚讓同一變更集中，低耦合減少變更擴散。","Favor Composition over Inheritance 提供更彈性的執行期替換。"],
  ["Factory 封裝建立決策，讓呼叫端不直接依賴具體類別名稱。","Strategy 把演算法變化封裝為可替換物件，移除大型條件分支。","Observer 建立一對多通知，但需注意訂閱解除、順序與錯誤隔離。","Adapter 把既有介面轉成用戶需要的介面，不修改被轉接物件。","長方法、重複程式、資料泥團與散彈式修改是常見 Code Smell。","重構必須保持外部可觀察行為不變，並以小步驟持續執行測試。","Mock 適合驗證重要互動；值計算應優先使用真實物件的狀態測試。","模式應回應已知的變化與耦合問題，不應為展示模式而增加複雜度。"],
  ["HTTP 請求包含 method、path、headers 與 body，回應包含 status、headers 與內容。","Router 依 URL 與方法選擇 View；View 負責轉換輸入輸出而非領域規則。","表單驗證應區分格式錯誤與領域規則違反。","ORM identity map 可能讓同一資料列在交易中對應同一物件。","CRUD 不是完整領域模型；複雜規則應以具意圖的方法表達。","Application Service 協調使用案例與交易邊界。","Repository 提供類似集合的領域介面，隱藏 SQL 或外部 API。","依賴方向應由介面層指向應用與領域，基礎設施實作領域需要的介面。"],
  ["Provider 封裝不同模型供應商的認證、請求與回應格式。","LLM Service 管理提示模板、重試、timeout、token 限制與結果解析。","介面應回傳應用需要的結果，而不是洩漏特定供應商完整回應。","OllamaProvider 與雲端 Provider 可共用 Protocol，並以設定選擇實作。","API Key 必須放在環境變數或密鑰服務，不可提交到 Git。","外部呼叫需處理限流、網路失敗、不合法輸出與降級策略。","Python 虛擬環境與鎖定版本確保部署可重現。","Linux 部署應考量 systemd、反向代理、HTTPS、日誌與健康檢查。"],
  ["專題核心類別應以一句話說明責任，若包含「以及」通常需要再檢查。","UML 關係與 multiplicity 必須和實際程式及資料規則一致。","Controller、Manager、Utils 過大常代表責任尚未分配到領域物件。","外部服務、檔案與資料庫應放在架構邊界並透過介面隔離。","測試應涵蓋主要使用案例、邊界值、非法狀態與外部失敗。","例外需在能處理的層級捕捉，不可用 except Exception 靜默忽略。","README 應包含目的、功能、架構、安裝、操作、測試與部署。","重構前後應保留可比較證據，例如測試、複雜度或依賴關係變化。"],
  ["期末作品需先清楚界定問題、使用者與可驗證的功能範圍。","核心領域至少應展現封裝、責任分配與有意義的物件協作。","UML 類別圖需與最終程式一致，並標示重要關係與多重性。","至少選擇一項 SOLID 原則或設計模式，說明它解決的具體問題。","測試報告需包含測試範圍、案例、結果與尚未處理的風險。","部署需提供可瀏覽網址或可重現的完整啟動步驟。","展示應依問題、需求、設計、操作、品質證據與反思安排。","繳交內容包含原始碼、版本紀錄、README、UML、測試與個人反思。"],
];

function SvgDiagram({week, topics}:{week:number;topics:readonly string[]}) {
  const hierarchy=[6,7,8,13,14,15,16].includes(week);
  const pos=hierarchy?[[350,55],[110,205],[350,205],[590,205]]:[[50,125],[250,125],[450,125],[650,125]];
  return <svg className="lesson-svg" viewBox="0 0 800 330" role="img" aria-labelledby={`svg-title-${week} svg-desc-${week}`}>
    <title id={`svg-title-${week}`}>第 {week} 週概念圖</title><desc id={`svg-desc-${week}`}>呈現本週四個主要概念的關係。</desc>
    <defs><marker id={`arrow-${week}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#d9f25f"/></marker></defs>
    {hierarchy?<>{[1,2,3].map(i=><line key={i} x1="400" y1="125" x2={pos[i][0]+50} y2="205" stroke="#d9f25f" strokeWidth="3" markerEnd={`url(#arrow-${week})`}/>)}</>:<>{[0,1,2].map(i=><line key={i} x1={pos[i][0]+100} y1="165" x2={pos[i+1][0]} y2="165" stroke="#d9f25f" strokeWidth="3" markerEnd={`url(#arrow-${week})`}/>)}</>}
    {topics.map((topic,i)=><g key={topic} transform={`translate(${pos[i][0]},${pos[i][1]})`}><rect width="150" height="80" rx="10" fill={i===0?"#d9f25f":"#20352e"} stroke={i===0?"#d9f25f":"#587269"} strokeWidth="2"/><foreignObject x="8" y="8" width="134" height="64"><div className={i===0?"svg-label dark":"svg-label"}>{topic}</div></foreignObject></g>)}
  </svg>;
}

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
      <section id="notes" className="content-section"><p className="section-index">02 / LECTURE NOTES</p><h2>詳細講義內容</h2><div className="note-grid">{topics.map((topic,i)=><section className="note-card" key={topic}><span>0{i+1}</span><h3>{topic}</h3><ul>{details.map((x,j)=><li key={x}>{x.replace("此概念",j===0?topic:"這項設計")}</li>)}</ul></section>)}</div><section className="deep-notes"><h3>本週必懂的核心重點</h3><ul>{weekNotes[n-1].map(x=><li key={x}>{x}</li>)}</ul></section><div className="teaching-flow"><b>建議教學流程</b><div><span>概念引導<small>20 分鐘</small></span><i>→</i><span>程式示範<small>30 分鐘</small></span><i>→</i><span>分組討論<small>20 分鐘</small></span><i>→</i><span>動手實作<small>50 分鐘</small></span></div></div></section>
      <section id="diagram" className="content-section"><p className="section-index">03 / SVG VISUAL MODEL</p><figure className="concept-diagram"><div className="diagram-heading"><span>SCALABLE VECTOR DIAGRAM</span><h2>{lesson[0]}概念關係圖</h2></div><SvgDiagram week={n} topics={topics}/><figcaption>{[6,7,8,13,14,15,16].includes(n)?"上層為抽象或核心角色，下層為具體類別、實作或協作者。":"由左至右閱讀，呈現本週概念的處理流程與學習順序。"}</figcaption></figure></section>
      <section id="lab" className="content-section practice-panel"><p className="section-index">04 / HANDS-ON LAB</p><h2>課堂實作任務</h2><p className="lab-brief">選擇一個生活或專題情境，運用「{topics[0]}」與「{topics[1]}」建立 Python 範例，並用圖或測試說明設計結果。</p><ol className="lab-steps"><li><b>分析</b><span>圈出需求中的資料、行為與限制。</span></li><li><b>設計</b><span>決定責任、介面與物件關係。</span></li><li><b>實作</b><span>以小步驟完成核心流程。</span></li><li><b>驗證</b><span>測試正常、邊界與錯誤情境。</span></li></ol></section>
      <section id="checklist" className="content-section"><p className="section-index">05 / CHECKLIST</p><h2>課後任務與檢核</h2><ul className="deliverable-list"><li><span>✓</span>能用自己的話解釋四項核心概念</li><li><span>✓</span>完成實作並保留執行或測試證據</li><li><span>✓</span>將本週技巧套用到個人專題</li></ul><div className="reflection"><b>反思問題</b><p>本週概念解決了什麼問題？如果不使用它，程式最可能在哪裡變得難以維護？</p></div></section>
    </article></div>
    <nav className="lesson-pagination">{n>1?<Link href={`/week/${n-1}/`}><small>← 上一週</small><b>{lessons[n-2][0]}</b></Link>:<span/>}{n<18?<Link href={`/week/${n+1}/`}><small>下一週 →</small><b>{lessons[n][0]}</b></Link>:<Link href="/"><small>完成課程</small><b>回到課程首頁</b></Link>}</nav>
  </main>;
}
