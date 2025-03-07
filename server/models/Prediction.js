// models/Prediction.js - Хранилище "экспертных" предсказаний
const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  cryptoName: {
    type: String,
    required: true,
    // Для всех токенов, которые точно "взлетят к луне", но почему-то так и не взлетают
  },
  cryptoSymbol: {
    type: String,
    required: true,
    // Три случайные буквы, которым ты доверяешь свои деньги
  },
  currentPrice: {
    type: Number,
    required: true,
    // Число, которое всегда меньше, чем то, за которое ты купил
  },
  sarcasticPrediction: {
    type: String,
    required: true,
    // Содержит столько же полезной информации, сколько и обычные финансовые прогнозы
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    // Чем выше значение, тем меньше вероятность, что это правда
  },
  analysis: {
    type: String,
    required: true,
    // Псевдонаучное объяснение, почему наши случайные догадки лучше других случайных догадок
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Когда мы официально начали обманывать себя
  }
});

// Предупреждаем, что это всё ещё не делает эти предсказания точными
module.exports = mongoose.model('Prediction', PredictionSchema);