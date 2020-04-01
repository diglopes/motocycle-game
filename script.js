const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 360;
document.body.appendChild(canvas);

const perm = [];
while (perm.length < 255) {
  while (perm.includes(val = Math.floor(Math.random() * 255)));
  perm.push(val);
}

const lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;
const noise = x => {
    x = (x * 0.01) % 255;
  return lerp(perm[Math.floor(x)], perm[(Math.ceil(x))], x - Math.floor(x));
};

let t = 0
function renderLoop() {
  t++
  ctx.fillStyle = "#19f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height)
  for (let i = 0; i < canvas.width; i++) {
    ctx.lineTo(i, canvas.height - noise(t + i) * 0.25);
  }
  ctx.lineTo(canvas.width, canvas.height)
  ctx.fill();
  requestAnimationFrame(renderLoop);
}

renderLoop();
