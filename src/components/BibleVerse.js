import React, { useState, useEffect } from 'react';
import { verses } from '../constants/verses';

const BibleVerse = () => {
  const [verse, setVerse] = useState(null);

  useEffect(() => {
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    setVerse(randomVerse);
  }, []);

  if (!verse) return null;

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-300 text-lg italic mb-3">"{verse.verse}"</p>
        <p className="text-[#FBAE00] text-sm font-medium text-right">- {verse.reference}</p>
      </div>
    </div>
  );
};

export default BibleVerse; 