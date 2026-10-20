/** Browser port of the course's five-class Pygame example.
 * World coordinates and rules match output/pygame_oop_shooter.
 * Rendering and translations live outside these objects.
 */
export const FIELD = {left: 24, top: 112, right: 764, bottom: 724, width: 740, height: 612};
export const TARGET = 200;
export const STEP = 1 / 60;
export type State = "ready" | "playing" | "paused" | "won" | "lost";
export type Kind = "Actor" | "Player" | "Enemy" | "Bullet";
export type Point = {x: number; y: number};
export type GameEvent = {kind: "initial" | "shot" | "hit" | "contact" | "missed" | "snapshot"; name?: string; target?: string; hp?: number};

export class Actor {
  name: string;
  kind: Kind;
  pos: Point;
  size: Point;
  velocity: Point = {x: 0, y: 0};
  groups = new Set<Set<Actor>>();
  constructor(name: string, pos: Point, size: Point, kind: Kind = "Actor") {
    this.name = name;
    this.pos = {...pos};
    this.size = {...size};
    this.kind = kind;
  }
  get rect() {
    const x = Math.round(this.pos.x), y = Math.round(this.pos.y);
    return {left: x - this.size.x / 2, right: x + this.size.x / 2,
      top: y - this.size.y / 2, bottom: y + this.size.y / 2};
  }
  join(...groups: Set<Actor>[]) {
    for (const group of groups) { group.add(this); this.groups.add(group); }
  }
  kill() {
    for (const group of this.groups) group.delete(this);
    this.groups.clear();
  }
  update(dt: number) {
    this.pos.x += this.velocity.x * dt;
    this.pos.y += this.velocity.y * dt;
  }
}

export class Player extends Actor {
  hp = 3;
  cooldown = 0;
  invulnerable = 0;
  constructor() { super("player", {x: 394, y: 664}, {x: 44, y: 48}, "Player"); }
  setDirection(x: number, y: number) {
    const length = Math.max(1, Math.hypot(x, y));
    this.velocity = {x: x / length * 330, y: y / length * 330};
  }
  update(dt: number) {
    super.update(dt);
    this.pos.x = Math.max(FIELD.left + 22, Math.min(this.pos.x, FIELD.right - 22));
    this.pos.y = Math.max(FIELD.top + 24, Math.min(this.pos.y, FIELD.bottom - 24));
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.invulnerable = Math.max(0, this.invulnerable - dt);
  }
  shoot(name: string) {
    if (this.cooldown > 0 || this.hp === 0) return null;
    this.cooldown = 0.22;
    return new Bullet(name, this);
  }
  takeDamage() {
    if (this.invulnerable > 0 || this.hp === 0) return false;
    this.hp -= 1;
    this.invulnerable = 0.8;
    return true;
  }
}

export class Enemy extends Actor {
  hp: number;
  maxHp: number;
  constructor(name: string, pos: Point, speed = 80, hp = 1) {
    super(name, pos, {x: 44, y: 40}, "Enemy");
    this.velocity.y = speed;
    this.hp = hp;
    this.maxHp = hp;
  }
  takeHit(damage: number) {
    this.hp = Math.max(0, this.hp - damage);
    if (this.hp === 0) { this.kill(); return true; }
    return false;
  }
}

export class Bullet extends Actor {
  owner: Player;
  damage = 1;
  constructor(name: string, owner: Player) {
    super(name, {x: Math.round(owner.pos.x), y: owner.rect.top - 9}, {x: 8, y: 20}, "Bullet");
    this.owner = owner;
    this.velocity.y = -620;
  }
  update(dt: number) {
    super.update(dt);
    if (this.rect.bottom < FIELD.top) this.kill();
  }
}

export function overlaps(a: Actor, b: Actor) {
  const x = a.rect, y = b.rect;
  return x.left < y.right && x.right > y.left && x.top < y.bottom && x.bottom > y.top;
}

export class Game {
  player = new Player();
  allSprites = new Set<Actor>();
  enemies = new Set<Enemy>();
  bullets = new Set<Bullet>();
  state: State = "ready";
  score = 0;
  elapsed = 0;
  spawnTimer = 1.15;
  nextEnemy = 1;
  nextBullet = 1;
  events: GameEvent[] = [];
  random: () => number;
  constructor(random: () => number = Math.random) { this.random = random; this.reset(); }
  log(event: GameEvent) { this.events = [...this.events.slice(-3), event]; }
  reset() {
    for (const actor of this.allSprites) actor.kill();
    this.player = new Player();
    this.player.join(this.allSprites);
    this.state = "ready"; this.score = 0; this.elapsed = 0;
    this.spawnTimer = 1.15; this.nextEnemy = 1; this.nextBullet = 1;
    this.spawnEnemy({x: 180, y: 180}, 65, 1);
    this.spawnEnemy({x: 395, y: 235}, 85, 2);
    this.spawnEnemy({x: 620, y: 175}, 100, 1);
    this.events = [{kind: "initial"}];
  }
  spawnEnemy(pos?: Point, speed?: number, hp?: number) {
    const enemy = new Enemy(`E${String(this.nextEnemy++).padStart(2, "0")}`,
      pos ?? {x: 59 + Math.floor(this.random() * 671), y: 88},
      speed ?? 65 + Math.floor(this.random() * 46), hp ?? (this.random() < 2 / 3 ? 1 : 2));
    enemy.join(this.enemies, this.allSprites);
    return enemy;
  }
  tryShoot() {
    if (this.state !== "playing") return null;
    const bullet = this.player.shoot(`B${String(this.nextBullet).padStart(2, "0")}`);
    if (bullet) {
      this.nextBullet++;
      bullet.join(this.bullets, this.allSprites);
      this.log({kind: "shot", name: bullet.name});
    }
    return bullet;
  }
  resolveCollisions() {
    for (const bullet of [...this.bullets]) {
      const enemy = [...this.enemies].find(enemy => overlaps(bullet, enemy));
      if (enemy) {
        if (enemy.takeHit(bullet.damage)) this.score += 10;
        bullet.kill();
        this.log({kind: "hit", name: bullet.name, target: enemy.name, hp: enemy.hp});
      }
    }
    for (const enemy of [...this.enemies]) {
      const touching = overlaps(enemy, this.player);
      if (touching || enemy.rect.top > FIELD.bottom) {
        enemy.kill();
        if (this.player.takeDamage()) this.log({kind: touching ? "contact" : "missed", hp: this.player.hp});
      }
    }
  }
  update(dt: number) {
    // Each object chooses its own update() implementation (polymorphism).
    for (const actor of [...this.allSprites]) actor.update(dt);
    this.elapsed += dt;
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) { this.spawnEnemy(); this.spawnTimer += 1.15; }
    this.resolveCollisions();
    if (this.player.hp === 0) this.state = "lost";
    else if (this.score >= TARGET) this.state = "won";
  }
  tick(dt: number, x = 0, y = 0, shooting = false) {
    if (this.state !== "playing" || !Number.isFinite(dt) || dt <= 0) return;
    this.player.setDirection(x, y);
    this.update(Math.min(dt, 1 / 30));
    if (shooting) this.tryShoot();
  }
  start() { if (this.state === "ready" || this.state === "paused") this.state = "playing"; }
  pause() { if (this.state === "playing") this.state = "paused"; }
  step() {
    if (this.state !== "paused") return;
    this.player.setDirection(0, 0);
    this.update(STEP);
  }
  prepareSnapshot() {
    this.reset(); this.state = "paused";
    for (const y of [490, 370]) {
      const bullet = new Bullet(`B${String(this.nextBullet++).padStart(2, "0")}`, this.player);
      bullet.pos.y = y;
      bullet.join(this.bullets, this.allSprites);
    }
    this.events = [{kind: "snapshot"}];
  }
}
