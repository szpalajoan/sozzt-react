import React from 'react';
import { Box, Typography, TextField, MenuItem, Button, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import FileUploadSection from '../../../components/FileUploadSection';
import OpenFolderButton from '../../../components/OpenFolderButton';

const RouteDrawingStep = ({
  routePreparation,
  personResponsible,
  availablePersons,
  isEditingPerson,
  onPersonEdit,
  setPersonResponsible,
  handlePersonResponsibleChange,
  drawnRouteProps,
  pdfProps,
  isDisabled
}) => {
  const { t } = useTranslation();

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
          Najpierw zatwierdź poprawność mapy
        </Typography>
      )}

      <h2 className="section-title">{t('routePreparation.routeDrawing.title')}</h2>

      {/* Person selection */}
      <Box sx={{ mb: 3 }}>
        {!isEditingPerson && routePreparation?.routeDrawing?.drawingBy ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="action" />
            <Typography>
              {availablePersons.find(p => p.user === routePreparation.routeDrawing.drawingBy)?.name || routePreparation.routeDrawing.drawingBy}
            </Typography>
            <IconButton size="small" onClick={onPersonEdit} sx={{ ml: 1 }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <>
            <TextField
              select
              label={t('routePreparation.routeDrawing.personLabel')}
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
              disabled={!personResponsible || drawnRouteProps.loading}
            >
              {t('routePreparation.routeDrawing.assignPerson')}
            </Button>
          </>
        )}
      </Box>

      {/* Files upload sections or open folder button */}
      {routePreparation?.routeDrawing?.drawingBy && (
        <Box>
          {/* Drawn route section */}
          {routePreparation.routeDrawing.mapWithRouteFileId && !routePreparation.routeDrawing.routeWithDataFileId && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                {t('fileUpload.onlyDrawnMapUploaded')}
              </Typography>
              {!routePreparation.routeDrawing.routeWithDataFileId && (
                <OpenFolderButton
                  folderPath="Projekty"
                  buttonText="Otwórz folder"
                />
              )}
            </Box>
          )}

          {!routePreparation.routeDrawing.mapWithRouteFileId && (
            <Box sx={{ mb: 3 }}>
              <FileUploadSection
                {...drawnRouteProps}
                titleTranslationKey="routePreparation.routeDrawing.fileUpload.drawnRouteTitle"
              />
            </Box>
          )}

          {/* PDF section */}
          {routePreparation.routeDrawing.routeWithDataFileId && !routePreparation.routeDrawing.mapWithRouteFileId && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                {t('fileUpload.onlyPdfUploaded')}
              </Typography>
              {!routePreparation.routeDrawing.mapWithRouteFileId && (
                <OpenFolderButton
                  folderPath="Projekty"
                  buttonText="Otwórz folder"
                />
              )}
            </Box>
          )}

          {!routePreparation.routeDrawing.routeWithDataFileId && (
            <Box sx={{ mb: 3 }}>
              <FileUploadSection
                {...pdfProps}
                titleTranslationKey="routePreparation.routeDrawing.fileUpload.pdfTitle"
              />
            </Box>
          )}

          {/* Show OpenFolderButton when both files are uploaded */}
          {routePreparation.routeDrawing.mapWithRouteFileId &&
            routePreparation.routeDrawing.routeWithDataFileId && (
              <>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                  {t('routePreparation.routeDrawing.filesUploaded')}
                </Typography>
                <OpenFolderButton
                  folderPath="Projekty"
                  buttonText="Otwórz folder z plikami"
                />
              </>
            )}
        </Box>
      )}
    </Box>
  );
};

export default RouteDrawingStep; 