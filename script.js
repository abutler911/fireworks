class Firework {
  constructor(x, y, targetY, ctx) {
    this.x = x;
    this.y = canvas.height;
    this.targetY = targetY;
    this.ctx = ctx;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.velocity = { x: (Math.random() - 0.5) * 1, y: -Math.random() * 4 - 4 };
    this.gravity = 0.035;
    this.exploded = false;
    this.angle = 0;
    this.spiralAmount = Math.random() * 0.1 - 0.6;
  }

  update() {
    this.angle += this.spiralAmount;
    this.velocity.x += Math.cos(this.angle) * 0.2;

    if (this.velocity.y < 0) {
      this.velocity.y += this.gravity;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    const isSlowingDown = this.velocity.y > 0;
    const isAboveMinimumHeight = this.y < canvas.height - 50;
    const isBelowTopEdge = this.y > 0;

    if (
      ((isSlowingDown && isAboveMinimumHeight) || !isBelowTopEdge) &&
      !this.exploded
    ) {
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
    playExplosionSound();

    const explosionType = Math.floor(Math.random() * 7);

    switch (explosionType) {
      case 0:
        this.circularExplosion();
        break;
      case 1:
        this.scatterExplosion();
        break;
      case 2:
        this.starburstExplosion();
        break;
      case 3:
        this.spiralExplosion();
        break;
      case 4:
        this.randomBurstExplosion();
        break;
      case 5:
        this.flowerExplosion();
        break;
      case 6:
        this.ringExplosion();
        break;
      default:
        this.circularExplosion();
    }
  }

  circularExplosion() {
    const numParticles = 30;
    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
      particles.push(
        new Particle(this.x, this.y, this.color, this.ctx, velocity)
      );
    }
  }

  scatterExplosion() {
    const numParticles = Math.floor(Math.random() * 20) + 20;
    for (let i = 0; i < numParticles; i++) {
      const velocity = {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
      };
      particles.push(
        new Particle(this.x, this.y, this.color, this.ctx, velocity)
      );
    }
  }

  starburstExplosion() {
    const numRays = 10;
    const particlesPerRay = 5;
    for (let i = 0; i < numRays; i++) {
      const angle = (i / numRays) * Math.PI * 2;
      for (let j = 0; j < particlesPerRay; j++) {
        const velocity = {
          x: Math.cos(angle) * (j + 1),
          y: Math.sin(angle) * (j + 1),
        };
        particles.push(
          new Particle(this.x, this.y, this.color, this.ctx, velocity)
        );
      }
    }
  }

  spiralExplosion() {
    const numParticles = 100;
    const spirals = 3;
    for (let i = 0; i < numParticles; i++) {
      const angle = spirals * Math.PI * (i / numParticles);
      const radius = (i / numParticles) * 4;
      const velocity = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
      particles.push(
        new Particle(this.x, this.y, this.color, this.ctx, velocity)
      );
    }
  }

  randomBurstExplosion() {
    const numParticles = 40;
    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      const radius = Math.random() * 2 + 1;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };
      particles.push(
        new Particle(this.x, this.y, this.color, this.ctx, velocity, radius)
      );
    }
  }

  flowerExplosion() {
    const petals = 5;
    const particlesPerPetal = 10;
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      for (let j = 0; j < particlesPerPetal; j++) {
        const petalAngle = angle + ((j / particlesPerPetal) * Math.PI) / petals;
        const velocity = {
          x: Math.cos(petalAngle) * 4,
          y: Math.sin(petalAngle) * 4,
        };
        particles.push(
          new Particle(this.x, this.y, this.color, this.ctx, velocity)
        );
      }
    }
  }

  ringExplosion() {
    const numParticles = 50;
    const ringRadius = 5;

    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      const velocity = {
        x: Math.cos(angle) * ringRadius,
        y: Math.sin(angle) * ringRadius,
      };
      particles.push(
        new Particle(this.x, this.y, this.color, this.ctx, velocity)
      );
    }
  }
}

class CometFirework extends Firework {
  constructor(x, y, targetY, ctx) {
    super(x, y, targetY, ctx);
    this.color = "white"; // Specific color for the comet
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 4, 0, Math.PI * 4);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x - this.velocity.x * 4, this.y - this.velocity.y * 4);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }
}

