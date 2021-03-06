const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const motocycleImg = new Image();
motocycleImg.src = "./assets/motocycle.png";

canvas.width = 500;
canvas.height = 350;
document.body.appendChild(canvas);

const perm = [];
while (perm.length < 255) {
  while (perm.includes((val = Math.floor(Math.random() * 255))));
  perm.push(val);
}

const lerp = (a, b, t) => a + ((b - a) * (1 - Math.cos(t * Math.PI))) / 2;
const noise = x => {
  x = (x * 0.01) % 255;
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
};

const player = {
  x: canvas.width / 2,
  y: 0,
  rot: 0,
  rSpeed: 0,
  ySpeed: 0,
  draw() {
    let p1 = canvas.height - noise(t + this.x) * 0.25;
    let p2 = canvas.height - noise(t + 5 + this.x) * 0.25;
    let grounded = 0;

    if (p1 - 15 > this.y) {
      this.ySpeed += 0.1;
    } else {
      this.ySpeed -= this.y - (p1 - 15);
      this.y = p1 - 15;
      grounded = 1;
    }

    if (!playing || (grounded && Math.abs(this.rot) > Math.PI * 0.5)) {
      playing = false;
      this.rSpeed = 5;
      keys.ArrowUp = 1;
      this.x -= speed * 5;
    }

    let angle = Math.atan2(p2 - 15 - this.y, this.x + 5 - this.x);
    this.y += this.ySpeed;

    if (grounded && playing) {
      this.rot -= (this.rot - angle) * 0.5;
      this.rSpeed = this.rSpeed - (angle - this.rot);
    }
    this.rSpeed += (keys.ArrowLeft - keys.ArrowRight) * 0.05;
    this.rot -= this.rSpeed * 0.1;
    if (this.rot > Math.PI) this.rot = -Math.PI;
    if (this.rot < -Math.PI) this.rot = Math.PI;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.drawImage(motocycleImg, -15, -15, 30, 30);
    ctx.restore();
  }
};

let t = 0;
let speed = 0;
const keys = {
  ArrowUp: 0,
  ArrowDown: 0,
  ArrowLeft: 0,
  ArrowRight: 0
};
let playing = true;
function renderLoop() {
  speed -= (speed - (keys.ArrowUp - keys.ArrowDown)) * 0.1;
  t += 10 * speed;
  ctx.fillStyle = "#19f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  console.log();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  for (let i = 0; i < canvas.width; i++) {
    ctx.lineTo(i, canvas.height - noise(t + i) * 0.25);
  }
  ctx.lineTo(canvas.width, canvas.height);
  ctx.fill();

  player.draw();
  requestAnimationFrame(renderLoop);
}

onkeydown = d => (keys[d.key] = 1);
onkeyup = d => (keys[d.key] = 0);

renderLoop();
