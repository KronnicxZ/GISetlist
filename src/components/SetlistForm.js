import React, { useState } from 'react';

const SetlistForm = ({ songs, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    songs: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSongToggle = (songId) => {
    setFormData(prev => ({
      ...prev,
      songs: prev.songs.includes(songId)
        ? prev.songs.filter(id => id !== songId)
        : [...prev.songs, songId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Editar Setlist' : 'Nuevo Setlist'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FBAE00]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FBAE00]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Canciones
              </label>
              <div className="overflow-y-auto max-h-[40vh] space-y-2 pr-2">
                {songs.map(song => (
                  <label
                    key={song.id}
                    className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={formData.songs.includes(song.id)}
                      onChange={() => handleSongToggle(song.id)}
                      className="w-4 h-4 text-[#FBAE00] bg-gray-700 border-gray-600 rounded focus:ring-[#FBAE00] focus:ring-2"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium group-hover:text-[#FBAE00]">{song.title}</div>
                      {song.artist && (
                        <div className="text-sm text-gray-400">{song.artist}</div>
                      )}
                    </div>
                    {song.bpm && (
                      <div className="text-sm text-gray-400">
                        {song.bpm} BPM
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 p-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-gray-800 rounded-lg focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-black bg-[#FBAE00] rounded-lg hover:bg-[#ffc03d] focus:outline-none"
            >
              {initialData ? 'Guardar cambios' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetlistForm;