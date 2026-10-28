"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import CourseShell from "./course-shell";
import VariableReference from "./variable-reference";
import {variableText} from "../variable-text";
import ConceptFlow from "./concept-flow";
import LessonDiagram from "./lesson-diagram";
import Image from "next/image";
import {week7ResourceNote} from "../week7-data";
import {week8ResourceNote} from "../week8-data";
import {memoryResourceNote} from "../memory-data";
import {memoryPlayPath,memoryText} from "../memory/text";
import {pygameResourceNote} from "../pygame-data";
import {playPath,playText} from "../game/text";
import {djangoResourceNote} from "../django-data";
import {basePath,unitInfo,unitRanges,unitChapters,coursePath,ui,weekLabel,type UnitId,type BodyBlock,type Language,type Lesson} from "../data";

function LinkedText({text}:{text:string}) {
  const url=/((?:https?:\/\/|(?:docs\.python\.org|docs\.djangoproject\.com|minhuangyuntech\.github\.io|eclass\.yuntech\.edu\.tw)\/)[^\s<>]+)/g;
  return <>{text.split(url).map((part,i)=>/^https?:\/\//.test(part)||/^(docs\.|minhuangyuntech\.|eclass\.)/.test(part)?<a key={i} href={part.startsWith("http")?part:`https://${part}`} target="_blank" rel="noreferrer">{part}</a>:part)}</>;
}
function ContentBlock({block}:{block:BodyBlock}) {
  if(block.type==="table")return <div className="lesson-table-scroll" tabIndex={0}><table><thead><tr>{block.rows?.[0]?.map((cell,i)=><th scope="col" key={i}><LinkedText text={cell}/></th>)}</tr></thead><tbody>{block.rows?.slice(1).map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}><LinkedText text={cell}/></td>)}</tr>)}</tbody></table></div>;
  if(block.type==="heading")return <h4><LinkedText text={block.text||""}/></h4>;
  return <p><LinkedText text={block.text||""}/></p>;
}
function CodeBlock({code,output,lang,codeLanguage,label}:{code:string;output?:string;lang:Language;codeLanguage?:string;label?:string|null}){
  const [status,setStatus]=useState("idle");
  const codeRef=useRef<HTMLElement>(null);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  async function copy(){
    try{await navigator.clipboard.writeText(code);setStatus("copied");}
    catch{
      const selection=window.getSelection();
      if(codeRef.current&&selection){const range=document.createRange();range.selectNodeContents(codeRef.current);selection.removeAllRanges();selection.addRange(range);}
      setStatus("failed");
    }
    if(timer.current)clearTimeout(timer.current);
    timer.current=setTimeout(()=>setStatus("idle"),3500);
  }
  const t=ui[lang];
  return <div className="lesson-code"><div className="lesson-code-bar"><span>{label||({shell:{zh:"終端機 · Windows / macOS / Linux",en:"Terminal · Windows / macOS / Linux",ja:"ターミナル · Windows / macOS / Linux"}[lang],powershell:"PowerShell · Windows",bash:"Terminal · macOS / Linux",html:"HTML · Django Template",css:"CSS",text:{zh:"文字／目錄",en:"Text / directory",ja:"テキスト／ディレクトリ"}[lang]} as Record<string,string>)[codeLanguage||""]||t.code}</span><button onClick={copy} aria-live="polite">{status==="copied"?`✓ ${t.copied}`:status==="failed"?t.copyFailed:t.copy}</button></div><pre tabIndex={0}><code ref={codeRef}>{code}</code></pre>{status==="failed"&&<p className="copy-help" role="status">{t.selectText}</p>}{output&&<div className="lesson-output"><span>{t.output}</span><pre>{output}</pre></div>}</div>;
}

