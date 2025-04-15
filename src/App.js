import React, { useState } from 'react';
import { mockSongs, mockSetlists } from './mock/data';
import SongList from './components/SongList';
import PlayerModal from './components/PlayerModal';
import SearchBar from './components/SearchBar';
import SongForm from './components/SongForm';
import SetlistForm from './components/SetlistForm';
import LoginModal from './components/LoginModal';
import SortFilter from './components/SortFilter';
import { useAuth } from './context/AuthContext';

function App() {
  const [songs, setSongs] = useState(mockSongs);
  const [setlists, setSetlists] = useState(mockSetlists);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [showSongForm, setShowSongForm] = useState(false);
  const [showSetlistForm, setShowSetlistForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [editingSetlist, setEditingSetlist] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const { isAdmin, logout } = useAuth();

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (!sortBy) return 0; // No ordenar si no hay criterio seleccionado
    
    // Manejar valores nulos o undefined
    const aValue = a[sortBy] || '';
    const bValue = b[sortBy] || '';
    
    // Ordenar números
    if (sortBy === 'bpm') {
      return (Number(aValue) || 0) - (Number(bValue) || 0);
    }
    
    // Ordenar texto
    return aValue.toString().localeCompare(bValue.toString());
  });

  const handleSaveSong = (song) => {
    if (song.id) {
      setSongs(songs.map(s => s.id === song.id ? song : s));
    } else {
      setSongs([...songs, { ...song, id: Date.now().toString() }]);
    }
    setShowSongForm(false);
    setEditingSong(null);
  };

  const handleSaveSetlist = (setlist) => {
    if (setlist.id) {
      setSetlists(setlists.map(s => s.id === setlist.id ? setlist : s));
    } else {
      setSetlists([...setlists, { ...setlist, id: Date.now().toString() }]);
    }
    setShowSetlistForm(false);
    setEditingSetlist(null);
  };

  const handleDeleteSong = (songId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta canción?')) {
      setSongs(songs.filter(s => s.id !== songId));
    }
  };

  const handleDeleteSetlist = (setlistId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este setlist?')) {
      setSetlists(setlists.filter(s => s.id !== setlistId));
    }
  };

  const handleAddToSetlist = (setlistId, songIds) => {
    setSetlists(setlists.map(setlist => {
      if (setlist.id === setlistId) {
        // Filtrar canciones duplicadas
        const newSongs = [...new Set([...setlist.songs, ...songIds])];
        return { ...setlist, songs: newSongs };
      }
      return setlist;
    }));
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Menú lateral y móvil */}
      <div className={`${showMobileMenu ? 'fixed inset-0 z-50 bg-black bg-opacity-75' : ''} md:relative`}>
        <div className={`w-64 fixed h-full bg-black border-r border-gray-800 transform transition-transform duration-200 ease-in-out ${
          showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <img src="/favicon.ico" alt="GPM Logo" className="w-8 h-8" />
                <span className="text-xl font-semibold">GPM</span>
              </div>
              <button 
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => setShowMobileMenu(false)}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {isAdmin ? (
                <>
                  <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">CANCIONES</h2>
                    <button
                      onClick={() => {
                        setEditingSong(null);
                        setShowSongForm(true);
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center space-x-2 text-[#FBAE00] hover:text-[#ffc03d] w-full px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      <span>Nueva canción</span>
                    </button>
                  </div>

                  <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">SETLISTS</h2>
                    <button
                      onClick={() => {
                        setEditingSetlist(null);
                        setShowSetlistForm(true);
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center space-x-2 text-[#FBAE00] hover:text-[#ffc03d] w-full px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      <span>Nuevo setlist</span>
                    </button>
                  </div>

                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300 w-full px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    <span>Cerrar sesión</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 text-[#FBAE00] hover:text-[#ffc03d] w-full px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span>Acceso admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center">
              <button 
                className="md:hidden mr-4 text-gray-400"
                onClick={() => setShowMobileMenu(true)}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </button>
              <h1 className="text-2xl font-bold">Canciones</h1>
            </div>
            <div className="w-full md:w-auto flex items-stretch gap-4">
              <div className="flex-1 md:w-64">
                <SearchBar onSearch={setSearchTerm} />
              </div>
              <div className="w-48">
                <SortFilter onSortChange={setSortBy} />
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingSong(null);
                    setShowSongForm(true);
                  }}
                  className="h-10 bg-[#FBAE00] text-black px-4 rounded-lg font-medium flex items-center whitespace-nowrap hover:bg-[#ffc03d]"
                >
                  <span className="mr-1">+</span>
                  Nueva
                </button>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-400 mb-4">
            {filteredSongs.length} canciones
          </div>

          <SongList 
            songs={filteredSongs} 
            onSongSelect={setSelectedSong}
            onEditSong={isAdmin ? (song) => {
              setEditingSong(song);
              setShowSongForm(true);
            } : null}
            onDeleteSong={isAdmin ? handleDeleteSong : null}
            setlists={isAdmin ? setlists : null}
            onAddToSetlist={handleAddToSetlist}
          />
        </div>
      </div>

      {selectedSong && (
        <PlayerModal 
          song={selectedSong} 
          onClose={() => setSelectedSong(null)} 
        />
      )}

      {showSongForm && isAdmin && (
        <SongForm
          initialData={editingSong}
          onSubmit={handleSaveSong}
          onCancel={() => {
            setShowSongForm(false);
            setEditingSong(null);
          }}
        />
      )}

      {showSetlistForm && isAdmin && (
        <SetlistForm
          songs={songs}
          initialData={editingSetlist}
          onSubmit={handleSaveSetlist}
          onCancel={() => {
            setShowSetlistForm(false);
            setEditingSetlist(null);
          }}
        />
      )}

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}

export default App;

// DONE