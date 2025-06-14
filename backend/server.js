const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const db = require('./db');
const dataSimulator = require('./data-simulator');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const cors = require('cors');
app.use(cors());

// Initialize database and start data simulation
db.initialize();
dataSimulator.start();

// WebSocket connection for real-time updates
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send initial data
  db.getLatestSpeed((err, speed) => {
    if (!err && speed) {
      ws.send(JSON.stringify(speed));
    }
  });
  
  ws.on('close', () => console.log('Client disconnected'));
});

// Broadcast new speed to all connected clients
dataSimulator.on('newSpeed', (speed) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(speed));
    }
  });
});

// REST API endpoint to get speed history
app.get('/api/speeds', async (req, res) => {
  try {
    const speeds = await db.getSpeedHistory();
    res.json(speeds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});