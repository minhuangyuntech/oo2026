"use client";
import {useCallback,useEffect,useState} from 'react';
import Link from 'next/link';
import {basePath,coursePath,type Language} from '../data';
import {Game,type PairId} from '../memory/engine';
import {memoryPlayPath,memoryText} from '../memory/text';
import './memory-game.css';

const symbols:Record<PairId,string>={moon:'☾',leaf:'❧',sun:'☀',star:'✦',gem:'◆',flower:'✿'};
export default function MemoryGame({initialLang}:{initialLang:Language}){
 const [lang,setLang]=useState(initialLang),[game,setGame]=useState(()=>new Game());
 const [observe,setObserve]=useState(false),[labels,setLabels]=useState(true),[selected,setSelected]=useState('C01');
 const [,render]=useState(0),[demo,setDemo]=useState<'match'|'miss'|null>(null);
 const t=memoryText[lang],card=game.board.get(selected)!;
 const refresh=()=>render(n=>n+1);
 const step=useCallback(()=>{if(game.step())render(n=>n+1);},[game]);
 useEffect(()=>{
  const handler=(event:KeyboardEvent)=>{
   if(event.ctrlKey||event.metaKey||event.altKey||event.repeat||(event.target instanceof HTMLElement&&event.target.closest('input,select,textarea,[contenteditable=true]')))return;
   if(event.key.toLowerCase()==='n'&&observe){event.preventDefault();step();}
   if(event.key.toLowerCase()==='l'){event.preventDefault();setLabels(v=>!v);}
  };
  window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);
 },[observe,step]);
 useEffect(()=>{
  document.documentElement.lang=lang==='zh'?'zh-Hant':lang;
  document.title=`${memoryText[lang].title} | OOP 2026`;
  document.querySelector('meta[name="description"]')?.setAttribute('content',memoryText[lang].description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href','https://minhuangyuntech.github.io/oo2026'+memoryPlayPath(lang));
 },[lang]);
 function language(next:Language){setLang(next);history.replaceState(null,'',basePath+memoryPlayPath(next));}
 function reset(example:'match'|'miss'|null){setGame(new Game(!!example));setSelected(example==='miss'?'C03':'C01');setDemo(example);if(example)setObserve(true);}
 function pick(name:string){setSelected(name);if(observe)game.queue(name);else game.play(name);refresh();}
 function primary(){if(observe||game.pending)step();else{game.finish_turn();refresh();}}
 const action=game.pending?`${t.reveal} ${game.pending.name}`:game.phase==='compare'?t.compare:game.phase==='resolve'?(game.result?t.keep:t.hide):game.phase==='won'?t.complete:t.wait;
 return <div className="memory-lab">
  <a className="ml-skip" href="#memory-main">{t.board}</a>
  <header className="ml-top"><Link href={coursePath(lang)}>{t.home}</Link><Link href={coursePath(lang,'memory')}>← {t.back}</Link><nav aria-label={t.language}>{(['zh','en','ja'] as Language[]).map(l=><button key={l} lang={l==='zh'?'zh-Hant':l} aria-pressed={lang===l} onClick={()=>language(l)}>{({zh:'中文',en:'English',ja:'日本語'})[l]}</button>)}</nav></header>
  <main id="memory-main"><div className="ml-heading"><div><p className="ml-kicker">PAIR LAB / OBJECT-ORIENTED DESIGN</p><h1>{t.title}</h1><p>{t.subtitle}</p></div><div className="ml-score"><span><b>{game.matches}<small> / 6</small></b>{t.pairs}</span><span><b>{game.turns}</b>{t.turns}</span></div></div>
   <div className="ml-toolbar"><div className="ml-modes"><button aria-pressed={!observe} onClick={()=>setObserve(false)}>{t.normal}</button><button aria-pressed={observe} onClick={()=>setObserve(true)}>{t.observe}</button></div><button aria-pressed={labels} onClick={()=>setLabels(v=>!v)}>{labels?'●':'○'} {t.labels}</button><button onClick={()=>reset(null)}>{t.new} ↻</button></div>
   <div className="ml-layout"><section className="ml-play" aria-label={t.board}>
    <div className="ml-flow" aria-label={t.phases[game.phase]}>{(['first','second','compare','resolve'] as const).map((phase,i)=><span key={phase} className={game.phase===phase?'active':''}><b>{i+1}</b>{t.phases[phase]}</span>)}</div>
    <p className="ml-instruction">{observe?t.hintObserve:t.hintPlay}</p>
    {demo&&<p className="ml-demo-note">{demo==='match'?t.demoMatch:t.demoMiss}</p>}
    <div className="ml-action"><button className="ml-primary" disabled={!game.can_step} onClick={primary}>{observe?`${t.step} · ${action}`:game.pending?action:t.confirm}<span aria-hidden="true"> →</span></button><p role="status" aria-live="polite">{game.phase==='won'?t.complete:t.phases[game.phase]}{game.pending?` · ${t.queue}: ${game.pending.name}`:''}</p></div>
    <div className="ml-board" id="memory-board">{game.board.cards.map(c=>{
     const state=c.matched?t.matched:c.face_up?t.face:t.hidden;
     const locked=c.face_up||c.matched||!!game.pending||!['first','second'].includes(game.phase);
     return <button key={c.name} className={`ml-card ${c.face_up?'up':'down'} ${c.matched?'matched':''} ${game.pending===c?'pending':''} ${selected===c.name&&observe?'selected':''}`} data-card-id={c.name} aria-label={`${c.name}: Card · ${state}${c.face_up?' · '+t.pairNames[c.pair_id]:''}`} aria-disabled={locked} onClick={()=>{if(!locked)pick(c.name);else setSelected(c.name);}}>
      <span className="ml-card-face" aria-hidden="true">{c.face_up?<><span className={`ml-symbol ${c.pair_id}`}>{symbols[c.pair_id]}</span><span>{t.pairNames[c.pair_id]}</span></>:<><span className="ml-card-back">?</span><span>CARD</span></>}</span>
      {labels&&<code>{c.name}: Card</code>}{c.matched&&<span className="ml-card-check" aria-hidden="true">✓</span>}{game.pending===c&&<span className="ml-pending-dot" aria-hidden="true">●</span>}
     </button>;
    })}</div>
    {game.phase==='won'&&<div className="ml-win" role="status"><h2>{t.win}</h2><p>{t.winNote}</p></div>}
    <p className="ml-keys">{t.keys}</p>
   </section>
   <aside className="ml-inspector" aria-label={t.inspector}><div className="ml-panel-title"><h2>{t.inspector}</h2><span>Card</span></div><label htmlFor="memory-select">{t.select}</label><select id="memory-select" value={selected} onChange={e=>setSelected(e.target.value)}>{game.board.cards.map(c=><option key={c.name} value={c.name}>{c.name}: Card</option>)}</select>
    <div className="ml-object"><h3>{card.name}: Card</h3><dl><div><dt>pair_id</dt><dd>{observe||card.face_up?card.pair_id:t.secret}</dd></div><div><dt>face_up</dt><dd>{String(card.face_up)}</dd></div><div><dt>matched</dt><dd>{String(card.matched)}</dd></div></dl><p>{t.inspectNote}</p></div>
    <h3>{t.references}</h3><dl className="ml-refs">{(['first','second','pending'] as const).map(key=><div key={key}><dt>game.{key}</dt><dd>{game[key]?.name??'null'}</dd></div>)}</dl>
    {(['first','second','pending'] as const).filter(k=>game[k]===card).map(k=><p className="ml-identity" key={k}><code>game.{k} === board.cards[{game.board.cards.indexOf(card)}]</code><b>true · {t.identity}</b></p>)}<p className="ml-small">{t.noCopy}</p>
    <div className="ml-state"><code>phase = &quot;{game.phase}&quot;</code><code>result = {String(game.result)}</code></div>
    <h3>{t.events}</h3><ol className="ml-events">{game.events.map((ev,i)=><li key={`${i}-${ev.kind}`}>{t.event[ev.kind].replace('{cards}',ev.names.join(', '))}</li>)}</ol>
   </aside></div>
   <section className="ml-examples"><div><h2>{t.examples}</h2><p>{t.exampleNote}</p></div><div><button onClick={()=>reset('match')}>{t.matchDemo}</button><button onClick={()=>reset('miss')}>{t.missDemo}</button></div></section>
   <section className="ml-model"><div><h2>{t.model}</h2><p>{t.modelNote}</p><p className="ml-small">{t.port}</p></div><div className="ml-class-line"><span><b>Game</b><code>first · second · pending</code></span><i>→</i><span><b>Board</b><code>cards[0..11]</code></span><i>→</i><span><b>12 × Card</b><code>pair_id · face_up · matched</code></span></div></section>
  </main><footer>PAIR LAB · OOP 2026 <Link href={coursePath(lang,'memory')}>{t.back} ↗</Link></footer>
 </div>;
}
