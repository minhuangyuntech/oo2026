"use client";

import Link from "next/link";
import {useCallback, useEffect, useRef, useState} from "react";
import {basePath, coursePath, type Language} from "../data";
import {Actor, Bullet, Enemy, FIELD, Game, Player, type GameEvent, type State} from "../game/engine";
import {drawGame} from "../game/draw";
import {eventText, playPath, playText} from "../game/text";
import "./shooter-game.css";

type ObjectView = {name: string; kind: string; x: number; y: number; vx: number; vy: number;
  hp?: number; cooldown?: number; damage?: number; owner?: string; sameOwner?: boolean; groups: string[]};
type View = {state: State; score: number; hp: number; time: number; enemies: number; bullets: number;
  total: number; objects: {name: string; kind: string}[]; selected: ObjectView | null; events: GameEvent[]};
const initialView: View = {state: "ready", score: 0, hp: 3, time: 0, enemies: 3, bullets: 0, total: 4,
  objects: [], selected: null, events: [{kind: "initial"}]};
const languages: Language[] = ["zh", "en", "ja"];
const languageNames = {zh: "中文", en: "English", ja: "日本語"};
const movement = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD", "Space"];

function objectView(actor: Actor, game: Game): ObjectView {
  return {name: actor.name, kind: actor.kind, x: actor.pos.x, y: actor.pos.y, vx: actor.velocity.x, vy: actor.velocity.y,
    hp: actor instanceof Player || actor instanceof Enemy ? actor.hp : undefined,
    cooldown: actor instanceof Player ? actor.cooldown : undefined,
    damage: actor instanceof Bullet ? actor.damage : undefined,
    owner: actor instanceof Bullet ? actor.owner.name : undefined,
    sameOwner: actor instanceof Bullet ? actor.owner === game.player : undefined,
    groups: [game.allSprites.has(actor) ? "all_sprites" : "",
      actor instanceof Enemy && game.enemies.has(actor) ? "enemies" : "",
      actor instanceof Bullet && game.bullets.has(actor) ? "bullets" : ""].filter(Boolean)};
}

