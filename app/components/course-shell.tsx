"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { basePath, coursePath, languageNames, locales, ui, modernWeeks, unitInfo, weekLabel, guiInfo, djangoInfo, pygameInfo, memoryInfo, type UnitId, type Language } from "../data";

export default function CourseShell({lang,week,children}:{lang:Language;week?:UnitId;children:React.ReactNode}) {
  const t=ui[lang];
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const escape=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false);};
    window.addEventListener("keydown",escape);
    return ()=>window.removeEventListener("keydown",escape);
  },[]);
  return <div className="learning-site" id="page-top">
    <a className="skip-link" href="#main-content">{t.skip}</a>
    {open && <button className="nav-scrim" aria-label={t.close} onClick={()=>setOpen(false)}/>}
    <aside id="course-navigation" className={`course-sidebar ${open?"is-open":""}`}>
      <Link href={coursePath(lang)} className="course-brand"><span className="brand-mark">oo<span>.</span></span><span>PYTHON<br/><strong>2026</strong></span></Link>
      <p className="sidebar-course">{t.course}</p>
      <nav aria-label={t.menu} className="course-nav">
        <Link className={!week?"nav-home active":"nav-home"} href={coursePath(lang)} aria-current={!week?"page":undefined}><span aria-hidden="true">⌂</span>{t.home}</Link>
        <p className="nav-caption">{t.materials}<span>01–08</span></p>
        {modernWeeks.map(unit=>{const item=unitInfo(lang,unit);return <Link className={`nav-week ${week===unit?"active":""}`} key={item.title} href={coursePath(lang,unit)} aria-current={week===unit?"page":undefined}><span className="nav-number">{String(unit).padStart(2,"0")}</span><span><small>{item.tag}</small><b>{item.title}</b></span>{week===unit&&<i aria-hidden="true"/>}</Link>;})}
        <Link className={`nav-week ${week==="gui"?"active":""}`} href={coursePath(lang,"gui")} aria-current={week==="gui"?"page":undefined}><span className="nav-number">GUI</span><span><small>{guiInfo[lang].tag}</small><b>{guiInfo[lang].title}</b></span></Link>
        <Link className={`nav-week ${week==="django"?"active":""}`} href={coursePath(lang,"django")} aria-current={week==="django"?"page":undefined}><span className="nav-number">WEB</span><span><small>{djangoInfo[lang].tag}</small><b>{djangoInfo[lang].title}</b></span></Link>
        <Link className={`nav-week ${week==="pygame"?"active":""}`} href={coursePath(lang,"pygame")} aria-current={week==="pygame"?"page":undefined}><span className="nav-number">OOP</span><span><small>{pygameInfo[lang].tag}</small><b>{pygameInfo[lang].title}</b></span></Link>
        <Link className={`nav-week ${week==="memory"?"active":""}`} href={coursePath(lang,"memory")} aria-current={week==="memory"?"page":undefined}><span className="nav-number">PAIR</span><span><small>{memoryInfo[lang].tag}</small><b>{memoryInfo[lang].title}</b></span></Link>
        <Link className="later-link" href={`${coursePath(lang)}#full-outline`}>{t.allWeeks}<span aria-hidden="true">↗</span></Link>
      </nav>
      <div className="sidebar-bottom"><span className="semester-dot"/>{t.term}<p>{t.school}<br/>{t.instructor}</p><a href="https://eclass.yuntech.edu.tw/" target="_blank" rel="noreferrer">eClass <span aria-hidden="true">↗</span></a></div>
    </aside>
    <div className="course-workspace">
      <header className="learning-topbar">
        <button className="menu-toggle" aria-label={t.menu} aria-expanded={open} aria-controls="course-navigation" onClick={()=>setOpen(!open)}><span aria-hidden="true">☰</span></button>
        <div className="breadcrumbs"><Link href={coursePath(lang)}>{t.home}</Link>{week&&<><span aria-hidden="true">/</span><b>{weekLabel(lang,week)}</b></>}</div>
        <nav className="language-switch" aria-label={t.language}>
          {locales.map(locale=><a key={locale} lang={locale==="zh"?"zh-Hant":locale} href={`${basePath}${coursePath(locale,week)}`} aria-current={locale===lang?"true":undefined} onClick={e=>{if(week&&window.location.hash)e.currentTarget.href=`${basePath}${coursePath(locale,week)}${window.location.hash}`;}}>{languageNames[locale]}</a>)}
        </nav>
      </header>
      {children}
      <footer className="learning-footer"><p>{t.credits}</p><a href="#page-top">{t.top} ↑</a></footer>
    </div>
  </div>;
}
