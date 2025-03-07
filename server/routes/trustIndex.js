// routes/trustIndex.js - Для иронично-обратного индикатора рыночных настроений
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Получить индекс доверия (который на самом деле индекс недоверия)
router.get('/', async (req, res) => {
  try {
    console.log('📊 Запрос на индекс доверия. Готовим обратный индикатор...');
    
    // В реальном проекте здесь будет анализ социальных медиа и рыночных данных
    // Для демонстрации генерируем случайные данные
    
    // Определяем общее настроение рынка на основе реальных данных (если можем их получить)
    let marketSentiment;
    let sentimentSource = 'random';
    
    try {
      // Пробуем получить индекс страха и жадности от Alternative.me API
      const fearGreedResponse = await axios.get('https://api.alternative.me/fng/');
      const fearGreedValue = fearGreedResponse.data.data[0].value;
      const fearGreedClassification = fearGreedResponse.data.data[0].value_classification;
      
      console.log(`💡 Получили индекс страха и жадности: ${fearGreedValue} (${fearGreedClassification})`);
      
      // Определяем настроение на основе индекса страха и жадности
      // Значения выше 50 считаются "жадностью" (позитивное настроение)
      marketSentiment = parseInt(fearGreedValue) > 50 ? 'positive' : 'negative';
      sentimentSource = 'fear&greed';
    } catch (fgError) {
      console.log('⚠️ Не удалось получить индекс страха и жадности. Используем данные о BTC для оценки...');
      
      try {
        // Если не удалось получить индекс страха и жадности, смотрим на изменение BTC за последний день
        const btcResponse = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin');
        const btcPriceChange = btcResponse.data.market_data.price_change_percentage_24h;
        
        console.log(`💡 Изменение цены BTC за 24ч: ${btcPriceChange}%`);
        
        // Если цена BTC выросла, считаем настроение позитивным
        marketSentiment = btcPriceChange > 0 ? 'positive' : 'negative';
        sentimentSource = 'btc_price';
      } catch (btcError) {
        console.log('⚠️ Не удалось получить данные о BTC. Генерируем случайное настроение...');
        
        // Если и это не удалось, генерируем случайно
        marketSentiment = Math.random() > 0.5 ? 'positive' : 'negative';
        sentimentSource = 'random';
      }
    }
    
    // Генерируем значение индекса
    // В нашей системе: более низкий индекс = высокий страх, высокий индекс = высокая жадность
    let indexValue;
    if (sentimentSource === 'fear&greed') {
      // Если у нас есть данные индекса страха и жадности, используем его
      indexValue = Math.floor(Math.random() * 30) + (marketSentiment === 'positive' ? 60 : 10);
    } else {
      // Иначе генерируем случайное значение с уклоном в соответствии с настроением
      indexValue = Math.floor(Math.random() * 40) + (marketSentiment === 'positive' ? 50 : 10);
    }
    
    // Генерируем рекомендацию, противоположную рыночному настроению
    let recommendation;
    if (marketSentiment === 'positive') {
      if (indexValue > 80) {
        recommendation = "Все в эйфории? Самое время паниковать и продавать всё подчистую! Когда таксисты начинают давать советы по инвестированию, умные инвесторы уже упаковывают чемоданы.";
      } else {
        recommendation = "Рынок слишком оптимистичен. Исторически это прекрасный индикатор предстоящего краха. Приготовьте попкорн и наблюдайте за неизбежным хаосом.";
      }
    } else {
      if (indexValue < 20) {
        recommendation = "Все паникуют и продают? Отличное время покупать! Если, конечно, вам нравится ловить падающие ножи и вы не боитесь потерять еще немного денег... или много.";
      } else {
        recommendation = "Рынок в депрессии? Согласно нашей противоречивой логике, это может быть сигналом для покупки. Или нет. Кто знает? Точно не мы.";
      }
    }
    
    // Генерируем факторы уверенности
    const confidenceFactors = [
      {
        name: "FOMO индекс",
        value: Math.floor(Math.random() * 100),
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      {
        name: "Индекс нытья в Twitter",
        value: Math.floor(Math.random() * 100),
        trend: Math.random() > 0.4 ? 'up' : 'down'
      },
      {
        name: "Количество 'экспертов'",
        value: Math.floor(Math.random() * 40) + 60, // Всегда много "экспертов"
        trend: 'up' // Количество экспертов всегда растет
      },
      {
        name: "Индекс финансовой паники",
        value: Math.floor(Math.random() * 100),
        trend: marketSentiment === 'positive' ? 'down' : 'up'
      }
    ];
    
    console.log(`✅ Индекс доверия создан! Значение: ${indexValue}, Настроение рынка: ${marketSentiment}`);
    
    // Формируем финальный результат
    const trustIndex = {
      indexValue: indexValue,
      marketSentiment: marketSentiment,
      recommendation: recommendation,
      confidenceFactors: confidenceFactors,
      sentimentSource: sentimentSource,
      timestamp: new Date().toISOString()
    };
    
    res.json(trustIndex);
  } catch (error) {
    console.error('❌ Ошибка при создании индекса доверия. Даже наш индекс недоверия ненадежен:', error);
    
    // Запасной индекс доверия, если что-то пошло не так
    const backupTrustIndex = {
      indexValue: Math.floor(Math.random() * 100),
      marketSentiment: Math.random() > 0.5 ? 'positive' : 'negative',
      recommendation: "Наши индикаторы не работают, но, честно говоря, они никогда и не работали. Подбрасывание монетки даст вам такую же точность, но будет дешевле.",
      confidenceFactors: [
        {
          name: "Индекс системных сбоев",
          value: 100, // Максимум, ведь у нас сбой
          trend: 'up'
        },
        {
          name: "Уровень точности прогнозов",
          value: Math.floor(Math.random() * 20), // Очень низкий
          trend: 'down'
        }
      ],
      sentimentSource: 'backup',
      timestamp: new Date().toISOString()
    };
    
    res.status(500).json({ 
      message: 'Произошла ошибка при создании индекса доверия. Наши алгоритмы такие же ненадежные, как и рыночные предсказания.',
      trustIndex: backupTrustIndex,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

// Получить исторические данные индекса доверия (чтобы показать, что он всегда ошибался)
router.get('/history', async (req, res) => {
  try {
    console.log('📈 Запрос на историю индекса доверия. Подготавливаем доказательства нашей некомпетентности...');
    
    // В реальном проекте здесь будут данные из базы данных
    // Для демонстрации генерируем случайные исторические данные
    
    const days = parseInt(req.query.days) || 30;
    const history = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      history.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100),
        marketSentiment: Math.random() > 0.5 ? 'positive' : 'negative'
      });
    }
    
    console.log(`✅ Сгенерировали историю индекса доверия за ${days} дней. Удивительно, как мы всегда ошибались!`);
    
    res.json(history);
  } catch (error) {
    console.error('❌ Ошибка при получении истории индекса доверия:', error);
    res.status(500).json({ 
      message: 'Не удалось получить историю индекса доверия. История наших ошибок слишком велика для обработки.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

module.exports = router;