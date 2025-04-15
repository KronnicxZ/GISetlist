import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import Metronome from './Metronome';

const SongForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    artist: initialData.artist || '',
    lyrics: initialData.lyrics || '',
    bpm: initialData.bpm || '',
    notes: initialData.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <TextField
        fullWidth
        label="Título"
        name="title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Artista"
        name="artist"
        value={formData.artist}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="BPM"
        name="bpm"
        type="number"
        value={formData.bpm}
        onChange={handleChange}
        margin="normal"
        inputProps={{ min: 30, max: 300 }}
      />

      {formData.bpm && (
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Metrónomo
          </Typography>
          <Metronome bpm={parseInt(formData.bpm)} />
        </Box>
      )}

      <TextField
        fullWidth
        label="Letra"
        name="lyrics"
        value={formData.lyrics}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
      />

      <TextField
        fullWidth
        label="Notas adicionales"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={2}
      />

      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        sx={{ mt: 2 }}
        fullWidth
      >
        {initialData.title ? 'Actualizar Canción' : 'Crear Canción'}
      </Button>
    </Box>
  );
};

export default SongForm;

// DONE