import React, { useState, useEffect } from 'react';
import { verses } from '../constants/verses';

const BIBLE_VERSIONS = {
  'RVR1960': '592420522e16049f-01', // Reina Valera 1960
  'NVI': 'c61ead81cd1e82c1-01',     // Nueva Versión Internacional
  'LBLA': 'b32b9d1b64b4ef29-01',    // La Biblia de las Américas
  'RVA': '592420522e16049f-02',     // Reina Valera Actualizada
  'PDT': '592420522e16049f-03',     // Palabra de Dios para Todos
};

const BibleVerse = () => {
  const [currentReference, setCurrentReference] = useState(null);
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState('RVR1960');
  const [showVersionMenu, setShowVersionMenu] = useState(false);

  // Efecto para seleccionar un versículo aleatorio al montar el componente
  useEffect(() => {
    if (!currentReference) {
      const randomLocalVerse = verses[Math.floor(Math.random() * verses.length)];
      setCurrentReference(randomLocalVerse.reference);
    }
  }, []);

  // Efecto para obtener el versículo en la versión seleccionada
  useEffect(() => {
    const fetchVerse = async () => {
      if (!currentReference) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.scripture.api.bible/v1/bibles/${BIBLE_VERSIONS[selectedVersion]}/verses/${currentReference}`,
          {
            headers: {
              'api-key': process.env.REACT_APP_BIBLE_API_KEY
            }
          }
        );

        if (!response.ok) {
          // Si falla la API, buscamos el versículo en nuestra lista local
          const localVerse = verses.find(v => v.reference === currentReference);
          if (localVerse) {
            setVerse({
              reference: localVerse.reference,
              verse: localVerse.verse,
              version: 'RVR1960' // La versión local es RVR1960
            });
          }
          throw new Error('No se pudo obtener el versículo de la API');
        }

        const data = await response.json();
        setVerse({
          reference: data.data.reference,
          verse: data.data.text,
          version: selectedVersion
        });
      } catch (err) {
        setError('No se pudo cargar el versículo en línea. Mostrando versículo local.');
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, [currentReference, selectedVersion]);

  const handleNewVerse = () => {
    const randomLocalVerse = verses[Math.floor(Math.random() * verses.length)];
    setCurrentReference(randomLocalVerse.reference);
  };

  if (loading && !verse) {
    return (
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-300">Cargando versículo...</p>
        </div>
      </div>
    );
  }

  if (!verse) return null;

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <button
            onClick={handleNewVerse}
            className="text-sm text-[#FBAE00] hover:text-[#ffc03d] focus:outline-none"
          >
            Nuevo versículo
          </button>
        </div>
        <p className="text-gray-300 text-lg italic mb-3">"{verse.verse}"</p>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[#FBAE00] text-sm font-medium">
              - {verse.reference}
            </p>
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </div>
          <div className="flex justify-end relative">
            <div className="group">
              <button
                onClick={() => setShowVersionMenu(!showVersionMenu)}
                className="text-gray-400 hover:text-white transition-colors text-xs flex items-center space-x-1"
                title={`Versión actual: ${selectedVersion}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-xs">{selectedVersion}</span>
              </button>
              {showVersionMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  {Object.keys(BIBLE_VERSIONS).map((version) => (
                    <button
                      key={version}
                      onClick={() => {
                        setSelectedVersion(version);
                        setShowVersionMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-xs ${
                        selectedVersion === version
                          ? 'text-[#FBAE00] bg-gray-700'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {version}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleVerse; 