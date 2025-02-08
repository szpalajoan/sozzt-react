import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';

const TauronCommunicationStep = ({
  documentation,
  onMarkSent,
  onMarkApproved,
  loading
}) => {
  const { t } = useTranslation();
  const mockSentDate = '2024-03-15'; // Data zmockowana

  return (
    <Box className="main-content">
      <h2 className="section-title">{t('documentation.tauronCommunication.title')}</h2>
      
      {/* Person responsible */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon color="action" />
        <Typography>Daniel</Typography>
      </Box>

      {/* Sent to Tauron section */}
      <Box sx={{ mb: 3 }}>
        {documentation.tauronCommunication?.printedDocumentationSentToTauron ? (
          <Box>
            <Typography color="success.main" sx={{ mb: 1 }}>
              {t('documentation.tauronCommunication.documentationSent')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('documentation.tauronCommunication.sentDate')}: {mockSentDate}
            </Typography>
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={onMarkSent}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('documentation.tauronCommunication.markAsSent')}
          </Button>
        )}
      </Box>

      {/* Tauron approval section */}
      {documentation.tauronCommunication?.printedDocumentationSentToTauron && (
        <Box>
          {documentation.tauronCommunication?.approvedByTauron ? (
            <Typography color="success.main">
              {t('documentation.tauronCommunication.approvedByTauron')}
            </Typography>
          ) : (
            <Button
              variant="contained"
              onClick={onMarkApproved}
              disabled={loading}
              color="success"
            >
              {loading ? <CircularProgress size={24} /> : t('documentation.tauronCommunication.markAsApproved')}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TauronCommunicationStep; 