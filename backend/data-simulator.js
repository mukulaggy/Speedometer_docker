const EventEmitter = require('events');
const db = require('./db');

class DataSimulator extends EventEmitter {}
const simulator = new DataSimulator();

let interval;
let currentSpeed = 0;
let accelerating = true;

function generateSpeed() {
  // Simulate realistic speed changes
  if (accelerating) {
    currentSpeed += Math.random() * 2;
    if (currentSpeed > 120) {
      accelerating = false;
    }
  } else {
    currentSpeed -= Math.random() * 2;
    if (currentSpeed < 5) {
      accelerating = true;
    }
  }
  
  // Ensure speed doesn't go negative
  currentSpeed = Math.max(0, currentSpeed);
  
  return parseFloat(currentSpeed.toFixed(2));
}

function start() {
  if (interval) clearInterval(interval);
  
  interval = setInterval(() => {
    const speed = generateSpeed();
    db.insertSpeed(speed);
    simulator.emit('newSpeed', { speed, timestamp: new Date() });
  }, 1000); // Update every second
}

function stop() {
  if (interval) clearInterval(interval);
}

simulator.start = start;
simulator.stop = stop;

module.exports = simulator;