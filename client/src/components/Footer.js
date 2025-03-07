import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 border-t border-purple-600 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} Advanced Sarcastic Soothsayer ($ASS)</p>
        <p className="text-sm text-gray-500 mt-1">All predictions are satirical and should not be taken seriously.</p>
      </div>
    </footer>
  );
};

export default Footer;