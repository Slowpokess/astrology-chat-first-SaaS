import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PortfolioAnalyzer from './pages/PortfolioAnalyzer';
import RetroactivePredictions from './pages/RetroactivePredictions';
import AstrologicalCharts from './pages/AstrologicalCharts';
import TrustIndex from './pages/TrustIndex';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container bg-gray-900 text-white min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio-analyzer" element={<PortfolioAnalyzer />} />
            <Route path="/retro-genius" element={<RetroactivePredictions />} />
            <Route path="/ass-trology" element={<AstrologicalCharts />} />
            <Route path="/trust-index" element={<TrustIndex />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;