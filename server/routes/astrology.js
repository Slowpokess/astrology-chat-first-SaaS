const express = require('express');
const router = express.Router();
const { generateAstrologyChart } = require('../services/aiService');

// Генерировать астрологический график
router.post('/chart', async (req, res) => {
  try {
    const { cryptoId, timeframe } = req.body;
    
    if (!cryptoId || !timeframe) {
      return res.status(400).json({ message: 'Crypto ID and timeframe are required' });
    }
    
    // Генерируем астрологический график
    const astrologyChart = await generateAstrologyChart(cryptoId, timeframe);
    
    res.json(astrologyChart);
  } catch (error) {
    console.error('Error generating astrology chart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;