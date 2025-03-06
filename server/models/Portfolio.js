const mongoose = require('mongoose');

const TokenAnalysisSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  roast: {
    type: String,
    required: true
  }
});

const PortfolioSchema = new mongoose.Schema({
  portfolio: {
    type: Array,
    required: true
  },
  overallRoast: {
    type: String,
    required: true
  },
  tokenAnalysis: [TokenAnalysisSchema],
  alternateUniverse: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);