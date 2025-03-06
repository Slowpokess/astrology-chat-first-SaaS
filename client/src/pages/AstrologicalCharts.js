// pages/AstrologicalCharts.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { generateAstrologicalChart } from '../services/apiService';
import { MoonIcon, SunIcon, StarIcon } from '@heroicons/react/solid';

const AstrologicalCharts = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('month');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [astrologicalFactors, setAstrologicalFactors] = useState([]);

  const popularCryptos = [
    { id: 'bitcoin', name: 'Bitcoin' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'dogecoin', name: 'Dogecoin' },
    { id: 'solana', name: 'Solana' },
    { id: 'cardano', name: 'Cardano' }
  ];

  const timeframes = [
    { id: 'week', name: '7 Days' },
    { id: 'month', name: '30 Days' },
    { id: 'quarter', name: '90 Days' },
    { id: 'year', name: '365 Days' }
  ];

  const loadChartData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await generateAstrologicalChart(selectedCrypto, timeframe);
      setChartData(result.chartData);
      setAstrologicalFactors(result.astrologicalFactors);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCrypto, timeframe]);

  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  // Функция для генерации случайных данных (для демонстрации)
  const getRandomData = () => {
    const data = [];
    const days = timeframe === 'week' ? 7 : 
                 timeframe === 'month' ? 30 : 
                 timeframe === 'quarter' ? 90 : 365;
    
    let price = 100 + Math.random() * 50;
    let moonInfluence = 50 + Math.random() * 20;
    let marsEnergy = 30 + Math.random() * 40;
    
    for (let i = 0; i < days; i++) {
      // Симуляция цены с волатильностью
      price = price + (Math.random() * 10 - 5);
      // Случайное колебание "астрологических" факторов
      moonInfluence = Math.max(0, Math.min(100, moonInfluence + (Math.random() * 10 - 5)));
      marsEnergy = Math.max(0, Math.min(100, marsEnergy + (Math.random() * 8 - 4)));
      
      // Симуляция "событий" для добавления точек внимания
      const hasAstroEvent = Math.random() > 0.9;
      
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: price,
        moonInfluence: moonInfluence,
        marsEnergy: marsEnergy,
        astroEvent: hasAstroEvent ? 'Planetary Alignment' : null
      });
    }
    
    return data;
  };

  // Имитируем получение данных, если chartData не установлен с сервера
  if (!chartData && !loading) {
    const randomData = getRandomData();
    setChartData(randomData);
    
    // Генерируем случайные "астрологические факторы"
    const randomFactors = [
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
    setAstrologicalFactors(randomFactors);
  }

  const getPlanetIcon = (factor) => {
    if (factor.name.toLowerCase().includes('лун')) return <MoonIcon className="h-6 w-6 text-blue-400" />;
    if (factor.name.toLowerCase().includes('солнц') || factor.name.toLowerCase().includes('солнеч')) 
      return <SunIcon className="h-6 w-6 text-yellow-500" />;
    return <StarIcon className="h-6 w-6 text-purple-400" />;
  };

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'strongly positive': return 'text-green-500';
      case 'positive': return 'text-green-400';
      case 'neutral': return 'text-gray-400';
      case 'negative': return 'text-red-400';
      case 'strongly negative': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded shadow-lg">
          <p className="font-bold text-white">{label}</p>
          <p className="text-green-400">
            Цена: ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-blue-400">
            Лунное влияние: {payload[1].value.toFixed(1)}%
          </p>
          <p className="text-red-400">
            Марсианская энергия: {payload[2].value.toFixed(1)}%
          </p>
          {payload[0].payload.astroEvent && (
            <p className="text-purple-400 font-bold mt-1">
              {payload[0].payload.astroEvent}!
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="astrological-charts">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">ASStrological Charts</h1>
      <p className="text-lg mb-8 text-gray-300">
        Где астрология встречается с техническим анализом в идеальном союзе абсурда
      </p>
      
      <div className="controls mb-6 flex flex-wrap gap-4">
        <div className="crypto-selector">
          <label className="block text-sm font-medium text-gray-400 mb-2">Выберите криптовалюту:</label>
          <select 
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {popularCryptos.map(crypto => (
              <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
            ))}
          </select>
        </div>
        
        <div className="timeframe-selector">
          <label className="block text-sm font-medium text-gray-400 mb-2">Временной период:</label>
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {timeframes.map(period => (
              <option key={period.id} value={period.id}>{period.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="chart-container bg-gray-800 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4 text-purple-300">ASStrologically Enhanced Price Chart</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Consulting the stars...</p>
            <p className="text-sm text-gray-500 mt-2">Aligning planetary movements with market patterns</p>
          </div>
        ) : chartData ? (
          <div className="relative">
            <div className="text-xs text-gray-500 italic absolute top-0 right-0">
              *Совершенно научно
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="moonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="marsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#34D399" 
                  fillOpacity={1} 
                  fill="url(#priceGradient)" 
                  name="Цена ($)"
                />
                <Area 
                  type="monotone" 
                  dataKey="moonInfluence" 
                  stroke="#60A5FA" 
                  fillOpacity={0.3} 
                  fill="url(#moonGradient)" 
                  name="Лунное влияние (%)"
                />
                <Area 
                  type="monotone" 
                  dataKey="marsEnergy" 
                  stroke="#F87171" 
                  fillOpacity={0.3} 
                  fill="url(#marsGradient)" 
                  name="Марсианская энергия (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Не удалось связаться с космическими силами</p>
            <p className="text-sm text-gray-500 mt-2">Звезды сегодня не в настроении</p>
          </div>
        )}
      </div>
      
      <div className="astrological-factors">
        <h2 className="text-xl font-bold mb-4 text-purple-300">Астрологические факторы влияния</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {astrologicalFactors.map((factor, index) => (
            <div key={index} className="factor-card bg-gray-800 border border-gray-700 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-3">
                {getPlanetIcon(factor)}
                <h3 className="font-bold text-lg">{factor.name}</h3>
              </div>
              
              <p className="text-gray-300 mb-3">{factor.description}</p>
              
              <div className="flex justify-between items-center">
                <span className={`font-medium ${getImpactColor(factor.impact)}`}>
                  Влияние: {factor.impact}
                </span>
                <span className="text-yellow-400 font-medium">
                  {factor.probability}% уверенность
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-10 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-purple-300">Астрологический прогноз</h2>
        <div className="mb-4 p-4 bg-gray-700 rounded-lg">
          <p className="text-lg italic">
            "Согласно нашему глубокому анализу планетарных движений и космических энергий, 
            {selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)} находится под 
            влиянием ретроградного Меркурия в созвездии Рыси-Под-Хвостом. Это однозначно 
            указывает на {Math.random() > 0.5 ? 'бычий' : 'медвежий'} тренд в ближайшие 
            {Math.floor(Math.random() * 10) + 1} дней. Инвесторам рекомендуется принимать решения 
            только при растущей луне и никогда по вторникам."
          </p>
          <div className="flex justify-end">
            <span className="text-purple-400 font-medium">
              - Профессор Астрономических Финансов, Университет Воображаемых Наук
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition">
            Получить персонализированный астро-прогноз за 100 $ASS
          </button>
          <p className="text-xs text-gray-500 mt-2">
            * Результаты могут варьироваться. Не является финансовой рекомендацией. 
            При создании не пострадало ни одно созвездие.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AstrologicalCharts;