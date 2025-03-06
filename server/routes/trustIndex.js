const express = require('express');
const router = express.Router();
const { getTrustIndex } = require('../services/aiService');

// Получить индекс доверия
router.get('/', async (req, res) => {
  try {
    // Получаем данные индекса доверия
    const trustIndex = await getTrustIndex();
    
    res.json(trustIndex);
  } catch (error) {
    console.error('Error fetching trust index:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;