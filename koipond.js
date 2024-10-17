let fish = [];
let ripples = [];
let lilies = [];
let cherubs = [];

function setup() {
    let canvas = createCanvas(710, 400);
    canvas.parent('p5-canvas-container'); // Attach canvas to the HTML div
    colorMode(HSB);

  // Initialize fish
  for (let i = 0; i < 5; i++) {
    fish.push(new Fish(random(width), random(height), random(30, 60)));
  }

  // Initialize lily pads
  for (let i = 0; i < 7; i++) {
    lilies.push(new LilyPad(random(width), random(height)));
  }

  // Initialize cherubs
  for (let i = 0; i < 2; i++) {
    cherubs.push(new Cherub(random(width), random(height)));
  }
}

function draw() {
  // Create a Renaissance-inspired background
  setGradientBackground();

  // Draw decorative frame
  drawFrame();

  // Update and display elements
  updateAndDisplayElements();

  // Add vignette effect
  drawVignette();
}

function setGradientBackground() {
  // Create a vertical gradient from deep blue to lighter blue
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(210, 50, 20), color(200, 30, 60), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawFrame() {
  push();
  noFill();
  strokeWeight(20);
  stroke(30, 70, 50);
  rect(0, 0, width, height);

  // Add decorative corners
  let cornerSize = 50;
  stroke(40, 80, 60);
  arc(cornerSize, cornerSize, cornerSize * 2, cornerSize * 2, 0, HALF_PI);
  arc(
    width - cornerSize,
    cornerSize,
    cornerSize * 2,
    cornerSize * 2,
    HALF_PI,
    PI
  );
  arc(
    width - cornerSize,
    height - cornerSize,
    cornerSize * 2,
    cornerSize * 2,
    PI,
    PI + HALF_PI
  );
  arc(
    cornerSize,
    height - cornerSize,
    cornerSize * 2,
    cornerSize * 2,
    PI + HALF_PI,
    TWO_PI
  );
  pop();
}

function updateAndDisplayElements() {
  // Update and display fish
  for (let f of fish) {
    f.update();
    f.display();
  }

  // Display lily pads
  for (let lily of lilies) {
    lily.display();
  }

  // Update and display cherubs
  for (let cherub of cherubs) {
    cherub.update();
    cherub.display();
  }

  // Display and update ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].display();
    ripples[i].expand();
    if (ripples[i].isFinished()) {
      ripples.splice(i, 1);
    }
  }
}

function drawVignette() {
  let gradient = drawingContext.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    width
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.7)");
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, width, height);
}

class Fish {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.hue = random(20, 40);
    this.speed = random(0.5, 1);
    this.angle = random(TWO_PI);
  }

  update() {
    this.angle += random(-0.05, 0.05);
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;

    if (random(1) < 0.02) {
      ripples.push(new Ripple(this.x, this.y));
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Fish body
    fill(this.hue, 70, 80);
    ellipse(0, 0, this.size, this.size / 2);

    // Tail
    triangle(
      -this.size / 2,
      0,
      -this.size * 0.8,
      -this.size / 4,
      -this.size * 0.8,
      this.size / 4
    );

    // Eye
    fill(0);
    ellipse(this.size / 4, -this.size / 8, this.size / 10);

    pop();
  }
}

class LilyPad {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(30, 60);
  }

  display() {
    push();
    translate(this.x, this.y);
    fill(100, 70, 60);
    ellipse(0, 0, this.size, this.size * 0.8);
    stroke(100, 70, 40);
    noFill();
    arc(0, 0, this.size * 0.9, this.size * 0.7, 0, PI);
    pop();
  }
}

class Cherub {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(30, 50);
    this.angle = 0;
  }

  update() {
    this.angle += 0.02;
    this.y += sin(this.angle) * 0.5;
  }

  display() {
    push();
    translate(this.x, this.y);
    fill(20, 30, 95);
    ellipse(0, 0, this.size, this.size * 1.2); // Body
    ellipse(-this.size / 3, -this.size / 2, this.size / 2); // Left wing
    ellipse(this.size / 3, -this.size / 2, this.size / 2); // Right wing
    fill(80, 99, 57);
    ellipse(0, -this.size / 2, this.size / 2); // Head
    pop();
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = random(20, 40);
    this.alpha = 100;
  }

  expand() {
    this.radius += 0.5;
    this.alpha -= 1;
  }

  display() {
    noFill();
    stroke(0, 0, 100, this.alpha);
    ellipse(this.x, this.y, this.radius * 2);
  }

  isFinished() {
    return this.radius > this.maxRadius || this.alpha < 0;
  }
}
