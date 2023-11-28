class Firework {
  constructor(x, y, targetY, ctx) {
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.ctx = ctx;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.velocity = { x: (Math.random() - 0.5) * 1, y: -Math.random() * 2 - 2 };
    this.gravity = 0.02;
    this.exploded = false;
  }

  update() {
    if (this.velocity.y < 0) {
      this.velocity.y += this.gravity;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if ((this.velocity.y >= 0 || this.y <= this.targetY) && !this.exploded) {
      this.explode();
    }
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  explode() {
    this.exploded = true;
    for (let i = 0; i < 30; i++) {
      particles.push(new Particle(this.x, this.y, this.color, this.ctx));
    }
  }
}

class Particle {
  constructor(x, y, color, ctx) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.ctx = ctx;
    this.radius = Math.random() * 2 + 1;
    this.velocity = {
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 6,
    };
    this.gravity = 0.1;
    this.alpha = 1;
  }

  update() {
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
}

const container = document.getElementById("fireworksContainer");
const canvas = document.createElement("canvas");
container.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let particles = [];
const maxFireworks = 4;

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.02 && fireworks.length < maxFireworks) {
    const newFireworksCount = Math.floor(
      Math.random() * (maxFireworks - fireworks.length + 1)
    );
    for (let j = 0; j < newFireworksCount; j++) {
      const x = Math.random() * canvas.width;
      const targetY =
        canvas.height / 4 +
        Math.random() * (canvas.height / 3 - canvas.height / 4);
      fireworks.push(new Firework(x, canvas.height, targetY, ctx));
    }
  }

  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if (firework.exploded) {
      fireworks.splice(index, 1);
    }
  });

  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    }
  });
}

function drawStarryBackground() {
  const starCount = (canvas.width + canvas.height) / 2;
  ctx.fillStyle = "white";
  for (let i = 0; i < starCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

drawStarryBackground();
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawStarryBackground();
});
animate();
