// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon } from '@heroicons/react/solid';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4 border-b border-purple-600">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <ChartBarIcon className="h-8 w-8 text-purple-500" />
          <div>
            <h1 className="text-2xl font-bold text-purple-400">Advanced Sarcastic Soothsayer</h1>
            <p className="text-sm text-gray-400">The $ASS you didn't know you needed</p>
          </div>
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-purple-400 transition">Home</Link></li>
            <li><Link to="/portfolio-analyzer" className="hover:text-purple-400 transition">Roast My Portfolio</Link></li>
            <li><Link to="/retro-genius" className="hover:text-purple-400 transition">Retro Genius</Link></li>
            <li><Link to="/ass-trology" className="hover:text-purple-400 transition">ASStrology</Link></li>
            <li><Link to="/trust-index" className="hover:text-purple-400 transition">Trust Index</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
