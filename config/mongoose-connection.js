const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(() => {

console.log('Connected to MongoDB');
})

const db = mongoose.connection;

module.exports = db;