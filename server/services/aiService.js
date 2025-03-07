// services/aiService.js - Здесь мы заставляем ИИ быть таким же "умным", как криптоаналитики
const OpenAI = require('openai');
const axios = require('axios');
const dotenv = require('dotenv');

// Загрузка секретов (почти как приватные ключи, но мы надеемся, что эти хранятся лучше)
dotenv.config();

// Даже ИИ не может предсказать крипторынок, но он хотя бы умеет смешно об этом писать
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Кэш для минимизации расходов на API (почти как твой план экономии на кофе для покупки биткоинов)
const predictionCache = new Map();
const portfolioCache = new Map();
const retroCache = new Map();

// Функция для получения данных о криптовалютах
const getCryptoPrices = async () => {
  try {
    console.log('🔍 Ищем актуальные цены... или что-то похожее на них');
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false
      }
    });
    
    console.log(`✅ Получили данные о ${response.data.length} криптовалютах. Теперь можем неправильно их интерпретировать!`);
    return response.data;
  } catch (error) {
    console.error('❌ Не удалось получить данные о криптовалютах. Видимо, рынок тоже в недоумении:', error);
    return [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 45000 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3000 },
      { id: 'dogecoin', name: 'Dogecoin', symbol: 'doge', current_price: 0.15 },
      { id: 'cardano', name: 'Cardano', symbol: 'ada', current_price: 0.5 },
      { id: 'solana', name: 'Solana', symbol: 'sol', current_price: 100 }
    ];
  }
};

const generatePrediction = async (cryptoData) => {
  // Сначала создаем промпт
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

  // Затем логгируем информацию
  console.log(`Генерируем предсказание для ${cryptoData.name} (${cryptoData.symbol})`);
  console.log("Отправляемый запрос к OpenAI:", prompt);

  // Создаем ключ кэша
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `${cryptoData.id || cryptoData.name}_${today}`;
  
  // Временно отключим кэш для отладки
  // if (predictionCache.has(cacheKey)) {
  //   console.log(`🧠 Нашли предсказание в кэше! Экономим деньги на API, в отличие от твоих крипто-трат.`);
  //   return predictionCache.get(cacheKey);
  // }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Можно заменить на другую модель, которая вам доступна
      messages: [
        { role: "system", content: "Ты - саркастичный, токсичный ИИ-предсказатель криптовалют. Твоя задача создавать намеренно абсурдные, но звучащие технически предсказания." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      // Временно отключаем формат JSON, чтобы проверить, работает ли запрос
      // response_format: { type: "json_object" }
    });
    
    console.log("Ответ от OpenAI:", response.choices[0].message.content);
    
    let result;
    try {
      // Попробуем распарсить ответ как JSON
      result = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      console.log("Ответ не в формате JSON, создаем структурированный объект из текста:", parseError);
      // Если не получается распарсить как JSON, создаем структуру вручную
      result = {
        text: response.choices[0].message.content,
        confidence: Math.floor(Math.random() * 30) + 70, // От 70 до 100
        analysis: "Сгенерировано на основе передовых алгоритмов случайных чисел и полета фантазии."
      };
    }
    
    console.log(`✅ Предсказание готово! Уверенность: ${result.confidence}%. Примерно как у всех криптоаналитиков.`);
    
    // Сохраняем в кэш
    predictionCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('❌ Ошибка при генерации предсказания. Наш ИИ такой же ненадежный, как и советы с Reddit:', error);
    // Возвращаем резервное предсказание в случае ошибки
    return {
      text: `${cryptoData.name} будет делать то, что делают все криптовалюты - заставлять инвесторов нервничать и принимать плохие решения. Наш уникальный индикатор "Большой Палец В Небо" показывает, что цена может пойти вверх, вниз, или, в редких случаях, остаться прежней.`,
      confidence: 85,
      analysis: "Основано на непреложном законе FOMO и панических продаж, а также на положении Меркурия в созвездии Тельца."
    };
  }
} 

// Остальные функции по аналогии...

// Финальный экспорт (единственное, что надежно экспортируется в этом модуле)
module.exports = {
  getCryptoPrices,
  generatePrediction,
  // Добавьте остальные функции по мере их создания
};