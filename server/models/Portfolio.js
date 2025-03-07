// models/Portfolio.js - Для хранения ваших несчастных инвестиционных решений
const mongoose = require('mongoose');

const TokenAnalysisSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // Имя токена, который ты купил на пике
  },
  roast: {
    type: String,
    required: true,
    // Наша саркастическая оценка твоего "гениального" выбора
  }
});

const PortfolioSchema = new mongoose.Schema({
  portfolio: {
    type: Array,
    required: true,
    // Коллекция неудачных финансовых решений, собранных в одном удобном месте
  },
  overallRoast: {
    type: String,
    required: true,
    // Общая оценка того, как плохо ты управляешь своими финансами
  },
  tokenAnalysis: [TokenAnalysisSchema],
  // Подробный разбор каждого отдельного неверного решения
  alternateUniverse: {
    type: String,
    required: true,
    // Описание параллельной вселенной, где ты принимал правильные решения
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Момент, когда ты решил, что тебе нужно наше "экспертное" мнение
  }
});

// Этот модуль экспортирования работает лучше, чем твоя стратегия "купи высоко, продай низко"
module.exports = mongoose.model('Portfolio', PortfolioSchema);