// server.js - Сатирический бэкенд для Advanced Sarcastic Soothsayer ($ASS)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Загрузка переменных окружения (они как тайны вселенной, но менее полезные)
dotenv.config();

// Инициализация Express (примерно так же надежно, как криптопрогнозы)
const app = express();
const PORT = process.env.PORT || 5001;

// Шутливые сообщения для логирования запросов
const requestJokes = [
  "Еще один пользователь, верящий нашим прогнозам? Впечатляет!",
  "Кто-то снова пытается спросить у нас, куда пойдет рынок. Ха!",
  "О, смотрите, еще один инвестор, который думает, что мы знаем, что делаем!",
  "Запрос получен. Готовим абсолютно точный прогноз... или нет.",
  "Наши хомячки-предсказатели просыпаются для обработки этого запроса."
];

// Саркастическое логирование запросов
app.use((req, res, next) => {
  const randomJoke = requestJokes[Math.floor(Math.random() * requestJokes.length)];
  console.log(`🔮 ${req.method} ${req.url} - ${randomJoke}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB (почти так же надежно, как мнение Reddit о следующем альткойне)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🚀 MongoDB подключена! Ваши ценные данные теперь в надежных руках... наверное.'))
.catch(err => {
  console.error('💩 MongoDB решила с нами не дружить сегодня:', err);
  console.log('Но мы все равно продолжим, как настоящие криптоэнтузиасты - игнорируя красные флаги!');
});

// Импорт маршрутов (каждый такой же точный, как предсказания медиумов)
const predictionsRoutes = require('./routes/predictions');
const portfolioRoutes = require('./routes/portfolio');
const retrogenRoutes = require('./routes/retrogen');
const astrologyRoutes = require('./routes/astrology');
const trustIndexRoutes = require('./routes/trustIndex');

// Использование маршрутов (с надеждой, что они работают лучше, чем технический анализ)
app.use('/api/predictions', predictionsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/retrogen', retrogenRoutes);
app.use('/api/astrology', astrologyRoutes);
app.use('/api/trust-index', trustIndexRoutes);

// Базовый маршрут для проверки, жив ли сервер (спойлер: удивительно, но да)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Сервер работает, к всеобщему удивлению',
    confidence: Math.floor(Math.random() * 100) + '%',
    prediction: 'Это сообщение исчезнет после следующего обновления страницы' 
  });
});

// Обслуживание статических файлов в production (почти как обещания ICO - иногда работают)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Обработка ошибок (как обработка убытков - с сарказмом и отрицанием)
app.use((err, req, res, next) => {
  console.error('💥 Что-то сломалось. Возможно, это знак продавать все криптоактивы?', err);
  res.status(500).json({
    message: 'Сервер решил взять выходной. Как и ваша прибыль.',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Внутренняя ошибка сервера',
    advice: 'Попробуйте подбросить монетку. Вероятно, это даст более надежный результат, чем наш API.'
  });
});

// Запуск сервера (с такой же надежностью, как долгосрочные криптопрогнозы)
app.listen(PORT, () => {
  console.log(`
  🚀 $ASS сервер успешно запущен на порту ${PORT}!
  🔮 Готов предсказывать будущее с точностью подбрасывания монеты.
  💰 Помните: финансовые советы тем точнее, чем они саркастичнее!
  `);
});

// Тестовый эндпоинт для проверки OpenAI API
app.get('/api/test-openai', async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Generate a short funny joke about cryptocurrency." }
      ],
      max_tokens: 100
    });
    
    res.json({
      success: true,
      result: response.choices[0].message.content,
      model: "gpt-3.5-turbo",
      apiKey: process.env.OPENAI_API_KEY ? "Present (masked)" : "Missing"
    });
  } catch (error) {
    console.error("OpenAI API test failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      apiKey: process.env.OPENAI_API_KEY ? "Present (masked)" : "Missing",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});