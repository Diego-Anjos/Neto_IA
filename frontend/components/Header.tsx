
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md w-full z-10">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <h1 className="text-3xl font-bold text-blue-700">
          Neto<span className="text-blue-500">IA</span>
        </h1>
        <p className="text-gray-600 text-lg">Seu assistente digital amigável</p>
      </div>
    </header>
  );
};

export default Header;
