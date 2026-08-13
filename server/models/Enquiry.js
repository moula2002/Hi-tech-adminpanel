const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  message: {
    type: String,
    required: true
  },
  status: {
    type: String, // 'unread', 'read'
    default: 'unread'
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
