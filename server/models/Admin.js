const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Admin User'
  },
  phone: {
    type: String,
    default: '+1 234 567 8900'
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
