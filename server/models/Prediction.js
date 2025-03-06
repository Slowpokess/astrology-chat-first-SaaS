const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  cryptoName: {
    type: String,
    required: true
  },
  cryptoSymbol: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  sarcasticPrediction: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  analysis: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
