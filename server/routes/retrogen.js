const express = require('express');
const router = express.Router();
const { generateRetroGenius } = require('../services/aiService');

// Генерировать ретроактивного "гения"
router.post('/generate', async (req, res) => {
  try {
    const { cryptoId } = req.body;
    
    if (!cryptoId) {
      return res.status(400).json({ message: 'Crypto ID is required' });
    }
    
    // Генерируем ретроактивное предсказание
    const retroGenius = await generateRetroGenius(cryptoId);
    
    res.json(retroGenius);
  } catch (error) {
    console.error('Error generating retro genius:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;