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
        recommendation: `The market is feeling ${Math.random() > 0.5 ? 'optimistic' : 'pessimistic'}, 
                        so our ASS-Trust-Index recommends doing exactly the opposite!`,
        confidenceFactors: [
          {
            name: "FOMO index",
            value: Math.floor(Math.random() * 100),
            trend: Math.random() > 0.5 ? 'up' : 'down'
          },
          {
            name: "Twitter Whining Index",
            value: Math.floor(Math.random() * 100),
            trend: Math.random() > 0.5 ? 'up' : 'down'
          },
          {
            name: "Number of 'Experts'",
            value: Math.floor(Math.random() * 100),
            trend: Math.random() > 0.5 ? 'up' : 'down'
          },
          {
            name: "Financial Panic Index",
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
        ? "Everyone's confident about growth? Perfect time to panic and make impulsive sales!" 
        : "Everyone's panicking? Buy immediately! Or don't buy. Who knows?";
    } else if (indexValue < 70) {
      return "The market is confused. Our advice? Be confused too!";
    } else {
      return marketSentiment === 'positive'
        ? "Universal euphoria? Excellent sign of an impending market collapse!"
        : "Universal pessimism with a high ASS-index? Definitely some kind of trap being set!";
    }
  };

  return (
    <div className="trust-index">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">ASS-Trust-Index</h1>
      <p className="text-lg mb-8 text-gray-300">
        The ironic indicator, opposite to market sentiments
      </p>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">Analyzing market sentiments...</p>
          <p className="text-sm text-gray-500 mt-2">And preparing the opposite recommendation</p>
        </div>
      ) : trustData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-6 text-center text-purple-300">
                ASS-Trust-Index: Current Value
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
                    Market Sentiment: 
                    <span className={trustData.marketSentiment === 'positive' ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                      {trustData.marketSentiment === 'positive' ? 'Positive' : 'Negative'}
                    </span>
                  </p>
                  <p className="text-lg font-bold mt-2">
                    {getRecommendation(trustData.indexValue, trustData.marketSentiment)}
                  </p>
                </div>
              </div>
              
              <div className="historical-data">
                <h3 className="text-lg font-bold mb-3 text-purple-300">Historical Index Data</h3>
                
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
                Confidence Factors
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
                  Important note:
                </h3>
                <p className="text-gray-300">
                  The ASS-Trust-Index is deliberately oriented against the general market sentiment. 
                  If everyone is happy, we're suspicious. If everyone is panicking, we see opportunities. 
                  Effectiveness around 50% - roughly like flipping a coin, just more sarcastically.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-400">Failed to load ASS-Trust-Index</p>
          <p className="text-sm text-gray-500 mt-2">Maybe it's too smart for our server</p>
        </div>
      )}
      
      <div className="mt-10 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-purple-300">How to Use the ASS-Trust-Index?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <EmojiHappyIcon className="h-8 w-8 text-green-400" />
              <h3 className="font-bold text-lg">When the index is high (70-100)</h3>
            </div>
            <p className="text-gray-300">
              Everyone's euphoric? Be twice as cautious! A high ASS-Trust-Index means 
              our system has detected too much positivity in the market. According to our 
              contrarian logic, this is the perfect time for panic or, at the very least, 
              healthy skepticism.
            </p>
          </div>
          
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <EmojiSadIcon className="h-8 w-8 text-red-400" />
              <h3 className="font-bold text-lg">When the index is low (0-30)</h3>
            </div>
            <p className="text-gray-300">
              Market in panic? Maybe it's a chance! A low ASS-Trust-Index indicates 
              the prevalence of negative sentiment. By our reverse logic, this could be 
              a good time for unfounded optimism or, if you're cautious, moderate curiosity.
            </p>
          </div>
          
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FireIcon className="h-8 w-8 text-orange-400" />
              <h3 className="font-bold text-lg">Best moments to use</h3>
            </div>
            <p className="text-gray-300">
              Use the ASS-Trust-Index in moments of extreme market emotions. When news 
              headlines are screaming about inevitable crashes or incredible growth, our index offers 
              a refreshing opposite view. Works correctly in about 50% of cases!
            </p>
          </div>
          
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FingerPrintIcon className="h-8 w-8 text-purple-400" />
              <h3 className="font-bold text-lg">Unique methodology</h3>
            </div>
            <p className="text-gray-300">
              Our methodology is simple: we analyze market sentiment and suggest the opposite. 
              Why does it work? Because mass psychology is often wrong at extremes. 
              Or, maybe because random predictions sometimes come true. Who knows?
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition">
            Set up personal ASS-Trust-Index notifications
          </button>
          <p className="text-xs text-gray-500 mt-2">
            * Following ASS-Trust-Index recommendations may not be the best financial strategy.
            But then again, following any recommendations might not be either.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustIndex;