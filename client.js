const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const receivedUpdates = new Set();
const receivedOrders = new Map();

const processUpdate = (update) => {

//   if (!receivedUpdates.has(JSON.stringify(update))) {
//     //if order does not exist
//     receivedUpdates.add(JSON.stringify(update));
//     // console.log('Processing update:', update);
    


//     // Determine action based on update status
//     switch (update.status) {
//       case 'complete':
//         console.log(`For AppOrderID: ${update.AppOrderID} : placeOrder`);
//         break;
//       case 'cancelled':
//         console.log(`For AppOrderID: ${update.AppOrderID} : cancelOrder`);
//         break;
//       case 'open':
//         console.log(`For AppOrderID: ${update.AppOrderID} : modifyOrder`);
//         break;
//     }
//   } else if(((update.priceType === "LMT" || update.priceType === "SL-LMT" || update.priceType === "SL-MKT") && update.status === "cancelled")) {
//     console.log(`For AppOrderID: ${update.AppOrderID} : cancelOrder`);
//   } else {
//     // if order already exist
//     console.log(`For AppOrderID: ${update.AppOrderID} : modifyOrder`);

const { priceType, status, AppOrderID } = update;

// Determine if order exists
const orderExists = receivedOrders.has(AppOrderID);

// Determine action based on priceType and status
let action;
if (status === 'cancelled') {
  if (['LMT', 'SL-LMT', 'SL-MKT'].includes(priceType)) {
    action = `For AppOrderID: ${AppOrderID} : cancelOrder`;
    console.log(action)
  }
} else if (priceType === 'MKT' && status === 'complete') {
  action = orderExists ? `For AppOrderID: ${AppOrderID} : modifyOrder` : `For AppOrderID: ${AppOrderID} : placeOrder`;
  console.log(action)
} else if (priceType === 'LMT') {
  action = status === 'open'
    ? (orderExists ? `For AppOrderID: ${AppOrderID} : modifyOrder` : `For AppOrderID: ${AppOrderID} : placeOrder`)
    : '';
    console.log(action)
} else if (['SL-LMT', 'SL-MKT'].includes(priceType)) {
  action = status === 'pending'
    ? (orderExists ? `For AppOrderID: ${AppOrderID} : modifyOrder` : `For AppOrderID: ${AppOrderID} : placeOrder`)
    : '';
    console.log(action)
}

// Update existing orders
if (status !== 'cancelled') {
  receivedOrders.set(AppOrderID, update);
} else {
  receivedOrders.delete(AppOrderID);
}
//   }
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



