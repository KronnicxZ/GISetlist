import React from 'react';

const FilterBar = ({ selectedGenre, selectedKey, onGenreChange, onKeyChange }) => {
  const genres = ['todos', 'adoracion', 'alabanza', 'ofrenda'];
  const keys = ['todas', 'C', 'G', 'D', 'A', 'E', 'B', 'F'];

  return (
    <div className="flex space-x-2 p-4 overflow-x-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <select
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm
                 text-gray-900 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {genres.map(genre => (
          <option key={genre} value={genre}>
            {genre === 'todos' ? 'Todas las categorías' : 
             genre.charAt(0).toUpperCase() + genre.slice(1)}
          </option>
        ))}
      </select>

      <select
        value={selectedKey}
        onChange={(e) => onKeyChange(e.target.value)}
        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm
                 text-gray-900 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {keys.map(key => (
          <option key={key} value={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar; 