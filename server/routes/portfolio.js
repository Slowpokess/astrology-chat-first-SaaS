// routes/portfolio.js - Для беспощадного анализа ваших инвестиционных "достижений"
const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const OpenAI = require('openai');

// Настройка OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Простой кэш для анализов портфелей
const portfolioCache = new Map();

// Анализировать портфель (AKA посмеяться над вашими инвестициями)
router.post('/analyze', async (req, res) => {
  try {
    console.log('📊 Кто-то отважился показать нам свой портфель. Смелый ход!');
    const { portfolio } = req.body;
    
    if (!portfolio || !Array.isArray(portfolio) || portfolio.length === 0) {
      console.log('❌ Пользователь прислал пустой портфель. Может, это и к лучшему...');
      return res.status(400).json({ 
        message: 'Valid portfolio data is required',
        advice: 'Если у вас нет криптоактивов, поздравляем! Вы, возможно, умнее большинства наших пользователей.'
      });
    }

    // Создаем ключ кэша на основе содержимого портфеля
    const cacheKey = JSON.stringify(portfolio);
    
    // Проверяем кэш (как твой портфель - с надеждой на чудо)
    if (portfolioCache.has(cacheKey)) {
      console.log(`🧠 Нашли анализ в кэше! Некоторые ошибки слишком очевидны, чтобы анализировать их дважды.`);
      return res.json(portfolioCache.get(cacheKey));
    }
    
    console.log(`💰 Анализируем портфель из ${portfolio.length} криптоактивов. Достаньте попкорн!`);
    
    // Создаем промт для OpenAI
    const prompt = `
      Проанализируй следующий криптопортфель с максимально язвительным и саркастичным тоном:
      ${JSON.stringify(portfolio)}
      
      Требования:
      1. Создай беспощадный язвительный "разбор" портфеля в целом
      2. Для каждого токена создай персонализированную насмешку
      3. Опиши "альтернативную вселенную", где пользователь принял противоположные решения
      4. Используй максимально токсичный, но юмористический тон
      5. Включи несколько метафор финансового краха
      
      Формат ответа должен быть в JSON:
      {
        "overallRoast": "Общий анализ портфеля на 1-2 абзаца",
        "tokenAnalysis": [
          {
            "name": "название токена",
            "roast": "персонализированная насмешка над выбором"
          },
          ...
        ],
        "alternateUniverse": "Описание альтернативной вселенной, где выборы были противоположными"
      }
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Ты - саркастичный, язвительный ИИ-аналитик финансов. Твоя задача создавать намеренно жесткие, но смешные анализы инвестиционных решений." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      response_format: { type: "json_object" }
    });
    
    const analysis = JSON.parse(response.choices[0].message.content);
    console.log('🔥 Анализ готов! Надеемся, пользователь умеет смеяться над собой.');
    
    // Сохраняем анализ в базу данных (потому что чужие ошибки нужно сохранять для истории)
    const newPortfolioAnalysis = new Portfolio({
      portfolio: portfolio,
      overallRoast: analysis.overallRoast,
      tokenAnalysis: analysis.tokenAnalysis,
      alternateUniverse: analysis.alternateUniverse
    });
    
    await newPortfolioAnalysis.save();
    console.log('💾 Анализ сохранен в базу данных. Он теперь часть нашей коллекции "Как не надо инвестировать".');
    
    // Сохраняем в кэш (портфели редко становятся лучше со временем)
    portfolioCache.set(cacheKey, analysis);
    
    res.json(analysis);
  } catch (error) {
    console.error('❌ Ошибка при анализе портфеля. Возможно, он настолько плох, что сломал наш ИИ:', error);
    
    // Запасной анализ, если что-то пошло не так
    const backupAnalysis = {
      overallRoast: "Поздравляю! Твой портфель настолько уникален, что даже наш ИИ отказывается его анализировать. Это либо гениально, либо катастрофично - но, скорее всего, второе. Сочетание токенов выглядит так, будто ты просто следовал рекомендациям случайных людей из Telegram-групп, одновременно добавляя всё, что появлялось в трендах Twitter.",
      tokenAnalysis: portfolio.map(item => ({
        name: item.token || "Неизвестный токен",
        roast: `Ах, ${item.token || "этот таинственный токен"}. Классический выбор тех, кто любит учиться на собственных ошибках. Покупка по $${item.buyPrice || "????"} была особенно вдохновляющей. Напоминает историю о том, как покупать на пике и держать до нуля.`
      })),
      alternateUniverse: "В альтернативной вселенной ты просто положил все эти деньги под матрас и потерял бы только на инфляции. Или, еще лучше, ты вложился в индексный фонд и сейчас спокойно пьешь коктейль на пляже, вместо того чтобы обновлять графики каждые 5 минут, надеясь, что твой любимый шиткоин вырастет на 10000%."
    };
    
    res.status(500).json({ 
      message: 'Произошла ошибка при анализе вашего портфеля. Возможно, он слишком уникален (читай: ужасен).',
      analysis: backupAnalysis,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

// Получить историю анализов портфелей (потому что люди редко учатся на своих ошибках)
router.get('/history', async (req, res) => {
  try {
    console.log('🏛️ Кто-то интересуется историей анализов. Археология финансовых катастроф?');
    const history = await Portfolio.find()
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log(`✅ Отправляем ${history.length} исторических анализов. Надеемся, они послужат уроком (но мы знаем, что нет).`);
    res.json(history);
  } catch (error) {
    console.error('❌ Ошибка при получении истории анализов. Прошлое так же ненадежно, как и будущее:', error);
    res.status(500).json({ 
      message: 'Не удалось получить историю анализов. Может, это и к лучшему.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

module.exports = router;