import React, { useState, useEffect } from 'react';
import PredictionCard from '../components/PredictionCard';
import { fetchLatestCryptoData, generateSarcasticPrediction } from '../services/apiService';

const HomePage = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPredictions = async () => {
            setLoading(true);
            try {
                // Получаем реальные данные по крипте
                const cryptoData = await fetchLatestCryptoData();
                // Генерируем для них сатирические прогнозы
                const newPredictions = await Promise.all(
                    cryptoData.slice(0, 5).map(async (crypto) => {
                        const sarcasticContent = await generateSarcasticPrediction(crypto);
                        return {
                            id: crypto.id,
                            name: crypto.name,
                            symbol: crypto.symbol,
                            currentPrice: crypto.current_price,
                            sarcasticPrediction: sarcasticContent.prediction,
                            confidence: sarcasticContent.confidence,
                            analysis: sarcasticContent.analysis,
                            timestamp: new Date().toISOString()
                        };
                    })
                );
                setPredictions(newPredictions);
            } catch (error) {
                console.error('Error loading predictions:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPredictions();
    }, []);

    const handleGenerateMore = async () => {
        setLoading(true);
        try {
            const cryptoData = await fetchLatestCryptoData(10, 20); // Берем другой диапазон токенов
            const newPredictions = await Promise.all(
                cryptoData.slice(0, 5).map(async (crypto) => {
                    const sarcasticContent = await generateSarcasticPrediction(crypto);
                    return {
                        id: crypto.id,
                        name: crypto.name,
                        symbol: crypto.symbol,
                        currentPrice: crypto.current_price,
                        sarcasticPrediction: sarcasticContent.prediction,
                        confidence: sarcasticContent.confidence,
                        analysis: sarcasticContent.analysis,
                        timestamp: new Date().toISOString()
                    };
                })
            );
            setPredictions([...newPredictions]);
        } catch (error) {
            console.error('Error generating more predictions:', error);
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
                <h2 className="text-2xl font-bold mb-4 text-purple-300">$ASS Trust Index</h2>
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