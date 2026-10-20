import test from "node:test";
import assert from "node:assert/strict";
import {Actor, Bullet, FIELD, Game, Player, STEP} from "../app/game/engine.ts";

const game = () => new Game(() => 0.5);
const empty = () => { const g = game(); for (const enemy of g.enemies) enemy.kill(); g.start(); return g; };

test("initial scene and five classes match the Pygame example", () => {
  const g = game();
  assert.equal(g.state, "ready"); assert.equal(g.enemies.size, 3); assert.equal(g.allSprites.size, 4);
  assert.deepEqual([...g.enemies].map(e => [e.name, e.pos.x, e.pos.y, e.hp, e.velocity.y]),
    [["E01", 180, 180, 1, 65], ["E02", 395, 235, 2, 85], ["E03", 620, 175, 1, 100]]);
  assert.ok(g.player instanceof Actor); assert.ok([...g.enemies][0] instanceof Actor);
});
test("groups retain identity and removal does not destroy referenced objects", () => {
  const g = game(), enemy = [...g.enemies][0];
  assert.ok(g.allSprites.has(enemy));
  enemy.hp = 7; assert.equal([...g.allSprites].find(a => a.name === enemy.name).hp, 7);
  enemy.kill(); assert.ok(!g.allSprites.has(enemy)); assert.ok(!g.enemies.has(enemy));
  assert.equal(enemy.groups.size, 0); assert.equal(enemy.hp, 7);
});
test("normalized diagonal movement and field limits", () => {
  const p = new Player(); p.setDirection(1, 1);
  assert.ok(Math.abs(Math.hypot(p.velocity.x, p.velocity.y) - 330) < 1e-9);
  p.update(100); assert.equal(p.rect.right, FIELD.right); assert.equal(p.rect.bottom, FIELD.bottom);
  p.setDirection(-1, -1); p.update(100); assert.equal(p.rect.left, FIELD.left); assert.equal(p.rect.top, FIELD.top);
});
test("float movement is independent of frame rate", () => {
  for (const fps of [30, 60, 120]) {
    const p = new Player(); p.setDirection(1, 0);
    for (let i = 0; i < fps / 2; i++) p.update(1 / fps);
    assert.ok(Math.abs(p.pos.x - 559) < 1e-8);
  }
});
test("each successful shot is new; all bullets share the actual owner", () => {
  const g = empty(), b1 = g.tryShoot();
  assert.ok(b1 instanceof Bullet); assert.equal(b1.owner, g.player);
  assert.equal(g.tryShoot(), null); assert.equal(g.nextBullet, 2);
  g.player.update(0.23); const b2 = g.tryShoot();
  assert.notEqual(b1, b2); assert.equal(b1.owner, b2.owner);
  assert.ok(g.allSprites.has(b1)); assert.ok(g.bullets.has(b1));
});
test("a bullet damages only the first overlapping enemy", () => {
  const g = empty();
  const e1 = g.spawnEnemy({x: 394, y: 400}, 0, 1), e2 = g.spawnEnemy({x: 394, y: 400}, 0, 1);
  const bullet = g.tryShoot(); bullet.pos.y = 400;
  g.resolveCollisions(); g.resolveCollisions();
  assert.equal(g.score, 10); assert.equal(e1.hp, 0); assert.equal(e2.hp, 1);
  assert.ok(!g.bullets.has(bullet)); assert.ok(!g.allSprites.has(bullet));
});
test("two-hit enemy awards points once", () => {
  const g = empty(), e = g.spawnEnemy({x: 394, y: 400}, 0, 2);
  g.tryShoot().pos.y = 400; g.resolveCollisions();
  assert.equal(e.hp, 1); assert.equal(g.score, 0);
  g.player.update(0.23); g.tryShoot().pos.y = 400; g.resolveCollisions();
  assert.equal(g.score, 10); assert.equal(g.enemies.size, 0);
});
test("polymorphic update cleans up offscreen bullets", () => {
  const g = empty(), b = g.tryShoot(), e = g.spawnEnemy({x: 180, y: 180}, 65);
  b.pos.y = 100; g.update(STEP);
  assert.ok(e.pos.y > 180); assert.equal(b.groups.size, 0); assert.equal(g.bullets.size, 0);
});
test("collisions and missed enemies respect invulnerability", () => {
  const g = empty();
  g.spawnEnemy({...g.player.pos}, 0); g.spawnEnemy({x: 100, y: 800}, 0);
  g.resolveCollisions(); assert.equal(g.player.hp, 2); assert.equal(g.enemies.size, 0);
  g.player.update(0.81); g.spawnEnemy({x: 100, y: 800}, 0); g.resolveCollisions();
  assert.equal(g.player.hp, 1);
});
test("paused time is frozen, single-step advances exactly 1/60 s", () => {
  const g = game(); g.start(); g.tick(STEP, 1, 0, true); g.pause();
  const time = g.elapsed, pos = {...g.player.pos}, enemy = [...g.enemies][0], y = enemy.pos.y;
  g.tick(1, 1, 1, true); assert.equal(g.elapsed, time); assert.deepEqual(g.player.pos, pos);
  assert.equal(g.tryShoot(), null);
  g.step(); assert.ok(Math.abs(g.elapsed - time - STEP) < 1e-10);
  assert.equal(enemy.pos.y, y + 65 * STEP); assert.deepEqual(g.player.pos, pos); assert.equal(g.state, "paused");
  g.start(); g.tick(STEP); assert.equal(g.state, "playing");
});
test("snapshot is a paused scene with two owner references", () => {
  const g = game(); g.prepareSnapshot();
  assert.equal(g.state, "paused"); assert.equal(g.allSprites.size, 6);
  assert.deepEqual([...g.bullets].map(b => b.pos.y), [490, 370]);
  for (const b of g.bullets) assert.equal(b.owner, g.player);
});
test("reset clears old groups and makes fresh instances", () => {
  const g = game(); g.prepareSnapshot(); const objects = [...g.allSprites];
  g.reset();
  assert.equal(g.state, "ready"); assert.equal(g.bullets.size, 0); assert.equal(g.elapsed, 0);
  assert.ok(objects.every(a => a.groups.size === 0)); assert.ok(!objects.includes(g.player));
});
test("win and loss freeze the simulation; zero lives take priority", () => {
  for (const [score, hp, state] of [[200, 3, "won"], [0, 0, "lost"], [200, 0, "lost"]]) {
    const g = empty(); g.score = score; g.player.hp = hp; g.update(STEP);
    assert.equal(g.state, state); const time = g.elapsed;
    g.tick(STEP, 1, 1, true); g.step(); g.start();
    assert.equal(g.state, state); assert.equal(g.elapsed, time); assert.equal(g.tryShoot(), null);
  }
});
test("invalid deltas are ignored and a long frame is capped", () => {
  const g = empty(); g.tick(NaN); g.tick(-1); g.tick(Infinity);
  assert.equal(g.elapsed, 0); g.tick(100); assert.equal(g.elapsed, 1 / 30);
});
test("spawn cadence matches the original 1.15-second interval", () => {
  const g = game(); g.start();
  for (let i = 0; i < 68; i++) g.tick(STEP);
  assert.equal(g.enemies.size, 3); g.tick(STEP);
  assert.equal(g.enemies.size, 4);
});
test("an idle game reaches game over through escaped enemies", () => {
  const g = game(); g.start();
  for (let i = 0; i < 60 * 30 && g.state === "playing"; i++) g.tick(STEP);
  assert.equal(g.state, "lost"); assert.equal(g.player.hp, 0);
});