export default function ShooterGame({initialLang}: {initialLang: Language}) {
  const [lang, setLang] = useState(initialLang);
  const [view, setView] = useState<View>(initialView);
  const [labels, setLabels] = useState(true);
  const [error, setError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const selectedRef = useRef<Actor | null>(null);
  const keys = useRef(new Set<string>());
  const labelsRef = useRef(true);
  const dirty = useRef(true);
  const t = playText[lang];
  const publish = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    setView({state: g.state, score: g.score, hp: g.player.hp, time: g.elapsed, enemies: g.enemies.size,
      bullets: g.bullets.size, total: g.allSprites.size, objects: [...g.allSprites].map(a => ({name: a.name, kind: a.kind})),
      selected: selectedRef.current ? objectView(selectedRef.current, g) : null, events: [...g.events]});
    dirty.current = true;
  }, []);
  const focus = () => canvasRef.current?.focus({preventScroll: true});
  const reset = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    keys.current.clear(); g.reset(); selectedRef.current = g.player; publish();
  }, [publish]);
  const toggleLabels = useCallback(() => {
    labelsRef.current = !labelsRef.current; setLabels(labelsRef.current); dirty.current = true;
  }, []);
  const pause = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    keys.current.clear();
    if (g.state === "playing") g.pause(); else g.start();
    publish();
  }, [publish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      // Canvas support is checked only in the browser.
      setError(true); return;
    }
    const game = new Game();
    gameRef.current = game; selectedRef.current = game.player;
    const input = keys.current;
    const resize = () => {
      const width = canvas.getBoundingClientRect().width;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(width * FIELD.height / FIELD.width * ratio));
      dirty.current = true;
    };
    const observer = new ResizeObserver(resize); observer.observe(canvas); resize();
    let request = 0, previous = 0, published = -Infinity;
    const frame = (now: number) => {
      const dt = previous ? (now - previous) / 1000 : 0;
      previous = now;
      const wasPlaying = game.state === "playing";
      const down = (...codes: string[]) => codes.some(code => input.has(code)) ? 1 : 0;
      game.tick(dt, down("ArrowRight", "KeyD") - down("ArrowLeft", "KeyA"),
        down("ArrowDown", "KeyS") - down("ArrowUp", "KeyW"), input.has("Space"));
      if (dirty.current || wasPlaying) {
        drawGame(ctx, game, labelsRef.current, selectedRef.current);
        dirty.current = false;
      }
      if (now - published >= 100 && (wasPlaying || published === -Infinity)) { publish(); published = now; }
      request = requestAnimationFrame(frame);
    };
    const stop = () => { input.clear(); game.pause(); previous = 0; publish(); };
    const visibility = () => { if (document.hidden) stop(); };
    const keyDown = (e: KeyboardEvent) => {
      // Shortcuts belong to the focused playfield; Tab remains normal browser navigation.
      if (document.activeElement !== canvas || e.ctrlKey || e.metaKey || e.altKey) return;
      if (movement.includes(e.code)) { e.preventDefault(); input.add(e.code); return; }
      if (!["KeyP", "KeyN", "KeyL", "KeyR", "Enter", "Escape"].includes(e.code)) return;
      e.preventDefault(); if (e.repeat) return;
      if (e.code === "KeyP") pause();
      if (e.code === "KeyN") { game.step(); publish(); }
      if (e.code === "KeyL") toggleLabels();
      if (e.code === "KeyR") reset();
      if (e.code === "Enter") { game.start(); publish(); }
      if (e.code === "Escape") { game.pause(); input.clear(); publish(); }
    };
    const keyUp = (e: KeyboardEvent) => input.delete(e.code);
    window.addEventListener("keydown", keyDown); window.addEventListener("keyup", keyUp);
    window.addEventListener("blur", stop); document.addEventListener("visibilitychange", visibility);
    request = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(request); observer.disconnect(); input.clear();
      window.removeEventListener("keydown", keyDown); window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", stop); document.removeEventListener("visibilitychange", visibility);
      gameRef.current = null;
    };
  }, [pause, publish, reset, toggleLabels]);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : lang;
    document.title = `${playText[lang].title} | OOP 2026`;
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://minhuangyuntech.github.io/oo2026${playPath(lang)}`);
    document.querySelector('meta[name="description"]')?.setAttribute("content", playText[lang].description);
  }, [lang]);
  function changeLanguage(locale: Language) {
    setLang(locale);
    // Changing UI language keeps the same Game, Player, and Bullet instances.
    window.history.replaceState(null, "", `${basePath}${playPath(locale)}`);
  }
  function select(name: string) {
    const game = gameRef.current;
    if (!game) return;
    const actor = [...game.allSprites].find(a => a.name === name);
    if (actor) { game.pause(); keys.current.clear(); selectedRef.current = actor; publish(); }
  }
  function start() { gameRef.current?.start(); publish(); focus(); }
  function snapshot() {
    const game = gameRef.current;
    if (!game) return;
    keys.current.clear(); game.prepareSnapshot(); selectedRef.current = [...game.bullets][0]; publish(); focus();
  }
  function press(code: string) {
    if (gameRef.current?.state !== "playing") return;
    keys.current.add(code);
    if (code === "Space") { gameRef.current.tryShoot(); publish(); }
  }
  const release = (code: string) => keys.current.delete(code);
  function control(code: string, label: string, icon: string, className = "") {
    return <button type="button" className={`sg-touch ${className}`} aria-label={label}
      disabled={view.state !== "playing"}
      onPointerDown={e => {e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); press(code);}}
      onPointerUp={() => release(code)} onPointerCancel={() => release(code)} onLostPointerCapture={() => release(code)}
      onKeyDown={e => {if (e.code === "Space" || e.code === "Enter") {e.preventDefault(); if (!e.repeat) press(code);}}}
      onKeyUp={e => {if (e.code === "Space" || e.code === "Enter") {e.preventDefault(); release(code);}}}
      onBlur={() => release(code)}>{icon}</button>;
  }
  const selected = view.selected;
  const overlay = view.state === "ready" || view.state === "won" || view.state === "lost";
  return <div className="star-lab" lang={lang === "zh" ? "zh-Hant" : lang}>
    <a className="sg-skip" href="#game-main">{t.start}</a>
    <header className="sg-header">
      <Link className="sg-brand" href={coursePath(lang)} aria-label={t.home}>oo<span>.</span><small>2026</small></Link>
      <Link className="sg-back" href={coursePath(lang, "pygame")}>← {t.back}</Link>
      <nav className="sg-languages" aria-label={t.language}>{languages.map(locale =>
        <button key={locale} type="button" lang={locale === "zh" ? "zh-Hant" : locale}
          aria-pressed={lang === locale} onClick={() => changeLanguage(locale)}>{languageNames[locale]}</button>)}</nav>
    </header>
    <main id="game-main" className="sg-main">
      <div className="sg-title-row"><div><p className="sg-eyebrow">PYGAME · BROWSER EDITION</p><h1>{t.title}</h1><p className="sg-subtitle">{t.subtitle}</p></div>
        <div className={`sg-status sg-${view.state}`} role="status"><i/>{t.states[view.state]}</div></div>
      <div className="sg-game-layout">
        <section className="sg-play" aria-label={t.subtitle}>
          <div className="sg-hud">
            <div><span>{t.score}</span><strong data-testid="score">{view.score.toString().padStart(3, "0")} <small>/ 200</small></strong></div>
            <div><span>{t.life}</span><strong className="sg-hearts" aria-label={`${t.life}: ${view.hp}`}><span aria-hidden="true">{"♥".repeat(view.hp)}<em>{"♡".repeat(3 - view.hp)}</em></span></strong></div>
            <div><span>{t.time}</span><strong data-testid="time">{view.time.toFixed(2)}<small> s</small></strong></div>
          </div>
          <div className="sg-canvas-wrap">
            <canvas ref={canvasRef} width={740} height={612} tabIndex={0} role="img" aria-label={t.canvas}
              aria-describedby="game-controls" onBlur={() => keys.current.clear()}
              onPointerDown={e => {
                focus();
                const g = gameRef.current, rect = e.currentTarget.getBoundingClientRect();
                if (!g) return;
                const x = FIELD.left + (e.clientX - rect.left) * FIELD.width / rect.width;
                const y = FIELD.top + (e.clientY - rect.top) * FIELD.height / rect.height;
                const hit = [...g.allSprites].reverse().find(a => Math.abs(a.pos.x - x) <= a.size.x / 2 + 10 && Math.abs(a.pos.y - y) <= a.size.y / 2 + 10);
                if (hit) select(hit.name);
              }}>{t.canvas}</canvas>
            {error && <p className="sg-error" role="alert">{t.error}</p>}
            {overlay && !error && <div className="sg-overlay"><div>
              <span className="sg-orbit" aria-hidden="true">✧</span>
              <p className="sg-eyebrow">{view.state === "ready" ? "ACTOR → PLAYER / ENEMY / BULLET" : t.states[view.state]}</p>
              <h2>{view.state === "ready" ? t.ready : view.state === "won" ? t.win : t.lose}</h2>
              <p>{view.state === "ready" ? t.intro : `${t.score}: ${view.score} / 200`}</p>
              <button className="sg-primary" onClick={() => {if (view.state !== "ready") reset(); start();}}>▶ {view.state === "ready" ? t.start : t.reset}</button>
              <button className="sg-plain" onClick={snapshot}>{t.snapshot} →</button>
            </div></div>}
            {view.state === "paused" && <div className="sg-paused-note"><span>Ⅱ</span>{t.pausedShort}</div>}
          </div>
          <div className="sg-toolbar">
            <button className="sg-primary" disabled={view.state === "won" || view.state === "lost" || error}
              onClick={() => {pause(); focus();}}>{view.state === "playing" ? `Ⅱ ${t.pause}` : `▶ ${view.state === "ready" ? t.start : t.resume}`}</button>
            <button disabled={view.state !== "paused"} onClick={() => {gameRef.current?.step(); publish(); focus();}}>{t.step}</button>
            <button aria-pressed={labels} onClick={toggleLabels}><span aria-hidden="true">{labels ? "☑" : "☐"}</span> {t.labels}</button>
            <button onClick={() => {reset(); focus();}}>{t.reset} ↺</button>
          </div>
          <div className="sg-input-row" id="game-controls">
            <div className="sg-dpad" role="group" aria-label={t.move}>
              {control("ArrowUp", t.up, "↑", "sg-up")}{control("ArrowLeft", t.left, "←", "sg-left")}
              <span aria-hidden="true">✧</span>{control("ArrowRight", t.right, "→", "sg-right")}{control("ArrowDown", t.down, "↓", "sg-down")}
            </div>
            <div className="sg-input-copy"><b>{t.controls}</b><p>{t.keyboard}</p></div>
            {control("Space", t.fire, `◎ ${t.fire}`, "sg-fire")}
          </div>
          <p className="sg-help">{t.focus}</p>
          <p className="sg-help">{view.state === "paused" ? t.paused : t.selectHint}</p>
          <noscript><p>{t.javascript}</p></noscript>
        </section>
        <aside className="sg-inspector" aria-label={t.inspector}>
          <div className="sg-panel-title"><h2>{t.inspector}</h2><span>{view.state === "playing" ? t.live : t.frozen}</span></div>
          <div className="sg-counts" aria-label={t.counts}>{[["Player", 1], ["Enemy", view.enemies], ["Bullet", view.bullets]].map(([name, count]) =>
            <div key={name}><strong>{count}</strong><span>{name}</span></div>)}</div>
          <div className="sg-selector"><label htmlFor="object-select">{t.select}</label><select id="object-select"
            value={selected?.name ?? "player"} onChange={e => select(e.target.value)}>
            {selected && !selected.groups.length && <option value={selected.name}>{selected.name}: {selected.kind} ({t.inactive})</option>}
            {view.objects.map(a => <option value={a.name} key={a.name}>{a.name}: {a.kind}</option>)}
          </select></div>
          {selected && <section className="sg-object" aria-label={t.selected}>
            <div className="sg-object-heading"><code>{selected.name}: {selected.kind}</code><span className={selected.groups.length ? "" : "sg-inactive"}>{selected.groups.length ? t.active : t.inactive}</span></div>
            <dl>
              <div><dt>{t.position} (x, y)</dt><dd data-testid="position">({selected.x.toFixed(1)}, {selected.y.toFixed(1)})</dd></div>
              <div><dt>{t.velocity} (px/s)</dt><dd>({selected.vx.toFixed(1)}, {selected.vy.toFixed(1)})</dd></div>
              {selected.hp !== undefined && <div><dt>hp</dt><dd>{selected.hp}</dd></div>}
              {selected.cooldown !== undefined && <div><dt>cooldown</dt><dd>{selected.cooldown.toFixed(2)} s</dd></div>}
              {selected.damage !== undefined && <div><dt>damage</dt><dd>{selected.damage}</dd></div>}
              {selected.owner && <div><dt>owner</dt><dd>→ {selected.owner}</dd></div>}
            </dl>
            <h3>{t.membership}</h3>
            <div className="sg-group-chips">{selected.groups.map(group => <code key={group}>{group}</code>)}</div>
            <p>{selected.groups.length > 1 ? t.same : !selected.groups.length ? t.removed : "game.player → player"}</p>
            {selected.owner && <><code className="sg-reference">owner === game.player → {String(selected.sameOwner)}</code><p>{t.owner}</p></>}
          </section>}
          <section className="sg-relationships"><h3>{t.classes}</h3><div className="sg-class-tree" aria-hidden="true"><code>Actor</code><span>△</span><div><code>Player</code><code>Enemy</code><code>Bullet</code></div></div><p>{t.inheritance}</p>
            <code className="sg-reference">game.all_sprites → {view.total}<br/>game.enemies → {view.enemies}<br/>game.bullets → {view.bullets}</code>
            {!view.bullets && <p>{t.noBullet}</p>}
          </section>
          <section className="sg-events"><h3>{t.events}</h3><ol>{view.events.map((event, i) => <li key={i}>{eventText(event, lang)}</li>)}</ol></section>
          <button className="sg-example" onClick={snapshot}>{t.snapshot} →</button><p className="sg-help">{t.snapshotNote}</p>
        </aside>
      </div>
      <section className="sg-bottom"><div><h2>{t.goal}</h2><p>{t.rule}</p><p>{t.autoPause}</p></div><div><p>{t.port}</p><Link href={coursePath(lang, "pygame")}>{t.back} →</Link></div></section>
    </main>
  </div>;
}
