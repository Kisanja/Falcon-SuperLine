const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  mainType: {
    type: String,
    enum: ['Income', 'Expenses'],
    required: true
  },
  subType: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Finance', financeSchema);
