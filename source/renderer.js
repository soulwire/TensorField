// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { autoDetectRenderer, Graphics } from 'pixi.js';
import { THICKNESS } from './config';

// ——————————————————————————————————————————————————
// Renderer
// ——————————————————————————————————————————————————

class Renderer {
  constructor() {
    this.graphics = new Graphics();
    this.renderer = new autoDetectRenderer(100, 100, {
      backgroundColor: 0x1b1b1b,
      resolution: window.devicePixelRatio || 1,
      antialias: true
    });
    this.canvas = this.renderer.view;
  }
  render(simulation) {
    let currentColor = simulation.particles[0].color;
    this.graphics.clear();
    this.graphics.lineStyle(1, currentColor, 1);
    simulation.particles.forEach(particle => {
      if (particle.visible) {
        if (particle.color !== currentColor) {
          this.graphics.lineStyle(1, particle.color, 1);
          currentColor = particle.color;
        }
        this.graphics.moveTo(particle.x, particle.y);
        particle.tail.forEach((point, index) => {
          this.graphics.lineTo(point.x, point.y);
        });
      }
    });
    this.renderer.render(this.graphics);
  }
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.view.style.height = this.height + 'px';
    this.renderer.view.style.width = this.width + 'px';
    this.renderer.resize(this.width, this.height);
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Renderer;
