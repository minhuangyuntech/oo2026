import test from 'node:test';
import assert from 'node:assert/strict';
import {Card, Board, Game} from '../app/memory/engine.ts';

test('board has 12 independent cards, two per pair',()=>{
 const b=new Board(); assert.equal(new Set(b.cards).size,12);
 const counts={};for(const c of b.cards)counts[c.pair_id]=(counts[c.pair_id]||0)+1;
 assert.deepEqual(Object.values(counts),[2,2,2,2,2,2]);assert.equal(new Set(b.cards.map(c=>c.name)).size,12);
});
test('matched cards remain revealed and cannot be revealed again',()=>{
 const c=new Card('C01','moon');assert.equal(c.reveal(),true);assert.equal(c.reveal(),false);
 c.hide();assert.equal(c.face_up,false);c.mark_matched();c.hide();assert.equal(c.face_up,true);assert.equal(c.reveal(),false);
});
test('queueing holds the board object and does not flip it',()=>{
 const g=new Game(true);assert.equal(g.step(),false);assert.equal(g.queue('bad'),false);
 assert.equal(g.queue('C01'),true);assert.equal(g.pending,g.board.cards[0]);assert.equal(g.pending.face_up,false);
 assert.equal(g.queue('C02'),false);assert.equal(g.step(),true);assert.equal(g.first,g.board.cards[0]);assert.equal(g.pending,null);
});
test('comparison and settlement are distinct steps; equal values are not identity',()=>{
 const g=new Game(true);g.queue('C01');g.step();g.queue('C02');g.step();
 assert.equal(g.phase,'compare');assert.equal(g.turns,0);assert.notEqual(g.first,g.second);
 assert.equal(g.first.pair_id,g.second.pair_id);assert.equal(g.queue('C03'),false);
 g.step();assert.equal(g.phase,'resolve');assert.equal(g.result,true);assert.equal(g.matches,0);assert.equal(g.first.matched,false);
 g.step();assert.equal(g.matches,1);assert.equal(g.turns,1);assert.equal(g.phase,'first');assert.equal(g.first,null);
 assert.equal(g.board.cards[0].matched,true);assert.equal(g.queue('C01'),false);assert.equal(g.step(),false);
});
test('mismatch hides the same two objects, clears temporary references',()=>{
 const g=new Game(true),a=g.board.get('C03'),b=g.board.get('C04');
 g.play('C03');assert.equal(g.queue('C03'),false);g.play('C04');g.step();assert.equal(g.result,false);
 assert.equal(a.face_up,true);g.step();assert.equal(a.face_up,false);assert.equal(b.face_up,false);
 assert.equal(g.board.get('C03'),a);assert.equal(g.first,null);assert.equal(g.second,null);assert.equal(g.turns,1);assert.equal(g.matches,0);
});
test('normal play waits for confirmation and all six pairs complete the game',()=>{
 const g=new Game(true);
 for(const [a,b] of [['C01','C02'],['C03','C05'],['C04','C06'],['C07','C09'],['C08','C11'],['C10','C12']]){
  g.play(a);g.play(b);assert.equal(g.phase,'compare');g.finish_turn();
 }
 assert.equal(g.phase,'won');assert.equal(g.turns,6);assert.equal(g.matches,6);
 assert.equal(g.can_step,false);assert.equal(g.queue('C01'),false);g.finish_turn();assert.equal(g.turns,6);
});
test('a new game creates new objects without changing an existing reference',()=>{
 const old=new Game(true);old.play('C01');const ref=old.first;const next=new Game(true);
 assert.notEqual(ref,next.board.cards[0]);assert.equal(ref.face_up,true);assert.equal(next.board.cards[0].face_up,false);
});
test('invalid transitions and repeated settlement do not alter counters',()=>{
 const g=new Game(true);g.compare();g.settle();g.finish_turn();assert.equal(g.turns,0);
 g.play('C01');g.play('C02');g.finish_turn();g.settle();g.compare();assert.equal(g.turns,1);assert.equal(g.matches,1);
});
