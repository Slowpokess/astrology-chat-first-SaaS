import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

const PredictionCard = ({ prediction }) => {
  // Определяем стиль в зависимости от уверенности прогноза
  // В нашей системе: чем выше уверенность, тем менее надежен прогноз
  const confidenceLevel = prediction.confidence; // от 0 до 100
  
  // Определяем цвет карточки в зависимости от уверенности
  const getBgColor = () => {
    if (confidenceLevel > 90) return 'border-red-500 bg-gradient-to-br from-gray-800 to-red-900';
    if (confidenceLevel > 75) return 'border-orange-500 bg-gradient-to-br from-gray-800 to-orange-900';
    if (confidenceLevel > 50) return 'border-yellow-500 bg-gradient-to-br from-gray-800 to-yellow-900';
    return 'border-green-500 bg-gradient-to-br from-gray-800 to-green-900';
  };

  // Определяем текст уверенности
  const getConfidenceText = () => {
    if (confidenceLevel > 90) return 'ABSOLUTELY GUARANTEED!!!';
    if (confidenceLevel > 75) return 'Very Confident';
    if (confidenceLevel > 50) return 'Somewhat Confident';
    return 'Just Guessing';
  };

  return (
    <div className={`prediction-card border-2 rounded-lg p-6 ${getBgColor()} transition-all hover:shadow-lg`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{prediction.name} ({prediction.symbol.toUpperCase()})</h3>
          <p className="text-gray-400">Current: ${prediction.currentPrice.toLocaleString()}</p>
        </div>
        <div className={`confidence-badge px-3 py-1 rounded-full text-xs font-bold
                        ${confidenceLevel > 75 ? 'bg-red-600 text-white' : 
                          confidenceLevel > 50 ? 'bg-yellow-600 text-white' : 
                          'bg-green-600 text-white'}`}>
          {getConfidenceText()}
        </div>
      </div>

      <p className="prediction-text text-lg mb-4">
        {prediction.sarcasticPrediction}
      </p>

      <div className="analysis-section text-sm bg-black bg-opacity-30 p-4 rounded-lg">
        <h4 className="font-bold mb-2 flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 mr-1 text-yellow-500" />
          Expert Analysis:
        </h4>
        <p className="text-gray-300">{prediction.analysis}</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Generated: {new Date(prediction.timestamp).toLocaleString()}
        </div>
        <button className="text-xs text-purple-400 hover:text-purple-300 transition">
          Share this wisdom
        </button>
      </div>
    </div>
  );
};

export default PredictionCard;