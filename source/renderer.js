// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import { THICKNESS } from './config';

// ——————————————————————————————————————————————————
// Renderer
// ——————————————————————————————————————————————————

class Renderer {
  constructor() {
    this.scale = window.devicePixelRatio || 1;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
  }
  render(simulation) {
    let currentColor = simulation.particles[0].color;
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.strokeStyle = currentColor;
    this.context.beginPath();
    simulation.particles.forEach(particle => {
      if (particle.visible) {
        if (particle.color !== currentColor) {
          this.context.stroke();
          this.context.strokeStyle = particle.color;
          this.context.beginPath();
          currentColor = particle.color;
        }
        this.context.moveTo(particle.x, particle.y);
        particle.tail.forEach((point, index) => {
          this.context.lineTo(point.x, point.y);
        });
      }
    });
    this.context.stroke();
  }
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.canvas.width = this.width * this.scale;
    this.canvas.height = this.height * this.scale;
    this.context.scale(this.scale, this.scale);
    this.context.lineWidth = THICKNESS;
    this.context.lineCap = 'round';
  }
}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Renderer;
