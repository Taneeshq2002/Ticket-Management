const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hash passwords for security
  address: { type: String, required: true }, // Ethereum wallet address
  tickets: [
    {
      eventId: String,
      ticketId: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);
