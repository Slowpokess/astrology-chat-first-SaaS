import React, { useState } from 'react';

const PortfolioAnalyzer = () => {
  const [portfolio, setPortfolio] = useState([
    { token: '', amount: '', buyPrice: '' }
  ]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddToken = () => {
    setPortfolio([...portfolio, { token: '', amount: '', buyPrice: '' }]);
  };

  const handleRemoveToken = (index) => {
    const newPortfolio = [...portfolio];
    newPortfolio.splice(index, 1);
    setPortfolio(newPortfolio);
  };

  const handleTokenChange = (index, field, value) => {
    const newPortfolio = [...portfolio];
    newPortfolio[index][field] = value;
    setPortfolio(newPortfolio);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Имитация API-запроса
    setTimeout(() => {
      setAnalysis({
        overallRoast: "Congratulations! Your portfolio is a masterclass in 'buy high, sell never' philosophy. If financial self-sabotage was an Olympic sport, you'd be taking home the gold. The beautiful mix of overhyped L1s, defunct DeFi protocols, and memecoins that even dogs wouldn't recognize shows a remarkable commitment to ignoring all conventional wisdom.",
        tokenAnalysis: portfolio.map(item => ({
          name: item.token || "Unknown Token",
          roast: item.token ? `Ah yes, ${item.token}, the perfect choice for those who enjoy watching their money evaporate while insisting "it's just a correction." Buying at $${item.buyPrice} was especially inspired timing - right at the peak of 'everyone's talking about it on TikTok' phase.` : "You've invested in something so obscure even our AI can't mock it properly. Achievement unlocked!"
        })),
        alternateUniverse: "In an alternate universe where you did the exact opposite of every investment decision, you'd be lounging on your private island, sipping cocktails served by robots you bought with your spare change, while checking how many more zeroes your net worth gained today. Meanwhile, in this universe, you're eating instant ramen while convincing yourself that diamond hands eventually pay off."
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="portfolio-analyzer">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Roast My Portfolio</h1>
      <p className="text-lg mb-8 text-gray-300">
        Let our AI mock your investment decisions with brutal honesty
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Enter Your Portfolio</h2>
          <form onSubmit={handleSubmit}>
            {portfolio.map((item, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">Token #{index + 1}</h3>
                  {portfolio.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveToken(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Token Name/Symbol
                    </label>
                    <input
                      type="text"
                      value={item.token}
                      onChange={(e) => handleTokenChange(index, 'token', e.target.value)}
                      placeholder="BTC"
                      className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleTokenChange(index, 'amount', e.target.value)}
                      step="0.000001"
                      min="0"
                      placeholder="0.5"
                      className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Buy Price (USD)
                    </label>
                    <input
                      type="number"
                      value={item.buyPrice}
                      onChange={(e) => handleTokenChange(index, 'buyPrice', e.target.value)}
                      step="0.01"
                      min="0"
                      placeholder="30000"
                      className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={handleAddToken}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
              >
                Add Another Token
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition flex-grow disabled:opacity-50"
              >
                {loading ? 'Analyzing Your Poor Life Choices...' : 'Roast My Portfolio'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          {!analysis && !loading && (
            <div className="text-center py-12">
              <h2 className="text-xl font-bold mb-2">Ready To Be Humiliated?</h2>
              <p className="text-gray-400">
                Enter your portfolio details and our AI will prepare a personalized roast
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <h2 className="text-xl font-bold mb-2">Analyzing Portfolio...</h2>
              <p className="text-gray-400">
                Our AI is crafting special insults just for you
              </p>
            </div>
          )}

          {analysis && (
            <div className="analysis-result">
              <h2 className="text-xl font-bold mb-4 text-purple-400">Your Portfolio Analysis</h2>
              
              <div className="mb-6 p-4 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg">
                <h3 className="font-bold text-red-400 mb-2">Overall Assessment</h3>
                <p className="text-gray-200">{analysis.overallRoast}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-yellow-400 mb-2">Token-by-Token Breakdown</h3>
                {analysis.tokenAnalysis.map((token, index) => (
                  <div key={index} className="mb-3 p-3 bg-gray-700 rounded">
                    <h4 className="font-bold">{token.name}</h4>
                    <p className="text-gray-300">{token.roast}</p>
                  </div>
                ))}
              </div>
              
              <div className="mb-6 p-4 bg-blue-900 bg-opacity-30 border border-blue-800 rounded-lg">
                <h3 className="font-bold text-blue-400 mb-2">Alternate Universe Scenario</h3>
                <p className="text-gray-200">{analysis.alternateUniverse}</p>
              </div>
              
              <div className="flex justify-center mt-6">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition">
                  Share This Humiliation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalyzer;