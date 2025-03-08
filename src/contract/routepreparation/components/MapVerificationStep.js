import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const MapVerificationStep = ({ routePreparation, onApprove, loading }) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy, HH:mm', { locale: pl });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <Box className="main-content">
      <h2 className="section-title">{t('routePreparation.mapVerification.title')}</h2>
      
      {routePreparation?.mapVerification?.correctnessOfTheMap ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleOutlineIcon color="success" />
            <Typography color="success.main">
              {t('routePreparation.mapVerification.approved')}
            </Typography>
          </Box>
          {routePreparation.mapVerification.verificationDate && (
            <Typography variant="body2" color="text.secondary">
              Data zatwierdzenia: {formatDate(routePreparation.mapVerification.verificationDate)}
            </Typography>
          )}
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={onApprove}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : t('routePreparation.mapVerification.button')}
        </Button>
      )}
    </Box>
  );
};

export default MapVerificationStep; 