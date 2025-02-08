import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

const MapVerificationStep = ({ documentation, loading, onApprove }) => {
  return (
    <Box className="main-content">
      <h2 className="section-title">Weryfikacja mapy</h2>
      {documentation.correctnessOfTheMap ? (
        <Typography 
          variant="body1" 
          color="success.main"
          sx={{ mt: 1 }}
        >
          Mapa została zatwierdzona
        </Typography>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={onApprove}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Zatwierdź mapę'}
        </Button>
      )}
    </Box>
  );
};

export default MapVerificationStep; 