class Particle {
  constructor(x, y, color, ctx, velocity, radius = null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.ctx = ctx;
    this.radius = radius || Math.random() * 2 + 1;
    this.velocity = velocity || {
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 6,
    };
    this.gravity = 0.1;
    this.alpha = 1;
    this.lifetime = 0;
  }

  update() {
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    // this.alpha -= 0.01;
    this.lifetime += 1;
    this.alpha = Math.exp(-0.05 * this.lifetime);
    if (this.alpha <= 0.01) {
      this.alpha = 0;
    }
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

class Cannon {
  constructor(x, ctx) {
    this.x = x;
    this.y = canvas.height - 30;
    this.ctx = ctx;
    this.isFiring = false;
  }

  draw() {
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(this.x - 10, canvas.height - 30, 20, 30);

    this.ctx.beginPath();
    this.ctx.moveTo(this.x - 5, this.y);
    this.ctx.lineTo(this.x - 5, this.y - 20);
    this.ctx.lineTo(this.x + 5, this.y - 20);
    this.ctx.lineTo(this.x + 5, this.y);
    this.ctx.closePath();
    this.ctx.fill();

    if (this.isFiring) {
      let gradient = this.ctx.createLinearGradient(
        this.x,
        this.y - 30,
        this.x,
        this.y - 50
      );
      gradient.addColorStop(0, "yellow");
      gradient.addColorStop(0.5, "orange");
      gradient.addColorStop(1, "red");

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - 10, this.y - 20);
      this.ctx.lineTo(this.x, this.y - 50);
      this.ctx.lineTo(this.x + 10, this.y - 20);
      this.ctx.closePath();
      this.ctx.fill();

      this.isFiring = false;
    }
  }

  launchFirework() {
    const targetY = Math.random() * (canvas.height / 6) + canvas.height / 12;
    fireworks.push(new Firework(this.x, this.y, targetY, this.ctx));
    this.isFiring = true;
  }
}

const container = document.getElementById("fireworksContainer");
const canvas = document.createElement("canvas");
container.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const explosionSound = new Audio("./boom.mp3");
explosionSound.preload = "auto";

let fireworks = [];
let particles = [];
const maxFireworks = 4;

const explosionSounds = [];
const maxSounds = 25;

for (let i = 0; i < maxSounds; i++) {
  explosionSounds.push(new Audio("./boom.mp3"));
}

const numCannons = 6;
const cannons = [];

function createCannons() {
  cannons.length = 0;

  const numCannons = window.innerWidth <= 768 ? 3 : 6;
  for (let i = 0; i < numCannons; i++) {
    const xPosition = (canvas.width / (numCannons + 1)) * (i + 1);
    cannons.push(new Cannon(xPosition, ctx));
  }
}

createCannons();

function playExplosionSound() {
  const sound = explosionSounds.pop();
  if (sound) {
    sound.play();
    explosionSounds.unshift(sound);
  }
}

function launchFirework() {
  const x = Math.random() * canvas.width;
  const targetY = Math.random() * (canvas.height / 6) + canvas.height / 12;

  console.log(
    "Launching firework - x:",
    x,
    "targetY:",
    targetY,
    "canvas height:",
    canvas.height
  );

  fireworks.push(new Firework(x, canvas.height, targetY, ctx));
}

let lastTime = 0;

function animate(timestamp) {
  requestAnimationFrame(animate);

  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  const movement = (100 * deltaTime) / 1000;

  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Randomly decide to launch a comet from one of the cannons
  if (Math.random() < 0.002) {
    // Adjust this probability to control frequency
    const randomCannonIndex = Math.floor(Math.random() * cannons.length);
    const cannon = cannons[randomCannonIndex];
    const targetY = Math.random() * (canvas.height / 6) + canvas.height / 12;

    fireworks.push(new CometFirework(cannon.x, canvas.height, targetY, ctx));
    cannon.isFiring = true;
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

  ctx.fillStyle = "brown";
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

  cannons.forEach((cannon) => {
    cannon.draw();
    if (Math.random() < 0.01) {
      cannon.launchFirework();
    }
  });
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createCannons();
});

animate();
