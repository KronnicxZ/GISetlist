import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from './ConfirmationModal';
import { extractYoutubeVideoId, getVideoDuration } from '../utils/youtube';

const SongList = ({ songs, onSongSelect, onEditSong, onDeleteSong, setlists, onAddToSetlist }) => {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [songDurations, setSongDurations] = useState({});
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchDurations = async () => {
      const durations = {};
      for (const song of songs) {
        if (song.youtubeUrl && !songDurations[song.id]) {
          const videoId = extractYoutubeVideoId(song.youtubeUrl);
          if (videoId) {
            const duration = await getVideoDuration(videoId);
            durations[song.id] = duration;
          }
        }
      }
      setSongDurations(prev => ({ ...prev, ...durations }));
    };

    fetchDurations();
  }, [songs]);

  const handleSelectSong = (e, songId) => {
    e.stopPropagation();
    setSelectedSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
  };

  const handleDeleteClick = (songId = null) => {
    setSongToDelete(songId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (songToDelete) {
      onDeleteSong(songToDelete);
    } else {
      selectedSongs.forEach(songId => onDeleteSong(songId));
      setSelectedSongs([]);
    }
    setIsDeleteModalOpen(false);
    setSongToDelete(null);
  };

  return (
    <div className="space-y-4">
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSongToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message={songToDelete 
          ? "¿Estás seguro de que quieres eliminar esta canción?"
          : `¿Estás seguro de que quieres eliminar ${selectedSongs.length} canción(es)?`
        }
      />

      {/* Barra de acciones */}
      {isAdmin && selectedSongs.length > 0 && (
        <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
          <div className="text-sm text-gray-400">
            {selectedSongs.length} {selectedSongs.length === 1 ? 'seleccionada' : 'seleccionadas'}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleDeleteClick()}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 bg-gray-800 rounded-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              <span>Eliminar</span>
            </button>
            {setlists && setlists.length > 0 && (
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm text-[#FBAE00] hover:text-[#ffc03d] bg-gray-800 rounded-lg"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <span>Agregar al setlist</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl invisible group-hover:visible">
                  {setlists.map(setlist => (
                    <button
                      key={setlist.id}
                      onClick={() => {
                        onAddToSetlist(setlist.id, selectedSongs);
                        setSelectedSongs([]);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      {setlist.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de canciones */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-800">
                  {isAdmin && (
                    <th className="py-3 px-4 font-medium w-8">
                      <span className="sr-only">Seleccionar</span>
                    </th>
                  )}
                  <th className="py-3 px-4 font-medium">Título</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Artista</th>
                  <th className="py-3 px-4 font-medium hidden lg:table-cell">Género</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">BPM</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Tono</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Duración</th>
                  {(onEditSong || onDeleteSong) && (
                    <th className="py-3 px-4 font-medium w-24">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-sm">
                {songs.map(song => (
                  <tr
                    key={song.id}
                    className="border-b border-gray-800 hover:bg-gray-900 cursor-pointer group"
                    onClick={() => onSongSelect(song)}
                  >
                    {isAdmin && (
                      <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedSongs.includes(song.id)}
                          onChange={(e) => handleSelectSong(e, song.id)}
                          className={`w-4 h-4 text-[#FBAE00] bg-gray-700 border-gray-600 rounded focus:ring-[#FBAE00] focus:ring-2 
                            ${selectedSongs.length > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                            transition-opacity duration-200`}
                        />
                      </td>
                    )}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-[#FBAE00]" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                          </svg>
                        </div>
                        <span className="truncate group-hover:text-[#FBAE00]">{song.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-400 hidden md:table-cell">{song.artist || '-'}</td>
                    <td className="py-4 px-4 text-gray-400 hidden lg:table-cell">{song.genre || '-'}</td>
                    <td className="py-4 px-4 hidden sm:table-cell">{song.bpm || '-'}</td>
                    <td className="py-4 px-4 hidden sm:table-cell">{song.key || '-'}</td>
                    <td className="py-4 px-4 hidden md:table-cell">{songDurations[song.id] || '-'}</td>
                    {(onEditSong || onDeleteSong) && (
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {onEditSong && (
                            <button 
                              className="text-gray-400 hover:text-[#FBAE00] p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditSong(song);
                              }}
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                              </svg>
                            </button>
                          )}
                          {onDeleteSong && (
                            <button 
                              className="text-gray-400 hover:text-red-500 p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(song.id);
                              }}
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongList; 