// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { COLORS } from './config';
import Random from './random';

// ——————————————————————————————————————————————————
// Particle
// ——————————————————————————————————————————————————

class Particle {
  constructor(x = 0, y = 0, mass = 1) {
    this.x = x;
    this.y = y;
    this.fx = 0;
    this.fy = 0;
    this.vx = 0;
    this.vy = 0;
    this.mass = mass;
    this.radius = 1;
    this.static = false;
    this.visible = true;
    this.charge = Random.sign();
    this.color = Random.item(COLORS);
    this.tail = [];
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Particle;