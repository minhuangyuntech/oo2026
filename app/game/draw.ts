import {Actor, Bullet, Enemy, FIELD, Game, Player} from "./engine";

const colors = {Player: "#68edbe", Enemy: "#ff8b81", Bullet: "#ffd67b", Actor: "#edf4fb"};
export function drawGame(ctx: CanvasRenderingContext2D, game: Game, labels: boolean, selected: Actor | null) {
  const scale = ctx.canvas.width / FIELD.width;
  const labelSize = Math.max(14, 11 * FIELD.width / Math.max(1, ctx.canvas.clientWidth));
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = "#0b1422";
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.translate(-FIELD.left, -FIELD.top);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#17273b";
  for (let x = FIELD.left; x <= FIELD.right; x += 46) {
    ctx.beginPath(); ctx.moveTo(x, FIELD.top); ctx.lineTo(x, FIELD.bottom); ctx.stroke();
  }
  for (let y = FIELD.top; y <= FIELD.bottom; y += 46) {
    ctx.beginPath(); ctx.moveTo(FIELD.left, y); ctx.lineTo(FIELD.right, y); ctx.stroke();
  }
  for (let i = 0; i < 48; i++) {
    ctx.fillStyle = i % 3 ? "#45617c" : "#8ca2b7";
    ctx.fillRect(FIELD.left + (i * 173 + 37) % FIELD.width, FIELD.top + (i * 127 + 53) % FIELD.height, 1.5, 1.5);
  }
  ctx.strokeStyle = "#ff8b8166"; ctx.setLineDash([6, 7]);
  ctx.beginPath(); ctx.moveTo(FIELD.left, FIELD.bottom - 2); ctx.lineTo(FIELD.right, FIELD.bottom - 2); ctx.stroke(); ctx.setLineDash([]);
  if (labels && selected instanceof Bullet && selected.groups.size) {
    ctx.strokeStyle = "#ffd67b88"; ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.moveTo(selected.pos.x, selected.pos.y); ctx.lineTo(selected.owner.pos.x, selected.owner.pos.y); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = `${labelSize}px ui-monospace, monospace`; ctx.fillStyle = "#ffd67b";
    ctx.fillText("owner → player", Math.min(selected.pos.x + 18, FIELD.right - labelSize * 9), (selected.pos.y + selected.owner.pos.y) / 2);
  }
  for (const actor of game.allSprites) {
    const {x, y} = actor.pos, {left, top} = actor.rect;
    const color = actor instanceof Enemy && actor.maxHp > 1 ? "#bca2ff" : colors[actor.kind];
    ctx.save(); ctx.translate(x, y);
    if (actor instanceof Player) {
      ctx.globalAlpha = actor.invulnerable > 0 ? 0.6 : 1;
      ctx.fillStyle = "#68edbe"; ctx.beginPath();
      ctx.moveTo(0, -24); ctx.lineTo(21, 18); ctx.lineTo(0, 9); ctx.lineTo(-21, 18); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#153b45"; ctx.beginPath();
      ctx.moveTo(0, -12); ctx.lineTo(7, 7); ctx.lineTo(-7, 7); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#edf4fb"; ctx.fillRect(-1, -20, 2, 8);
      if (game.state === "playing") {
        ctx.fillStyle = "#68edbe66"; ctx.beginPath(); ctx.moveTo(-5, 13); ctx.lineTo(0, 24); ctx.lineTo(5, 13); ctx.fill();
      }
    } else if (actor instanceof Enemy) {
      ctx.fillStyle = color; ctx.beginPath();
      ctx.moveTo(-19, -17); ctx.lineTo(18, -17); ctx.lineTo(21, 5); ctx.lineTo(0, 19); ctx.lineTo(-22, 5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#252a43"; ctx.fillRect(-14, -8, 28, 10);
      ctx.fillStyle = "#edf4fb";
      for (const eye of [-7, 7]) { ctx.beginPath(); ctx.arc(eye, -3, 3, 0, Math.PI * 2); ctx.fill(); }
      for (let hp = 0; hp < actor.maxHp; hp++) {
        ctx.fillStyle = hp < actor.hp ? color : "#33465b"; ctx.fillRect(-11 + hp * 13, 27, 9, 3);
      }
    } else {
      ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(-4, -10, 8, 20, 4); ctx.fill();
      ctx.fillStyle = "#edf4fb"; ctx.fillRect(-1, -8, 2, 10);
    }
    ctx.restore();
    if (labels || actor === selected) {
      ctx.strokeStyle = actor === selected ? "#ffffff" : `${color}77`;
      ctx.lineWidth = actor === selected ? 2 : 1;
      ctx.setLineDash(actor === selected ? [] : [3, 4]);
      ctx.strokeRect(left - 4, top - 4, actor.size.x + 8, actor.size.y + 8); ctx.setLineDash([]);
    }
    if (labels) {
      const label = `${actor.name}: ${actor.kind}`;
      ctx.font = `bold ${labelSize}px ui-monospace, SFMono-Regular, Consolas, monospace`;
      const w = ctx.measureText(label).width + 14;
      const lx = Math.max(FIELD.left + 5, Math.min(x - w / 2, FIELD.right - w - 5));
      const ly = Math.max(FIELD.top + 4, top - labelSize - 15);
      ctx.fillStyle = "#0b1422ee"; ctx.beginPath(); ctx.roundRect(lx, ly, w, labelSize + 8, 4); ctx.fill();
      ctx.fillStyle = color; ctx.fillText(label, lx + 7, ly + labelSize + 2);
    }
  }
}
