// routes/predictions.js - Маршруты для "экспертных" предсказаний
const express = require('express');
const router = express.Router();
const { generatePrediction, getCryptoPrices } = require('../services/aiService');
const Prediction = require('../models/Prediction');

// Получить список последних предсказаний (которые все одинаково бесполезны)
router.get('/', async (req, res) => {
  try {
    console.log('📊 Кто-то хочет посмотреть наши предыдущие предсказания. Смелый ход!');
    const predictions = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(predictions);
  } catch (error) {
    console.error('❌ Не удалось получить предсказания. Они так же надежны, как и криптовалютные биржи:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера. Наши предсказатели временно недоступны. Попробуйте Magic 8-Ball вместо нас.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

// Создать новое предсказание (глубокий анализ = случайные числа)
router.post('/generate', async (req, res) => {
  try {
    console.log('🧙‍♂️ Генерируем новое предсказание. Подбрасываем монетку...');
    const { crypto } = req.body;
    
    // Если передан объект криптовалюты, используем его
    // Иначе получаем данные о случайной криптовалюте
    let cryptoData;
    if (crypto) {
      cryptoData = crypto;
      console.log(`🎯 Пользователь хочет предсказание для ${crypto.name}. Как будто для других криптовалют оно было бы точнее!`);
    } else {
      console.log('🎲 Пользователь не указал криптовалюту. Выбираем жертву случайным образом...');
      const cryptoList = await getCryptoPrices();
      const randomIndex = Math.floor(Math.random() * Math.min(20, cryptoList.length));
      cryptoData = cryptoList[randomIndex];
      console.log(`🎯 Случайно выбрали ${cryptoData.name}. Бедняга даже не подозревает, что мы о нем скажем.`);
    }
    
    // Генерируем предсказание (столь же научное, как гадание на кофейной гуще)
    const prediction = await generatePrediction(cryptoData);
    
    // Создаем запись в базе данных (потому что нам нужны доказательства нашей "точности")
    const newPrediction = new Prediction({
      cryptoName: cryptoData.name,
      cryptoSymbol: cryptoData.symbol,
      currentPrice: cryptoData.current_price,
      sarcasticPrediction: prediction.text,
      confidence: prediction.confidence,
      analysis: prediction.analysis
    });
    
    await newPrediction.save();
    console.log('💾 Сохранили предсказание в базу данных. Теперь оно официально "экспертное"!');
    
    res.status(201).json(newPrediction);
  } catch (error) {
    console.error('❌ Ошибка при создании предсказания. Наш хрустальный шар треснул:', error);
    res.status(500).json({ 
      message: 'Не удалось создать предсказание. Возможно, будущее слишком мрачно даже для нашего ИИ.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
      suggestion: 'Попробуйте подбросить монетку. Точность примерно та же, но дешевле.'
    });
  }
});

// Получить данные о криптовалютах (как минимум мы здесь не врем... почти)
router.get('/crypto-data', async (req, res) => {
  try {
    console.log('🔍 Кто-то интересуется реальными ценами криптовалют. Такая редкость в нашем приложении!');
    const { start = 0, limit = 10 } = req.query;
    const startIndex = parseInt(start);
    const limitCount = parseInt(limit);
    
    const cryptoData = await getCryptoPrices();
    const slicedData = cryptoData.slice(startIndex, startIndex + limitCount);
    
    console.log(`✅ Отправляем данные о ${slicedData.length} криптовалютах. Надеемся, они не устареют до того, как страница загрузится.`);
    res.json(slicedData);
  } catch (error) {
    console.error('❌ Не удалось получить данные о криптовалютах. Рынок в хаосе (как обычно):', error);
    res.status(500).json({ 
      message: 'Не удалось получить актуальные данные. По крайней мере, в этом мы не отличаемся от большинства криптоаналитиков.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

// Получить одно конкретное предсказание (чтобы посмеяться дважды)
router.get('/:id', async (req, res) => {
  try {
    console.log(`🔍 Кто-то ищет конкретное предсказание #${req.params.id}. Видимо, хочет убедиться, насколько оно было неточным.`);
    const prediction = await Prediction.findById(req.params.id);
    
    if (!prediction) {
      console.log('❓ Предсказание не найдено. Оно исчезло так же быстро, как прибыль на медвежьем рынке.');
      return res.status(404).json({ message: 'Предсказание не найдено. Оно исчезло из базы данных, как ваши деньги из крипто-кошелька.' });
    }
    
    console.log('✅ Предсказание найдено и отправлено. Надеемся, оно уже устарело!');
    res.json(prediction);
  } catch (error) {
    console.error('❌ Ошибка при поиске предсказания. Наша база данных такая же нестабильная, как крипторынок:', error);
    res.status(500).json({ 
      message: 'Не удалось найти предсказание. Может, оно сбылось и нам стало стыдно?',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

module.exports = router;