export default function WeekLesson({lang,week,lesson}:{lang:Language;week:UnitId;lesson:Lesson}){
  const t=ui[lang],info=unitInfo(lang,week),ranges=unitRanges(week),names=unitChapters(lang,week);
  const download=lesson.download||`week-${week}-${week===4?"zh":lang}.pptx`;
  const examples=lesson.examples||(typeof week==="number"&&week>=3?`week-${week}-examples.zip`:undefined);
  const sourceIsChinese=lesson.sourceLanguage==="zh"||week===4;
  const previous:UnitId|undefined=week===8?7:week===7?6:week==="memory"?"pygame":week==="pygame"?"django":week==="django"?"gui":week==="gui"?8:week>1?week-1:undefined;
  const next:UnitId|undefined=week===8?"gui":week===7?8:week===6?7:week==="memory"?undefined:week==="pygame"?"memory":week==="django"?"pygame":week==="gui"?"django":week<6?week+1:"gui";
  const [query,setQuery]=useState("");
  const [completed,setCompleted]=useState<number[]>([]);
  const [active,setActive]=useState(1);
  const [tocOpen,setTocOpen]=useState(false);
  useEffect(()=>{
    try{
      const stored=JSON.parse(localStorage.getItem(`oo2026-read-${week}`)||"[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if(Array.isArray(stored))setCompleted([...new Set(stored.filter(x=>Number.isInteger(x)&&x>=1&&x<=ranges.length))]);
    }catch{/* Local storage is optional. */}
  },[week,ranges.length]);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries)if(entry.isIntersecting){
        const chapter=Number((entry.target as HTMLElement).dataset.chapter);
        setActive(chapter);
        try{localStorage.setItem("oo2026-last-read",JSON.stringify({week,chapter}));}catch{}
      }
    },{rootMargin:"-90px 0px -65% 0px",threshold:0});
    document.querySelectorAll(".lesson-chapter").forEach(element=>observer.observe(element));
    return ()=>observer.disconnect();
  },[week,query]);
  function toggleChapter(chapter:number){
    const next=completed.includes(chapter)?completed.filter(n=>n!==chapter):[...completed,chapter];
    setCompleted(next);
    try{localStorage.setItem(`oo2026-read-${week}`,JSON.stringify(next));}catch{}
  }
  const chapters=useMemo(()=>ranges.map(([start,end],i)=>({index:i+1,title:names[i],slides:lesson.slides.filter(slide=>slide.number>=start&&slide.number<=end).filter(slide=>!query.trim()||JSON.stringify(slide).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))})),[ranges,names,lesson,query]);
  const toc=<><h2>{t.reading}</h2><nav aria-label={t.reading}>{names.map((name,i)=><a key={name} href={`#chapter-${i+1}`} className={active===i+1?"is-active":""} aria-current={active===i+1?"location":undefined} onClick={()=>{setQuery("");setTocOpen(false);}}><span>{completed.includes(i+1)?"✓":String(i+1).padStart(2,"0")}</span>{name}</a>)}</nav>{(week==="pygame"||week==="memory")&&<a className="toc-download" href="#variables" onClick={()=>setTocOpen(false)}>{variableText[lang].title} ↗</a>}<a className="toc-download" href="#resources">↓ {t.resources}</a><div className="reading-progress"><div><b>{t.progress}</b><span>{completed.length} / {ranges.length}</span></div><progress value={completed.length} max={ranges.length} aria-label={t.progress}/><p>{t.local}</p></div></>;
  return <CourseShell lang={lang} week={week}><main id="main-content" className="week-content" tabIndex={-1}>
    <header className="week-heading"><div className="week-heading-meta"><span className="week-badge">{weekLabel(lang,week)}</span><span>{info.tag}</span></div><h1>{info.title}</h1><p>{info.summary}</p><div className="week-heading-bottom"><span>{ranges.length} {t.chapters}<i/> {lesson.slides.length} {t.slides}<i/> Python 3.12+</span><button className="print-button" onClick={()=>window.print()}>{t.print} ↗</button></div></header>
    <div className="week-reading-layout"><div className="reading-main">
      <section className="outcomes"><h2>{t.key}</h2><ol>{info.outcomes.map((outcome,i)=><li key={outcome}><span>0{i+1}</span>{outcome}</li>)}</ol></section>
      {(week==="pygame"||week===7||week===8)&&<section className="pygame-play-entry"><div><h2>{playText[lang].subtitle}</h2><p>{playText[lang].description}</p></div><Link className="action-primary" href={playPath(lang)}>▶ {playText[lang].launch}</Link></section>}
      {week==="memory"&&<section className="pygame-play-entry"><div><h2>{memoryText[lang].subtitle}</h2><p>{memoryText[lang].description}</p></div><Link className="action-primary" href={memoryPlayPath(lang)}>▶ {memoryText[lang].launch}</Link></section>}
      {(week==="pygame"||week==="memory")&&<a className="variable-entry" href="#variables"><span><b>{variableText[lang].title}</b><small>{variableText[lang].entry}</small></span><span aria-hidden="true">↓</span></a>}
      <div className="mobile-toc"><button aria-expanded={tocOpen} aria-controls="mobile-chapters" onClick={()=>setTocOpen(!tocOpen)}>{t.tocToggle}<span>{tocOpen?"−":"+"}</span></button>{tocOpen&&<div id="mobile-chapters">{toc}</div>}</div>
      <div className="lesson-search"><label htmlFor="lesson-search">{t.search}</label><div><span aria-hidden="true">⌕</span><input id="lesson-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/>{query&&<button onClick={()=>setQuery("")}>{t.clear}</button>}</div></div>
      {week!==1&&<p className="excerpt-note">{t.codeNote}</p>}
      <div aria-live="polite" className="search-status">{query&&`${chapters.reduce((sum,c)=>sum+c.slides.length,0)} ${t.topics}`}</div>
      {chapters.every(chapter=>chapter.slides.length===0)&&<p className="no-results">{t.noResults}</p>}
      {chapters.map(chapter=>chapter.slides.length>0&&<section key={chapter.index} id={`chapter-${chapter.index}`} data-chapter={chapter.index} className="lesson-chapter"><header className="chapter-heading"><span>{t.chapter} {String(chapter.index).padStart(2,"0")}</span><h2>{chapter.title}</h2></header>
        {chapter.slides.map(slide=><article className="lesson-topic" key={slide.number} id={`slide-${slide.number}`}><div className="topic-source">{t.sourceSlide} {String(slide.number).padStart(2,"0")}</div><h3><a href={`#slide-${slide.number}`}>{slide.title}</a></h3>{week===4&&<ConceptFlow slide={slide.number} lang={lang}/>} {slide.diagram&&<LessonDiagram id={slide.diagram} lang={lang}/>} {slide.image&&<figure className={slide.imageLayout==="wide"?"lesson-illustration":"gui-screenshot"}><div className="lesson-image-scroll" tabIndex={slide.imageLayout==="wide"?0:undefined}><Image src={`${basePath}${slide.image}`} alt={slide.imageAlt||""} width={slide.imageWidth||640} height={slide.imageHeight||480} unoptimized style={{width:"100%",height:"auto"}}/></div><figcaption>{slide.imageAlt}</figcaption></figure>} {slide.code&&<CodeBlock code={slide.code} output={slide.output} lang={lang} codeLanguage={slide.codeLanguage}/>}{slide.snippets?.map((snippet,i)=><CodeBlock key={i} code={snippet.code} lang={lang} codeLanguage={snippet.language} label={snippet.label}/>)}<div className="topic-body">{slide.body.map((block,i)=><ContentBlock block={block} key={i}/>)}</div>{!slide.code&&slide.output&&<div className="standalone-output"><b>{t.output}</b><pre>{slide.output}</pre></div>}</article>)}
        {!query&&<button className={`chapter-complete ${completed.includes(chapter.index)?"is-complete":""}`} aria-pressed={completed.includes(chapter.index)} onClick={()=>toggleChapter(chapter.index)}><span aria-hidden="true">{completed.includes(chapter.index)?"✓":"○"}</span>{completed.includes(chapter.index)?t.done:t.mark}</button>}
      </section>)}
      {(week==="pygame"||week==="memory")&&<VariableReference key={week+lang} lang={lang} unit={week}/>}
      <section id="resources" className="lesson-resources"><p className="kicker">RESOURCES</p><h2>{t.resources}</h2><p>{week===7?week7ResourceNote[lang]:week===8?week8ResourceNote[lang]:week==="memory"?memoryResourceNote[lang]:week==="pygame"?pygameResourceNote[lang]:week==="django"?djangoResourceNote[lang]:t.resourceNote}</p><div className="resource-links"><a className="action-primary" download href={`${basePath}/materials/${download}`}>↓ {sourceIsChinese&&lang!=="zh"?t.chineseSource:t.download}<small>PPTX</small></a>{examples&&<a className="action-secondary" download href={`${basePath}/materials/${examples}`}>↓ {week==="memory"?memoryText[lang].desktopDownload:t.examples}</a>}</div><p className="source-filename">{t.source}: {lesson.source}</p>{(week===4||week==="django")&&<p>{t.week4Note}</p>}<h3>{t.refs}</h3><ul><li><a href={`https://docs.python.org/${lang==="ja"?"ja/":""}3.12/tutorial/`} target="_blank" rel="noreferrer">Python 3.12 · Tutorial ↗</a></li><li><a href={`https://docs.python.org/${lang==="ja"?"ja/":""}3.12/reference/datamodel.html`} target="_blank" rel="noreferrer">Python · Data model ↗</a></li>{week===4&&<li><a href={`https://docs.djangoproject.com/${lang==="ja"?"ja":"en"}/5.2/ref/models/instances/#validating-objects`} target="_blank" rel="noreferrer">Django 5.2 · Model validation ↗</a></li>}{week==="django"&&<li><a href={`https://docs.djangoproject.com/${lang==="ja"?"ja":"en"}/5.2/intro/`} target="_blank" rel="noreferrer">Django 5.2 · Tutorial ↗</a></li>}{week==="pygame"&&<li><a href="https://www.pygame.org/docs/ref/sprite.html" target="_blank" rel="noreferrer">Pygame · Sprite / Group ↗</a></li>}{week==="memory"&&<li><a href="https://www.pygame.org/docs/" target="_blank" rel="noreferrer">Pygame · Documentation ↗</a></li>}{week===8&&<><li><a href="https://docs.python.org/3.12/library/abc.html" target="_blank" rel="noreferrer">Python · ABC ↗</a></li><li><a href="https://docs.python.org/3.12/library/typing.html#typing.Protocol" target="_blank" rel="noreferrer">Python · Protocol ↗</a></li><li><a href="https://www.pygame.org/docs/ref/sprite.html#pygame.sprite.Group.update" target="_blank" rel="noreferrer">Pygame · Group.update ↗</a></li></>}{week===6&&<li><a href="https://www.omg.org/spec/UML/2.5.1" target="_blank" rel="noreferrer">OMG · UML 2.5.1 ↗</a></li>}</ul></section>
      <nav className="week-pagination" aria-label={t.materials}>{previous?<Link href={coursePath(lang,previous)}><small>← {t.prev}</small><b>{unitInfo(lang,previous).title}</b></Link>:<Link href={coursePath(lang)}><small>← {t.back}</small></Link>}{next?<Link href={coursePath(lang,next)}><small>{t.next} →</small><b>{unitInfo(lang,next).title}</b></Link>:<Link href={`${coursePath(lang)}#full-outline`}><small>{t.allWeeks} →</small><b>{t.later}</b></Link>}</nav>
    </div><aside className="week-toc">{toc}</aside></div>
  </main></CourseShell>;
}
