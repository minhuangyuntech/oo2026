"use client";

import {useState} from "react";
import guides from "../../content/game-variables.json";
import {basePath,coursePath,type Language} from "../data";
import {variableText} from "../variable-text";
import "./variable-reference.css";

type Section = {id:string;title:string[];file:string;rows:{name:string;value:string;meaning:string[]}[];notes:string[][];code?:string};
const languages:Language[]=["zh","en","ja"];
const languageNames={zh:"中文",en:"English",ja:"日本語"};

export default function VariableReference({lang,unit}:{lang:Language;unit:"pygame"|"memory"}) {
  const [query,setQuery]=useState("");
  const t=variableText[lang],index=languages.indexOf(lang),guide=guides[unit];
  const needle=query.trim().toLocaleLowerCase();
  const sections=(guide.sections as Section[]).map(section=>{
    const context=[section.title[index],section.file,...section.notes.map(note=>note[index]),section.code||""].join(" ").toLocaleLowerCase();
    return {...section,rows:section.rows.filter(row=>!needle||context.includes(needle)||[row.name,row.value,row.meaning[index]].join(" ").toLocaleLowerCase().includes(needle))};
  }).filter(section=>section.rows.length||(!needle||[section.title[index],...section.notes.map(note=>note[index]),section.code||""].join(" ").toLocaleLowerCase().includes(needle)));
  const count=sections.reduce((sum,section)=>sum+section.rows.length,0);
  return <section id="variables" className="variable-guide" aria-labelledby="variable-title">
    <header className="variable-heading"><p className="kicker">{t.eyebrow}</p><h2 id="variable-title">{t.title}</h2><p>{guide.intro[index]}</p>
      <nav className="variable-languages" aria-label={t.switch}>{languages.map(language=><a key={language} href={`${basePath}${coursePath(language,unit)}#variables`} hrefLang={language==="zh"?"zh-Hant":language} lang={language==="zh"?"zh-Hant":language} aria-current={language===lang?"page":undefined}>{languageNames[language]}</a>)}</nav>
    </header>
    <div className="variable-search"><label htmlFor="variable-search">{t.search}</label><div><input id="variable-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.placeholder}/>{query&&<button onClick={()=>setQuery("")}>{t.clear}</button>}</div><p role="status">{count} {t.results}</p></div>
    <nav className="variable-index" aria-label={t.sections}>{sections.map(section=><a href={`#variables-${section.id}`} key={section.id}>{section.title[index]}</a>)}</nav>
    {sections.length===0&&<p className="no-results">{t.none}</p>}
    {sections.map(section=><section className="variable-section" id={`variables-${section.id}`} key={section.id} aria-labelledby={`variable-title-${section.id}`}>
      <p className="variable-file">{section.file}</p><h3 id={`variable-title-${section.id}`}>{section.title[index]}</h3>
      {section.rows.length>0&&<div className="variable-table-wrap" tabIndex={0} role="region" aria-label={section.title[index]}><table><thead><tr><th scope="col">{t.name}</th><th scope="col">{t.value}</th><th scope="col">{t.meaning}</th></tr></thead><tbody>{section.rows.map((row,i)=><tr key={`${row.name}-${i}`}><th scope="row"><code>{row.name}</code></th><td><code>{row.value}</code></td><td>{row.meaning[index]}</td></tr>)}</tbody></table></div>}
      {section.notes.map((note,i)=><p className="variable-note" key={i}>{note[index]}</p>)}
      {section.code&&<pre className="variable-code" tabIndex={0}><code>{section.code}</code></pre>}
      <a className="variable-return" href="#variables">↑ {t.top}</a>
    </section>)}
  </section>;
}
