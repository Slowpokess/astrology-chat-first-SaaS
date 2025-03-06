const express = require('express');
const router = express.Router();
const { analyzePortfolio } = require('../services/aiService');
const Portfolio = require('../models/Portfolio');

// Анализировать портфель
router.post('/analyze', async (req, res) => {
  try {
    const { portfolio } = req.body;
    
    if (!portfolio || !Array.isArray(portfolio) || portfolio.length === 0) {
      return res.status(400).json({ message: 'Valid portfolio data is required' });
    }
    
    // Анализируем портфель с помощью ИИ
    const analysis = await analyzePortfolio(portfolio);
    
    // Записываем анализ в базу данных для истории
    const newPortfolioAnalysis = new Portfolio({
      portfolio: portfolio,
      overallRoast: analysis.overallRoast,
      tokenAnalysis: analysis.tokenAnalysis,
      alternateUniverse: analysis.alternateUniverse
    });
    
    await newPortfolioAnalysis.save();
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;