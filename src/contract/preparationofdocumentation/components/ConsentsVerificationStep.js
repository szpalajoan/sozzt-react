import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const ConsentsVerificationStep = ({ documentation, loading, onComplete }) => {
  return (
    <Box className="main-content">
      <h2 className="section-title">Weryfikacja zgód</h2>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="action" />
          <Typography>Kasia</Typography>
        </Box>
      </Box>

      {documentation.consentsVerification?.consentsVerified ? (
        <Typography 
          variant="body1" 
          color="success.main"
          sx={{ mt: 1 }}
        >
          Zgody zostały zweryfikowane
        </Typography>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={onComplete}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Zatwierdź weryfikację zgód'}
        </Button>
      )}
    </Box>
  );
};

export default ConsentsVerificationStep; 