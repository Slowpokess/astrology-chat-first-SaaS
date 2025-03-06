const OpenAI = require('openai');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Функция для получения данных о криптовалютах
const getCryptoPrices = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
};

// Функция для генерации сатирического предсказания
const generatePrediction = async (cryptoData) => {
  try {
    // Создаем промт для OpenAI
    const prompt = `
      Создай сатирическое, язвительное предсказание цены и будущего криптовалюты ${cryptoData.name} (${cryptoData.symbol.toUpperCase()}).
      Текущая цена: $${cryptoData.current_price}
      
      Требования:
      1. Используй максимально токсичный, саркастичный тон
      2. Включи абсурдные, но псевдонаучные обоснования
      3. Притворись самоуверенным "экспертом"
      4. Чем более уверенно звучит прогноз, тем абсурднее он должен быть
      5. Используй нелепые корреляции с несвязанными явлениями
      6. Добавь выдуманные финансовые термины
      
      Формат ответа должен быть в JSON:
      {
        "text": "Сатирический прогноз на 1-2 абзаца",
        "confidence": число от 0 до 100 (чем абсурднее прогноз, тем выше уверенность),
        "analysis": "Псевдонаучное обоснование на 1-2 предложения"
      }
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Ты - саркастичный, токсичный ИИ-предсказатель криптовалют. Твоя задача создавать намеренно абсурдные, но звучащие технически предсказания." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating prediction:', error);
    // Возвращаем резервное предсказание в случае ошибки
    return {
      text: `${cryptoData.name} будет делать то, что делают все криптовалюты - заставлять инвесторов нервничать и принимать плохие решения.`,
      confidence: 85,
      analysis: "Основано на непреложном законе FOMO и панических продаж."
    };
  }
};

// Функция для анализа портфеля
const analyzePortfolio = async (portfolio) => {
  try {
    // Получаем текущие цены для токенов в портфеле
    const currentPrices = await getCryptoPrices();
    
    // Подготавливаем данные портфеля с текущими ценами
    const portfolioWithCurrentPrices = portfolio.map(item => {
      const cryptoData = currentPrices.find(crypto => 
        crypto.symbol.toLowerCase() === item.token.toLowerCase() || 
        crypto.name.toLowerCase() === item.token.toLowerCase()
      );
      
      return {
        ...item,
        currentPrice: cryptoData ? cryptoData.current_price : null
      };
    });
    
    // Создаем промт для OpenAI
    const prompt = `
      Проанализируй следующий криптопортфель с максимально язвительным и саркастичным тоном:
      ${JSON.stringify(portfolioWithCurrentPrices)}
      
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
      model: "gpt-4",
      messages: [
        { role: "system", content: "Ты - саркастичный, язвительный ИИ-аналитик финансов. Твоя задача создавать намеренно жесткие, но смешные анализы инвестиционных решений." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing portfolio:', error);
    // Возвращаем резервный анализ в случае ошибки
    return {
      overallRoast: "Поздравляю! Твой портфель настолько уникален, что даже наш ИИ отказывается его анализировать. Это либо гениально, либо катастрофично - но, скорее всего, второе.",
      tokenAnalysis: portfolio.map(item => ({
        name: item.token,
        roast: `Ах, ${item.token}. Классический выбор тех, кто любит учиться на собственных ошибках.`
      })),
      alternateUniverse: "В альтернативной вселенной ты вложился в индексный фонд и сейчас спокойно пьешь коктейль на пляже, а не обновляешь графики каждые 5 минут."
    };
  }
};

// Функция для генерации ретроактивного "гения"
const generateRetroGenius = async (cryptoName) => {
  try {
    // Получаем исторические данные для выбранной криптовалюты
    const historicalData = await getHistoricalData(cryptoName);
    
    // Находим точку максимального роста
    const bestEntry = findBestEntryPoint(historicalData);
    
    // Создаем промт для OpenAI
    const prompt = `
      Создай фейковый пост "из прошлого" (от ${bestEntry.date}), который якобы предсказал рост ${cryptoName}
      с $${bestEntry.price} до $${historicalData[historicalData.length - 1].price}.
      
      Требования:
      1. Используй самоуверенный, хвастливый тон
      2. Добавь "секретные сигналы", которые якобы указывали на успех
      3. Включи несколько якобы технических индикаторов
      4. Притворись, что это было "очевидно" для профессионалов
      5. Добавь несколько выдуманных терминов
      
      Формат ответа должен быть в JSON:
      {
        "date": "дата в формате DD-MM-YYYY",
        "title": "Название поста",
        "content": "Содержание поста на 1-2 абзаца",
        "indicators": ["Список 3-5 'технических индикаторов', которые якобы использовались"],
        "signature": "Подпись вымышленного 'эксперта'",
        "followUp": "Короткий саркастический комментарий от нашей системы"
      }
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Ты - саркастичный ИИ, создающий фейковые 'гениальные' прогнозы из прошлого. Твоя задача высмеивать самопровозглашенных экспертов рынка." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating retro genius:', error);
    // Возвращаем резервный контент в случае ошибки
    return {
      date: "01-01-2021",
      title: `${cryptoName} - Очевидная возможность!`,
      content: `Только что провел детальный анализ ${cryptoName} и, как профессионал, могу сказать: это очевидная возможность. Все технические индикаторы указывают на колоссальный рост. Не благодарите меня позже, просто запомните: я сказал это первым!`,
      indicators: ["RSI-дивергенция", "Двойная конвергенция Фибоначчи", "Пересечение хомячковых объемов"],
      signature: "КриптоМастерГуру9000, Предсказатель Будущего™",
      followUp: "Напоминание: этот пост был создан сегодня. Умение предсказывать прошлое - не суперспособность."
    };
  }
};

// Заглушка для получения исторических данных (в реальном проекте будет API)
const getHistoricalData = async (cryptoName) => {
  // Симуляция исторических данных
  const today = new Date();
  const data = [];
  
  for (let i = 365; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Создаем симуляцию цены с некоторой волатильностью
    const basePrice = 1000; // базовая цена
    const volatility = 0.05; // 5% волатильность
    const trend = 0.001; // небольшой тренд роста
    
    // Симуляция цены с памятью о предыдущей цене
    const prevPrice = data.length > 0 ? data[data.length - 1].price : basePrice;
    const randomChange = (Math.random() * 2 - 1) * volatility * prevPrice;
    const trendChange = prevPrice * trend * (365 - i);
    const price = prevPrice + randomChange + trendChange;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(price, 10) // Предотвращаем отрицательные цены
    });
  }
  
  return data;
};

// Функция для поиска лучшей точки входа в исторических данных
const findBestEntryPoint = (historicalData) => {
  let bestEntry = historicalData[0];
  let bestRatio = 0;
  
  // Находим точку с максимальным соотношением текущая_цена/цена_входа
  const finalPrice = historicalData[historicalData.length - 1].price;
  
  for (let i = 0; i < historicalData.length - 30; i++) { // Исключаем последние 30 дней
    const entry = historicalData[i];
    const ratio = finalPrice / entry.price;
    
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestEntry = entry;
    }
  }
  
  return bestEntry;
};

// Экспорт функций
module.exports = {
  getCryptoPrices,
  generatePrediction,
  analyzePortfolio,
  generateRetroGenius
};