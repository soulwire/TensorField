// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import {
  MOUSE_MASS_PRESSED,
  MOUSE_MASS_NORMAL,
  DISTRIBUTION,
  TAIL_LENGTH,
  MAX_FORCE,
  GRAVITY,
  FRICTION,
  TOGGLE
} from './config';
import Particle from './particle';
import Random from './random';

// ——————————————————————————————————————————————————
// Simulation
// ——————————————————————————————————————————————————

class Simulation {
  constructor() {
    this.mouse = new Particle(0, 0, 1);
    this.mouse.pressed = false;
    this.mouse.charge = -1;
    this.mouse.visible = false;
    this.mouse.static = true;
    this.particles = [];
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    document.addEventListener('mousedown', this.onPointerDown, false);
    document.addEventListener('touchstart', this.onPointerDown, false);
    document.addEventListener('mousemove', this.onPointerMove, false);
    document.addEventListener('touchmove', this.onPointerMove, false);
    document.addEventListener('mouseleave', this.onPointerUp, false);
    document.addEventListener('mouseup', this.onPointerUp, false);
    document.addEventListener('touchend', this.onPointerUp, false);
  }
  step() {
    // Update mouse
    if (this.mouse.pressed) {
      if (this.mouse.mass < MOUSE_MASS_PRESSED) {
        this.mouse.mass *= 1.2;
      }
    } else {
      this.mouse.mass *= 0.85;
    }
    // Update particles
    let i, j, a, b, d, f, l, dx, dy, fx, fy, dSq;
    for (i = this.particles.length - 1; i >= 0; i--) {
      a = this.particles[i];
      if (a.static) { continue; }
      // Invert charge
      if (Math.random() < TOGGLE) {
        a.charge = -a.charge;
      }
      // Compute gravitational force
      for (j = i - 1; j >= 0; j--) {
        b = this.particles[j];
        dx = b.x - a.x;
        dy = b.y - a.y;
        dSq = dx * dx + dy * dy + 0.01;
        if (dSq > 1) {
          d = Math.sqrt(dSq);
          // l = Math.pow(1 / d, 0.8);
          l = 1 / d;
          fx = dx * l;
          fy = dy * l;
          f = Math.min(MAX_FORCE, (GRAVITY * a.mass * b.mass) / dSq);
          a.fx += f * fx * b.charge;
          a.fy += f * fy * b.charge;
          b.fx += -f * fx * a.charge;
          b.fy += -f * fy * a.charge;
        }
      }
      // Integrate
      a.vx += a.fx;
      a.vy += a.fy;
      a.vx *= FRICTION;
      a.vy *= FRICTION;
      a.fx = a.fy = 0;
      // Update tail
      a.tail.unshift({
        x: a.x,
        y: a.y
      });
      if (a.tail.length > TAIL_LENGTH) {
        a.tail.pop();
      }
      // Update position
      a.x += a.vx;
      a.y += a.vy;
      // Re-spawn when out of bounds
      if (
        a.x > this.width + a.radius ||
        a.y > this.height + a.radius ||
        a.x < -a.radius ||
        a.y < -a.radius
      ) {
        a.x = Random.float(this.width);
        a.y = Random.float(this.height);
        a.tail.length = 0;
      }
    }
  }
  resize(width, height) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.diagonal = Math.sqrt(Math.pow(this.width, 2), Math.pow(this.height, 2));
    this.particleCount = Math.round(this.diagonal / DISTRIBUTION);
    this.particles.length = 0;
    for (let x, y, m, p, i = 0; i < this.particleCount; i++) {
      x = Random.float(this.width);
      y = Random.float(this.height);
      m = Random.float(0.5, 8.0);
      p = new Particle(x, y, m);
      this.particles.push(p);
    }
    // Sort by color for less draw calls
    this.particles.sort((a, b) => a.color < b.color ? -1 : 1);
    this.particles.unshift(this.mouse);
  }
  onPointerDown(event) {
    this.mouse.pressed = true;
    this.mouse.charge = 1;
    this.mouse.mass = 1;
  }
  onPointerMove(event) {
    const { clientX: x, clientY: y } = (
      event.changedTouches ?
        event.changedTouches[0] :
        event
    );
    this.mouse.x = x;
    this.mouse.y = y;
    if (!this.mouse.pressed) {
      this.mouse.mass = MOUSE_MASS_NORMAL;
    }
  }
  onPointerUp() {
    this.mouse.pressed = false;
    this.mouse.charge = -1;
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Simulation;