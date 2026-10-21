"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseShell from "./course-shell";
import {memoryPlayPath,memoryText} from "../memory/text";
import {playPath,playText} from "../game/text";
import {basePath,chapterRanges,guiInfo,guiRanges,djangoInfo,djangoRanges,pygameInfo,pygameRanges,memoryInfo,memoryRanges,unitRanges,coursePath,laterWeeks,ui,weekInfo,weekLabel,type UnitId,type Language} from "../data";

export default function CourseHome({lang}:{lang:Language}) {
  const t=ui[lang];
  const [resume,setResume]=useState<{week:UnitId;chapter:number}|null>(null);
  useEffect(()=>{
    try {
      const raw=JSON.parse(localStorage.getItem("oo2026-last-read")||"null");
      if(raw&&(raw.week==="gui"||raw.week==="django"||raw.week==="pygame"||raw.week==="memory"||(Number.isInteger(raw.week)&&raw.week>=1&&raw.week<=6))&&Number.isInteger(raw.chapter)&&raw.chapter>=1&&raw.chapter<=unitRanges(raw.week).length) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setResume(raw);
      }
    } catch { /* The course remains usable when browser storage is unavailable. */ }
  },[]);
  return <CourseShell lang={lang}><main id="main-content" className="overview-content" tabIndex={-1}>
    <section className="overview-hero">
      <div className="hero-copy"><p className="kicker"><span/>{t.term} · PYTHON OOP</p><h1>{t.welcome}</h1><p className="hero-description">{t.intro}</p><div className="hero-buttons"><Link className="action-primary" href={resume?`${coursePath(lang,resume.week)}#chapter-${resume.chapter}`:coursePath(lang,1)}>{resume?t.continue:t.start}<span aria-hidden="true">→</span></Link><a className="text-action" href="#learning-materials">{t.materials} ↓</a></div>{resume&&<p className="resume-caption">{t.saved} · {weekLabel(lang,resume.week)} · {t.chapter} {resume.chapter}</p>}</div>
      <div className="object-illustration" aria-hidden="true"><div className="object-window"><div className="window-top"><span/><span/><span/><b>student.py</b></div><pre><span className="syntax-purple">class</span> <span className="syntax-mint">Student</span>:<br/>{"    "}<span className="syntax-purple">def</span> learn(self):<br/>{"        "}self.understand()<br/>{"        "}self.build()<br/>{"        "}self.improve()</pre></div><div className="object-pill">identity <span>·</span> state <span>·</span> behavior</div><div className="object-link"/><div className="instance-row"><span><i/>amy = Student()</span><span><i/>bob = Student()</span></div><div className="figure-caption">ONE CLASS. MANY POSSIBILITIES.</div></div>
    </section>
    <div className="overview-facts"><div><strong>10</strong><span>{t.scope}</span></div><div><strong>361</strong><span>{t.slides}</span></div><div><strong>03</strong><span>{t.translation}</span></div><div><strong>Python</strong><span>3.12+</span></div></div>
    <section id="learning-materials" className="materials-section"><div className="section-heading-row"><div><p className="kicker">LEARN · EXPLORE · BUILD</p><h2>{t.materials}</h2></div><span className="edition-badge">{t.updated}</span></div>
      <div className="lesson-cards">{weekInfo[lang].map((item,i)=><article className="lesson-card" key={item.title}><div className="card-top"><span className="week-index">0{i+1}</span><span className="topic-tag">{item.tag}</span></div><h3><Link href={coursePath(lang,i+1)}>{item.title}</Link></h3><p>{item.summary}</p><div className="card-bottom"><span>{chapterRanges[i].length} {t.chapters}<i/> {[23,67,40,56,11,19][i]} {t.slides}</span><Link aria-label={`${t.read} · ${weekLabel(lang,i+1)}`} href={coursePath(lang,i+1)}>{t.read} <span aria-hidden="true">↗</span></Link></div></article>)}</div>
    </section>
    <section className="gui-feature"><div><p className="kicker">DESKTOP GUI · PYTHON</p><h2>{guiInfo[lang].title}</h2><p>{guiInfo[lang].summary}</p><div className="gui-tool-tags">{["Tkinter","Qt","wxPython","Kivy","Dear PyGui"].map(tool=><span key={tool}>{tool}</span>)}</div></div><div><span>{guiRanges.length} {t.chapters} · 32 {t.slides}</span><Link className="action-primary" href={coursePath(lang,"gui")}>{t.read} ↗</Link></div></section>
    <section className="gui-feature django-feature"><div><p className="kicker">DJANGO · WEB DEVELOPMENT</p><h2>{djangoInfo[lang].title}</h2><p>{djangoInfo[lang].summary}</p><div className="gui-tool-tags">{["Project / App","URL / View","Model / ORM","Template / Form"].map(item=><span key={item}>{item}</span>)}</div></div><div><span>{djangoRanges.length} {t.chapters} · 53 {t.slides}</span><Link className="action-primary" href={coursePath(lang,"django")}>{t.read} ↗</Link></div></section>
    <section className="gui-feature pygame-feature"><div><p className="kicker">PYGAME · OBJECTS IN ACTION</p><h2>{pygameInfo[lang].title}</h2><p>{pygameInfo[lang].summary}</p><div className="gui-tool-tags">{["Actor","Player","Enemy","Bullet","Game"].map(item=><span key={item}>{item}</span>)}</div></div><div><span>{pygameRanges.length} {t.chapters} · 33 {t.slides}</span><Link className="action-primary" href={playPath(lang)}>▶ {playText[lang].launch}</Link><Link className="text-action" href={coursePath(lang,"pygame")}>{t.read} ↗</Link></div></section>
    <section className="gui-feature memory-feature"><div><p className="kicker">CARD MATCHING · OBJECT STATE</p><h2>{memoryInfo[lang].title}</h2><p>{memoryInfo[lang].summary}</p><div className="gui-tool-tags">{["Card","Board","Game"].map(item=><span key={item}>{item}</span>)}</div></div><div><span>{memoryRanges.length} {t.chapters} · 27 {t.slides}</span><Link className="action-primary" href={memoryPlayPath(lang)}>▶ {memoryText[lang].launch}</Link><Link className="text-action" href={coursePath(lang,"memory")}>{t.read} ↗</Link><a className="text-action" download href={`${basePath}/materials/memory-oop-trilingual.zip`}>↓ {memoryText[lang].desktopDownload}</a></div></section>
    <section className="project-overview"><div><p className="kicker">FROM CONCEPT TO PRACTICE</p><h2>{t.individual}</h2><p>{t.individualNote}</p></div><div className="assessment-panel"><h3>{t.assessment}</h3>{[["30%",t.attendance],["30%",t.midterm],["40%",t.project]].map(([percent,label])=><div key={label}><span>{label}</span><strong>{percent}</strong></div>)}</div></section>
    <section id="full-outline" className="outline-section"><div className="section-heading-row"><div><p className="kicker">COURSE ROADMAP</p><h2>{t.outline}</h2></div></div><p className="muted">{t.laterNote}</p><div className="outline-list">{laterWeeks[lang].slice(2).map((title,index)=><Link key={title} href={`/week/${index+7}/`}><span className="outline-number">{String(index+7).padStart(2,"0")}</span><b>{title}</b><small>{t.original}</small><span aria-hidden="true">↗</span></Link>)}</div></section>
  </main></CourseShell>;
}
