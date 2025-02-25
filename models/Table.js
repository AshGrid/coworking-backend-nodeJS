const mongoose = require('mongoose');
const Chair = require('./chair');

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  total_number_of_chairs: {
    type: Number,
    required: false,
    default: 0
  },
  chairs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chair',  // Reference to the Chair model
    default: []
  }]
});

module.exports = mongoose.model('Table', tableSchema);