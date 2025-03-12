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
        title: `${cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)} - Inevitable Success!`,
        content: `After hours of analysis, I can confidently declare: ${cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)} is on the verge of tremendous growth! My unique indicators show a clear formation of the "Double Rocket with Hyper-acceleration" pattern. REMEMBER THIS MESSAGE - in a year you'll regret not buying now!`,
        indicators: [
          "Fivefold Fibonacci Convergence", 
          "Lunar Attraction Index", 
          "Triple Bottom with Waiting Guy Bounce", 
          "Mavrodi Line Crossing"
        ],
        signature: "CryptoGuru9000, Wealth Predictor™",
        followUp: "Note: this 'genius' forecast was created in hindsight. Predicting the past is our superpower!"
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
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Retroactive "Genius"</h1>
      <p className="text-lg mb-8 text-gray-300">
        A look "back" at our supposedly perfect predictions, which we surely made at the right time
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">Choose a cryptocurrency for retroactive prediction:</label>
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
          <p className="text-xl text-gray-400">Creating prediction from the past...</p>
          <p className="text-sm text-gray-500 mt-2">It takes time to properly age the paper</p>
        </div>
      ) : retroPost ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg" style={oldPaperStyle}>
              <div className="retro-post-header mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Published: {retroPost.date}
                    </div>
                    <h2 className="text-2xl font-bold text-yellow-400">
                      {retroPost.title}
                    </h2>
                  </div>
                  <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded rotate-12">
                    URGENT!
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
                  Technical Indicators:
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
                About "Genius" Predictions
              </h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  Every cryptocurrency market "expert" looks like a genius if you only show 
                  their successful predictions and ignore hundreds of incorrect ones.
                </p>
                <p>
                  Our retroactive "genius" illustrates how easy it is to look like a visionary 
                  when you make predictions in hindsight.
                </p>
                <p>
                  Remember: even a broken clock is right twice a day,
                  and a random "expert" is occasionally accidentally right.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-purple-300">
                How to Become an "Expert"
              </h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside">
                <li>Make many different predictions</li>
                <li>Loudly remind everyone about those that came true</li>
                <li>Never mention the unsuccessful ones</li>
                <li>Use complex terms and indicators</li>
                <li>Speak with absolute confidence</li>
                <li>If you're wrong, say "the market was manipulated"</li>
              </ol>
              
              <div className="mt-6 text-center">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition">
                  Generate your own forecast from the past
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  And become a retroactive crypto genius for just 50 $ASS
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-400">Choose a cryptocurrency to generate a retroactive "genius"</p>
          <p className="text-sm text-gray-500 mt-2">And we'll show how easy it is to be a seer in hindsight</p>
        </div>
      )}
      
      <div className="mt-10 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-purple-300">Hall of Fame of Retroactive "Geniuses"</h2>
        
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
                {["Bitcoin", "Ethereum", "Dogecoin"][index-1]} - Inevitable Rise!
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                "I am absolutely certain that this is the best investment opportunity of the decade..."
              </p>
              <div className="text-right text-purple-400 text-sm italic">
                - CryptoGuru{Math.floor(Math.random() * 9000) + 1000}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <button className="text-purple-400 hover:text-purple-300 transition">
            Show more "genius" forecasts from the past
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetroactivePredictions;