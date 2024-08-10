
const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const receivedUpdates = new Set();
const receivedOrders = new Map();

console.log("Action Taken:")
const processUpdate = (update) => {

const { priceType, status, AppOrderID } = update;

// Determine if order exists
const orderExists = receivedOrders.has(AppOrderID);

// Determine action based on priceType and status
let action;
if (status === 'cancelled') {
  if (['LMT', 'SL-LMT', 'SL-MKT'].includes(priceType)) {
    action = 'cancelOrder';
    receivedOrders.delete(AppOrderID)
  }
} else if (priceType === 'MKT' && status === 'complete') {
    action = orderExists ? 'modifyOrder' : 'placeOrder';
} else if (['LMT', 'SL-LMT', 'SL-MKT'].includes(priceType)) {
    if (status === 'open' || status === 'pending') {
        action = orderExists ? 'modifyOrder' : 'placeOrder';
    }
}

// Update existing orders
if (status !== 'cancelled') {
  receivedOrders.set(AppOrderID, update);
} else {
  receivedOrders.delete(AppOrderID);
}

console.log(`For AppOrderID: ${AppOrderID} : ${action}`)
};

socket.on('orderUpdate', (update) => {
  processUpdate(update);
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
