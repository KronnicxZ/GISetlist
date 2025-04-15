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
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState('RVR1960');

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        setLoading(true);
        setError(null);

        // Primero obtenemos un versículo aleatorio de nuestra lista local
        const randomLocalVerse = verses[Math.floor(Math.random() * verses.length)];
        
        // Intentamos obtener el mismo versículo en la versión seleccionada
        const response = await fetch(
          `https://api.scripture.api.bible/v1/bibles/${BIBLE_VERSIONS[selectedVersion]}/verses/${randomLocalVerse.reference}`,
          {
            headers: {
              'api-key': process.env.REACT_APP_BIBLE_API_KEY
            }
          }
        );

        if (!response.ok) {
          // Si falla la API, usamos el versículo local
          setVerse(randomLocalVerse);
          return;
        }

        const data = await response.json();
        setVerse({
          reference: data.data.reference,
          verse: data.data.text,
          version: selectedVersion
        });
      } catch (err) {
        // Si hay cualquier error, usamos el versículo local
        const randomLocalVerse = verses[Math.floor(Math.random() * verses.length)];
        setVerse(randomLocalVerse);
        setError('No se pudo cargar el versículo en línea. Mostrando versículo local.');
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, [selectedVersion]);

  if (loading) {
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
        <div className="flex justify-end mb-4">
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="bg-gray-800 text-white text-sm rounded-lg px-3 py-1 border border-gray-700 focus:outline-none focus:border-[#FBAE00]"
          >
            <option value="RVR1960">Reina Valera 1960</option>
            <option value="NVI">Nueva Versión Internacional</option>
            <option value="LBLA">La Biblia de las Américas</option>
            <option value="RVA">Reina Valera Actualizada</option>
            <option value="PDT">Palabra de Dios para Todos</option>
          </select>
        </div>
        <p className="text-gray-300 text-lg italic mb-3">"{verse.verse}"</p>
        <div className="flex justify-between items-center">
          <p className="text-[#FBAE00] text-sm font-medium">- {verse.reference}</p>
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default BibleVerse; 