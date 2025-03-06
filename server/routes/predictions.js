const express = require('express');
const router = express.Router();
const { generatePrediction, getCryptoPrices } = require('../services/aiService');
const Prediction = require('../models/Prediction');

// Получить список последних предсказаний
router.get('/', async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Создать новое предсказание
router.post('/', async (req, res) => {
  try {
    // Получаем данные о криптовалютах
    const cryptoData = await getCryptoPrices();
    
    // Выбираем случайные криптовалюты для предсказаний
    const selectedCryptos = [];
    const cryptoCount = Math.min(5, cryptoData.length);
    
    // Случайный выбор криптовалют без повторений
    const usedIndices = new Set();
    while (selectedCryptos.length < cryptoCount) {
      const randomIndex = Math.floor(Math.random() * cryptoData.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        selectedCryptos.push(cryptoData[randomIndex]);
      }
    }
    
    // Генерируем предсказания для каждой выбранной криптовалюты
    const generatedPredictions = await Promise.all(
      selectedCryptos.map(async (crypto) => {
        const prediction = await generatePrediction(crypto);
        
        // Создаем запись в базе данных
        const newPrediction = new Prediction({
          cryptoName: crypto.name,
          cryptoSymbol: crypto.symbol,
          currentPrice: crypto.current_price,
          sarcasticPrediction: prediction.text,
          confidence: prediction.confidence,
          analysis: prediction.analysis
        });
        
        await newPrediction.save();
        return newPrediction;
      })
    );
    
    res.status(201).json(generatedPredictions);
  } catch (error) {
    console.error('Error creating predictions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Получить одно конкретное предсказание
router.get('/:id', async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    
    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }
    
    res.json(prediction);
  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
