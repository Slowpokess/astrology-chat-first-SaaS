// pages/RetroactivePredictions.js
import React, { useState, useEffect } from 'react';
import { generateRetroGenius, getCryptoPrices } from '../services/apiService';

const RetroactivePredictions = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [retroPost, setRetroPost] = useState(null);
  const [popularCryptos, setPopularCryptos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPopularCryptos();
  }, []);

  useEffect(() => {
    if (selectedCrypto) {
      generatePrediction(selectedCrypto);
    }
  }, [selectedCrypto]);

  const loadPopularCryptos = async () => {
    try {
      const data = await getCryptoPrices();
      setPopularCryptos(data.slice(0, 20)); // Берем топ-20 криптовалют
    } catch (error) {
      console.error('Error loading popular cryptos:', error);
      // Заглушка на случай ошибки
      setPopularCryptos([
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'eth' },
        { id: 'dogecoin', name: 'Dogecoin', symbol: 'doge' },
        { id: 'solana', name: 'Solana', symbol: 'sol' },
        { id: 'cardano', name: 'Cardano', symbol: 'ada' }
      ]);
    }
  };

  const generatePrediction = async (cryptoId) => {
    setLoading(true);
    try {
      const result = await generateRetroGenius(cryptoId);
      setRetroPost(result);
    } catch (error) {
      console.error('Error generating retro post:', error);
      // Заглушка на случай ошибки
      setRetroPost({
        date: "15-01-2021",
        title: `${cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)} - Неизбежный успех!`,
        content: `После многочасового анализа могу с уверенностью заявить: ${cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)} находится на пороге грандиозного роста! Мои уникальные индикаторы показывают явное формирование паттерна "Двойной ракеты с гиперускорением". ЗАПОМНИТЕ ЭТО СООБЩЕНИЕ - через год вы будете жалеть, что не купили сейчас!`,
        indicators: [
          "Пятикратная конвергенция Фибоначчи", 
          "Индекс лунного притяжения", 
          "Тройное дно с отскоком ждуна", 
          "Пересечение линии Мавроди"
        ],
        signature: "КриптоГуру9000, Предсказатель Богатства™",
        followUp: "Примечание: этот 'гениальный' прогноз создан задним числом. Предсказывать прошлое - наша суперспособность!"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRandomDate = () => {
    const start = new Date(2020, 0, 1);
    const end = new Date(2021, 11, 31);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
  };

  const formatFollowUp = (text) => {
    if (!text) return '';
    // Делаем первую часть (до тире или двоеточия) красной
    const parts = text.split(/[-:]/);
    if (parts.length > 1) {
      return (
        <>
          <span className="text-red-400 font-bold">{parts[0]}</span>
          <span>{text.replace(parts[0], '')}</span>
        </>
      );
    }
    return text;
  };

  // Добавляем эффект "старой бумаги" для ретро-поста
  const oldPaperStyle = {
    backgroundImage: `
      radial-gradient(circle at center, rgba(255, 250, 240, 0.03) 0%, rgba(255, 250, 240, 0.01) 100%), 
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
    `,
    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.2)'
  };

  return (
    <div className="retro-predictions">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Ретроактивный "Гений"</h1>
      <p className="text-lg mb-8 text-gray-300">
        Взгляд в "прошлое" на наши якобы идеальные предсказания, которые мы, конечно же, сделали вовремя
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">Выберите криптовалюту для ретроактивного предсказания:</label>
        <select 
          value={selectedCrypto}
          onChange={(e) => setSelectedCrypto(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {popularCryptos.map(crypto => (
            <option key={crypto.id} value={crypto.id}>
              {crypto.name} ({crypto.symbol.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-400">Изготавливаем предсказание из прошлого...</p>
          <p className="text-sm text-gray-500 mt-2">Требуется время, чтобы правильно состарить бумагу</p>
        </div>
      ) : retroPost ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg" style={oldPaperStyle}>
              <div className="retro-post-header mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Опубликовано: {retroPost.date}
                    </div>
                    <h2 className="text-2xl font-bold text-yellow-400">
                      {retroPost.title}
                    </h2>
                  </div>
                  <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded rotate-12">
                    СРОЧНО!
                  </div>
                </div>
              </div>
              
              <div className="retro-post-content mb-6">
                <p className="text-lg leading-relaxed bg-gradient-to-r from-gray-300 to-gray-100 text-transparent bg-clip-text">
                  {retroPost.content}
                </p>
              </div>
              
              <div className="retro-post-indicators mb-6">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">
                  Технические индикаторы:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {retroPost.indicators.map((indicator, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="retro-post-signature text-right">
                <p className="text-purple-300 italic">
                  {retroPost.signature}
                </p>
              </div>
            </div>
            
            <div className="mt-6 bg-red-900 bg-opacity-20 border border-red-800 p-4 rounded-lg">
              <p className="text-gray-300 italic">
                {formatFollowUp(retroPost.followUp)}
              </p>
            </div>
          </div>
          
          <div className="explanation-sidebar">
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-4 text-purple-300">
                О "гениальных" предсказаниях
              </h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  Каждый "эксперт" криптовалютного рынка выглядит гением, если показывать 
                  только его удачные предсказания и игнорировать сотни ошибочных.
                </p>
                <p>
                  Наш ретроактивный "гений" иллюстрирует, как легко выглядеть провидцем, 
                  когда ты делаешь предсказания задним числом.
                </p>
                <p>
                  Помните: даже сломанные часы дважды в день показывают правильное время,
                  а случайный "эксперт" иногда случайно оказывается прав.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-purple-300">
                Как стать "экспертом"
              </h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside">
                <li>Делайте много разных предсказаний</li>
                <li>Громко напоминайте о тех, что сбылись</li>
                <li>Никогда не упоминайте о неудачных</li>
                <li>Используйте сложные термины и индикаторы</li>
                <li>Говорите с абсолютной уверенностью</li>
                <li>Если ошиблись, скажите "рынок был манипулирован"</li>
              </ol>
              
              <div className="mt-6 text-center">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition">
                  Сгенерировать собственный прогноз из прошлого
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  И станьте ретроактивным криптогением всего за 50 $ASS
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-400">Выберите криптовалюту для генерации ретроактивного "гения"</p>
          <p className="text-sm text-gray-500 mt-2">И мы покажем, как легко быть провидцем задним числом</p>
        </div>
      )}
      
      <div className="mt-10 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-purple-300">Зал славы ретроактивных "гениев"</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-500">{getRandomDate()}</div>
                <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                  +{Math.floor(Math.random() * 900) + 100}%
                </div>
              </div>
              <h3 className="font-bold text-white mb-1">
                {["Bitcoin", "Ethereum", "Dogecoin"][index-1]} - Неизбежный взлет!
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                "Я абсолютно уверен, что это лучшая инвестиционная возможность десятилетия..."
              </p>
              <div className="text-right text-purple-400 text-sm italic">
                - КриптоГуру{Math.floor(Math.random() * 9000) + 1000}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <button className="text-purple-400 hover:text-purple-300 transition">
            Показать больше "гениальных" прогнозов из прошлого
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetroactivePredictions;