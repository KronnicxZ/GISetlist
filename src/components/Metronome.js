import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { Box, Button, Select, MenuItem, IconButton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

const Metronome = ({ bpm, timeSignature = '4/4' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSignature, setCurrentTimeSignature] = useState(timeSignature);
  const [currentBeat, setCurrentBeat] = useState(0);

  useEffect(() => {
    let timer;
    if (isPlaying && bpm > 0) {
      const synth = new Tone.Synth().toDestination();
      const beatsInBar = parseInt(currentTimeSignature.split('/')[0]);
      
      // Calcular el intervalo entre beats basado en los BPM
      const interval = (60 / bpm) * 1000; // convertir BPM a milisegundos

      timer = setInterval(() => {
        setCurrentBeat((prev) => {
          const nextBeat = (prev + 1) % beatsInBar;
          // Reproducir un tono más agudo en el primer beat de cada compás
          if (nextBeat === 0) {
            synth.triggerAttackRelease('C5', '32n', undefined, 0.5);
          } else {
            synth.triggerAttackRelease('G4', '32n', undefined, 0.3);
          }
          return nextBeat;
        });
      }, interval);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, bpm, currentTimeSignature]);

  const handleTimeSignatureChange = (event) => {
    setCurrentTimeSignature(event.target.value);
    setCurrentBeat(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setCurrentBeat(0);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
      <IconButton 
        onClick={togglePlay}
        color="primary"
        size="small"
      >
        {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
      </IconButton>

      <Select
        value={currentTimeSignature}
        onChange={handleTimeSignatureChange}
        size="small"
        sx={{ minWidth: 80 }}
      >
        <MenuItem value="4/4">4/4</MenuItem>
        <MenuItem value="3/4">3/4</MenuItem>
        <MenuItem value="6/8">6/8</MenuItem>
      </Select>

      <Typography variant="body2" color="text.secondary">
        {bpm} BPM
      </Typography>
    </Box>
  );
};

export default Metronome; 