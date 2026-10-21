// The model has no UI, timers, or translations. One step performs one transition.
export type PairId = "moon" | "leaf" | "sun" | "star" | "gem" | "flower";
export type Phase = "first" | "second" | "compare" | "resolve" | "won";
export const SAMPLE: PairId[] = ["moon","moon","leaf","sun","leaf","sun","star","gem","star","flower","gem","flower"];

export class Card {
  name: string;
  pair_id: PairId;
  face_up = false;
  matched = false;
  constructor(name: string, pair_id: PairId) { this.name = name; this.pair_id = pair_id; }
  reveal(): boolean {
    if (this.face_up || this.matched) return false;
    this.face_up = true;
    return true;
  }
  hide(): void { if (!this.matched) this.face_up = false; }
  mark_matched(): void { this.face_up = true; this.matched = true; }
}

export class Board {
  cards: Card[];
  constructor(sample = false, random: () => number = Math.random) {
    const pairs = [...SAMPLE];
    if (!sample) for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    this.cards = pairs.map((pair, i) => new Card(`C${String(i+1).padStart(2,"0")}`, pair));
  }
  get(name: string): Card | undefined { return this.cards.find(card => card.name === name); }
  get complete(): boolean { return this.cards.every(card => card.matched); }
}

export type EventKind = "new" | "sample" | "queued" | "first" | "second" | "equal" | "different" | "matched" | "hidden" | "won";
export type GameEvent = {kind: EventKind; names: string[]};
export class Game {
  board: Board;
  first: Card | null = null;
  second: Card | null = null;
  pending: Card | null = null;
  phase: Phase = "first";
  result: boolean | null = null;
  turns = 0;
  matches = 0;
  events: GameEvent[];
  constructor(sample = false, random: () => number = Math.random) {
    this.board = new Board(sample, random);
    this.events = [{kind:sample ? "sample" : "new", names:[]}];
  }
  log(kind: EventKind, names: string[] = []): void {
    this.events = [...this.events.slice(-5), {kind, names}];
  }
  queue(name: string): boolean {
    if (!['first','second'].includes(this.phase) || this.pending) return false;
    const card = this.board.get(name);
    if (!card || card.face_up || card.matched) return false;
    this.pending = card;
    this.log("queued", [card.name]);
    return true;
  }
  get can_step(): boolean { return !!this.pending || this.phase === "compare" || this.phase === "resolve"; }
  step(): boolean {
    if (this.pending && (this.phase === "first" || this.phase === "second")) {
      const card = this.pending;
      this.pending = null;
      card.reveal();
      if (this.phase === "first") { this.first = card; this.phase = "second"; this.log("first", [card.name]); }
      else { this.second = card; this.phase = "compare"; this.log("second", [card.name]); }
      return true;
    }
    if (this.phase === "compare") { this.compare(); return true; }
    if (this.phase === "resolve") { this.settle(); return true; }
    return false;
  }
  compare(): void {
    if (this.phase !== "compare" || !this.first || !this.second) return;
    this.result = this.first.pair_id === this.second.pair_id;
    this.turns += 1;
    this.phase = "resolve";
    this.log(this.result ? "equal" : "different", [this.first.name, this.second.name]);
  }
  settle(): void {
    if (this.phase !== "resolve" || !this.first || !this.second) return;
    const names = [this.first.name, this.second.name];
    if (this.result) {
      this.first.mark_matched(); this.second.mark_matched(); this.matches += 1;
      this.log("matched", names);
    } else { this.first.hide(); this.second.hide(); this.log("hidden", names); }
    this.first = null; this.second = null; this.result = null;
    this.phase = this.board.complete ? "won" : "first";
    if (this.phase === "won") this.log("won");
  }
  // Normal play reveals immediately. Confirmation compares and settles together.
  play(name: string): boolean { if (!this.queue(name)) return false; return this.step(); }
  finish_turn(): void { if (this.phase === "compare") this.compare(); if (this.phase === "resolve") this.settle(); }
}
