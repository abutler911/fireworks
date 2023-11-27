const container = document.getElementById("fireworksContainer");
const canvas = document.createElement("canvas");
container.appendChild(canvas);

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Firework {
  constructor(x, y, targetY) {
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.velocity = -Math.random() * 3 - 4; // Negative for upward movement
  }

  update() {
    this.y += this.velocity;

    // Check if firework has reached its peak (targetY)
    if (this.y <= this.targetY) {
      // TODO: Handle the explosion
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
    for (let i = 0; i < 30; i++) {
      // Create 30 particles
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
      x: Math.random() - 0.5, // Random direction
      y: Math.random() - 0.5,
    };
    this.alpha = 1; // For fade-out effect
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01; // Gradually fade out
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

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Trail effect
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Handle fireworks
  if (Math.random() < 0.05) {
    // Random chance to spawn a firework
    const x = Math.random() * canvas.width;
    const targetY = (Math.random() * canvas.height) / 2;
    fireworks.push(new Firework(x, canvas.height, targetY));
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    const firework = fireworks[i];
    firework.update();
    firework.draw();

    if (firework.y <= firework.targetY) {
      fireworks.splice(i, 1); // Remove firework after explosion
    }
  }

  // Handle particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.update();
    particle.draw();

    if (particle.alpha <= 0) {
      particles.splice(i, 1); // Remove particle after it fades out
    }
  }
}

animate();
