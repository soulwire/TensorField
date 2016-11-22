// ——————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————

import Simulation from './simulation';
import Renderer from './renderer';

// ——————————————————————————————————————————————————
// Bootstrap
// ——————————————————————————————————————————————————

const init = () => {
  const simulation = new Simulation();
  const renderer = new Renderer();
  const update = () => {
    requestAnimationFrame(update);
    simulation.step();
    renderer.render(simulation);
  };
  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    simulation.resize(width, height);
    renderer.resize(width, height);
  };
  document.body.appendChild(renderer.canvas);
  window.addEventListener('resize', resize);
  resize();
  update();
};

if (document.readyState === 'complete') init()
else window.addEventListener('load', init);