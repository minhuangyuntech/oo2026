"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import CourseShell from "./course-shell";
import ConceptFlow from "./concept-flow";
import {basePath,chapterNames,chapterRanges,coursePath,ui,weekInfo,weekLabel,type BodyBlock,type Language,type Lesson} from "../data";

function LinkedText({text}:{text:string}) {
  const url=/((?:https?:\/\/|(?:docs\.python\.org|docs\.djangoproject\.com|minhuangyuntech\.github\.io|eclass\.yuntech\.edu\.tw)\/)[^\s<>]+)/g;
  return <>{text.split(url).map((part,i)=>/^https?:\/\//.test(part)||/^(docs\.|minhuangyuntech\.|eclass\.)/.test(part)?<a key={i} href={part.startsWith("http")?part:`https://${part}`} target="_blank" rel="noreferrer">{part}</a>:part)}</>;
}
function ContentBlock({block}:{block:BodyBlock}) {
  if(block.type==="table")return <div className="lesson-table-scroll" tabIndex={0}><table><thead><tr>{block.rows?.[0]?.map((cell,i)=><th scope="col" key={i}><LinkedText text={cell}/></th>)}</tr></thead><tbody>{block.rows?.slice(1).map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}><LinkedText text={cell}/></td>)}</tr>)}</tbody></table></div>;
  if(block.type==="heading")return <h4><LinkedText text={block.text||""}/></h4>;
  return <p><LinkedText text={block.text||""}/></p>;
}
function CodeBlock({code,output,lang}:{code:string;output?:string;lang:Language}){
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
  return <div className="lesson-code"><div className="lesson-code-bar"><span>{t.code}</span><button onClick={copy} aria-live="polite">{status==="copied"?`✓ ${t.copied}`:status==="failed"?t.copyFailed:t.copy}</button></div><pre tabIndex={0}><code ref={codeRef}>{code}</code></pre>{status==="failed"&&<p className="copy-help" role="status">{t.selectText}</p>}{output&&<div className="lesson-output"><span>{t.output}</span><pre>{output}</pre></div>}</div>;
}

