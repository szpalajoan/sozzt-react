import React from 'react';
import { Box, Typography, TextField, MenuItem, Button, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';

const LandExtractsPersonStep = ({
  personResponsible,
  availablePersons,
  isEditingPerson,
  onPersonEdit,
  setPersonResponsible,
  handlePersonResponsibleChange,
  requestForPlotExtractsSent,
  onRequestSent
}) => {
  const { t } = useTranslation();

  return (
    <Box className="main-content">
      <h2 className="section-title">{t('landExtracts.title')}</h2>

      <Box sx={{ mb: 3 }}>
        {!isEditingPerson && personResponsible ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="action" />
            <Typography>
              {availablePersons.find(p => p.user === personResponsible)?.name || personResponsible}
            </Typography>
            <IconButton size="small" onClick={onPersonEdit} sx={{ ml: 1 }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <>
            <TextField
              select
              label={t('landExtracts.personLabel')}
              value={personResponsible}
              onChange={(e) => setPersonResponsible(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            >
              {availablePersons.map((person) => (
                <MenuItem key={person.user} value={person.user}>
                  {person.name}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              onClick={handlePersonResponsibleChange}
              disabled={!personResponsible}
            >
              {t('landExtracts.assignPerson')}
            </Button>
          </>
        )}
      </Box>

      {personResponsible && !requestForPlotExtractsSent && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onRequestSent}
          >
            {t('landExtracts.requestSent')}
          </Button>
        </Box>
      )}

      {requestForPlotExtractsSent && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleOutlineIcon color="success" />
            <Typography color="success.main">
              {t('landExtracts.requestSent')}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LandExtractsPersonStep; 