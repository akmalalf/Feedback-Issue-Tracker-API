const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { 
    type: String, 
    enum: ['bug', 'feature', 'question', 'other'] 
  },
  status: { 
    type: String, 
    enum: ['open', 'in progress', 'resolved'], 
    default: 'open' 
  },
  screenshotUrl: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
