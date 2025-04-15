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
          <div className="flex justify-end">
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="bg-transparent text-gray-400 text-xs border-none focus:outline-none cursor-pointer hover:text-white transition-colors"
            >
              <option value="RVR1960">RVR1960</option>
              <option value="NVI">NVI</option>
              <option value="LBLA">LBLA</option>
              <option value="RVA">RVA</option>
              <option value="PDT">PDT</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleVerse; 