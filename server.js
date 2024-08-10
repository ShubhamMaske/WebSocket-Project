const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const updates = require('./updates.json');

const logUpdate = (update) => {
  console.log(`Update sent to order book at [${new Date().toISOString()}] :`, update);
};

const sendUpdates = (updatesToSend, delay) => {
  setTimeout(() => {
    updatesToSend.forEach(update => {
      io.emit('orderUpdate', update);
      logUpdate(update);
    });
  }, delay);
};

io.on('connection', (socket) => {
  console.log('Client connected');

  sendUpdates(updates.slice(0, 10), 0); // First 10 updates in 1 second
  sendUpdates(updates.slice(10, 30), 1000); // Next 20 updates after 2 seconds
  sendUpdates(updates.slice(30, 70), 3000); // 40 updates after 3 seconds
  sendUpdates(updates.slice(70, 100), 6000); // Final 30 updates after 5 seconds

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
