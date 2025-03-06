import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Получение данных о криптовалютах (переименуйте функцию для совместимости)
export const fetchLatestCryptoData = async (start = 0, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/predictions/crypto-data`, {
      params: { start, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

// Добавьте для совместимости с RetroactivePredictions.js
export const getCryptoPrices = fetchLatestCryptoData;

// Генерация сатирического предсказания
export const generateSarcasticPrediction = async (crypto) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predictions/generate`, { crypto });
    return response.data;
  } catch (error) {
    console.error('Error generating prediction:', error);
    throw error;
  }
};

// Анализ криптопортфеля
export const analyzePortfolio = async (portfolio) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/portfolio/analyze`, { portfolio });
    return response.data;
  } catch (error) {
    console.error('Error analyzing portfolio:', error);
    throw error;
  }
};

// Генерация ретроактивного "гения"
export const generateRetroGenius = async (cryptoId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/retrogen/generate`, { cryptoId });
    return response.data;
  } catch (error) {
    console.error('Error generating retro genius:', error);
    throw error;
  }
};

// Генерация астрологического графика
export const generateAstrologicalChart = async (cryptoId, timeframe) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/astrology/chart`, { 
      cryptoId, 
      timeframe 
    });
    return response.data;
  } catch (error) {
    console.error('Error generating astrological chart:', error);
    throw error;
  }
};

// Получение индекса доверия
export const getTrustIndex = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trust-index`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trust index:', error);
    throw error;
  }
};