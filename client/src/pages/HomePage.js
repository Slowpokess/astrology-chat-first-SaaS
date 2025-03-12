// pages/HomePage.js
import React, { useState, useEffect } from 'react';
import PredictionCard from '../components/PredictionCard';
import { fetchLatestCryptoData, generateSarcasticPrediction } from '../services/apiService';

const HomePage = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      // Получаем реальные данные по крипте
      const cryptoData = await fetchLatestCryptoData();
      
      // Генерируем для них сатирические прогнозы
      const newPredictions = await Promise.all(
        cryptoData.slice(0, 2).map(async (crypto) => {
          try {
            const sarcasticContent = await generateSarcasticPrediction(crypto);
            return {
              id: crypto.id,
              cryptoName: crypto.name,
              cryptoSymbol: crypto.symbol,
              currentPrice: crypto.current_price,
              sarcasticPrediction: sarcasticContent.text || sarcasticContent.sarcasticPrediction,
              confidence: sarcasticContent.confidence,
              analysis: sarcasticContent.analysis,
              timestamp: new Date().toISOString()
            };
          } catch (error) {
            console.error(`Error generating prediction for ${crypto.name}:`, error);
            // Fallback prediction in case of error
            return {
              id: crypto.id,
              cryptoName: crypto.name,
              cryptoSymbol: crypto.symbol,
              currentPrice: crypto.current_price,
              sarcasticPrediction: `${crypto.name} will do what all cryptocurrencies do - make investors nervous and take bad decisions.`,
              confidence: 85,
              analysis: "Based on the immutable law of FOMO and panic selling.",
              timestamp: new Date().toISOString()
            };
          }
        })
      );
      
      setPredictions(newPredictions);
    } catch (error) {
      console.error('Error loading predictions:', error);
      // Fallback to mock data if API fails
      setPredictions([
        {
          id: "bitcoin",
          cryptoName: "Bitcoin",
          cryptoSymbol: "btc",
          currentPrice: 45000,
          sarcasticPrediction: "After consulting with our group of fortune-telling experts and examining the entrails of a particularly prophetic chicken, we can confidently say that Bitcoin will continue its honorable tradition of making absolutely all price predictions wrong. Expect either a parabolic rise to eternal glory or a catastrophic fall to the center of the Earth.",
          confidence: 95,
          analysis: "Cosmic alignments and Twitter sentiments indicate inevitable volatility, which surprises absolutely no one.",
          timestamp: new Date().toISOString()
        },
        {
          id: "ethereum",
          cryptoName: "Ethereum",
          cryptoSymbol: "eth",
          currentPrice: 3200,
          sarcasticPrediction: "Our patented 'Vitalik's Mood' indicator suggests that Ethereum will continue to fulfill its promises around the time when the heat death of the universe occurs. Meanwhile, our gas fee forecast predicts expenses equivalent to a small family trip to Disneyland every time you want to swap tokens.",
          confidence: 72,
          analysis: "Technical analysis shows that drawing shapes on charts and calling them 'patterns' is still as reliable as ever.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMore = async () => {
    setLoading(true);
    try {
      const cryptoData = await fetchLatestCryptoData(2, 5); // Берем другой диапазон токенов
      const newPredictions = await Promise.all(
        cryptoData.slice(0, 2).map(async (crypto) => {
          try {
            const sarcasticContent = await generateSarcasticPrediction(crypto);
            return {
              id: crypto.id,
              cryptoName: crypto.name,
              cryptoSymbol: crypto.symbol,
              currentPrice: crypto.current_price,
              sarcasticPrediction: sarcasticContent.text || sarcasticContent.sarcasticPrediction,
              confidence: sarcasticContent.confidence,
              analysis: sarcasticContent.analysis,
              timestamp: new Date().toISOString()
            };
          } catch (error) {
            console.error(`Error generating prediction for ${crypto.name}:`, error);
            // Fallback prediction
            return {
              id: crypto.id,
              cryptoName: crypto.name,
              cryptoSymbol: crypto.symbol,
              currentPrice: crypto.current_price,
              sarcasticPrediction: `Our experts have temporarily lost connection with the cosmos, but we can say that ${crypto.name} will follow market laws that no one understands.`,
              confidence: 75,
              analysis: "Based on the phases of the moon and the position of tea leaves.",
              timestamp: new Date().toISOString()
            };
          }
        })
      );
      setPredictions(newPredictions);
    } catch (error) {
      console.error('Error generating more predictions:', error);
      // Fallback logic here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-purple-400">Welcome to the most honest crypto predictor</h1>
        <p className="text-xl mb-8 text-gray-300">
          Where our confidence is inversely proportional to our accuracy
        </p>
        <div className="flex justify-center">
          <button 
            onClick={handleGenerateMore}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition 
                     flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Generating more nonsense...</span>
            ) : (
              <span>Generate Even More Confident Predictions!</span>
            )}
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-purple-300">Today's ASStounding Predictions</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Loading incredibly accurate predictions...</p>
            <p className="text-sm text-gray-500 mt-2">Just kidding, they're going to be terrible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictions.map(prediction => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-purple-300">$ASS Trust Index</h2>
        <div className="flex items-center gap-4">
          <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
              style={{ width: '23%' }}
            ></div>
          </div>
          <span className="font-bold text-xl text-red-500">23%</span>
        </div>
        <p className="mt-2 text-gray-400 italic">
          Market sentiment is positive, which means it's the perfect time to panic sell everything!
        </p>
      </section>
    </div>
  );
};

export default HomePage;