import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CompleteStepButton = ({ handleComplete, loading, titleKey, descriptionKey, warningMessage }) => {
  const { t } = useTranslation();
  return (
    <Box className="finalize-content">
      <h2 className="section-title">{t(titleKey)}</h2>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t(descriptionKey)}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
        {t(warningMessage)}
      </Typography>
      <Button
        variant="contained"
        color="success"
        onClick={handleComplete}
        disabled={loading}
      >
        {t('completeStep.completeAndFinalize')}
      </Button>
    </Box>
  );
};

export default CompleteStepButton;
