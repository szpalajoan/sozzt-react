import React from 'react';
import { Box, Typography, Button, TextField, MenuItem, IconButton, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';

const TermVerificationStep = ({
  documentation,
  personResponsible,
  isEditingPerson,
  onPersonEdit,
  setPersonResponsible,
  handlePersonChange,
  onApproveTerms,
  onComplete,
  loading,
  isDisabled
}) => {
  const { t } = useTranslation();

  const verifiers = [
    { name: "Anna Kowalska", user: "user1" },
    { name: "Jan Nowak", user: "user2" }
  ];

  return (
    <Box 
      className="main-content"
      sx={{ 
        opacity: isDisabled ? 0.5 : 1,
        pointerEvents: isDisabled ? 'none' : 'auto',
        position: 'relative'
      }}
    >
      {isDisabled && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            position: 'absolute',
            top: 8,
            right: 16
          }}
        >
          Najpierw zakończ komunikację z Tauronem
        </Typography>
      )}

      <h2 className="section-title">{t('documentation.termVerification.title')}</h2>
      
      {/* Person selection */}
      <Box sx={{ mb: 3 }}>
        {!isEditingPerson && documentation.termVerification?.verifierName ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="action" />
            <Typography>
              {verifiers.find(v => v.user === documentation.termVerification.verifierName)?.name}
            </Typography>
            <IconButton size="small" onClick={onPersonEdit} sx={{ ml: 1 }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <>
            <TextField
              select
              label={t('documentation.termVerification.personLabel')}
              value={personResponsible}
              onChange={(e) => setPersonResponsible(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            >
              {verifiers.map((verifier) => (
                <MenuItem key={verifier.user} value={verifier.user}>
                  {verifier.name}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              onClick={handlePersonChange}
              disabled={!personResponsible || loading}
            >
              {t('documentation.termVerification.assignPerson')}
            </Button>
          </>
        )}
      </Box>

      {/* Terms approval section */}
      {documentation.termVerification?.verifierName && !documentation.termVerification?.areAllTermsActual && (
        <Button
          variant="contained"
          color="primary"
          onClick={onApproveTerms}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : t('documentation.termVerification.approveTerms')}
        </Button>
      )}

      {documentation.termVerification?.areAllTermsActual && !documentation.termVerification?.areContractsCorrect && (
        <>
          <Typography color="success.main" sx={{ mb: 2 }}>
            {t('documentation.termVerification.termsApproved')}
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={onComplete}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('documentation.termVerification.complete')}
          </Button>
        </>
      )}

      {documentation.termVerification?.areContractsCorrect && (
        <Typography color="success.main">
          {t('documentation.termVerification.documentationCompleted')}
        </Typography>
      )}
    </Box>
  );
};

export default TermVerificationStep; 