// pages/TrustIndex.js - Страница для ASS-Trust-Index
import React, { useState, useEffect } from 'react';
import { getTrustIndex } from '../services/apiService';
import { 
  ArrowUpIcon, ArrowDownIcon, ExclamationCircleIcon,
  EmojiHappyIcon, EmojiSadIcon, FireIcon, FingerPrintIcon
} from '@heroicons/react/solid';

const TrustIndex = () => {
  const [trustData, setTrustData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    loadTrustData();
    generateHistoricalData();
  }, []);

  const loadTrustData = async () => {
    setLoading(true);
    try {
      const result = await getTrustIndex();
      setTrustData(result);
    } catch (error) {
      console.error('Error loading trust index:', error);
      // Используем заглушку данных для демонстрации
      setTrustData({
        indexValue: Math.floor(Math.random() * 100),
        marketSentiment: Math.random() > 0.5 ? 'positive' : 'negative',
        recommendation: `Рынок настроен ${Math.random() > 0.5 ? 'оптимистично' : 'пессимистично'}, 
                        поэтому наш ASS-Trust-Index рекомендует делать абсолютно наоборот!`,
        confidenceFactors: [
          {
            name: "FOMO индекс",
            value: Math.floor(Math.random() * 100),
            trend: Math.random() > 0.5 ? 'up' : 'down'
          },
          {
            name: "Индекс нытья в Twitter",
            value: Math.floor(Math.random() * 100),
            trend: Math.random() > 0.5 ? 'up' : 'down'
          },
          {
            name: "Количество 'экспертов'",
            value: Math.floor(Math.random() * 100),
            trend: Math.random() > 0.5 ? 'up' : 'down'
          },
          {
            name: "Индекс финансовой паники",
            value: Math.floor(Math.random() * 100),
            trend: Math.random() > 0.5 ? 'up' : 'down'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const generateHistoricalData = () => {
    const data = [];
    // Генерируем данные за последние 30 дней
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100)
      });
    }
    setHistoricalData(data);
  };

  // Функция для получения цвета индикатора
  const getIndexColor = (value) => {
    if (value < 30) return 'text-red-500';
    if (value < 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Функция для получения рекомендации на основе индекса
  const getRecommendation = (indexValue, marketSentiment) => {
    if (indexValue < 30) {
      return marketSentiment === 'positive' 
        ? "Все уверены в росте? Идеальное время для паники и необдуманных продаж!" 
        : "Все в панике? Немедленно покупайте! Или не покупайте. Кто знает?";
    } else if (indexValue < 70) {
      return "Рынок в замешательстве. Наш совет? Тоже будьте в замешательстве!";
    } else {
      return marketSentiment === 'positive'
        ? "Всеобщая эйфория? Отличный знак готовящегося коллапса рынка!"
        : "Всеобщий пессимизм при высоком ASS-индексе? Определенно готовится какая-то ловушка!";
    }
  };

  return (
    <div className="trust-index">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">ASS-Trust-Index</h1>
      <p className="text-lg mb-8 text-gray-300">
        Ироничный индикатор, обратный рыночным настроениям
      </p>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">Анализируем настроения рынка...</p>
          <p className="text-sm text-gray-500 mt-2">И готовим противоположную рекомендацию</p>
        </div>
      ) : trustData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-6 text-center text-purple-300">
                ASS-Trust-Index: Текущее значение
              </h2>
              
              <div className="index-value-container flex flex-col items-center mb-8">
                <div className="relative">
                  <svg className="w-48 h-48">
                    <circle
                      className="text-gray-700"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="69"
                      cx="96"
                      cy="96"
                    />
                    <circle
                      className={getIndexColor(trustData.indexValue)}
                      strokeWidth="10"
                      strokeDasharray={`${trustData.indexValue * 4.33} 433`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="69"
                      cx="96"
                      cy="96"
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className={`text-5xl font-bold ${getIndexColor(trustData.indexValue)}`}>
                      {trustData.indexValue}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-lg text-gray-300">
                    Рыночное настроение: 
                    <span className={trustData.marketSentiment === 'positive' ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                      {trustData.marketSentiment === 'positive' ? 'Позитивное' : 'Негативное'}
                    </span>
                  </p>
                  <p className="text-lg font-bold mt-2">
                    {getRecommendation(trustData.indexValue, trustData.marketSentiment)}
                  </p>
                </div>
              </div>
              
              <div className="historical-data">
                <h3 className="text-lg font-bold mb-3 text-purple-300">Исторические данные индекса</h3>
                
                <div className="flex items-end h-64 bg-gray-900 rounded-lg p-4">
                  {historicalData.map((day, index) => (
                    <div 
                      key={index} 
                      className="flex-1 flex flex-col items-center"
                      title={`${day.date}: ${day.value}`}
                    >
                      <div 
                        className={`w-full rounded-t-sm ${getIndexColor(day.value)}`}
                        style={{ height: `${day.value}%` }}
                      ></div>
                      {index % 7 === 0 && (
                        <span className="text-xs text-gray-500 mt-1">
                          {day.date.slice(5)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="confidence-factors">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-6 text-center text-purple-300">
                Факторы уверенности
              </h2>
              
              <div className="space-y-6">
                {trustData.confidenceFactors.map((factor, index) => (
                  <div key={index} className="factor bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">{factor.name}</h3>
                      <div className="flex items-center">
                        <span className={factor.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                          {factor.trend === 'up' ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />}
                        </span>
                        <span className="font-bold ml-1">{factor.value}%</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${factor.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${factor.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                <h3 className="font-bold mb-2 flex items-center text-yellow-400">
                  <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                  Важное примечание:
                </h3>
                <p className="text-gray-300">
                  ASS-Trust-Index намеренно ориентирован против общего настроения рынка. 
                  Если все счастливы, мы подозрительны. Если все в панике, мы видим возможности. 
                  Эффективность около 50% - примерно как подбрасывание монетки, только более саркастично.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-400">Не удалось загрузить ASS-Trust-Index</p>
          <p className="text-sm text-gray-500 mt-2">Возможно, он слишком умен для нашего сервера</p>
        </div>
      )}
      
      <div className="mt-10 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-purple-300">Как использовать ASS-Trust-Index?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <EmojiHappyIcon className="h-8 w-8 text-green-400" />
              <h3 className="font-bold text-lg">Когда индекс высокий (70-100)</h3>
            </div>
            <p className="text-gray-300">
              Все в эйфории? Будьте дважды осторожны! Высокий ASS-Trust-Index означает, 
              что наша система обнаружила слишком много позитива на рынке. Согласно нашей 
              противоположной логике, это идеальное время для паники или, по крайней мере, 
              здорового скептицизма.
            </p>
          </div>
          
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <EmojiSadIcon className="h-8 w-8 text-red-400" />
              <h3 className="font-bold text-lg">Когда индекс низкий (0-30)</h3>
            </div>
            <p className="text-gray-300">
              Рынок в панике? Может быть, это шанс! Низкий ASS-Trust-Index указывает 
              на преобладание негативных настроений. По нашей обратной логике, это может быть 
              хорошим временем для необоснованного оптимизма или, если вы осторожны, умеренного любопытства.
            </p>
          </div>
          
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FireIcon className="h-8 w-8 text-orange-400" />
              <h3 className="font-bold text-lg">Лучшие моменты для использования</h3>
            </div>
            <p className="text-gray-300">
              Используйте ASS-Trust-Index в моменты экстремальных рыночных эмоций. Когда новостные 
              заголовки кричат о неизбежном крахе или невероятном росте, наш индекс предлагает 
              освежающий взгляд противоположности. Работает правильно примерно в 50% случаев!
            </p>
          </div>
          
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FingerPrintIcon className="h-8 w-8 text-purple-400" />
              <h3 className="font-bold text-lg">Уникальная методология</h3>
            </div>
            <p className="text-gray-300">
              Наша методология проста: мы анализируем настроения рынка и предлагаем противоположное. 
              Почему это работает? Потому что массовая психология часто ошибается на экстремумах. 
              Или, может быть, потому что случайные предсказания иногда сбываются. Кто знает?
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition">
            Настроить персональные уведомления ASS-Trust-Index
          </button>
          <p className="text-xs text-gray-500 mt-2">
            * Следовать рекомендациям ASS-Trust-Index может быть не лучшей финансовой стратегией.
            Но, опять же, следовать любым рекомендациям тоже.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustIndex;