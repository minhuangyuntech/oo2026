import type {Language} from "../data";

const captions:Record<number,Record<Language,string>>={
  2:{zh:"a 與 b 參照同一個 list 物件。",en:"a and b refer to the same list object.",ja:"a と b は同じ list オブジェクトを参照します。"},
  14:{zh:"類別的三個區塊：名稱、屬性、操作。",en:"Three compartments: class name, attributes, and operations.",ja:"三つの区画：クラス名・属性・操作。"},
  16:{zh:"左：類別結構。右：某時刻的兩個實體；實體名稱加底線。",en:"Left: class structure. Right: two instances at one moment, with underlined instance names.",ja:"左はクラス構造、右はある時点の二つのインスタンスです。インスタンス名には下線を引きます。"},
  17:{zh:"菱形在整體端；一般化三角形指向父類別；依賴箭頭指向供應者。",en:"Diamonds mark the whole; the generalization triangle points to the parent; dependency points to the supplier.",ja:"菱形は全体側、汎化の三角形は親クラス側、依存の矢印は提供側に置きます。"},
  18:{zh:"每筆 Enrollment 對應 1 位 Student；每位 Student 可有 0..* 筆 Enrollment。箭頭指向可導覽的 Student。",en:"Each Enrollment has one Student; a Student can have 0..* enrollments. The arrow points to the navigable Student.",ja:"一つの Enrollment に一人の Student、一人の Student に 0..* の Enrollment。矢印は参照先の Student を示します。"},
  20:{zh:"上：學習小組與學生的聚合。下：訂單與明細的組合；菱形皆在整體端。",en:"Top: aggregation of groups and students. Bottom: composition of orders and lines. Diamonds are at the whole end.",ja:"上はグループと学生の集約、下は注文と明細のコンポジションです。菱形は全体側にあります。"},
  24:{zh:"Enrollment 保存關係資料，並各連結 1 位 Student 與 1 門 Course。",en:"Enrollment stores relationship data and links one Student with one Course.",ja:"Enrollment が関係のデータを持ち、一人の Student と一つの Course を結び付けます。"},
  27:{zh:"已確認的 Order 組合 1..* 個 OrderLine。明細參照 1 個 Product；Order 暫時依賴 PricingService。",en:"A confirmed Order composes 1..* OrderLines. Each line refers to one Product; Order temporarily depends on PricingService.",ja:"確定済み Order は 1..* の OrderLine を持ち、各明細は一つの Product を参照します。Order は PricingService に一時的に依存します。"}
};
function Box({x,y,width=180,title,attrs=[],ops=[],instance=false}:{x:number;y:number;width?:number;title:string;attrs?:string[];ops?:string[];instance?:boolean}){
  const h=attrs.length||ops.length?140:64;
  return <g className="uml-box"><rect x={x} y={y} width={width} height={h} rx={3}/><text x={x+width/2} y={y+33} textAnchor="middle" className={instance?"uml-instance":"uml-class"}>{title}</text>{h>64&&<><path d={`M${x},${y+50}h${width}`}/>{attrs.map((line,i)=><text className="uml-member" x={x+12} y={y+77+i*22} key={line}>{line}</text>)}{!instance&&<path d={`M${x},${y+99}h${width}`}/>} {ops.map((line,i)=><text className="uml-member" x={x+12} y={y+124+i*20} key={line}>{line}</text>)}</>}</g>;
}
export default function LessonDiagram({id,lang}:{id:string;lang:Language}){
  const n=Number(id.replace("uml-","")),caption=captions[n]?.[lang];
  if(!caption)return null;
  const arrow=`${id}-arrow`,hollow=`${id}-hollow`,solid=`${id}-solid`,triangle=`${id}-triangle`;
  const relation=(x1:number,y1:number,x2:number,y2:number,left?:string,right?:string,kind="association")=><g><path className="uml-edge" d={`M${x1},${y1}L${x2},${y2}`} strokeDasharray={kind==="dependency"?"7 5":undefined} markerStart={kind==="aggregation"?`url(#${hollow})`:kind==="composition"?`url(#${solid})`:undefined} markerEnd={kind==="dependency"||kind==="navigate"?`url(#${arrow})`:kind==="generalization"?`url(#${triangle})`:undefined}/>{left&&<text className="uml-count" x={x1+25} y={y1-12}>{left}</text>}{right&&<text className="uml-count" x={x2-15} y={y2-12} textAnchor="end">{right}</text>}</g>;
  const labels={zh:["關聯","依賴","聚合","組合","一般化"],en:["Association","Dependency","Aggregation","Composition","Generalization"],ja:["関連","依存","集約","コンポジション","汎化"]}[lang];
  return <figure className="lesson-diagram"><div className="diagram-scroll" tabIndex={0} role="region" aria-label={caption}><svg role="img" aria-labelledby={`${id}-title`} viewBox={`0 0 800 ${n===17?330:n===27?350:n===20?300:225}`}><title id={`${id}-title`}>{caption}</title><defs>
    <marker id={arrow} viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto"><path d="M1 1L11 6L1 11" fill="none" stroke="currentColor" strokeWidth="1.5"/></marker>
    <marker id={triangle} viewBox="0 0 14 14" refX="13" refY="7" markerWidth="14" markerHeight="14" orient="auto"><path d="M1 1L13 7L1 13Z" fill="white" stroke="currentColor" strokeWidth="1.5"/></marker>
    {[hollow,solid].map((marker,i)=><marker key={marker} id={marker} viewBox="0 0 20 14" refX="1" refY="7" markerWidth="20" markerHeight="14" orient="auto"><path d="M1 7L10 1L19 7L10 13Z" fill={i?"currentColor":"white"} stroke="currentColor" strokeWidth="1.5"/></marker>)}
  </defs>
    {n===2&&<><Box x={70} y={20} title="a"/><Box x={70} y={135} title="b"/><Box x={530} y={65} title="list" attrs={["[10, 20]"]} instance/>{relation(250,52,530,110,undefined,undefined,"navigate")}{relation(250,167,530,125,undefined,undefined,"navigate")}</>}
    {n===14&&<Box x={185} y={40} width={430} title="Student" attrs={["- name: str"]} ops={["+ rename(new_name)"]}/>}
    {n===16&&<><Box x={10} y={40} width={240} title="Student" attrs={["- name: String"]} ops={["+ rename(newName)"]}/><Box x={305} y={40} width={220} title="amy : Student" attrs={['name = "Amy"']} instance/><Box x={570} y={40} width={220} title="bob : Student" attrs={['name = "Bob"']} instance/></>}
    {n===17&&["association","dependency","aggregation","composition","generalization"].map((kind,i)=><g key={kind}><text x={20} y={44+i*61}>{labels[i]}</text>{relation(260,38+i*61,730,38+i*61,undefined,undefined,kind)}</g>)}
    {n===18&&<><Box x={30} y={65} title="Enrollment"/><Box x={580} y={65} title="Student"/>{relation(210,97,580,97,"0..*","1","navigate")}<text x={395} y={134} textAnchor="middle">student</text></>}
    {n===20&&<><Box x={30} y={30} width={230} title="LearningGroup"/><Box x={560} y={30} width={200} title="Student"/>{relation(260,62,560,62,"0..*","0..*","aggregation")}<Box x={30} y={175} width={230} title="Order"/><Box x={560} y={175} width={200} title="OrderLine"/>{relation(260,207,560,207,"1","1..*","composition")}</>}
    {n===24&&<><Box x={10} y={40} width={180} title="Student" attrs={["name: str"]}/><Box x={300} y={40} width={220} title="Enrollment" attrs={["score: Real [0..1]"]} ops={["set_score(score)"]}/><Box x={630} y={40} width={160} title="Course" attrs={["title: str"]}/>{relation(190,110,300,110,"1","0..*")}{relation(520,110,630,110,"0..*","1")}</>}
    {n===27&&<><Box x={10} y={30} width={180} title="Order" attrs={["status: str"]} ops={["confirm()"]}/><Box x={300} y={30} width={190} title="OrderLine" attrs={["qty: int"]}/><Box x={620} y={30} width={170} title="Product" attrs={["price: int"]}/>{relation(190,105,300,105,"1","1..*","composition")}{relation(490,105,620,105,"0..*","1")}<Box x={300} y={240} width={220} title="PricingService"/>{relation(100,170,300,272,undefined,undefined,"dependency")}<text className="uml-member" x={540} y={280}>price(order)</text></>}
  </svg></div><figcaption>{caption}</figcaption></figure>;
}
