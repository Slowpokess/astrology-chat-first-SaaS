// routes/retrogen.js - Для создания "гениальных" предсказаний задним числом
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const axios = require('axios');

// Настройка OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Простой кэш для ретроактивных "гениев"
const retroCache = new Map();

// Генерировать ретроактивного "гения"
router.post('/generate', async (req, res) => {
  try {
    console.log('🧙‍♂️ Запрос на создание ретроактивного гения. Подготавливаем машину времени...');
    const { cryptoId } = req.body;
    
    if (!cryptoId) {
      console.log('❌ Не указана криптовалюта для ретроактивного прогноза. Даже машина времени требует минимальных вводных.');
      return res.status(400).json({ 
        message: 'Crypto ID is required',
        advice: 'Укажите криптовалюту, и мы покажем, как "точно" предсказали бы её рост.'
      });
    }

    // Проверяем кэш (ведь прошлое не меняется, в отличие от наших воспоминаний о нём)
    if (retroCache.has(cryptoId)) {
      console.log(`🧠 Нашли ретропрогноз в кэше! История не меняется, только наше мнение о ней.`);
      return res.json(retroCache.get(cryptoId));
    }
    
    console.log(`🔮 Создаем ретроактивное предсказание для ${cryptoId}. Спойлер: мы были правы (задним числом)!`);
    
    // Получаем данные о криптовалюте (реальные, чтобы наш ретропрогноз был хотя бы отчасти правдоподобен)
    let cryptoData;
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}`);
      cryptoData = response.data;
      console.log(`✅ Получили данные о ${cryptoData.name}. Теперь можем точно "предсказать" его прошлое.`);
    } catch (cryptoError) {
      console.log(`⚠️ Не удалось получить данные о ${cryptoId}. Придется импровизировать.`);
      // Если не удалось получить данные, используем заглушку
      cryptoData = {
        name: cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1),
        symbol: cryptoId.substring(0, 3),
        market_data: {
          current_price: { usd: 1000 },
          ath: { usd: 5000 },
          ath_date: { usd: '2021-11-10T14:24:11.849Z' }
        }
      };
    }
    
    // Создаем дату "из прошлого" - до пика цены
    const athDate = new Date(cryptoData.market_data.ath_date?.usd || '2021-01-01');
    const predictionDate = new Date(athDate);
    predictionDate.setMonth(athDate.getMonth() - 6); // За 6 месяцев до пика
    
    // Форматируем дату в строку DD-MM-YYYY
    const formattedDate = predictionDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
    
    // Создаем промт для OpenAI
    const prompt = `
      Создай фейковый пост "из прошлого" (от ${formattedDate}), который якобы предсказал рост ${cryptoData.name}
      с гораздо более низкой цены до пика в $${cryptoData.market_data.ath.usd}.
      
      Требования:
      1. Используй самоуверенный, хвастливый тон
      2. Добавь "секретные сигналы", которые якобы указывали на успех
      3. Включи несколько якобы технических индикаторов с псевдонаучными названиями
      4. Притворись, что это было "очевидно" для профессионалов
      5. Добавь несколько выдуманных финансовых терминов
      
      Формат ответа должен быть в JSON:
      {
        "date": "${formattedDate}",
        "title": "Название поста",
        "content": "Содержание поста на 1-2 абзаца",
        "indicators": ["Список 3-5 'технических индикаторов', которые якобы использовались"],
        "signature": "Подпись вымышленного 'эксперта'",
        "followUp": "Короткий саркастический комментарий от нашей системы"
      }
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Ты - саркастичный ИИ, создающий фейковые 'гениальные' прогнозы из прошлого. Твоя задача высмеивать самопровозглашенных экспертов рынка." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      response_format: { type: "json_object" }
    });
    
    const retroGenius = JSON.parse(response.choices[0].message.content);
    console.log('✅ Ретроактивный "гений" создан! Ещё один "эксперт", который всё знал наперёд (но только задним числом).');
    
    // Добавляем информацию о текущей цене для контекста
    retroGenius.currentPrice = cryptoData.market_data.current_price.usd;
    retroGenius.peakPrice = cryptoData.market_data.ath.usd;
    
    // Сохраняем в кэш (история не меняется, только наши выдумки о ней)
    retroCache.set(cryptoId, retroGenius);
    
    res.json(retroGenius);
  } catch (error) {
    console.error('❌ Ошибка при создании ретроактивного гения. Даже машина времени иногда ломается:', error);
    
    // Запасной ретроактивный "гений", если что-то пошло не так
    const backupRetro = {
      date: "01-01-2021",
      title: `${req.body.cryptoId.charAt(0).toUpperCase() + req.body.cryptoId.slice(1)} - Очевидная возможность!`,
      content: `Только что провел детальный анализ ${req.body.cryptoId.charAt(0).toUpperCase() + req.body.cryptoId.slice(1)} и, как профессионал, могу сказать: это очевидная возможность. Все технические индикаторы указывают на колоссальный рост. Не благодарите меня позже, просто запомните: я сказал это первым!`,
      indicators: ["RSI-дивергенция", "Двойная конвергенция Фибоначчи", "Пересечение хомячковых объемов", "Индекс лунного притяжения"],
      signature: "КриптоМастерГуру9000, Предсказатель Будущего™",
      followUp: "Примечание: этот пост был создан сегодня. Умение предсказывать прошлое - не суперспособность, это обычная практика криптоаналитиков."
    };
    
    res.status(500).json({ 
      message: 'Произошла ошибка при создании ретроактивного прогноза. Наша машина времени временно не работает.',
      retroGenius: backupRetro,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

module.exports = router;