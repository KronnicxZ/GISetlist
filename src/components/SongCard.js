import React from 'react';

const SongCard = ({ song, onEdit, onPlay }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-4 transition-all hover:shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{song.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{song.artist}</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => onPlay(song)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
            >
              Play
            </button>
            <button 
              onClick={() => onEdit(song)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
        <div className="mt-2 flex space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">BPM: {song.bpm}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Tonalidad: {song.key}</span>
        </div>
      </div>
    </div>
  );
};

export default SongCard;