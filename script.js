const container = document.getElementById("fireworksContainer");
const canvas = document.createElement("canvas");
container.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Firework {
  constructor(x, y, targetY) {
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.velocity = {
      x: (Math.random() - 0.5) * 1, // Random horizontal velocity
      y: -Math.random() * 2 - 2, // Vertical velocity
    };
    this.gravity = 0.02; // Gravity factor
    this.exploded = false;
  }

  update() {
    // Reduce the vertical velocity each frame to simulate gravity
    if (this.velocity.y < 0) {
      // Only reduce if the firework is moving upwards
      this.velocity.y += this.gravity;
    }

    // Update position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Check if the firework has reached its peak and should explode
    if ((this.velocity.y >= 0 || this.y <= this.targetY) && !this.exploded) {
      this.explode();
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  explode() {
    this.exploded = true; // Set the flag when exploded
    for (let i = 0; i < 15; i++) {
      particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Math.random() * 2 + 1;
    this.velocity = {
      x: (Math.random() - 0.5) * 6, // Slower horizontal spread
      y: (Math.random() - 0.5) * 6, // Slower vertical initial velocity
    };
    this.gravity = 0.1; // Gravity pulling particles down
    this.alpha = 1;
  }

  update() {
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let fireworks = [];
let particles = [];
let maxFireworks = 4;
let fps = 30;
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;

function animate() {
  requestAnimationFrame(animate);
  now = Date.now();
  delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.02 && fireworks.length < maxFireworks) {
    let newFireworksCount = Math.floor(
      Math.random() * (maxFireworks - fireworks.length + 1)
    );
    for (let j = 0; j < newFireworksCount; j++) {
      const x = Math.random() * canvas.width;

      // Adjust targetY to ensure fireworks explode higher
      // Set a minimum height at 2/3 of the screen
      const minHeight = canvas.height * (2 / 3);
      // Randomness up to an additional 1/12 of the screen height
      const randomHeight = Math.random() * (canvas.height / 12);

      const targetY = minHeight - randomHeight;

      fireworks.push(new Firework(x, canvas.height, targetY));
    }
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    const firework = fireworks[i];
    firework.update();
    firework.draw();
    if (firework.exploded) {
      fireworks.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.update();
    particle.draw();
    if (particle.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

animate();
