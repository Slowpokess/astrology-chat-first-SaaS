const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const axios = require('axios');
const path = require('path');

// Загрузка переменных окружения
dotenv.config();

// Инициализация Express
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Базовый маршрут для проверки работоспособности
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});


// Инициализация OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Импорт маршрутов
const predictionsRoutes = require('./routes/predictions');
const portfolioRoutes = require('./routes/portfolio');
const retrogenRoutes = require('./routes/retrogen');
const astrologyRoutes = require('./routes/astrology');
const trustIndexRoutes = require('./routes/trustIndex');

// Использование маршрутов
app.use('/api/predictions', predictionsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/retrogen', retrogenRoutes);
app.use('/api/astrology', astrologyRoutes);
app.use('/api/trust-index', trustIndexRoutes);

// Обслуживание статических файлов в production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

