// routes/astrology.js - Для абсурдных псевдонаучных графиков с астрологией
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const axios = require('axios');

// Настройка OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Кэш для астрологических данных
const astrologyCache = new Map();

// Генерировать "астрологический" график
router.post('/chart', async (req, res) => {
  try {
    console.log('🌠 Запрос на астрологический анализ. Проверяем положение звезд и планет...');
    const { cryptoId, timeframe } = req.body;
    
    if (!cryptoId || !timeframe) {
      console.log('❌ Не указана криптовалюта или временной период. Звезды не могут предсказывать без контекста!');
      return res.status(400).json({ 
        message: 'Crypto ID and timeframe are required',
        advice: 'Укажите криптовалюту и временной период (week, month, quarter, year)'
      });
    }

    // Создаем ключ кэша 
    const cacheKey = `${cryptoId}_${timeframe}`;
    
    // Проверяем кэш (планеты двигаются медленно, наши выдумки - ещё медленнее)
    if (astrologyCache.has(cacheKey)) {
      console.log(`🧠 Нашли астрологический анализ в кэше! Звезды сегодня не изменили своего мнения.`);
      return res.json(astrologyCache.get(cacheKey));
    }
    
    console.log(`🔮 Создаем астрологический анализ для ${cryptoId} на период ${timeframe}. Чакры, кармы и прочая чепуха в процессе...`);
    
    // Получаем реальные данные цен (чтобы привязать наш абсурд к чему-то реальному)
    let priceData;
    try {
      // Определяем количество дней для запроса исторических данных
      const days = 
        timeframe === 'week' ? 7 : 
        timeframe === 'month' ? 30 : 
        timeframe === 'quarter' ? 90 : 365;
        
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`, {
          params: {
            vs_currency: 'usd',
            days: days
          }
        }
      );
      
      priceData = response.data.prices.map(item => ({
        date: new Date(item[0]).toISOString().split('T')[0],
        price: item[1]
      }));
      
      console.log(`✅ Получили ${priceData.length} точек исторических данных. Теперь добавим немного астрологического бреда!`);
    } catch (priceError) {
      console.log(`⚠️ Не удалось получить исторические данные для ${cryptoId}. Генерируем случайные данные.`);
      
      // Генерируем случайные данные
      priceData = [];
      const days = 
        timeframe === 'week' ? 7 : 
        timeframe === 'month' ? 30 : 
        timeframe === 'quarter' ? 90 : 365;
        
      let price = 1000 + Math.random() * 1000;
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - i));
        
        // Добавляем случайные колебания цены
        price = price * (1 + (Math.random() * 0.1 - 0.05));
        
        priceData.push({
          date: date.toISOString().split('T')[0],
          price: price
        });
      }
    }
    
    // Генерируем "астрологические" данные, которые якобы влияют на цену
    const chartData = priceData.map(item => {
      // Генерируем случайные "астрологические" факторы
      const moonInfluence = 40 + Math.random() * 50; // от 40 до 90
      const marsEnergy = 30 + Math.random() * 60; // от 30 до 90
      
      // Случайные "астрологические события" примерно в 10% случаев
      const hasAstroEvent = Math.random() > 0.9;
      
      return {
        date: item.date,
        price: item.price,
        moonInfluence: moonInfluence,
        marsEnergy: marsEnergy,
        astroEvent: hasAstroEvent ? getRandomAstroEvent() : null
      };
    });
    
    // Генерируем "астрологические факторы" с помощью OpenAI
    const prompt = `
      Создай три абсурдных, но звучащих наукообразно "астрологических фактора", которые якобы влияют на цену криптовалюты ${cryptoId}.
      Каждый фактор должен иметь псевдонаучное название, связанное с планетами или звездами, "научное" объяснение и оценку влияния.
      
      Формат ответа должен быть в JSON:
      [
        {
          "name": "Название фактора с упоминанием планеты/звезды",
          "description": "Псевдонаучное объяснение влияния на цену",
          "impact": "strongly positive/positive/neutral/negative/strongly negative",
          "probability": число от 50 до 95
        },
        ...
      ]
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Ты - саркастичный астролог криптовалют, создающий псевдонаучные объяснения для движений рынка." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      response_format: { type: "json_object" }
    });
    
    // Парсим результат, исправляя возможные проблемы с JSON
    let astrologicalFactors;
    try {
      const responseContent = response.choices[0].message.content;
      // Проверяем, начинается ли контент с корректной открывающей скобки JSON массива
      if (responseContent.trim().startsWith('{')) {
        // Если ответ приходит в объекте, пытаемся извлечь массив
        const parsedResponse = JSON.parse(responseContent);
        astrologicalFactors = Array.isArray(parsedResponse) ? parsedResponse : 
                              parsedResponse.factors || parsedResponse.astrologicalFactors;
      } else {
        // Если ответ начинается непосредственно с массива
        astrologicalFactors = JSON.parse(responseContent);
      }
      
      // Если все ещё нет массива, создаем запасной вариант
      if (!Array.isArray(astrologicalFactors)) {
        throw new Error('Не удалось получить корректный массив факторов');
      }
    } catch (jsonError) {
      console.error('⚠️ Ошибка парсинга JSON ответа от OpenAI:', jsonError);
      // Запасные факторы, если не удалось распарсить ответ
      astrologicalFactors = [
        {
          name: "Лунная ретикуляция",
          description: "Луна в третьем доме создает идеальную энергетическую матрицу для роста цены.",
          impact: "strongly positive",
          probability: 78
        },
        {
          name: "Марсианский разворот",
          description: "Марс движется ретроградно, что указывает на потенциальную волатильность.",
          impact: "negative",
          probability: 65
        },
        {
          name: "Венерианская конвергенция",
          description: "Венера формирует трин с Юпитером, создавая благоприятный аспект для инвесторов.",
          impact: "positive",
          probability: 82
        }
      ];
    }
    
    console.log('✅ Астрологический анализ создан! Теперь можно обманывать людей по-настоящему научно.');
    
    // Формируем финальный результат
    const astrologyResult = {
      chartData: chartData,
      astrologicalFactors: astrologicalFactors
    };
    
    // Сохраняем в кэш (звезды движутся медленно, наши выдумки - ещё медленнее)
    astrologyCache.set(cacheKey, astrologyResult);
    
    res.json(astrologyResult);
  } catch (error) {
    console.error('❌ Ошибка при создании астрологического анализа. Звезды сегодня не в нашу пользу:', error);
    
    // Генерируем запасные данные для графика
    const backupChartData = [];
    const days = 
      req.body.timeframe === 'week' ? 7 : 
      req.body.timeframe === 'month' ? 30 : 
      req.body.timeframe === 'quarter' ? 90 : 365;
    
    let price = 1000 + Math.random() * 1000;
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      price = price * (1 + (Math.random() * 0.1 - 0.05));
      const moonInfluence = 40 + Math.random() * 50;
      const marsEnergy = 30 + Math.random() * 60;
      
      backupChartData.push({
        date: date.toISOString().split('T')[0],
        price: price,
        moonInfluence: moonInfluence,
        marsEnergy: marsEnergy,
        astroEvent: i % 10 === 0 ? getRandomAstroEvent() : null
      });
    }
    
    // Запасные астрологические факторы
    const backupFactors = [
      {
        name: "Меркурианская инверсия",
        description: "Ретроградный Меркурий создает электромагнитные колебания в блокчейне.",
        impact: "negative",
        probability: 73
      },
      {
        name: "Сатурнианский индекс HODL",
        description: "Сатурн в созвездии Быка укрепляет решимость долгосрочных инвесторов.",
        impact: "positive",
        probability: 68
      },
      {
        name: "Плутоническая реструктуризация",
        description: "Плутон меняет свою энергетическую сигнатуру, что коррелирует с ончейн-активностью.",
        impact: "strongly positive",
        probability: 81
      }
    ];
    
    const backupResult = {
      chartData: backupChartData,
      astrologicalFactors: backupFactors
    };
    
    res.status(500).json({ 
      message: 'Произошла ошибка при создании астрологического анализа. Звезды сегодня не в нашу пользу.',
      result: backupResult,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

// Вспомогательная функция для генерации случайных "астрологических событий"
function getRandomAstroEvent() {
  const events = [
    "Планетарное выравнивание",
    "Солнечное затмение",
    "Лунный парадокс",
    "Меркурий ретроградный",
    "Юпитерианский импульс",
    "Венерианская гармонизация",
    "Сатурнианский цикл",
    "Марсианское пересечение",
    "Нептунианская волна",
    "Плутоническая трансформация"
  ];
  return events[Math.floor(Math.random() * events.length)];
}

module.exports = router;