export default function WeekLesson({lang,week,lesson}:{lang:Language;week:number;lesson:Lesson}){
  const t=ui[lang],info=weekInfo[lang][week-1],ranges=chapterRanges[week-1],names=chapterNames[lang][week-1];
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
  const toc=<><h2>{t.reading}</h2><nav aria-label={t.reading}>{names.map((name,i)=><a key={name} href={`#chapter-${i+1}`} className={active===i+1?"is-active":""} aria-current={active===i+1?"location":undefined} onClick={()=>{setQuery("");setTocOpen(false);}}><span>{completed.includes(i+1)?"✓":String(i+1).padStart(2,"0")}</span>{name}</a>)}</nav><a className="toc-download" href="#resources">↓ {t.resources}</a><div className="reading-progress"><div><b>{t.progress}</b><span>{completed.length} / {ranges.length}</span></div><progress value={completed.length} max={ranges.length} aria-label={t.progress}/><p>{t.local}</p></div></>;
  return <CourseShell lang={lang} week={week}><main id="main-content" className="week-content" tabIndex={-1}>
    <header className="week-heading"><div className="week-heading-meta"><span className="week-badge">{weekLabel(lang,week)}</span><span>{info.tag}</span></div><h1>{info.title}</h1><p>{info.summary}</p><div className="week-heading-bottom"><span>{ranges.length} {t.chapters}<i/> {lesson.slides.length} {t.slides}<i/> Python 3.12+</span><button className="print-button" onClick={()=>window.print()}>{t.print} ↗</button></div></header>
    <div className="week-reading-layout"><div className="reading-main">
      <section className="outcomes"><h2>{t.key}</h2><ol>{info.outcomes.map((outcome,i)=><li key={outcome}><span>0{i+1}</span>{outcome}</li>)}</ol></section>
      <div className="mobile-toc"><button aria-expanded={tocOpen} aria-controls="mobile-chapters" onClick={()=>setTocOpen(!tocOpen)}>{t.tocToggle}<span>{tocOpen?"−":"+"}</span></button>{tocOpen&&<div id="mobile-chapters">{toc}</div>}</div>
      <div className="lesson-search"><label htmlFor="lesson-search">{t.search}</label><div><span aria-hidden="true">⌕</span><input id="lesson-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/>{query&&<button onClick={()=>setQuery("")}>{t.clear}</button>}</div></div>
      {week>1&&<p className="excerpt-note">{t.codeNote}</p>}
      <div aria-live="polite" className="search-status">{query&&`${chapters.reduce((sum,c)=>sum+c.slides.length,0)} ${t.topics}`}</div>
      {chapters.every(chapter=>chapter.slides.length===0)&&<p className="no-results">{t.noResults}</p>}
      {chapters.map(chapter=>chapter.slides.length>0&&<section key={chapter.index} id={`chapter-${chapter.index}`} data-chapter={chapter.index} className="lesson-chapter"><header className="chapter-heading"><span>{t.chapter} {String(chapter.index).padStart(2,"0")}</span><h2>{chapter.title}</h2></header>
        {chapter.slides.map(slide=><article className="lesson-topic" key={slide.number} id={`slide-${slide.number}`}><div className="topic-source">{t.sourceSlide} {String(slide.number).padStart(2,"0")}</div><h3><a href={`#slide-${slide.number}`}>{slide.title}</a></h3>{week===4&&<ConceptFlow slide={slide.number} lang={lang}/>} {slide.code&&<CodeBlock code={slide.code} output={slide.output} lang={lang}/>}<div className="topic-body">{slide.body.map((block,i)=><ContentBlock block={block} key={i}/>)}</div>{!slide.code&&slide.output&&<div className="standalone-output"><b>{t.output}</b><pre>{slide.output}</pre></div>}</article>)}
        {!query&&<button className={`chapter-complete ${completed.includes(chapter.index)?"is-complete":""}`} aria-pressed={completed.includes(chapter.index)} onClick={()=>toggleChapter(chapter.index)}><span aria-hidden="true">{completed.includes(chapter.index)?"✓":"○"}</span>{completed.includes(chapter.index)?t.done:t.mark}</button>}
      </section>)}
      <section id="resources" className="lesson-resources"><p className="kicker">RESOURCES</p><h2>{t.resources}</h2><p>{t.resourceNote}</p><div className="resource-links"><a className="action-primary" download href={`${basePath}/materials/week-${week}-${week===4?"zh":lang}.pptx`}>↓ {week===4&&lang!=="zh"?t.chineseSource:t.download}<small>PPTX</small></a>{week>=3&&<a className="action-secondary" download href={`${basePath}/materials/week-${week}-examples.zip`}>↓ {t.examples}</a>}</div><p className="source-filename">{t.source}: {lesson.source}</p>{week===4&&<p>{t.week4Note}</p>}<h3>{t.refs}</h3><ul><li><a href={`https://docs.python.org/${lang==="ja"?"ja/":""}3.12/tutorial/`} target="_blank" rel="noreferrer">Python 3.12 · Tutorial ↗</a></li><li><a href={`https://docs.python.org/${lang==="ja"?"ja/":""}3.12/reference/datamodel.html`} target="_blank" rel="noreferrer">Python · Data model ↗</a></li>{week===4&&<li><a href={`https://docs.djangoproject.com/${lang==="ja"?"ja":"en"}/5.2/ref/models/instances/#validating-objects`} target="_blank" rel="noreferrer">Django 5.2 · Model validation ↗</a></li>}</ul></section>
      <nav className="week-pagination" aria-label={t.materials}>{week>1?<Link href={coursePath(lang,week-1)}><small>← {t.prev}</small><b>{weekInfo[lang][week-2].title}</b></Link>:<Link href={coursePath(lang)}><small>← {t.back}</small></Link>}{week<4?<Link href={coursePath(lang,week+1)}><small>{t.next} →</small><b>{weekInfo[lang][week].title}</b></Link>:<Link href={`${coursePath(lang)}#full-outline`}><small>{t.allWeeks} →</small><b>{t.later}</b></Link>}</nav>
    </div><aside className="week-toc">{toc}</aside></div>
  </main></CourseShell>;
}
